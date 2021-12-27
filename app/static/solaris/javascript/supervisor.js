let currentloc = 'home';
let headCount = $('head').children().length;

$('.navlink').click(function(event){
    
    //preventing default function
    event.preventDefault();

    //changing active link
    $('.nv-active').removeClass('nv-active');
    this.classList.add('nv-active');

    //changing second link text
    if (this.id != 'home-link-nv') {
        $('#second-link-nv').html(this.innerHTML).addClass('nv-active');
    } else {
        $('#second-link-nv').html('glassmorphism').removeClass('nv-active');
    }

    var destination = this.href.split('/');
    destination = destination[destination.length - 1];

    //getting page resources
    if(currentloc != destination){

        console.log(destination);
        
        fetch(`/solaris-api/pages/${destination}`).then(response => {
            return response.json();
        }).then(json => {

            $('#main-cont').hide('puff', 600);

            setTimeout(() => {
                $('main').remove();
                $('#main-cont').append(json.main);

                while ($('head').children().length > headCount) {
                    $('head').children().last().remove();
                }
                addCss(json.css_link);

                $('#main-cont').show('puff', 600);

            }, 700);

            currentloc = destination;
        });
    }
});


function addCss(cssLink) {
    
    if(cssLink != ''){
        css = $('<link>').attr('rel', 'stylesheet').attr('href', cssLink);
        $('head').last().append(css);
    }

}