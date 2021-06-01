
  async function objLoader(){
      const response = await fetch("/game/resources/models/objs/Chair/Chair.obj");
      const text = await response.text();
      const lines = text.split("\n");
      const regexKeyword = /(\w*)(?: )*(.*)/;
      let material = "basic";
      let object = "default";
      let group = ""
      let verticesIndices = [];

      let geometries = [];
      let geometry;

      let webglData = [
        [],
        [],
        []
      ];

        let positionCordinate = [[0, 0, 0]];
        let textureCordinate = [[0, 0]];
        let normalCordinate = [[0, 0, 0]];

        let vertexData = [
          positionCordinate,
          textureCordinate,
          normalCordinate
        ];


      function addVertex(data){
        let indices = data.split("/");

        indices.forEach((index, i) => {
          if(!index){
            return;
          }
          index = (index>0?index: index+(vertexData[i].length));
          webglData[i].push(...vertexData[i][index]);
        });
      }

      function resetGeometry(){
        if( geometry ){
            geometry = undefined;
        }
      }

      function setGeometry(){
      if(!geometry){
        const position = [];
        const texCord = [];
        const normalCord = [];

        webglData = [
          position,
          texCord,
          normalCord
        ];

       geometry = {
        group,
        material,
        attributes:{
          position,
          texCord,
          normalCord
        }    
          };
        
        geometries.push(geometry);
        }        
      }

      let addMethods = {
        v(data) {
          positionCordinate.push(data);
        },
        vt(data) {
          textureCordinate.push(data);
        },
        vn(data) {
          normalCordinate.push(data);
        },
        f(data) {
        setGeometry();
        for(let i=0, traingleCount = data.length -2; i<traingleCount; i++){
          addVertex(data[0]);
          addVertex(data[i+1]);
          addVertex(data[i+2])
        }
        },
        usemtl(data){
          resetGeometry();
          material = data;
        },
        o(data){
          object = data;
        }
      };

      function geometryRange(data){
            let min = data.slice(0, 3);
            let max = data.slice(0, 3);

            for(let i=0, length = data.length; i<length; i+=3){
              for(let j=0; j<3; j++){
                min[j] = Math.min(min[j], data[i+j]);
                max[j] = Math.max(max[j], data[i+j]);
              }
            }
            return {min, max};
      }

      function getRange(geometries){
          return geometries.reduce(({min, max}, {attributes})=>{
              const vertexPosition = attributes.position;
              let minMax = geometryRange(vertexPosition);
              return{
                min: min.map((min, index)=>Math.min(min, minMax.min[index])),
                max: max.map((max, index)=>Math.max(max, minMax.max[index]))
              };
          },
          {
          min:Array(3).fill(Number.POSITIVE_INFINITY),
          max:Array(3).fill(Number.NEGATIVE_INFINITY)
        });
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
      let minMax = getRange(geometries);
      return {
        geometries, 
        minMax
        };
  }