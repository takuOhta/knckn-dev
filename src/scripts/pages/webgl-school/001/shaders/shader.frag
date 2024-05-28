// For PI declaration:
#include <common>

uniform sampler2D texturePosition;
uniform sampler2D textureUv;

uniform vec2 uTextureSize;

uniform float uTime;
uniform float uFpsRatio;
uniform float uCurrentSection;
uniform float uAreaDepth;

uniform sampler2D uTexture;

uniform float uOpacity;
uniform vec3 uColor;
uniform float uColorOffset;

varying float vInstanceId;
varying vec2 vUv;
varying vec4 vPos;
varying vec4 vVel;


float map(float value, float min1, float max1, float min2, float max2) {
  if(value >= max2) return max2;
  if(value <= min2) return min2;
  float x = min2 + (value - min1) * (max2 - min2) / (max1 - min1);
  return min(max(x, min2), max2);
}

float random(vec2 _uv) {
  return fract(sin(dot(_uv.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

void main() {
  vec2 uv = vec2( int(vInstanceId) % int(uTextureSize.x),  floor(float(int(vInstanceId) / int(uTextureSize.x))) ) / uTextureSize;
  vec2 texUv = texture2D(textureUv, uv).rg;
  vec3 texColor = texture2D(uTexture, texUv).rgb;
  vec4 color = vec4(texColor, 1.0);
  gl_FragColor = color;

}
