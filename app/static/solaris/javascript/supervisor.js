let currentloc = 'home';
const headCount = $('head').children().length;

$('.navlink').click(function(event){
    
    //preventing default function
    event.preventDefault();

    //damn he tweaking
    //changing active link
    $('.nv-active').removeClass('nv-active');
    this.classList.add('nv-active');

    //changing second link text
    if (this.id != 'home-link-nv') {
        $('#second-link-nv').html(this.innerHTML).addClass('nv-active');
    } else {
        $('#second-link-nv').html('glassmorphism').removeClass('nv-active');
    }

    //getting page resources
    if(currentloc != this.innerHTML){

        namePage = this.innerHTML.replace(' ', '-');
        
        fetch(`/solaris-api/pages/${namePage}`).then(response => {
            return response.json();
        }).then(json => {

            addCss(json.css_link);

            $('main').hide('puff', 600);

            setTimeout(() => {
                $('main').remove();
                $('#main-cont').append(json.main).hide();

                $('#main-cont').show('puff', 600);

                setTimeout(() => {

                    while ($('head').children().length > headCount) {
                        $('head').children().last().remove();
                    }

                    addCss(json.css_link);

                }, 700);

            }, 700);

            currentloc = this.innerHTML;
        });

    }

});


function addCss(cssLink) {
    
    if(cssLink != ''){

        css = $('<link>').attr('rel', 'stylesheet').attr('href', cssLink);
        $('head').last().append(css);
    }

}