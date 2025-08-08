precision highp float;

uniform float uTime;
uniform float uNormalScale;
uniform vec2 uRippleCenter;
uniform float uRippleTime;

varying vec3 vWorldPos;
varying vec3 vNormal;

void main(){
  vec3 pos = position;
  float wave = (sin((pos.x + uTime*2.0)*0.05) + cos((pos.z + uTime*1.5)*0.07)) * 0.3 * uNormalScale;
  // radial ripple
  float r = distance(vec2(pos.x, pos.z), uRippleCenter);
  float rippleT = uTime - uRippleTime;
  float ripple = 0.0;
  if (rippleT >= 0.0 && rippleT < 4.0) {
    float k = 6.2831; // 2pi wavelength units
    float phase = k * (r - rippleT * 2.0);
    ripple = sin(phase) * exp(-r * 0.1) * (1.0 - rippleT / 4.0);
  }
  pos.y += ripple * 0.6;
  pos.y += wave;

  vec4 world = modelMatrix * vec4(pos,1.0);
  vWorldPos = world.xyz;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * viewMatrix * world;
}
