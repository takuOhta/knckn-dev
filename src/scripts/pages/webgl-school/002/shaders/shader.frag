#include <common>
#include <bsdfs>
#include <lights_pars_begin>
// #include <lights_pars_maps>
#include <lights_phong_pars_fragment>

precision highp float;

uniform float uTime;
uniform vec3 uColor;
uniform float uIndex;

varying vec2 vUv;
varying vec3 vModelPosition;
varying vec3 vNormal;


vec3 emissive = vec3(0.0);
vec3 specular = vec3(1.0);
float shininess = 8.0;

void main() {
    float brightness = 1.5;
    vec3 diffuseColor = uColor;
    diffuseColor.r -= uIndex * 0.76;
    diffuseColor.g -= uIndex * 0.275;
    diffuseColor.b -= uIndex * 0.44;
    ReflectedLight reflectedLight = ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));

    #include <specularmap_fragment>
    #include <normal_fragment_begin>
    #include <normal_fragment_maps>
    #include <lights_phong_fragment>
    #include <lights_fragment_begin>
    #include <lights_fragment_maps>
    #include <lights_fragment_end>

    // distanceを使用して、vec2(0.5, 1.0)から扇状に広がるようにマスクする
    float inFan = 
      (
        vUv.x < 0.5 ? step(0.5, 1.0 - vUv.y / vUv.x * 0.25 ) : 0.0
        + vUv.x > 0.5 ? step(0.5, 1.0 -(vUv.y) / (1.0 - vUv.x) * 0.25 ) : 0.0
      )
      * smoothstep(0.0, 0.4 + sin(vModelPosition.x * vModelPosition.y * vModelPosition.z * 0.00001) * 0.1, 1.0 -distance(vUv, vec2(0.5, 1.0)))
      * smoothstep(0.0, 0.1, distance(vUv, vec2(0.5, 1.0)))
      ;
    
    vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + emissive;
    // ライトあり
    // gl_FragColor.rgb = outgoingLight * brightness * inFan;
    // ライトなし
    gl_FragColor.rgb = diffuseColor * brightness * inFan;
    gl_FragColor.a = inFan;
}

