export function setupAudio(camera: THREE.Camera) {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const gain = ctx.createGain();
  gain.gain.value = 0.2;
  gain.connect(ctx.destination);

  // Simple noise-based ambience
  const bufferSize = 2 * ctx.sampleRate;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    // low frequency rumble-like noise
    data[i] = (Math.random() * 2 - 1) * 0.2;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;
  const biquad = ctx.createBiquadFilter();
  biquad.type = 'lowpass';
  biquad.frequency.value = 400;
  noise.connect(biquad).connect(gain);

  function resume() {
    if (ctx.state !== 'running') {
      ctx.resume();
    }
    try { noise.start(); } catch {}
  }

  return { resume };
}
