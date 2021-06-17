let matLib;
let geometries = [];

async function objFileLoader(gl) {
  async function objLoader() {
    const response = await fetch("/game/resources/models/objs/Chair/Chair.obj");
    const text = await response.text();
    const lines = text.split("\n");
    const regexKeyword = /(\w*)(?: )*(.*)/;
    let material = "basic";
    let object = "default";
    let group = "";
    let verticesIndices = [];

    let geometry;

    let webglData = [[], [], [], []];

    let positionCordinate = [[0, 0, 0]];
    let textureCordinate = [[0, 0]];
    let normalCordinate = [[0, 0, 0]];
    let vertexColor = [[0, 0, 0]];

    let vertexData = [
      positionCordinate,
      textureCordinate,
      normalCordinate,
      vertexColor,
    ];

    function addVertex(data) {
      let indices = data.split("/");
      indices.forEach((index, i) => {
        if (!index) {
          return;
        }
        index = index > 0 ? index : index + vertexData[i].length;
        webglData[i].push(...vertexData[i][index]);
        // add color value of that vertex which is i=0 to the webgl data
        if (i === 0) {
          webglData[3].push(...vertexColor[index]);
        }
      });
    }

    function resetGeometry() {
      if (geometry) {
        geometry = undefined;
      }
    }

    function setGeometry() {
      if (!geometry) {
        const position = [];
        const texCord = [];
        const normalCord = [];
        const colorValue = [];
        webglData = [position, texCord, normalCord, colorValue];

        geometry = {
          group,
          material,
          attributes: {
            position,
            texCord,
            normalCord,
            colorValue,
          },
        };

        console.log(material);

        geometries.push(geometry);
      }
    }

    let addMethods = {
      v(data) {
        if (data.length > 3) {
          positionCordinate.push(data.slice(0, 3));
          vertexColor.push(data.slice(3));
        } else {
          positionCordinate.push(data);
          vertexColor.push([1, 1, 1]);
        }
      },
      vt(data) {
        textureCordinate.push(data);
      },
      vn(data) {
        normalCordinate.push(data);
      },
      f(data) {
        setGeometry();
        for (
          let i = 0, traingleCount = data.length - 2;
          i < traingleCount;
          i++
        ) {
          addVertex(data[0]);
          addVertex(data[i + 1]);
          addVertex(data[i + 2]);
        }
      },
      mtllib(data) {
        matLib = data;
      },
      usemtl(data) {
        resetGeometry();
        material = data[0];
      },
      o(data) {
        object = data;
      },
    };

    for (let i = 0, length = lines.length; i < length; i++) {
      let line = lines[i].trim();
      if (line === "" || line.startsWith("#")) {
        continue;
      }
      let result = regexKeyword.exec(line);
      if (!result) {
        continue;
      }
      const [, keyword, unparsedArgs] = result;
      let datas = line.split(/\s+/).slice(1);
      const handlerFunction = addMethods[keyword];
      if (!handlerFunction) {
        // console.warn(`${keyword} isnot handled by this program`);
        continue;
      }
      handlerFunction(datas);
    }
  }

  function geometryRange(data) {
    let min = data.slice(0, 3);
    let max = data.slice(0, 3);

    for (let i = 0, length = data.length; i < length; i += 3) {
      for (let j = 0; j < 3; j++) {
        min[j] = Math.min(min[j], data[i + j]);
        max[j] = Math.max(max[j], data[i + j]);
      }
    }
    return { min, max };
  }

  function getRange(geometries) {
    return geometries.reduce(
      ({ min, max }, { attributes }) => {
        const vertexPosition = attributes.position;
        let minMax = geometryRange(vertexPosition);
        return {
          min: min.map((min, index) => Math.min(min, minMax.min[index])),
          max: max.map((max, index) => Math.max(max, minMax.max[index])),
        };
      },
      {
        min: Array(3).fill(Number.POSITIVE_INFINITY),
        max: Array(3).fill(Number.NEGATIVE_INFINITY),
      }
    );
  }

  async function materialLoader() {
    let materials = {};
    let material;
    let keywords = {
      newmtl(data) {
        material = {};
        materials[data[0]] = material;
      },
      Ns(data) {
        material.shininess = Number(...data);
      },
      Ka(data) {
        material.ambient = data.map(Number);
      },
      Kd(data) {
        material.diffuse = data.map(Number);
      },
      Ks(data) {
        material.specular = data.map(Number);
      },
      Ke(data) {
        material.emissive = data.map(Number);
      },
      Ni(data) {
        material.opticalDensity = Number(...data);
      },
      d(data) {
        material.opacity = Number(...data);
      },
      illum(data) {
        material.illum = Number(...data);
      },
    };

    function createDefaultTexture() {
      let texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        1,
        1,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        new Uint8Array([255, 255, 255, 255])
      );
      return texture;
    }

    function loadImage(url, texture) {
      let image = new Image();
      img.src = url;
      img.crossOriginSource = "";
      img.onload = () => {
        // safe side for large texture, otherwise not needed as we have already binded this above
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          image
        );

        if (isPowerOf2(img.width) && isPowerOf2(img.height)) {
          gl.generateMipmap(gl.TEXTURE_2D);
        }

        gl.texParameter2i(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameter2i(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameter2i(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      };

      return texture;
    }

    function textureLoader() {
      const textureList = {};
      let texture = createDefaultTexture();
      let materialLists = Object.values(materials);
      materialLists.forEach((material) => {
        Object.entries(material)
          .filter((value) => {
            if (value[0].endsWith("Map")) {
              return true;
            }
          })
          .map(([textureName, textureImage]) => {
            // find name of image from textureImage
            // you dont need to find the name because same name texture may be in different folder
            const texturemapped = materialLists[textureImage];
            if (!existingTexture) {
              // find URL of image
              let imageURL = new URL(textureImage, url).href;
              texturemapped = loadImage(imageURL, texture);
            }
            material[textureName] = texturemapped;
          });
      });
    }

    let url = new URL("./resources/models/objs/Chair/", window.location.href);
    let materialURL = new URL(matLib, url).href;
    const response = await (await fetch(materialURL)).text();
    const lines = response.split("\n");
    const regexKeyword = /(\w*)(?: )*(.*)/;

    for (let i = 0, length = lines.length; i < length; i++) {
      const data = lines[i].trim();
      if (data == "" || data.startsWith("#")) {
        continue;
      }
      const result = regexKeyword.exec(data);
      if (!result) {
        continue;
      }
      [, keyword, unparsedvalued] = result;
      let datas = data.split(/\s+/).slice(1);
      let handler = keywords[keyword];
      if (!handler) {
        // console.warn(`${keyword} is uncatched keyword`);
        continue;
      }

      handler(datas);
    }

    textureLoader();
    return materials;
  }
  await objLoader();
  materials = await materialLoader();
  // await textureLoader();

  let minMax = getRange(geometries);
  return {
    geometries,
    materials,
    minMax,
  };
}
