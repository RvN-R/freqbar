// Tiggering wav file with button
// const button1 = document.getElementById('button1');

// const audioCtx = new(window.AudioContext || window.webkitAudioContext)();
// console.log(audioCtx)

const container = document.getElementById('container');
const canvas = document.getElementById('canvas1');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
let audioSource;
let analyser;

container.addEventListener('click', function(){
    // audio source
    const audio1 = document.getElementById('audio1');
    audio1.src = 'ChildrenOfTheNightBeat.wav';
    const audioContext = new AudioContext();
    audio1.play();
    // setting the audio source as the wav at the top of the code
    audioSource = audioContext.createMediaElementSource(audio1);
    analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 8192;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const barWidth = canvas.width/bufferLength;
    let barHeight;
    let x;

    // animate for bar graph frequency display
    function animate(){
        x = 0;
        ctx.clearRect(0,0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        for(let i = 0; i < bufferLength; i++){
            barHeight = dataArray[i];
            ctx.fillStyle = 'red';
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth;
        }
        requestAnimationFrame(animate);
    }
    return animate();
});



// button1.addEventListener('click', function(){
//     audio1.play();
//     audio1.addEventListener('playing', function(){
//         console.log('Audio 1 started playing');
//     });
//     audio1.addEventListener('ended', function(){
//         console.log('Audio 1 ended!');
//     });
// });

// const button2 = document.getElementById('button2');
// button2.addEventListener('click', playSound);
// function playSound(){
//     const oscillator = audioCtx.createOscillator();
//     oscillator.connect(audioCtx.destination);
//     oscillator.type = 'sine';
//     oscillator.start();
//     setTimeout(function (){
//         oscillator.stop();
//     }, 200);
// }