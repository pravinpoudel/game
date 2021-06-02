"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function objLoader() {
  var response, text, lines, regexKeyword, material, object, group, verticesIndices, geometries, geometry, webglData, positionCordinate, textureCordinate, normalCordinate, vertexColor, vertexData, addVertex, resetGeometry, setGeometry, addMethods, geometryRange, getRange, i, length, line, result, _result, keyword, unparsedArgs, datas, handlerFunction, minMax;

  return regeneratorRuntime.async(function objLoader$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          getRange = function _ref7(geometries) {
            return geometries.reduce(function (_ref, _ref2) {
              var min = _ref.min,
                  max = _ref.max;
              var attributes = _ref2.attributes;
              var vertexPosition = attributes.position;
              var minMax = geometryRange(vertexPosition);
              return {
                min: min.map(function (min, index) {
                  return Math.min(min, minMax.min[index]);
                }),
                max: max.map(function (max, index) {
                  return Math.max(max, minMax.max[index]);
                })
              };
            }, {
              min: Array(3).fill(Number.POSITIVE_INFINITY),
              max: Array(3).fill(Number.NEGATIVE_INFINITY)
            });
          };

          geometryRange = function _ref6(data) {
            var min = data.slice(0, 3);
            var max = data.slice(0, 3);

            for (var i = 0, length = data.length; i < length; i += 3) {
              for (var j = 0; j < 3; j++) {
                min[j] = Math.min(min[j], data[i + j]);
                max[j] = Math.max(max[j], data[i + j]);
              }
            }

            return {
              min: min,
              max: max
            };
          };

          setGeometry = function _ref5() {
            if (!geometry) {
              var position = [];
              var texCord = [];
              var normalCord = [];
              var colorValue = [];
              webglData = [position, texCord, normalCord, colorValue];
              geometry = {
                group: group,
                material: material,
                attributes: {
                  position: position,
                  texCord: texCord,
                  normalCord: normalCord,
                  colorValue: colorValue
                }
              };
              geometries.push(geometry);
            }
          };

          resetGeometry = function _ref4() {
            if (geometry) {
              geometry = undefined;
            }
          };

          addVertex = function _ref3(data) {
            var indices = data.split("/");
            indices.forEach(function (index, i) {
              var _webglData$i;

              if (!index) {
                return;
              }

              index = index > 0 ? index : index + vertexData[i].length;

              (_webglData$i = webglData[i]).push.apply(_webglData$i, _toConsumableArray(vertexData[i][index])); // add color value of that vertex which is i=0 to the webgl data


              if (i === 0) {
                var _webglData$;

                (_webglData$ = webglData[3]).push.apply(_webglData$, _toConsumableArray(vertexColor[index]));
              }
            });
          };

          _context.next = 7;
          return regeneratorRuntime.awrap(fetch("/game/resources/models/objs/Chair/Chair.obj"));

        case 7:
          response = _context.sent;
          _context.next = 10;
          return regeneratorRuntime.awrap(response.text());

        case 10:
          text = _context.sent;
          lines = text.split("\n");
          regexKeyword = /(\w*)(?: )*(.*)/;
          material = "basic";
          object = "default";
          group = "";
          verticesIndices = [];
          geometries = [];
          webglData = [[], [], [], []];
          positionCordinate = [[0, 0, 0]];
          textureCordinate = [[0, 0]];
          normalCordinate = [[0, 0, 0]];
          vertexColor = [[0, 0, 0]];
          vertexData = [positionCordinate, textureCordinate, normalCordinate, vertexColor];
          addMethods = {
            v: function v(data) {
              if (data.length > 3) {
                positionCordinate.push(data.slice(0, 3));
                vertexColor.push(data.slice(3));
              } else {
                positionCordinate.push(data);
                vertexColor.push([1, 1, 1]);
              }
            },
            vt: function vt(data) {
              textureCordinate.push(data);
            },
            vn: function vn(data) {
              normalCordinate.push(data);
            },
            f: function f(data) {
              setGeometry();

              for (var i = 0, traingleCount = data.length - 2; i < traingleCount; i++) {
                addVertex(data[0]);
                addVertex(data[i + 1]);
                addVertex(data[i + 2]);
              }
            },
            usemtl: function usemtl(data) {
              resetGeometry();
              material = data;
            },
            o: function o(data) {
              object = data;
            }
          };
          i = 0, length = lines.length;

        case 26:
          if (!(i < length)) {
            _context.next = 43;
            break;
          }

          line = lines[i].trim();

          if (!(line === "" || line.startsWith("#"))) {
            _context.next = 30;
            break;
          }

          return _context.abrupt("continue", 40);

        case 30:
          result = regexKeyword.exec(line);

          if (result) {
            _context.next = 33;
            break;
          }

          return _context.abrupt("continue", 40);

        case 33:
          _result = _slicedToArray(result, 3), keyword = _result[1], unparsedArgs = _result[2];
          datas = line.split(/\s+/).slice(1);
          handlerFunction = addMethods[keyword];

          if (handlerFunction) {
            _context.next = 39;
            break;
          }

          console.warn("".concat(keyword, " isnot handled by this program"));
          return _context.abrupt("continue", 40);

        case 39:
          handlerFunction(datas);

        case 40:
          i++;
          _context.next = 26;
          break;

        case 43:
          minMax = getRange(geometries);
          return _context.abrupt("return", {
            geometries: geometries,
            minMax: minMax
          });

        case 45:
        case "end":
          return _context.stop();
      }
    }
  });
}
//# sourceMappingURL=objloader.dev.js.map
