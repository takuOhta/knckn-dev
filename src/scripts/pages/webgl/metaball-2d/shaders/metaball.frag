precision highp float;

uniform float uTime;
uniform vec3 uColor;
uniform float uAspect;
uniform vec2 uResolution;

varying vec2 vUv;

vec2 random2( vec2 p ) {
  return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

// Some useful functions
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

//
// Description : GLSL 2D simplex noise function
//      Author : Ian McEwan, Ashima Arts
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License :
//  Copyright (C) 2011 Ashima Arts. All rights reserved.
//  Distributed under the MIT License. See LICENSE file.
//  https://github.com/ashima/webgl-noise
//
float snoise(vec2 v) {

  // Precompute values for skewed triangular grid
  const vec4 C = vec4(
    0.211324865405187,
    // (3.0-sqrt(3.0))/6.0
    0.366025403784439,
    // 0.5*(sqrt(3.0)-1.0)
    -0.577350269189626,
    // -1.0 + 2.0 * C.x
    0.024390243902439);
    // 1.0 / 41.0

  // First corner (x0)
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);

  // Other two corners (x1, x2)
  vec2 i1 = vec2(0.0);
  i1 = (x0.x > x0.y)? vec2(1.0, 0.0):vec2(0.0, 1.0);
  vec2 x1 = x0.xy + C.xx - i1;
  vec2 x2 = x0.xy + C.zz;

  // Do some permutations to avoid
  // truncation effects in permutation
  i = mod289(i);
  vec3 p = permute(
    permute( i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(
    dot(x0,x0),
    dot(x1,x1),
    dot(x2,x2)
    ), 0.0);

  m = m*m ;
  m = m*m ;

  // Gradients:
  //  41 pts uniformly over a line, mapped onto a diamond
  //  The ring size 17*17 = 289 is close to a multiple
  //      of 41 (41*7 = 287)

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  // Normalise gradients implicitly by scaling m
  // Approximation of: m *= inversesqrt(a0*a0 + h*h);
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);

  // Compute final noise value at P
  vec3 g = vec3(0.0);
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);
  return 130.0 * dot(m, g);
}

void main() {
  vec2 st = vUv.st;
  // vec2 st = gl_FragCoord.xy / uResolution.xy;
  // st.x *= uResolution.x/uResolution.y;
  // グリッドのスケール アスペクト調整
  float size = 2.4;
  st *= vec2(size * uAspect, size);
  // グリッド
  vec2 i_st = floor(st);
  vec2 f_st = fract(st);

  // 最短距離 初期値1
  float m_dist = 1.0;

  for(int y= -1; y <=1; y++) {
    for(int x= -1; x <=1; x++) {
      // 隣接する8つのグリッドを取得
      vec2 neighbor = vec2(float(x), float(y));

      // グリッド内の現在地＋隣接する場所からのランダムな位置。
      vec2 point = random2(i_st + neighbor);
      // オフセットをアニメーション
      point = 0.5 + 0.5 * vec2(snoise(uTime * 0.04 + 2.1831 * point), snoise(uTime * 0.01 + 3.2831 * vec2(point.y, point.x)));

      // 自セルの中のpointと隣接セルとベクター
      vec2 diff = neighbor + point - f_st;

      // セルの距離
      float dist = length(diff);

      // 最短距離を更新
      m_dist = min(m_dist, m_dist * dist );
    }
  }

  // 
  float bg = smoothstep(0.6, 0.12, m_dist);
  float edge = smoothstep(0.12, 0.4, m_dist);
  float edge2 = smoothstep(0.1, 0.4, m_dist);
  // メタボールのカラー
  vec3 baseColor = vec3(44., 80., 130.) / 255.;
  vec3 dist = vec3(m_dist);
  vec3 color = baseColor;
  vec3 ballColor = baseColor;
  color = mix(ballColor, color, bg - edge - edge2);
  // // 境界線の処理
  // if(result == 1.0) {
  //   color = vec3(1.0);
  // }else {
  //   color = ballColor;
  // }
   // Draw grid
  // color.r -= step(.98, f_st.x) + step(.98, f_st.y);
  float alpha = (bg - edge - edge2) * 0.92;
  gl_FragColor = vec4(color, alpha);
}