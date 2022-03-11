$('#continue').click(function(){
    $('#intro').toggle({
        duration: 400,
        ease: 'swing'
    });

    $('body').css('overflow-y', '');

    fetch('/solaris-api/shader-lightsaber-script-tags').then(res => {
        return res.json();
    }).then(jsonShaders => {

        $('body').append($(jsonShaders.vertex_shader));
        $('body').append($(jsonShaders.fragment_shader));
        $('body').append($(jsonShaders.howler_tag));

        let script = $('<script></script>').attr('src', '/static/solaris/javascript/lightsaber/lightsaber_render.js');
        script.attr('type', 'module');
        $('body').append(script);

        script = $('<script></script>').attr('src', '/static/solaris/javascript/lightsaber/lightsaber_controls.js');
        script.attr('type', 'module');
        $('body').append(script);

        $('head').append('<link rel="stylesheet" href="/static/icons/fontAwesome6/css/all.css">');
        $('.saber-controls').removeClass('d-none');
    });
});

$(document).ready(function (){
    $('body').css('overflow-y', 'scroll');
});