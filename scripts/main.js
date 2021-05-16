`use strict`;

const vs = `#version 300 es
    in vec3 a_position;
    in float a_textureCordinate;
    
    // create sampler
    
    uniform mat4 u_wvProjectionMatrix;

    function main(){
        vec4 gl_Position = multiply viewMatrix *vec4(a_position, 1.0);
        // generate sampled data
    }
`;

const fs =  `fragment shader`;

function init(){

    const canvas = document.querySelector("#main-canvas");
    let gl = canvas.getContext("webgl2");
    if(!gl){
        console.log("webgl2 not found");
        return;

    }
    // create a program
    let program = webglUtils.createProgramFromSources(gl, [vs, fs]);
    // find position of all the attribute;
    let vertexLocation = webglUtils.getAttributeLocation(program, "a_position");
    let wvProjectionMatrixLocation = webglUtils.getUniformLocation(program, "u_wvProjectionMatrix") 

    // create a vertex array to store the state of the program
    let vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    // change the state and input the value of the attributes with Vertex Buffer Object

    // calculate and input the uniform value - other than needed in draw scene/updating uniforms

    // call a function drawscene

    // call drawScene in loop

    // call the draw calls
}

init()