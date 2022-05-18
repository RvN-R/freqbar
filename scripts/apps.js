// Tiggering wav file with button
const button1 = document.getElementById('button1');
let audio1 = new Audio();
audio1.src = 'DANA.wav';

const audioCtx = new(window.AudioContext || window.webkitAudioContext)();
console.log(audioCtx)

button1.addEventListener('click', function(){
    audio1.play();
    audio1.addEventListener('playing', function(){
        console.log('Audio 1 started playing');
    });
    audio1.addEventListener('ended', function(){
        console.log('Audio 1 ended!');
    });
});

const button2 = document.getElementById('button2');
button2.addEventListener('click', playSound);
function playSound(){
    const oscillator = audioCtx.createOscillator();
    oscillator.connect(audioCtx.destination);
    oscillator.type = 'sine';
    oscillator.start();
    setTimeout(function (){
        oscillator.stop();
    }, 200);
}