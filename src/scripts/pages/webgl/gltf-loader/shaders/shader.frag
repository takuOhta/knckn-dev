precision highp float;

uniform float uTime;
uniform vec3 uColor;
uniform float uAspect;
uniform vec2 uResolution;
uniform sampler2D uTex;

varying vec2 vUv;

void main() {
  vec2 st = vUv.st;
  vec3 color = texture2D(uTex, vUv.st).rgb;
  // vec3 color = vec3(st,1.0);
  gl_FragColor = vec4(color, 1);
}