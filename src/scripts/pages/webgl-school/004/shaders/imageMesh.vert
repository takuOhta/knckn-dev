varying vec2 vUv;
uniform bool uIsSelected;
uniform float uTime;
uniform float uStopTime;
void main() {
    vUv = uv;
    vec3 pos = position;
    float size = smoothstep(8.0, 0.0,uTime - uStopTime);
    if(!uIsSelected) pos *= size * 1.6;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}