/**
 * Created by Thomas on 29/09/2016.
 */

window.onload = startup;

var canvas;
var gl;
var attributes = new Object();
var buffers = new Object();
var matrices = new Object();

var lastTimestamp;



function setupAttributes() {
    attributes.aVertexPositionId = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    attributes.aColorPositionId = gl.getAttribLocation(shaderProgram, "aColor");
    //attributes.uColorPositionId = gl.getUniformLocation(shaderProgram, "uColor");
    attributes.uModelViewMatrixId = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
    attributes.uProjectionMatrixId = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
    attributes.uCameraMatrixId = gl.getUniformLocation(shaderProgram, "uCameraMatrix");
}


function setupBufferColors() {
    buffers.colors = gl.createBuffer();

    var vertices = [
        //Frontside of the cube
        1,1,0,1,
        1,1,0,1,
        1,1,0,1,
        1,1,0,1,

        // right side of the cube
        1,0.5,1,1,
        1,0.5,1,1,
        1,0.5,1,1,
        1,0.5,1,1,


        // Top of the cube
        0.5,1,1,1,
        0.5,1,1,1,
        0.5,1,1,1,
        0.5,1,1,1,


        //left side of the cube
        0,0,1,1,
        0,0,1,1,
        0,0,1,1,
        0,0,1,1,

        // bottom of the cube
        0.5,0.5,0.5,1,
        0.5,0.5,0.5,1,
        0.5,0.5,0.5,1,
        0.5,0.5,0.5,1,

        //Backside of the cube
        1,0.2,0.2,1,
        1,0.2,0.2,1,
        1,0.2,0.2,1,
        1,0.2,0.2,1


    ];
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colors);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

function setupBufferVertices() {
    buffers.vertices = gl.createBuffer();

    var vertices = [
        //Frontside of the cube
        -5, -5, -5,  // 0
        5, -5, -5,   // 1
        5, 5, -5,     // 2
        -5, 5 , -5,  // 3



        // right side of the cube
        5, -5, -5,   // 4
        5, -5, 5, // 5
        5, 5, 5,  // 6
        5, 5, -5,  // 7

        // Top of the cube
        5, 5, -5,  // 8
        5, 5, 5,  // 9
        -5, 5, 5,  //10
        -5, 5 , -5,  // 11

        //left side of the cube
        -5, -5, -5,  // 12
        -5,-5, 5,  //13
        -5, 5, 5,  // 14
        -5, 5 , -5,  // 15

        // bottom of the cube
        -5, -5, -5,  // 16
        5, -5, -5,   // 17
        5, -5, 5, // 18
        -5,-5, 5,  //19

        //Backside of the cube
        5, -5, 5, //20
        -5,-5, 5,  //21
        -5, 5, 5,  //22
        5, 5, 5  //23


    ];
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertices);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

function setupBufferIndices() {
    buffers.edge = gl.createBuffer();

    var indices = [
       // front
        0,2,3,
        0,1,2,

        // right
        4,6,7,
        4,5,6,

        //top
        8,10,11,
        8,9,10,

        //left
        13,15,14,
        13,12,15,


        //bottom
        17,16,19,
        19,18,17,

        // back
        23,20,21,
        21,22,23


    ];
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.edge);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
}




function startup(){
    canvas = document.getElementById("gameCanvas");
    gl = createGLContext(canvas);
    initGL();
    drawAnimated(null);
    //draw();
}

function createGLContext(canvas){
    // get the gl drawing context
    var context = canvas.getContext("webgl");
    if (!context){
        alert("Failed to create GL context");
    }
    // wrap to debug context
    return WebGLDebugUtils.makeDebugContext(context);
}

function initGL(){
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    shaderProgram = loadAndCompileShaders(gl, "VertexShader.shader", "FragmentShader.shader");
    setupAttributes();
    setupBufferVertices();
    setupBufferIndices();
    setupBufferColors();


    matrices.rotation = mat4.create();
    mat4.identity(matrices.rotation);
    matrices.rotationSecond = mat4.create();
    mat4.identity(matrices.rotationSecond);
    matrices.rotationThird = mat4.create();
    mat4.identity(matrices.rotationThird);
    matrices.rotationFour = mat4.create();
    mat4.identity(matrices.rotationFour);

}

