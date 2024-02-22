// attribute vec2 uv;
// attribute vec2 position;
uniform float uTime;
uniform vec3 uMouse;
uniform vec3 interval;

varying vec2 vUv;

vec2 random2( vec2 p ) {
  return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

void main() {
  vUv = uv;

  vec3 newPos = position;
  float moveAmount = 10.0;
  newPos = vec3(
    newPos.x,
    newPos.y,
    newPos.z
  );

  vec4 mvPosition = modelViewMatrix * vec4( newPos, 1.0 );
  gl_Position = projectionMatrix * mvPosition;
}
