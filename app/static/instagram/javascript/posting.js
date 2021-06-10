let fileInput = $('#file-input');


fileInput.change(function (event){

    if(event.target.files[0]){
        let file = event.target.files[0];
        url = URL.createObjectURL(file);
        $('#image-sample').attr('src', url);
    }

});


$('#del-post').click(function (){
    $('#modal-del-post').modal('show');
});

$('.dp-js').click(function (event){
    $('#h-del-post').modal('show');

    $('#confirm-deletion').click(function (){
        deletePost(event.target.id)

        postId = event.target.id.split('-')[1];
        select = '#post-' + postId;
        $(select).remove();

        $('#h-del-post').modal('hide')
    });
});



function deletePost(id){
    data = new FormData();
    data.append('type', id)

    xhr = new XMLHttpRequest();
    xhr.open('DELETE', '');
    xhr.send(data);
}
