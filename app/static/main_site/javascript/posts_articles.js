$(document).ready(function (){

    elem = document.getElementsByClassName('dt');

    for(let i = 0; i < elem.length; i++){
        let ms = parseInt(elem[i].innerHTML);
        var date = new Date(ms);
        //ms /= 60000;
        //ms -= date.getTimezoneOffset();
        //date = new Date(ms * 60000)
        var formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} at ${date.getHours()}:${date.getMinutes()}`;
        elem[i].innerHTML = formattedDate;
    }
});

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