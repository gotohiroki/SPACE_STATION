// uniform mat4 projectionMatrix; // 3Dグラフィックスの投影行列を表す行列です。この行列は、オブジェクトの3D座標を2Dスクリーン座標に変換するために使用されます。
// uniform mat4 viewMatrix; // 3Dグラフィックスの視点行列を表す行列です。この行列は、カメラの位置と方向を定義し、オブジェクトをどのように見るかを制御します。
// uniform mat4 modelMatrix; // 3Dオブジェクトのモデル行列を表す行列です。この行列は、オブジェクトの位置、回転、スケーリングなどの変換を定義します。
uniform vec2 uFrequency; // XY
uniform float uTime; // 時間

// attribute vec3 position; // 3Dオブジェクトの頂点の位置情報を格納します。この属性は、頂点データがグラフィックスパイプラインに渡される際に使用され、オブジェクトの形状を定義します。
attribute float aRandom;
// attribute vec2 uv;

varying vec2 vUv;
varying float vRandom;
varying float vElevation;

void main() {
    // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

    vRandom = aRandom;
    vUv = uv;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.z += sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
    modelPosition.z += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;

    float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
    elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;

    modelPosition.z += elevation;
    vElevation = elevation;

    // modelPosition.z += aRandom * 0.1;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;

    // gl_Position.x += 0.5;
    // gl_Position.y += 0.5;
}