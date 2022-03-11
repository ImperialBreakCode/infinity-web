import { toggleBlade } from './lightsaber_render.js';
import { toggleFlash } from './lightsaber_render.js';
import { retracted, bladeFlashing, changeBladeColor } from './lightsaber_render.js';

var hum = new Howl({
    src: ['/static/solaris/audio/hum2.mp3'],
    loop: true,
    sprite: {
        hum: [0, 7000]
    }
});

var ignition = new Howl({
    src: ['/static/solaris/audio/ignition2.mp3']
});

var retraction = new Howl({
    src: ['/static/solaris/audio/powerDown2.mp3']
});

var lockup = new Howl({
    src: ['/static/solaris/audio/lockup.mp3'],
    loop: true,
    volume: 0.6,
    sprite: {
        lock: [100, 5000]
    }
});

$('#toggle-blade').click(function(){
    if (retracted) {
        toggleBtnState('toggle-flash', 1);
        toggleBtnState(this.id, 2);

        ignition.play();
        setTimeout(() => {
            hum.play('hum');
        }, 400);

        toggleBlade();
    }
    else{
        toggleBtnState('toggle-flash', 0);
        toggleBtnState(this.id, 1);

        retraction.play();
        lockup.stop();
        setTimeout(() => {
            hum.stop();
            toggleBlade();
        }, 600);
    }
    
});

$('#toggle-flash').click(function(){

    if (bladeFlashing) {
        lockup.stop();
        toggleBtnState(this.id, 1);
    }
    else{
        if(!retracted){
            lockup.play('lock');
            toggleBtnState(this.id, 2);
        }
    }

    toggleFlash();
});

$('#mute-sound').click(function(){
    var element = $('#mute-sound');
    if( element.hasClass('setting-selected') ){
        element.removeClass('setting-selected');
        hum.mute(false);
        lockup.mute(false);
        ignition.mute(false);
        retraction.mute(false);

    }
    else{
        element.addClass('setting-selected');
        hum.mute(true);
        lockup.mute(true);
        ignition.mute(true);
        retraction.mute(true);
    }
});

$('#blade-color-btn').click(function(){
    $('#box-color-blade').toggle({
        effect: 'drop',
        duration: 200
    });

    if ( !$('#box-help').css('display', 'none') ) {
        $('#help-info').click();
    }
    
});

$('#help-info').click(function(){
    $('#box-help').toggle({
        effect: 'drop',
        duration: 200
    });

    if ( !$('#box-color-blade').css('display', 'none') ) {
        $('#blade-color-btn').click();
    }
});

$('.color-box').click(function(){
    $('.color-box-active').removeClass('color-box-active');
    this.classList.add('color-box-active');

    $('#box-color-blade').toggle({
        effect: 'drop',
        duration: 200
    });

    changeBladeColor(this.id);
});

$('.close-mark').click(function(){
    $('#help-info').click();
});

document.addEventListener('keydown', (e) => {
    if(e.key == 's' && !e.repeat){
        $('#toggle-blade').click();
    }
    else if(e.key == 'c' && !e.repeat){
        $('#toggle-flash').click();
    }
});

document.addEventListener('keyup', (e) => {
    if(e.key == 'c' && !e.repeat){
        $('#toggle-flash').click();
    }
});

// state = 0 -> disabled, state = 1 -> enabled, state = 2 -> active
function toggleBtnState(btnId, state) {
    if(state == 0){
        $(`#${btnId}`).addClass('control-btn-disabled');
        $(`#${btnId}`).removeClass('control-btn-active');
    }
    else if(state == 1){
        $(`#${btnId}`).removeClass('control-btn-disabled');
        $(`#${btnId}`).removeClass('control-btn-active');
    }
    else if(state == 2){
        $(`#${btnId}`).removeClass('control-btn-disabled');
        $(`#${btnId}`).addClass('control-btn-active');
    }
}