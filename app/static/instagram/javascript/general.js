
$(document).ready(function(){

    if( $( window ).width() <= 974){

        $('#drop').css('display', 'none');
    }

    if ($( window ).width() <= 600) {
        $('#inner-nav').removeClass('px-5');
    }


    $( window ).resize(function(){

        if ($( window ).width() >= 975) {
            $('#drop').removeClass('d-none');

            $('#menu-btn').css('background-color', 'transparent');
            $('#drop').css('display', '');
			
			RestoreSearch();
        }
        else{
            $('#menu-btn').removeClass('d-none');
            $('#menu-btn').css('background-color', 'transparent');

            $('#drop').css('display', 'none');
        }


        if ($( window ).width() <= 600) {
            $('#inner-nav').removeClass('px-5');
        }
        else{
            $('#inner-nav').addClass('px-5');
        }
    });

    $('#menu-btn').click(function(){

        if ( $('#drop').css('display') == "block" || $('#drop').css('display')== "flex") {

            
            $('#menu-btn').css('background-color', 'transparent');
        }
        else{
            $('#menu-btn').css('background-color', 'var(--color-bdn)');
        }


        $('#drop').toggle('slide', {direction:'up'}, function(){
            if ( $('#drop').css('display') == "block" || $('#drop').css('display')== "flex") {
                
                $('#drop').css('display', '');
            }
        });
    });


    $('#s-icon').click(function(){

        $('#s-icon').addClass('d-none');

        $('#search').css('display', 'inline-block');
        $('#search').addClass('search-widen', 1000, 'swing');
        $('#x-search').removeClass('d-none');

        if ($( window ).width() >= 975) {
            $('#drop').addClass('d-none');
        }
        else{
            $('#menu-btn').addClass('d-none');
        }

    });

    $('#x-search').click(function(){

        RestoreSearch();

        if ($( window ).width() >= 975) {
            $('#drop').removeClass('d-none');
        }
        else{
            $('#menu-btn').removeClass('d-none');
        }

    });

    $('#prf-btn').click(function(){

        $('#drop-prf').toggleClass('d-none');
        $('#drop-prf').toggleClass('dropdown-prf-height', 'swing');
        $('#drop-prf').css('display', '')

    });

});

function RestoreSearch(){

    $('#search').removeClass('search-widen', 1000, 'easeInBack');
    $('#x-search').addClass('d-none');
    $('#search').css('display', '');

    $('#s-icon').removeClass('d-none');

}