
$(document).ready(function(){
    
    for(var i = 0; i < 20; i++){

        var r = 10;
        var r2 = 10;

        while (r > 9 || r == 0) {
            r = Math.floor(Math.random()*10);
        }

        while (r2 > 9 || r2 == 0) {
            r2 = Math.floor(Math.random()*10);
        }

        var src = `https://picsum.photos/seed/${r + r2}/200`

        story = $('#sample-story').clone();
        story.removeAttr('id');
        story.removeClass('d-none');

        story.children('img').attr('src', src);
        
        st = Math.floor(Math.random()*10);

        if (st < 2) {
            story.addClass('story-friend');
        }
        else{
            story.addClass('story-ordinary');
        }

        $('.presentation').first().append(story);

    }
    $('.presentation').first().append('<span></span>');
    $('.presentation').children().last().css('padding', '5px');
    
});