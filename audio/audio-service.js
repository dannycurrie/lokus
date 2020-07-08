import { sounds, getSoundURL } from './sounds.js';

const initialiseAudio = (soundId) =>
  new Howl({
    src: [getSoundURL(soundId)],
    loop: true,
  });

export default () =>
  Object.values(sounds).map((soundId) => {
    return {
      audio: initialiseAudio(soundId),
      key: soundId,
    };
  });
