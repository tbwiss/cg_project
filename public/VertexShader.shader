attribute vec3 aVertexPosition;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uCameraMatrix;
attribute vec4 aColor;
varying vec4 vColor;

void main() {
    //gl_Position = vec4(aVertexPosition, 0, 1);
    vColor = aColor;
    vec4 position = vec4(aVertexPosition, 1.0);
    gl_Position =  uProjectionMatrix  * uCameraMatrix * uModelViewMatrix * position;
}