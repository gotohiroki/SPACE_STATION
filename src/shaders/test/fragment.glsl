// precision mediump float;

uniform vec3 uColor;
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vRandom;
varying float vElevation;

void main() {
    // gl_FragColor = vec4(0.5, vRandom, 1.0, 1.0); // ノイズ
    gl_FragColor = vec4(0.3, vRandom, 1.0, 1.0); // ノイズ
    // gl_FragColor = vec4(vUv, 0.0, 1.0); // カラー
    // gl_FragColor = vec4(uColor, 1.0); // オレンジ

    // vec4 textureColor = texture2D(uTexture, vUv);
    // textureColor.rgb *= vElevation * 2.0 + 0.5;
    // gl_FragColor = textureColor;
}