let landmarksTitle = $('#landmarks-title');
let landmarksPar = $('#landmarks-p');

$(document).ready(function(){
    landmarksTitle.css('left', '100%');
    landmarksPar.css('top', '100%');
    
    landmarksTitle.css('opacity', '0');
    landmarksPar.css('opacity', '0');
});

$(window).scroll(function() {
    let scrollPercent = ($(window).scrollTop() / $(document).height()) * 100;

    if (scrollPercent < 25) {
        landmarksTitle.css('left', `${100 - scrollPercent * 2}%`);
        landmarksTitle.css('opacity', `${scrollPercent * 4}%`);

        landmarksPar.css('top', `${100 - scrollPercent * 2.80}%`);
        landmarksPar.css('opacity', `${scrollPercent * 4}%`)
    }

    $('.title').css('transform', `translate(0, ${scrollPercent * 5}%)`); 
});

