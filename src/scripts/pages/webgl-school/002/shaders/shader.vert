// For PI declaration:
#include <common>

uniform float uSize;
uniform float uCurvature;
uniform float uTime;
uniform float uSpeed;

varying vec2 vUv;
varying vec3 vModelPosition;
varying vec3 vViewPosition;
varying vec3 vNormal;

vec3 rotate(vec3 p, float angle, vec3 axis){
    vec3 a = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float r = 1.0 - c;
    mat3 m = mat3(
        a.x * a.x * r + c,
        a.y * a.x * r + a.z * s,
        a.z * a.x * r - a.y * s,
        a.x * a.y * r - a.z * s,
        a.y * a.y * r + c,
        a.z * a.y * r + a.x * s,
        a.x * a.z * r + a.y * s,
        a.y * a.z * r - a.x * s,
        a.z * a.z * r + c
    );
    return m * p;
}
void main() {
    vUv = uv;

    vec3 pos = position;
    float angle = atan(pos.x, pos.y);
    // 移動 
    pos.z += uSize * uCurvature * sin(angle);
    // 回転
    pos = rotate(position, uTime * uSpeed, vec3(0.3, 0.2, 1.0));

    // standard shading用
    vNormal = normalMatrix * normal;
    vModelPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
    vViewPosition = -(modelViewMatrix * vec4(pos, 1.0)).xyz;
    
    vec4 worldPosition = modelMatrix * vec4( pos, 1.0 );
    vec4 mvPosition =  viewMatrix * worldPosition;
    
    gl_Position = projectionMatrix * mvPosition;
}

