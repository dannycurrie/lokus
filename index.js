import audioService from './audio/audio-service.js';

const {
  fromEvent,
  operators: { map },
} = rxjs;

const source = fromEvent(document, 'mousemove');
const example = source.pipe(
  map((event) => `pos ${event.clientX} ${event.clientY}`)
);
example.subscribe((val) => console.log(val));

audioService().forEach((s) => s.audio.play());
