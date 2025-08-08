precision highp float;

uniform vec3 uCameraPos;
uniform vec3 uLightDir;
uniform vec3 uShallowColor;
uniform vec3 uDeepColor;
uniform float uWaterLevel;

varying vec3 vWorldPos;
varying vec3 vNormal;

void main(){
  float depth = clamp((uWaterLevel - vWorldPos.y) / 30.0, 0.0, 1.0);
  vec3 baseColor = mix(uShallowColor, uDeepColor, depth);

  vec3 N = normalize(vNormal);
  float diff = max(dot(N, normalize(uLightDir)), 0.0);
  float fresnel = pow(1.0 - max(dot(normalize(uCameraPos - vWorldPos), N), 0.0), 3.0);

  vec3 color = baseColor * (0.4 + 0.6*diff) + fresnel * 0.1;
  gl_FragColor = vec4(color, 0.7);
}
