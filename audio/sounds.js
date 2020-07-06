import config from '../config.js';

const { soundsPath, soundFormat } = config;

export const sounds = {
  piano_new: 'piano_new',
  LR_Pianos_new: 'LR_Pianos_new',
  arp_new: 'arp_new',
  synth_new: 'synth_new',
  synth2_new: 'synth2_new',
  swells_new: 'swells_new',
};

/**
 * Given a sound id, returns a url for
 * the identified sound
 *
 * @param {string} soundId
 */
export const getSoundURL = (soundId) => {
  if (soundId in sounds) {
    return `${soundsPath}${soundId}.${soundFormat}`;
  }
  console.warn(`unrecognised sound ${soundId}`);
  return null;
};
