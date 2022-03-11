let currentloc = $('meta[name=location]').attr('content');
let headCount = $('head').children().length;
let scriptCount = $('script').length;


$(document).ready(function (){
    if (currentloc !== 'home'){
        delete window.btn;

        $('main').remove();

        let link = $(`a[href="${currentloc}"]`).first();
        currentloc = 'home';
        link.click();
    }
});

$('#update-url').click(function (){
    window.location.replace(currentloc);
});

$('#copy-link').click(function (){
    let host = window.location.hostname;
    //let port = window.location.port;
    navigator.clipboard.writeText(`${host}/solaris/${currentloc}`);
})

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

    if (currentloc !== 'home' && this.id === 'second-link-nv'){
        destination = currentloc;
    }

    //getting page resources
    if(currentloc != destination){

        console.log(destination);

        if(currentloc === 'lightsaber'){
            let host = window.location.hostname;
            window.location.replace(`${destination}`);
        }
        
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

                while ($('script').length > scriptCount) {
                    $('script').last().remove();
                }

                addCss(json.css_link);
                addJavascript(json.javascript_link);

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


function addJavascript(javascriptLink){
    if(javascriptLink != ''){
        script = $(`<script></script>`).attr('src', javascriptLink);
        $('body').last().append(script);
    }
}