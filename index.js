import audioService from './audio/audio-service.js';

const sounds = audioService();

const play = (sound) => sound.audio.play();

sounds.forEach(play);
