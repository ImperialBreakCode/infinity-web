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

    modal.modal('hide');

});

form.addEventListener('submit', function (event){
    if (blob_img != null) {
        let formDat = new FormData(form);
        formDat.append('cropped-img', blob_img, 'wow.jpg');

        let xhr = new XMLHttpRequest();
        xhr.open('POST', form.action, true);
        xhr.send(formDat);
        event.preventDefault()

        setTimeout(function(){
            if(window.location.pathname == '/setup'){
                location.replace('/')
            }
            else {
                location.replace("/instagram/my-profile")
            }
        }, 600)
    }
})