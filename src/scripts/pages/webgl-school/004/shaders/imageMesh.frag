precision highp float;
const float PI = 3.1415926535897932384626433832795; // PIの定義
varying vec2 vUv;

uniform float uTime;
uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uIndex;
uniform float uDivisionNum;
uniform vec2 uMouseOffset;

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
    uv.x /= 30.0; // 0 ~ 1
    uv.y /= 30.0; // 0 ~ 1
    uv.x += uIndex.x / 30.0;
    uv.y += uIndex.y / 30.0; // 0.0 ~ 1.0

    uv.x += 0.05;
    uv.y -= 0.05;

    // add time offset
    uv.x += noise(vec2(uIndex.x, uv.x + sin(uTime * 0.935))) * 0.01;
    uv.y += noise(vec2(uIndex.y, uv.y + cos(uTime * 0.823))) * 0.02;

    // add mouse offset
    uv.x *= 1. + (noise(vec2(uMouseOffset.x + uIndex.y, uv.x)) - 0.5) * 2.0 * 0.05;
    uv.y *= 1. + (noise(vec2(uMouseOffset.y + uIndex.x, uv.y)) - 0.5) * 2.0 * 0.05;
    uv.x += noise(vec2(uMouseOffset.x + uIndex.x, uv.x)) * 0.15;
    uv.y += noise(vec2(uMouseOffset.y + uIndex.y, uv.y)) * 0.15;

    vec4 color = texture2D(uTexture, uv.xy);
    gl_FragColor.rgb = color.rgb;
    gl_FragColor.a = 1.0;
}