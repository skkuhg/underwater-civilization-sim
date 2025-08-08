import * as THREE from 'three';

export function setupXR(
  renderer: THREE.WebGLRenderer,
  button: HTMLButtonElement,
  scene?: THREE.Scene,
  onRipple?: (pos: THREE.Vector3) => void,
  playerRig?: THREE.Group
) {
  const state = {
    leftGamepad: undefined as Gamepad | undefined,
    rightGamepad: undefined as Gamepad | undefined,
  speed: 2.0,
  mode: 'smooth' as 'smooth'|'teleport',
  snapAngle: 30,
  snapCooldown: 0,
  };
  if (navigator.xr) {
    (navigator.xr as any).isSessionSupported('immersive-vr').then((supported: boolean) => {
      if (supported) {
        button.hidden = false;
        button.onclick = async () => {
          try {
            const session = await (navigator.xr as any).requestSession('immersive-vr', { optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking'] });
            renderer.xr.setSession(session);

            if (scene) {
              const controller = renderer.xr.getController(0);
              controller.addEventListener('select', () => {
                const p = new THREE.Vector3();
                controller.getWorldPosition(p);
                p.y = 0; // project to water level
                onRipple?.(p);
              });
              scene.add(controller);
              const controller1 = renderer.xr.getController(1);
              scene.add(controller1);

              // track gamepads for locomotion
              session.addEventListener('inputsourceschange', () => {
                const sources = session.inputSources;
                state.leftGamepad = undefined;
                state.rightGamepad = undefined;
                for (const s of sources) {
                  if (s && s.gamepad && s.handedness) {
                    if (s.handedness === 'left') state.leftGamepad = s.gamepad as Gamepad;
                    if (s.handedness === 'right') state.rightGamepad = s.gamepad as Gamepad;
                  }
                }
              });
            }
          } catch (e) {
            console.error('Failed to start XR session', e);
          }
        };
      }
    });
  }
  function update(dt: number) {
    if (!renderer.xr.isPresenting || !playerRig) return;
    const gp = state.leftGamepad || state.rightGamepad;
    if (!gp || !gp.axes) return;
    const axX = gp.axes[2] ?? gp.axes[0] ?? 0; // thumbstick X
    const axY = gp.axes[3] ?? gp.axes[1] ?? 0; // thumbstick Y
    const xrCam = (renderer.xr as any).getCamera();
    const forward = new THREE.Vector3();
    xrCam.getWorldDirection(forward);
    forward.y = 0; forward.normalize();
    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0,1,0)).normalize();
    if (state.mode === 'smooth') {
      const move = new THREE.Vector3();
      // Typical FPS scheme: Y axis is forward/back, X axis is strafe
      move.addScaledVector(forward, -axY);
      move.addScaledVector(right, axX);
      if (move.lengthSq() > 0.0001) {
        move.normalize().multiplyScalar(state.speed * dt);
        playerRig.position.add(move);
      }
      // snap turn using right stick X if available
      if (state.snapCooldown > 0) state.snapCooldown -= dt;
      const rx = state.rightGamepad?.axes?.[2] ?? 0;
      if (Math.abs(rx) > 0.8 && state.snapCooldown <= 0) {
        const dir = Math.sign(rx);
        playerRig.rotation.y += THREE.MathUtils.degToRad(state.snapAngle) * dir;
        state.snapCooldown = 0.25;
      }
    } else {
      // Teleport mode placeholder (movement disabled here)
    }
  }
  // Note: camera reference in update uses renderer.xr.getCamera; this is runtime-safe.
  function setMode(m: 'smooth'|'teleport') { state.mode = m; }
  function setSpeed(v: number) { state.speed = v; }
  function setSnapAngle(v: number) { state.snapAngle = v|0; }
  return { update, setMode, setSpeed, setSnapAngle };
}
