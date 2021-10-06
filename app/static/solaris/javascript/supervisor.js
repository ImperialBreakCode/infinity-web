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
        
        fetch(`/solaris-api/pages/${this.innerHTML}`).then(response => {
            return response.json();
        }).then(json => {

            while ($('head').children().length > headCount) {
                $('head').children().last().remove();
            }

            if(json.css_link != ''){
                css = $('<link>').attr('rel', 'stylesheet').attr('href', json.css_link);
                $('head').last().append(css);
            }

            $('main').hide('puff', 600);

            setTimeout(() => {
                $('main').remove();
                $('#main-cont').append(json.main).hide();

                $('#main-cont').show('puff', 600);
            }, 700);

            currentloc = this.innerHTML;
        });

    }

});