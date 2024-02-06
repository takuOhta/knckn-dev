precision highp float;

uniform float uTime;
uniform vec3 uColor;
uniform float uAspect;
uniform vec2 uResolution;

varying vec2 vUv;

vec2 random2( vec2 p ) {
  return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

void main() {
  vec2 st = vUv.st;
  // vec2 st = gl_FragCoord.xy/uResolution.xy;
  // st.x *= uResolution.x/uResolution.y;
  // アスペクト調整
  st.x *= uAspect;
  // グリッドのスケール
  st *= 4.0;
  // グリッド
  vec2 i_st = floor(st);
  vec2 f_st = fract(st);

  // 最短距離 初期値1
  float m_dist = 1.0;

  for(int x=-1; x <1; x++) {
    for(int y=-1; y <1; y++) {
      // 隣接する8つのグリッドを取得
      vec2 neighbor = vec2(float(x), float(y));

      // グリッド内の現在地＋隣接する場所からのランダムな位置。
      vec2 offset = random2(i_st + neighbor);

      // オフセットをアニメーション
      offset = 0.5 + 0.25 * sin(uTime + 6.2831 * offset);

      // セルの位置
      vec2 pos = neighbor  + offset - f_st;

      // セルの距離
      float dist = length(pos);

      // 最短距離を更新
      m_dist = min(m_dist, m_dist * dist);
    }
  }

  // 
  float result = smoothstep(0., 0.1, m_dist*2.168) ;
  // メタボールのカラー
  vec3 color = vec3(0.0);
  color += vec3(74., 255., 195.) / 255.;
  // // 境界線の処理
  // if(result == 1.0) {
  //   color = vec3(1.0);
  // }else {
  //   color = ballColor;
  // }

  gl_FragColor = vec4(color,result);
}