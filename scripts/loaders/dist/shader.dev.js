"use strict";

var loader_VS = "#version 300 es\n\nin vec3 a_position;\n\nuniform mat4 u_modelMatrix;\nuniform mat4 u_vpMatrix;\nuniform float u_scale;\n\nout vec3 v_color;\n\nvoid main(){\n    v_color = a_position;\n    gl_Position = u_vpMatrix*u_modelMatrix*vec4(a_position*u_scale, 1.0);\n}\n";
var loader_FS = "#version 300 es\n\nprecision highp float;\n\nin vec3 v_color;\nout vec4 outColor;\n\nvoid main(){\n    outColor = vec4(0.0, 1.0, 0.0, 0.5);\n}\n";
//# sourceMappingURL=shader.dev.js.map