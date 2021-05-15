sp = document.getElementsByClassName('sp');


for (let i = 0; i < sp.length; i++) {
    sp[i].addEventListener("mouseover", Blurback);
    sp[i].addEventListener("mouseout", Rblurback);
}


$(document).ready(function(){

    $(window).scroll(function() {

        var scrollPercent = ($(window).scrollTop() / $(document).height()) * 100;

        if (window.innerWidth >= "1170") {
            
            $('.first').css('transform', 'scale(' + (100 - scrollPercent)/100 + ') translate(0, ' + $(window).scrollTop() +'px)');
            $('.menu').css('transform', 'scale(' + (100 - scrollPercent)/100 + ') translate(0, ' + $(window).scrollTop()*2 + 'px)');
            
            if(scrollPercent >= 45){
                $('.menu').addClass('d-none');
            }
            else{
                $('.menu').removeClass('d-none');
            }

            if (scrollPercent == 0) {
                $(".menu").removeAttr("style");
            }
        }

        if (scrollPercent == 0) {
            $(".menu").removeAttr("style");
        }
    });

    $( window ).resize(function(){

        if (window.innerWidth < '1170') {
            $(".first").removeAttr("style");
            $(".menu").removeAttr("style");
            $('.menu').removeClass('d-none');
        }

    });

});


function Blurback(){
    back = document.getElementById('blur');
    back.style.background = '#00000010';
    back.style.backdropFilter = 'blur(7px)';
}

function Rblurback(){
    back = document.getElementById('blur');
    back.style.background = 'transparent';
    back.style.backdropFilter = 'blur(0px)';
}