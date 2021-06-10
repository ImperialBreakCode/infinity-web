import { EmojiButton } from 'https://cdn.jsdelivr.net/npm/@joeattardi/emoji-button@4.6.0/dist/index.min.js';


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

buttonTrigger.click(function (event){
    button = event.target
    picker.togglePicker(button);
});

picker.on('emoji', selection =>{
    let input = button.parentNode.parentElement.children[1];
    input.value += selection.emoji;
});


//comment
//
//

$('.post-button').click(function (event){

    postComment(event);

});

$('.inp').keypress(function (event){
    if (event.which == 13){
         postComment(event);
    }
});

$('.di-cmt').click(function (event){
    deleteComment(event);

    let comment_id = event.target.id.split('-')[1];
    let select = '#comment-' + comment_id;
    $(select).remove();
});


function postComment(event){
    let input = event.target.parentElement.children[1];

    let data = new FormData();
    data.append('type', input.id);
    data.append('content', input.value);

    let xhr = new XMLHttpRequest();
    xhr.open('POST', '');
    xhr.send(data);
    input.value = '';
}

function deleteComment(event){

    let data = new FormData();
    data.append('type', event.target.id);

    let xhr = new XMLHttpRequest();
    xhr.open('DELETE', '');
    xhr.send(data);
}
