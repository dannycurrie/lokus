const soundsPath = '../audio/audio-files/';
const soundFormat = 'wav';

export const sounds = {
  piano_new: 'piano_new',
  LR_Pianos_new: 'LR_Pianos_new',
  arp_new: 'arp_new',
  synth_new: 'synth_new',
  synth2_new: 'synth2_new',
  swells_new: 'swells_new',
};

const getSoundURL = (soundId) => {
  if (soundId in sounds) {
    return `${soundsPath}${soundId}.${soundFormat}`;
  }
  console.warn(`unrecognised sound ${soundId}`);
  return null;
};

const initialiseAudio = (soundId) =>
  new Howl({
    src: [getSoundURL(soundId)],
    loop: true,
    preload: true,
  });

let toLoad = Object.keys(sounds).length;

// audioObjects are loaded as soon as this file is loaded
const audioObjects = Object.values(sounds).reduce((acc, curr) => {
  const sound = initialiseAudio(curr);
  sound.on('load', () => (toLoad = toLoad - 1));
  return { ...acc, [curr]: sound };
}, {});

export default async () => {
  const returnAudio = () =>
    Object.values(sounds).map((soundId) => ({
      audio: audioObjects[soundId],
      key: soundId,
    }));

  // returns when all audio files have finished loading - this ensures the playback is synced
  return new Promise((resolve) => {
    const waitForAudio = () => {
      if (toLoad === 0) resolve(returnAudio());
      else setTimeout(waitForAudio, 30);
    };
    waitForAudio();
  });
};
