
$('.delete-btn').click(function (event){
    $('#modal-del').modal('show');

    let btnId = event.target.id;

    $('#confirm-del').click(function (){

        $('#modal-del').modal('hide');

        let data = new FormData();
        data.append('type', btnId)

        let xhr = new XMLHttpRequest();
        xhr.open('DELETE', '');
        xhr.send(data);

        let rowId = '#r-' + btnId.split('-')[1];
        $(rowId).remove();

    });
});