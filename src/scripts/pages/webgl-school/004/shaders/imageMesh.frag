precision highp float;
const float PI = 3.1415926535897932384626433832795; // PIの定義
varying vec2 vUv;

uniform float uTime;
uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uIndex;
uniform float uDivisionNum;
uniform vec2 uMouseOffset;
uniform float uReset;
float rand(vec2 n) {
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 ip = floor(p);
  vec2 u = fract(p);
  u = u * u * (3.0 - 2.0 * u);

  float res = mix(mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x), mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);
  return res * res;
}

void main() {
  vec2 uv = vUv.xy;
  float division = sqrt(uDivisionNum);
  uv.x /= 20.0; // 0 ~ 1
  uv.y /= 20.0; // 0 ~ 1
  uv.x += uIndex.x / 20.0;
  uv.y += uIndex.y / 20.0; // 0.0 ~ 1.0

  // uv.y -= 0.05;
  // uv.x += 0.05;

  {
    // add time offset
    float noiseX = noise(vec2(uIndex.x, uIndex.y + uTime * 0.235));
    float noiseY = noise(vec2(uIndex.x + uTime * 0.0235, uIndex.y));
    uv.x += noise(vec2(noiseX, noiseY)) * 0.01 * uReset;
    uv.y += noise(vec2(sin(noiseY * PI * 2.0), cos(noiseY * PI * 2.0))) * 0.02 * uReset;
  }

  // add mouse offset
  uv.x *= 1. + (noise(vec2(uMouseOffset.x + uIndex.y, uv.x)) - 0.5) * 2.0 * 0.05 * uReset;
  uv.y *= 1. + (noise(vec2(uMouseOffset.y + uIndex.x, uv.y)) - 0.5) * 2.0 * 0.05 * uReset;
  uv.x += noise(vec2(uMouseOffset.x + uIndex.x, uv.x)) * 0.15 * uReset;
  uv.y += noise(vec2(uMouseOffset.y + uIndex.y, uv.y)) * 0.15 * uReset;

  vec4 color = texture2D(uTexture, uv.xy);
  gl_FragColor.rgb = color.rgb;
  gl_FragColor.a = 1.0;
}