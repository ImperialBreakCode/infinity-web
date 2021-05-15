$(document).ready(function(){

    $('#dr-btn').css('display', 'none');

    $('#cr-btn').click(function(){

        $('#dr-btn').toggle({duration: 300, easing: 'easeInOutQuad'});


    });

});