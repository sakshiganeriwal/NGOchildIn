'use strict';

(function() {
    $.fn.pageMe = function(opts) {
        var $this = this,
            defaults = {
                perPage: 7,
                showPrevNext: false,
                hidePageNumbers: false
            },
            settings = $.extend(defaults, opts);

        var listElement = $this;
        var perPage = settings.perPage;
        var children = listElement.children();
        var pager = $('.pager');

        if (typeof settings.childSelector != "undefined") {
            children = listElement.find(settings.childSelector);
        }

        if (typeof settings.pagerSelector != "undefined") {
            pager = $(settings.pagerSelector);
        }

        var numItems = children.size();
        var numPages = Math.ceil(numItems / perPage);

        pager.data("curr", 0);

        if (settings.showPrevNext) {
            $('<li><a href="#" class="prev_link">«</a></li>').appendTo(pager);
        }

        var curr = 0;
        while (numPages > curr && (settings.hidePageNumbers == false)) {
            $('<li><a href="#" class="page_link">' + (curr + 1) + '</a></li>').appendTo(pager);
            curr++;
        }

        if (settings.showPrevNext) {
            $('<li><a href="#" class="next_link">»</a></li>').appendTo(pager);
        }

        pager.find('.page_link:first').addClass('active');
        pager.find('.prev_link').hide();
        if (numPages <= 1) {
            pager.find('.next_link').hide();
        }
        pager.children().eq(1).addClass("active");

        children.hide();
        children.slice(0, perPage).show();

        pager.find('li .page_link').click(function() {
            var clickedPage = $(this).html().valueOf() - 1;
            goTo(clickedPage, perPage);
            return false;
        });
        pager.find('li .prev_link').click(function() {
            previous();
            return false;
        });
        pager.find('li .next_link').click(function() {
            next();
            return false;
        });

        function previous() {
            var goToPage = parseInt(pager.data("curr")) - 1;
            goToPage && goTo(goToPage);
        }

        function next() {
            var goToPage = parseInt(pager.data("curr")) + 1;
            goToPage && goTo(goToPage);
        }

        function goTo(page) {
            var startAt = page * perPage,
                endOn = startAt + perPage;

            children.css('display', 'none').slice(startAt, endOn).show();

            if (page >= 1) {
                pager.find('.prev_link').show();
            } else {
                pager.find('.prev_link').hide();
            }

            if (page < (numPages - 1)) {
                pager.find('.next_link').show();
            } else {
                pager.find('.next_link').hide();
            }

            pager.data("curr", page);
            pager.children().removeClass("active");
            pager.children().eq(page + 1).addClass("active");

        }
    };

    $(document).ready(function() {
        $("#registerDonor").click(function() {
            $("#registerDonorForm").modal();
        });

        $(".editButton").click(function(event) {
            $("#registerDonorForm").modal();
            var donorInfo = event.target.parentElement.parentElement.childNodes;
            donorInfo.forEach(function(element, index) {
                element.className && $('#form_' + element.className) && $('#form_' + element.className).val(element.innerHTML);
            });
        });

        $(".deleteButton").click(function(event) {
            $("#delete").modal();

            var donorId;
            var findDonorId = event.target.parentElement.parentElement.childNodes;
            findDonorId.forEach(function(element) {
                if (element.className && element.className === 'donor_id' && element.innerHTML) {
                    donorId = element.innerHTML;
                }
            });
            console.log('donorId : ' + donorId);

            donorId && $("#deleteDonor").attr("data-donor-id", donorId);
        });

        $('#donorList').pageMe({
            pagerSelector: '#myPager',
            showPrevNext: true,
            hidePageNumbers: false,
            perPage: 3
        });

        $("#donorsList #checkall").click(function() {
            if ($("#donorsList #checkall").is(':checked')) {
                $("#donorsList input[type=checkbox]").each(function() {
                    $(this).prop("checked", true);
                });

            } else {
                $("#donorsList input[type=checkbox]").each(function() {
                    $(this).prop("checked", false);
                });
            }
        });

        $("#deleteDonor").click(function(event) {
            var donorId = event.target.getAttribute("data-donor-id");
            $.ajax({
                url: '/deleteDonor',
                data: {
                    donor_id: donorId
                },
                type: "POST",
                dataType: "json",
                success: function(json) {}
            });
        });

        $('form#FormMessage').on('submit', function(e) {
            var donorsListCheckbox = document.querySelectorAll('.checkthis');
            var donorIds = [];
            donorsListCheckbox.forEach(function(element) {
                if (element.checked) {
                    var findDonorId = element.parentElement.parentElement.childNodes;
                    findDonorId.forEach(function(element) {
                        if (element.className && element.className === 'donor_id' && element.innerHTML) {
                            donorIds.push(element.innerHTML);
                        }
                    });
                }
            });

            var data_ajax = $(this).serialize() + "&donor_id=" + (donorIds.length > 0 ? JSON.stringify(donorIds) : '');
            $.ajax({
                url: '/messagesDonor',
                data: data_ajax,
                type: "POST",
                dataType: "json",
                success: function(json) {}
            });
        });
    });

})(this);
