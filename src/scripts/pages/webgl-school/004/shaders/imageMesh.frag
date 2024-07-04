precision highp float;
varying vec2 vUv;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uIndex;
uniform float uDivisionNum;

void main() {
    vec2 uv = vUv.xy;
    float division = sqrt(uDivisionNum);
    uv.x /= 10.0; // 0 ~ 1
    uv.y /= 10.0; // 0 ~ 1
    uv.x += uIndex.x / 10.0;
    uv.y += uIndex.y / 10.0; // 0.0 ~ 1.0
    vec4 color = texture2D(uTexture, uv.xy);
    gl_FragColor.rgb = color.rgb;
    gl_FragColor.a = 1.0;
}