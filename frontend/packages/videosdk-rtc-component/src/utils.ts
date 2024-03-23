import Sound from '../public/notisound.wav';

export function playNotificationSound() {
  const audio = new Audio(Sound);
  audio.play();
}