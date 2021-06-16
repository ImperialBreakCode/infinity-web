button = $('#filter-btn');

$(document).ready(function (){

    collapse();

    $(window).resize(function (){

        collapse();

    });

});

function collapse(){

    if (window.innerWidth <= 991){

        button.removeClass('d-none');
        button.attr('data-bs-target', '#form');
        button.attr('aria-expanded', 'false');

        $('#form').addClass('collapse');
    }
    else {
        button.addClass('d-none');
        button.removeAttr('data-bs-target');
        button.removeAttr('aria-expanded');

        $('#form').removeClass('collapse');
    }

}