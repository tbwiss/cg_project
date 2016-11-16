precision mediump float;
uniform vec4 uColor;
varying vec4 vColor;

void main() {
    //gl_FragColor = vec4(1,1,1,1);
    gl_FragColor = vColor;
}