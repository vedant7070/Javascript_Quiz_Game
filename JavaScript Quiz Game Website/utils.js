function decodeHTML(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function animateTransition(hideElement, showElement) {
  hideElement.animate([
    { opacity: 1, transform: 'translateY(0)' },
    { opacity: 0, transform: 'translateY(-20px)' }
  ], { duration: 300, easing: 'ease-in' }).onfinish = () => {
    hideElement.classList.add('hidden');
    showElement.classList.remove('hidden');
    showElement.animate([
      { opacity: 0, transform: 'translateY(20px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 300, easing: 'ease-out' });
  };
}

function playSound(audioElement) {
  if (audioElement) {
    audioElement.currentTime = 0;
    audioElement.play().catch(error => console.warn('Audio playback failed:', error));
  }
}