void main() {

  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 texUv = texture2D( textureUv, uv );

  // 位置情報の更新
  texUv.xyz = texUv.xyz;
  texUv.a = 1.0;
  gl_FragColor = texUv;

}