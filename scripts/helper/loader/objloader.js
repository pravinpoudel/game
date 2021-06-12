let matLib;
let geometries = [];

async function objFileLoader() {
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
    return materials;
  }
  await objLoader();
  materials = await materialLoader();
  let minMax = getRange(geometries);
  return {
    geometries,
    materials,
    minMax,
  };
}
