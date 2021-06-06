const matLib = [];

async function objLoader() {
  const response = await fetch("/game/resources/models/objs/Chair/Chair.obj");
  const text = await response.text();
  const lines = text.split("\n");
  const regexKeyword = /(\w*)(?: )*(.*)/;
  let material = "basic";
  let object = "default";
  let group = "";
  let verticesIndices = [];

  let geometries = [];
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
      for (let i = 0, traingleCount = data.length - 2; i < traingleCount; i++) {
        addVertex(data[0]);
        addVertex(data[i + 1]);
        addVertex(data[i + 2]);
      }
    },
    mtllib(data) {
      matLib.push(data);
    },
    usemtl(data) {
      resetGeometry();
      material = data;
    },
    o(data) {
      object = data;
    },
  };

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
      console.warn(`${keyword} isnot handled by this program`);
      continue;
    }
    handlerFunction(datas);
  }

  matLib.forEach(async (element, index) => {
    let url = new URL("./resources/models/objs/Chair/", window.location.href);
    let materialURL = new URL(element, url);
    const response = await (await fetch(materialURL)).text();
    const lines = response.split("\n");
  });

  for (let i = 0, length = lines.length; i < length; i++) {
    const data = lines[i].trim();
  }

  let minMax = getRange(geometries);
  return {
    geometries,
    minMax,
  };
}
