let filevalue;
let fileinput;
let files;
let fileImage;
let image;
let cropper;
let canvas;
let fileReady;

fileinput = $('#formFileLg');
filevalue = fileinput.val();
image = $('#cropper-img');
let modal = $('#modal');
let doneBtn = $('#done-crop');
let sampleImage = $('#sample');


fileinput.change(function (event){

    files = event.target.files;
    fileImage = files[0];

    url = URL.createObjectURL(fileImage);
    image.attr('src', url);

    modal.modal('show');

});

modal.on('shown.bs.modal', function (){

    image1 = document.getElementById('cropper-img');
    cropper = new Cropper(image1, {
        aspectRatio: 1,
        viewMode: 3
    });

});

modal.on('hidden.bs.modal', function (){

    cropper.destroy();
    cropper = null;

});


doneBtn.click(function (){

    canvas = cropper.getCroppedCanvas();
    sampleImage.attr('src', canvas.toDataURL());

    canvas.toBlob(function (blob){

        fileReady = new File([blob], 'wow.jpg');
        fileinput.files = fileReady;
        console.log(fileinput.files);

    }, 'image/jpg');

    modal.modal('hide');

});


$('#cancel-crop').click(function (){

    fileinput.val(filevalue);

});