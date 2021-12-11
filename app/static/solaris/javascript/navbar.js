$('.dropdown-btn').click(function(){

    btn = $(this);

    if ( !btn.hasClass('dp-active') ) {
        
        btn.removeClass('unmarked-nv');
        offset = btn[0].offsetLeft;
        btn.css('transform', `translate(-${offset}px, 0)`);
        btn.addClass('dp-active');
        $('.unmarked-nv').css('transform', 'translate(0, -400%)');

    }else{

        btn.removeClass('dp-active');
        btn.css('transform', '');
        $('.unmarked-nv').css('transform', '');
        btn.addClass('unmarked-nv');

    }

});

$('.navlink-d').click(function (){
        btn.click();
});

$('.dropdown-btn').click(function (event) {

    let id;

    switch (event.target.id) {
        case 'designs-btn':
            id = '#ui-designs';
            break;
        
        case 'effects-btn':
            id = '#ui-effects';
            break;

        case 'more-btn':
            id = '#more'
            break;
            
        default:
            break;
    }
    
    if ($(id).hasClass('d-none')) {

        $(id).removeClass('d-none');
        $(id).removeClass('mn-dr-hidden', 'swing');

    }else{

        $(id).addClass('mn-dr-hidden', 'swing', function(){

            setTimeout(() => {
                $(id).addClass('d-none');
            }, 400);

        });
        
    }
    

});