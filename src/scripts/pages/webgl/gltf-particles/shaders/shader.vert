// For PI declaration:
#include <common>

uniform sampler2D texturePosition;
uniform sampler2D textureVelocity;

uniform vec2 uTextureSize;

uniform float uParticleSize;

varying vec2 vUv;
varying vec4 vPos;
varying vec4 vVel;
varying float vInstanceId;

attribute int instanceId;

mat3 rotate(float angle, vec3 axis){
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
    return m;
}

void main() {
  vec2 textureUv = vec2( instanceId % int(uTextureSize.x),  floor(float(instanceId / int(uTextureSize.x))) ) / uTextureSize;

  vec4 offsetPosition = texture2D( texturePosition, textureUv );
  vec3 offsetPos = offsetPosition.xyz;

  // 位置調整
  offsetPos *= 60.0;
  offsetPos *= rotate(radians(120.0), vec3(0., 1.0, 0.));
  offsetPos *= rotate(radians(-106.0), vec3(1., 0.0, 0.));
  offsetPos.y += 100.0;
  vec3 pos = position;
  // pos *= vec3(uParticleSize * 0.5 + uParticleSize * 0.5 * offsetPos.z);

  // float aspect = uAreaSize.y / uAreaSize.x;

  // offsetPos.x *= uAreaSize.x / 2.;
  // offsetPos.y *= uAreaSize.y / 2.;

  // if(uAreaSize.x > uAreaSize.y) {
  //   offsetPos.y /= aspect;
  // }else {
  //   offsetPos.x *= aspect;
  // }

  // // 中心位置を調整
  // offsetPos.y -= uAreaCenter.y;

  // vec4 offsetVelocity = texture2D( textureVelocity, textureUv );
  // vec3 vel = offsetVelocity.xyz;

  vUv = uv;
  vPos = offsetPosition;
  vInstanceId = float(instanceId);

  vec4 mvPosition = modelViewMatrix * vec4( pos + offsetPos , 1.0 );
  gl_Position = projectionMatrix * mvPosition;

}