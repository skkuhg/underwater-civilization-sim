precision highp float;

uniform vec3 uSunDir;

varying vec3 vWorldPos;

void main(){
  vec3 up = vec3(0.0,1.0,0.0);
  float h = normalize(vWorldPos).y * 0.5 + 0.5;
  float sunAmt = pow(max(dot(normalize(vWorldPos), normalize(uSunDir)), 0.0), 32.0);
  vec3 dayTop = vec3(0.05, 0.25, 0.6);
  vec3 dayHorizon = vec3(0.6, 0.8, 1.0);
  vec3 sky = mix(dayHorizon, dayTop, h);
  sky += vec3(1.0, 0.8, 0.6) * sunAmt * 0.5;
  gl_FragColor = vec4(sky, 1.0);
}
