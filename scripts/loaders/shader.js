const loader_VS = `#version 300 es

// you can make in vec4 a_position; glsl will add more data than pointer point with 1.0

in vec3 a_position;
in vec3 a_color;
in vec3 a_normal;

out vec3 v_color;
out vec3 v_normalWorld;
out vec3 surfaceView;

uniform mat4 u_modelMatrix;
uniform mat4 u_vpMatrix;

uniform mat4 u_worldNormal;
uniform vec3 u_cameraWorld;
uniform float u_scale;

void main(){

    vec4 worldPosition = u_modelMatrix*vec4(a_position, 1.0);
    surfaceView = u_cameraWorld- vec3(worldPosition);

    v_normalWorld = (mat3(u_modelMatrix)*a_normal);

    v_color = a_color;

    gl_Position = u_vpMatrix*u_modelMatrix*vec4(a_position*u_scale, 1.0);
}
`;

const loader_FS = `#version 300 es

#if GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else 
    precision mediump float;
#endif

in vec3 v_color;
in vec3 v_normalWorld;
in vec3 surfaceView;

out vec4 outColor;

uniform vec3 u_lightDirection;

uniform vec3 ambient;
uniform vec3 diffuse;
uniform vec3 specular;

uniform sampler2D diffuseSampler;
uniform sampler2D normalSampler;
uniform sampler2D specularSampler;

uniform vec3 emmisive;
uniform float shininess;
uniform float opacity;
uniform vec3 u_ambientLight;


void main(){

    vec3 normalDirection = normalize(v_normalWorld);
    vec3 viewDirection = normalize(surfaceView);

    vec3 lightDirectionNormalized = normalize(u_lightDirection);
    vec3 ambientLight = v_color*ambient*u_ambientLight;

    vec3 directionalLight = vec3(0.8, 0.8, 0.8);    
    float lambertianFactor = clamp(dot(normalDirection, lightDirectionNormalized), 0.0, 1.0);
    // vec3 diffuseTextureData = texture2D(diffuseSampler, v_textCord);
    vec3 effectiveDiffuse = v_color*diffuse*lambertianFactor*directionalLight;

    vec3 halfVector = normalize(lightDirectionNormalized + viewDirection);
    float specularLight = clamp(dot(halfVector, normalDirection), 0.0, 1.0);
    // vec3 specularTextureData = texture2D(specularSampler, v_textCord);
    vec3 effectiveSpecular = specular*pow(specularLight, shininess);

    outColor = vec4( emmisive + ambientLight + effectiveDiffuse + effectiveSpecular, 1.0); 
}
`;
