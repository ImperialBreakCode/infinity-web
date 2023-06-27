$('#continue').click(function () {

    $('#intro').css('background', '');

    $('.intro-text').hide({
        effect: 'fade',
        easing: 'swing',
        duration: 400,
        complete: () => {

            $('#intro').remove();

            let panel = $('<div></div>').addClass('prep-panel');
            let loadPerc = $('<h1></h1>').html('0%');
            let loadProgress = $('<div></div>').addClass('load-progress').append('<div></div>');
            panel.append(loadPerc);
            panel.append(loadProgress);

            $('main').append(panel);

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

                $('.saber-controls').removeClass('d-none');
            });
        }
    });

});

$(document).ready(function () {
    setTimeout(() => {
        $('#css-saber').css('width', '');
        $('#intro').css('background', '#130000')
    }, 500);
});