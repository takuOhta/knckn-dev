void main() {

  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 position = texture2D( texturePosition, uv );

  // 位置情報の更新
  position.xyz = position.xyz;
  position.a = 1.0;
  gl_FragColor = position;

}