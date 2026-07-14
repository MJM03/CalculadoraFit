
'use strict';

const frames = Array.from({ length: 16 }, (_, i) =>
  `deadlift_${String(i + 1).padStart(2, '0')}.png`
);

const phases = [
  ['Posición inicial', 'Barra sobre el centro del pie y abdomen activo.'],
  ['Tensión', 'Elimina la holgura de la barra antes de despegarla.'],
  ['Inicio del empuje', 'Empuja el suelo manteniendo el pecho firme.'],
  ['Barra a media tibia', 'Conserva la barra cerca de las piernas.'],
  ['Barra cerca de rodillas', 'Cadera y hombros deben subir coordinados.'],
  ['Extensión de cadera', 'Lleva la cadera hacia la barra sin hiperextender.'],
  ['Posición superior', 'Termina erguido, con glúteos activos.'],
  ['Pausa arriba', 'Mantén una posición estable y neutral.'],
  ['Inicio del descenso', 'Inicia llevando la cadera hacia atrás.'],
  ['Barra a las rodillas', 'Desliza la barra cerca de los muslos.'],
  ['Cadera hacia atrás', 'Mantén tensión abdominal durante el descenso.'],
  ['Barra a media tibia', 'Flexiona rodillas cuando la barra las haya pasado.'],
  ['Cerca del suelo', 'Controla la barra; evita dejarla caer.'],
  ['Posición inicial', 'Reorganiza la postura sin perder neutralidad.'],
  ['Reset y preparación', 'Respira, crea tensión y prepara la siguiente repetición.'],
  ['Listo para repetir', 'Repite conservando el mismo patrón técnico.']
];

const baseDurations = [300, 190, 125, 100, 95, 105, 170, 320, 145, 120, 120, 130, 155, 230, 210, 250];

const frameImage = document.querySelector('#atlasFrame');
const frameNumber = document.querySelector('#frameNumber');
const phaseName = document.querySelector('#phaseName');
const phaseTip = document.querySelector('#phaseTip');
const progressBar = document.querySelector('#progressBar');
const playButton = document.querySelector('#playButton');
const previousButton = document.querySelector('#previousButton');
const nextButton = document.querySelector('#nextButton');
const speedRange = document.querySelector('#speedRange');
const speedOutput = document.querySelector('#speedOutput');
const loopButton = document.querySelector('#loopButton');
const slowButton = document.querySelector('#slowButton');
const resetButton = document.querySelector('#resetButton');
const soundButton = document.querySelector('#soundButton');

let currentFrame = 0;
let playing = true;
let looping = true;
let speed = 1;
let lastChange = performance.now();
let voiceEnabled = false;

frames.forEach(src => {
  const preload = new Image();
  preload.src = src;
});

function renderFrame(announce = false) {
  frameImage.src = frames[currentFrame];
  frameNumber.textContent = currentFrame + 1;
  phaseName.textContent = phases[currentFrame][0];
  phaseTip.textContent = phases[currentFrame][1];
  progressBar.style.width = `${((currentFrame + 1) / frames.length) * 100}%`;

  if (announce && voiceEnabled && 'speechSynthesis' in window) {
    speechSynthesis.cancel();
    const message = new SpeechSynthesisUtterance(
      `${phases[currentFrame][0]}. ${phases[currentFrame][1]}`
    );
    message.lang = 'es-PE';
    message.rate = 1;
    speechSynthesis.speak(message);
  }
}

function setPlaying(value) {
  playing = value;
  playButton.textContent = playing ? '❚❚' : '▶';
  playButton.setAttribute('aria-label', playing ? 'Pausar animación' : 'Reproducir animación');
  lastChange = performance.now();
}

function step(direction) {
  setPlaying(false);
  currentFrame = (currentFrame + direction + frames.length) % frames.length;
  renderFrame(true);
}

function animate(now) {
  const duration = baseDurations[currentFrame] / speed;

  if (playing && now - lastChange >= duration) {
    if (currentFrame === frames.length - 1) {
      if (looping) {
        currentFrame = 0;
      } else {
        setPlaying(false);
      }
    } else {
      currentFrame += 1;
    }
    renderFrame(false);
    lastChange = now;
  }

  requestAnimationFrame(animate);
}

playButton.addEventListener('click', () => setPlaying(!playing));
previousButton.addEventListener('click', () => step(-1));
nextButton.addEventListener('click', () => step(1));

speedRange.addEventListener('input', event => {
  speed = Number(event.target.value);
  speedOutput.value = `${speed.toFixed(2).replace(/0$/, '')}×`;
});

loopButton.addEventListener('click', () => {
  looping = !looping;
  loopButton.classList.toggle('active', looping);
  loopButton.textContent = looping ? '↻ Bucle' : '→ Una repetición';
});

slowButton.addEventListener('click', () => {
  const enabled = !slowButton.classList.contains('active');
  slowButton.classList.toggle('active', enabled);
  speed = enabled ? 0.55 : 1;
  speedRange.value = speed;
  speedOutput.value = `${speed.toFixed(2).replace(/0$/, '')}×`;
});

resetButton.addEventListener('click', () => {
  currentFrame = 0;
  renderFrame(true);
  setPlaying(true);
});

soundButton.addEventListener('click', () => {
  voiceEnabled = !voiceEnabled;
  soundButton.textContent = voiceEnabled ? '🔊' : '🔇';
  soundButton.setAttribute(
    'aria-label',
    voiceEnabled ? 'Desactivar indicaciones por voz' : 'Activar indicaciones por voz'
  );
  if (voiceEnabled) renderFrame(true);
  else if ('speechSynthesis' in window) speechSynthesis.cancel();
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) setPlaying(false);
});

renderFrame();
requestAnimationFrame(animate);