function draw(){
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colors);
    gl.vertexAttribPointer(attributes.aColorPositionId, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attributes.aColorPositionId);


    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertices);
    gl.vertexAttribPointer(attributes.aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attributes.aVertexPositionId);

    gl.uniformMatrix4fv(attributes.uProjectionMatrixId, false, matrices.orthoMatrix);
    gl.uniformMatrix4fv(attributes.uModelViewMatrixId, false, matrices.rotationSecond);
    gl.uniformMatrix4fv(attributes.uCameraMatrixId, false, matrices.lookAtMatrix);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.edge);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.FRONT);
    gl.enable(gl.CULL_FACE);

    gl.viewport(0,0,400,300);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colors);
    gl.vertexAttribPointer(attributes.aColorPositionId, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attributes.aColorPositionId);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertices);
    gl.vertexAttribPointer(attributes.aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attributes.aVertexPositionId);

    gl.uniformMatrix4fv(attributes.uProjectionMatrixId, false, matrices.orthoMatrix);
    gl.uniformMatrix4fv(attributes.uModelViewMatrixId, false, matrices.rotationThird);
    gl.uniformMatrix4fv(attributes.uCameraMatrixId, false, matrices.lookAtMatrix);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.edge);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.FRONT);
    gl.enable(gl.CULL_FACE);

    gl.viewport(400,300, 400, 300);


    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colors);
    gl.vertexAttribPointer(attributes.aColorPositionId, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attributes.aColorPositionId);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertices);
    gl.vertexAttribPointer(attributes.aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attributes.aVertexPositionId);

    gl.uniformMatrix4fv(attributes.uProjectionMatrixId, false, matrices.orthoMatrix);
    gl.uniformMatrix4fv(attributes.uModelViewMatrixId, false, matrices.rotationFour);
    gl.uniformMatrix4fv(attributes.uCameraMatrixId, false, matrices.lookAtMatrix);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.edge);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.FRONT);
    gl.enable(gl.CULL_FACE);

    gl.viewport(0,300, 400, 300);


    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colors);
    gl.vertexAttribPointer(attributes.aColorPositionId, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attributes.aColorPositionId);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertices);
    gl.vertexAttribPointer(attributes.aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attributes.aVertexPositionId);

    gl.uniformMatrix4fv(attributes.uProjectionMatrixId, false, matrices.orthoMatrix);
    gl.uniformMatrix4fv(attributes.uModelViewMatrixId, false, matrices.rotation);
    gl.uniformMatrix4fv(attributes.uCameraMatrixId, false, matrices.lookAtMatrix);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.edge);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.FRONT);
    gl.enable(gl.CULL_FACE);

    gl.viewport(400,0, 400, 300);


}

function drawAnimated(timeStamp){
    // calc time since last call
    // move or change object
    if(!lastTimestamp){
        lastTimestamp = timeStamp;
    }
    var deltaTime = timeStamp - lastTimestamp;
    lastTimestamp = timeStamp;

    //
    //  Nachbauen der Darstellungen im Dok Uebung 3 Teil 1.
    //

    /*  oben mitte
     matrices.orthoMatrix = mat4.create();
     mat4.frustum(matrices.orthoMatrix,-10, 10, -10, 10, 15, 100);
     matrices.lookAtMatrix = mat4.create();
     mat4.lookAt(matrices.lookAtMatrix, [0,0,20] , [0,0,0] , [0,1,0]);
     */

    /*  unten mitte
     matrices.orthoMatrix = mat4.create();
     mat4.ortho(matrices.orthoMatrix, -10, 10, -10, 10, -10, 100);
     matrices.lookAtMatrix = mat4.create();
     mat4.lookAt(matrices.lookAtMatrix, [10,0,20] , [0,0,0] , [0,1,0]);
     */

    /* oben rechts
     matrices.orthoMatrix = mat4.create();
     mat4.frustum(matrices.orthoMatrix,-10, 10, -10, 10, 15, 100);
     matrices.lookAtMatrix = mat4.create();
     mat4.lookAt(matrices.lookAtMatrix, [15,-15,15] , [0,0,0] , [0,1,0]);
     */

    /* unten links
     matrices.orthoMatrix = mat4.create();
     mat4.frustum(matrices.orthoMatrix,-10, 10, -10, 10, 15, 100);
     matrices.lookAtMatrix = mat4.create();
     mat4.lookAt(matrices.lookAtMatrix, [-10,0,20] , [0,0,0] , [0,1,0]);
     */

    /* unten rechts
     matrices.orthoMatrix = mat4.create();
     mat4.frustum(matrices.orthoMatrix,-10, 10, -10, 10, 15, 100);
     matrices.lookAtMatrix = mat4.create();
     mat4.lookAt(matrices.lookAtMatrix, [30,12,15] , [0,0,0] , [0,1,0]);
     */


    matrices.orthoMatrix = mat4.create();
    matrices.lookAtMatrix = mat4.create();
    //mat4.frustum(matrices.orthoMatrix,-10, 10, -10, 10, 15, 100);
    mat4.perspective(matrices.orthoMatrix, 7, 800/600, 10, 100);
    mat4.ortho(matrices.orthoMatrix, -10, 10, -10, 10, 0, 100);
    mat4.lookAt(matrices.lookAtMatrix, [10,30,15] , [0,0,0] , [0,1,0]);



    mat4.rotateX(matrices.rotationFour, matrices.rotationFour, 0.02);
    mat4.rotateY(matrices.rotation, matrices.rotation, 0.05);
    mat4.rotateZ(matrices.rotationSecond, matrices.rotationSecond, -0.02);

    mat4.rotateX(matrices.rotationThird, matrices.rotationThird, 0.02);
    mat4.rotateY(matrices.rotationThird, matrices.rotationThird, 0.03);



    draw();

    //request the next frame;
    window.requestAnimationFrame(drawAnimated);
}




