const loader_VS = `#version 300 es

in vec3 a_position;
in vec3 a_color;
out vec3 v_color;

uniform mat4 u_modelMatrix;
uniform mat4 u_vpMatrix;
uniform float u_scale;

void main(){
    v_color = a_color;
    gl_Position = u_vpMatrix*u_modelMatrix*vec4(a_position*u_scale, 1.0);
}
`;

const loader_FS = `#version 300 es

precision highp float;

in vec3 v_color;
out vec4 outColor;

void main(){
    outColor = vec4(v_color, 1.0);
    // outColor = vec4(0.0, 1.0, 0.0, 1.0);
}
`;
