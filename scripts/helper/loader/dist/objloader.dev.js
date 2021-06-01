"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

(function _callee() {
  var response, text, lines, regexKeyword, vertexData, addMethods, i, length, line, result, _result, keyword, unparsedArgs, datas, handlerFunction;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(fetch("/game/resources/models/objs/Handgun_obj.obj"));

        case 2:
          response = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(response.text());

        case 5:
          text = _context.sent;
          console.log(text);
          lines = text.split("\n");
          regexKeyword = /(w*)(?: )*(.*)/;
          vertexData = {
            positionCordinate: [[0, 0, 0]],
            textureCordinate: [],
            normalCordinate: []
          };
          addMethods = {
            v: function v(data) {
              vertexData.positionCordinate.push(data);
            },
            vt: function vt(data) {
              vertexData.textureCordinate.push(data);
            },
            vn: function vn(data) {
              vertexData.normalCordinate.push(data);
            },
            f: function f(data) {// add the data in webgl from vertex data stored
            }
          };
          i = 0, length = 6;

        case 12:
          if (!(i < length)) {
            _context.next = 27;
            break;
          }

          line = lines[i].trim();

          if (!(line === "" || line.startsWith("#"))) {
            _context.next = 16;
            break;
          }

          return _context.abrupt("continue", 24);

        case 16:
          result = regexKeyword.exec(line);

          if (result) {
            _context.next = 19;
            break;
          }

          return _context.abrupt("continue", 24);

        case 19:
          _result = _slicedToArray(result, 3), keyword = _result[1], unparsedArgs = _result[2];
          datas = line.split(/\s+/).slice(1);
          handlerFunction = addMethods[keyword];

          if (!handlerFunction) {
            console.warn("identifiec keyword", keyword);
          }

          handlerFunction(datas);

        case 24:
          i++;
          _context.next = 12;
          break;

        case 27:
        case "end":
          return _context.stop();
      }
    }
  });
})();
//# sourceMappingURL=objloader.dev.js.map
