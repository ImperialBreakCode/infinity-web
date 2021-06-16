import {EmojiButton} from 'https://cdn.jsdelivr.net/npm/@joeattardi/emoji-button@4.6.0/dist/index.min.js';


let accName;
let prfPicUrl
let prfLink;


// emoji picker
//
//

const picker = new EmojiButton({
    styleProperties: {
        '--font': 'Comfortaa, cursive'
    }
});
const buttonTrigger = $('.emoji-comment');
let button;

buttonTrigger.click(function (event) {
    button = event.target
    picker.togglePicker(button);
});

picker.on('emoji', selection => {
    let input = button.parentNode.parentElement.children[1];
    input.value += selection.emoji;
});


//comment
//
//


$(document).ready(function () {

    //getting account info

    fetch('/fre-api/gcud').then(response => {

        return response.json();

    }).then(json => {

        accName = json.acc_name;
        prfPicUrl = json.profile_pic_url;
        prfLink = json.profile_link;

    });

    $('.post-button').click(function (event) {
        postComment(event)
    });

    $('.inp').keypress(function (event) {
        if (event.which == 13) {
            postComment(event);
        }
    });

    $('.di-cmt').click(function (event) {
        deleteComment(event);

        let comment_id = event.target.id.split('-')[1];
        let select = '#comment-' + comment_id;
        $(select).remove();
    });

});


function postCommentOnly(event) {
    let input = event.target.parentElement.children[1];

    let data = new FormData();
    data.append('type', input.id);
    data.append('content', input.value);

    let xhr = new XMLHttpRequest();
    xhr.open('POST', '');
    xhr.send(data);
    input.value = '';
}

function deleteComment(event) {

    let data = new FormData();
    data.append('type', event.target.id);

    let xhr = new XMLHttpRequest();
    xhr.open('DELETE', '');
    xhr.send(data);
}

async function postCommentReturnId(event) {
    let input = event.target.parentElement.children[1];

    let id;

    await fetch(window.location.url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'type': input.id,
            'content': input.value
        })
    }).then(response => {
        return response.json();
    }).then(json => {
        id = parseInt(json.id);
    });

    return id

}

function postComment(event) {
    let path = window.location.pathname;

    if (path.substr(0, 16) === '/instagram/post/') {

        $('.no-comments').remove();
        postCommentReturnId(event).then(cId => {

            let sample = $('#comment-sample').clone();
            sample.attr('id', `comment-${cId}`);
            sample.children('img').first().attr('src', prfPicUrl)
            sample.children('#cont-n-name').children('a').attr('href', prfLink).html(accName);
            sample.children('#cont-n-name').removeAttr('id').children('p').html(event.target.parentElement.children[1].value);
            sample.children('.delete-cmt').children('i').attr('id', `dc-${cId}`);
            sample.removeClass('d-none');
            $('.comment-section').append(sample);

            event.target.parentElement.children[1].value = ''
        });

    } else {
        postCommentOnly(event);
    }
}
