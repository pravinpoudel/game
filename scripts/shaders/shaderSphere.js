const vs = `#version 300 es

#define M_PI 3.1415926535897932384626433832795

in vec3 a_position;
in float a_textureCordinate;

uniform mat4 u_ModelMatrix;
uniform mat4 u_wvProjectionMatrix;

out vec3 vertexCordinate;
out vec2 uvCordinate;

void main(){

    vec3 vertDirection = normalize(vec3(a_position) - vec3(0.0, 0.0, 0.0));
    float u = atan(vertDirection.x, vertDirection.z)/(2.0*M_PI) + 0.5;
    float v = 0.5-vertDirection.y ;
    uvCordinate = vec2(u,v);

    gl_Position =  u_wvProjectionMatrix* vec4((2.0*a_position)- vec3(1.0, 1.0, 1.0), 1.0);  
    gl_Position =   vec4(a_position, 1.0);
    vertexCordinate = 0.5 - a_position;   
}
`;

const fs = `#version 300 es


precision highp float;

in vec3 vertexCordinate;
uniform sampler2D u_sphereText;

out vec4 outColor;
in vec2 uvCordinate;

void main(){
 
    // vec3 vertDirection = normalize(vertexCordinate - vec3(0.0, 0.0, 0.0));
    // float u = atan(vertDirection.x, vertDirection.z)/(2.0*M_PI) + 0.5;
    // float v = 0.5-vertDirection.y ;

    outColor = texture(u_sphereText, uvCordinate);
    // outColor = vec4(0.0, 0.8,  0.0, 1.0);
}

`;

const vsTriangle = `#version 300 es
    in vec3 a_position;
    in vec2 a_textureCordinate;

    out vec3 varying_color;

    uniform mat4 u_vpMatrix;


    void main(){
        gl_Position = u_vpMatrix*vec4(a_position, 1.0);
        varying_color = a_position;
    }
`;

const fsTriangle = `#version 300 es

    precision mediump float;
    in vec3 varying_color;
    
    uniform mat4 u_model;
    uniform mat4 u_VPmatrix;


    out vec4 outColor;

    void main(){
        outColor = vec4(1.0, 0.0, 0.0, 0.7);
    }
`;

const vsSkybox = `#version 300 es
in vec3 a_position;
out vec3 texPosition;
uniform mat4 u_VPmatrix;
uniform mat4 u_modelMatrix;

// pass the vertex vector to fragment shader

void main(){
    texPosition = a_position;
    gl_Position = u_VPmatrix*(vec4(a_position, 1.0));
}
`;

const fsSkybox = `#version 300 es

precision highp float;

in vec3 texPosition;
out vec4 outColor;

uniform samplerCube u_SkyTexture;


void main(){

    // outColor = vec4(0.0, 1.0, 0.0, 1.0);
    outColor = texture(u_SkyTexture, texPosition);
}
`;
