let filevalue;
let fileinput;
let files;
let fileImage;
let image;
let cropper;
let canvas;
let blob_img;

fileinput = $('#formFileLg');
filevalue = fileinput.val();
image = $('#cropper-img');
let modal = $('#modal');
let doneBtn = $('#done-crop');
let sampleImage = $('#sample');
let form = document.forms.namedItem('s-e-form')


fileinput.change(function (event) {

    files = event.target.files;

    if (files[0]) {
        fileImage = files[0];

        url = URL.createObjectURL(fileImage);
        image.attr('src', url);

        modal.modal('show');
    }

});

modal.on('shown.bs.modal', function () {

    image1 = document.getElementById('cropper-img');
    cropper = new Cropper(image1, {
        aspectRatio: 1,
        viewMode: 3
    });

});

modal.on('hidden.bs.modal', function () {

    cropper.destroy();
    cropper = null;

});


doneBtn.click(function () {

    canvas = cropper.getCroppedCanvas({
        width: 200,
        height: 200
    });

    sampleImage.attr('src', canvas.toDataURL());

    canvas.toBlob(function (blob) {

        blob_img = blob

    }, 'image/jpeg');

    setTimeout(function () {

        let reader = new FileReader();
        reader.readAsDataURL(blob_img);
        reader.onloadend = function () {
             $('#cropped-img').val(reader.result);
        }

    }, 600);

    modal.modal('hide');

});