// Tiggering wav file with button
// const button1 = document.getElementById('button1');

// const audioCtx = new(window.AudioContext || window.webkitAudioContext)();
// console.log(audioCtx)

const container = document.getElementById('container');
const canvas = document.getElementById('canvas1');
const file = document.getElementById('fileupload');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
let audioSource;
let analyser;

var freqBar = true
var peakBar = false
var circleBar = false
var swrilBar = false

var fftNumber =512

//put click in the event listener below to get audio to play.
container.addEventListener('#', function(){
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
    analyser.fftSize = 128;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const barWidth = (canvas.width/2)/bufferLength;
    // Below barWidth is to be used with simple bar frequency graph
    // const barWidth = canvas.width/bufferLength;
    let barHeight;
    let x;

    // animate for bar graph frequency display
    function animate(){
        x = 0;
        ctx.clearRect(0,0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray)
        requestAnimationFrame(animate);
    }
    return animate();
});

// Ability to load files from computer, play them and trigger the visualizer
file.addEventListener('change', function(){
    const files = this.files;
    const audio1 = document.getElementById('audio1');
    const audioContext = new AudioContext();
    audio1.src = URL.createObjectURL(files[0]);
    audio1.load();
    audio1.play();
    audioSource = audioContext.createMediaElementSource(audio1);
    analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = fftNumber;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // const is to be used with Peak
    // const barWidth = (canvas.width/2)/bufferLength;
    // attempt at ternary operator
    // const barWidth = (freqBar == false) ?canvas.width/bufferLength : (canvas.width/2)/bufferLength;
    // Below barWidth is to be used with simple bar frequency graph
    
    const barWidth = canvas.width/bufferLength;
    let barHeight;
    let x;

    // animate for bar graph frequency display
    // in the if statement I need to add a new value to fftNumber variabel and barWidth
    function animate(){
        x = 0;
        ctx.clearRect(0,0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        if(freqBar == true){
          drawBarVisualiser(bufferLength, x, barWidth, barHeight, dataArray);
          fftNumber = 1024
        }else if(peakBar == true){
          drawPeakVisualiser(bufferLength, x, barWidth, barHeight, dataArray);
          fftNumber = 512
        }else if(circleBar == true){
          drawCircleVisualiser(bufferLength, x, barWidth, barHeight, dataArray)
        }else{
          drawSpiralVisualiser(bufferLength, x, barWidth, barHeight, dataArray)
        }
        // drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray)
        requestAnimationFrame(animate);
    }
    return animate();
});

// Below version of drawVisualiser is a simple bar frequency graph with one colour
function drawBarVisualiser(bufferLength, x, barWidth, barHeight, dataArray){
    for(let i = 0; i < bufferLength; i++){
        barHeight = dataArray[i];
        ctx.fillStyle = 'red';
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth;
    }
}

// Below version of drawVisualiser, has a left and right
function drawPeakVisualiser(bufferLength, x, barWidth, barHeight, dataArray){
    for(let i = 0; i < bufferLength; i++){
        barHeight = dataArray[i] * 2;
        const red = i * barHeight/30;
        const green = i/2; 
        const blue = barHeight;
        ctx.fillStyle = 'white';
        ctx.fillRect(canvas.width/2 - x, canvas.height - barHeight -30 , barWidth, 15);
        ctx.fillStyle = 'rgb('+ red + ',' + green + ',' + blue + ')';
        ctx.fillRect(canvas.width/2 - x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth;
    }
    for(let i = 0; i < bufferLength; i++){
        barHeight = dataArray[i] * 2;
        const red = i * barHeight/30;
        const green = i/2; 
        const blue = barHeight;
        ctx.fillStyle = 'white';
        ctx.fillRect(x, canvas.height - barHeight -30 , barWidth, 15);
        ctx.fillStyle = 'rgb('+ red + ',' + green + ',' + blue + ')';
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth;
    }
}

// Below drawVisualiser is a ciicle Visualiser
function drawCircleVisualiser(bufferLength, x, barWidth, barHeight, dataArray){
    for(let i = 0; i < bufferLength; i++){
        barHeight = dataArray[i];
        ctx.save();
        ctx.translate(canvas.width/2, canvas.height/2);
        ctx.rotate(i + Math.PI * 2/ bufferLength);
        const red = i * barHeight/30;
        const green = i/2; 
        const blue = barHeight;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, barWidth, 15);
        ctx.fillStyle = 'rgb('+ red + ',' + green + ',' + blue + ')';
        ctx.fillRect(0, 0, barWidth, barHeight);
        x += barWidth;
        ctx.restore();
    }
}

// Below drawVisualiser is a strange spriral visualiser
function drawSpiralVisualiser(bufferLength, x, barWidth, barHeight, dataArray){
    for(let i = 0; i < bufferLength; i++){
        barHeight = dataArray[i] * 1.5;
        ctx.save();
        ctx.translate(canvas.width/2, canvas.height/2);
        ctx.rotate(i * Math.PI * 4/ bufferLength);
        const hue = i * 15;
        ctx.fillStyle = 'hsl(' + hue + ',100%, 50%)';
        ctx.fillRect(0, 0, barWidth, barHeight);
        x += barWidth;
        ctx.restore();
    }
}


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

let selector = document.getElementById("visuals");

selector.addEventListener('change', function(event){
  if(freqBar == true){
    console.log("This is freqbar",freqBar)
    console.log(fftNumber)
  }else if(peakBar == true){
    console.log("This is peakBar",peakBar)
    console.log(fftNumber)
  }else if(circleBar ==true){
    console.log("This is circleBar",circleBar)
    console.log(fftNumber)
  }else{
    console.log("This is swirlBar",swrilBar)
    console.log(fftNumber)
  }
})

function changeOpt(event){
  const frequencyBarGraph = "Frequecy Bar Graph"
  const peakBarGraph = "Peak Bar Graph"
  const circleGraph = "Circle Graph"
  const swirlGraph = "Swirl Graph"

  const selectedValue = this.options[this.selectedIndex].text;

  if(frequencyBarGraph == selectedValue){
    freqBar = true; peakBar = false; circleBar=false; swrilBar=false;
  }else if(peakBarGraph == selectedValue){
    peakBar = true; freqBar=false; circleBar=false; swrilBar=false;
  }else if(circleGraph == selectedValue){
    circleBar = true; peakBar = false; freqBar=false; swrilBar=false;
  }else{
    swrilBar = true; peakBar = false; freqBar=false; circleBar=false;
  }
}



