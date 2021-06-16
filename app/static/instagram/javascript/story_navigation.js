$(document).ready(function(){

    var px = 0;
    var d = 0;

    toggleLeftNav()

    $('.stories').first().scroll(function(){

        toggleLeftNav();
        toggleRightNav();

    });

    $('#story-right').click(function(){

        px += 300;
        d = $('.presentation').first().width() - $('.stories').first().width() - 10;

        if (px > d) {
            px = d;
            $('#story-right').css('display', 'none');
        }
        else{
            $('#story-right').css('display', '');
        }

        $('.presentation').first().css('transform', `translate(-${px}px, 0)`);

        $('#story-left').css('display', '');

    });


    $('#story-left').click(function(){

        px -= 300;

        if (px < 0) {
            px = 0;
            $('#story-left').css('display', 'none');
        }
        else{
            $('#story-left').css('display', '');
        }

        $('.presentation').first().css('transform', `translate(-${px}px, 0)`);

        $('#story-right').css('display', '');

    });
    
});

function toggleLeftNav(){

    block = $('.stories').first().offset().left + 10; 
    present = $('.presentation').first().offset().left;

    if (block == present) {
        $('#story-left').css('display', 'none');
    }
    else{
        $('#story-left').css('display', '');
    }
}

function toggleRightNav(){

    block = $('.stories').first(); 
    present = $('.presentation').first();

    blocknum = block.offset().left + block.width() + 20;
    presentnum = present.offset().left + present.width();

    if (blocknum == presentnum) {
        $('#story-right').css('display', 'none');
    }
    else{
        $('#story-right').css('display', '');
    }
}