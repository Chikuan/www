/*
 * File:        nyancat.js
 * Version      0.1.0
 * Maintainer:  Shintaro Kaneko <kaneshin0120@gmail.com>
 * Last Change: 22-Aug-2012.
 */

(function(window, document) {
  var getCanvasById = function(id) {
    var elem = document.getElementById(id);
    return { self: elem
      , context: elem.getContext('2d')
      , width: elem.width
      , height: elem.height
      , background: 'rgba(0,51,153,1)'
    };
  };
  var drawCanvas = function(spec, object_name) {
    var cvs = spec.canvas;
    var objects = spec.objects[object_name];
    var frame = function() {
      // clearing (filling) canvas
      cvs.context.fillStyle = cvs.background;
      cvs.context.fillRect(0, 0, cvs.width, cvs.height);
      // rendering canvas
      for (var obj in objects) {
        objects[obj].render();
      }
      // update objects
      for (var obj in objects) {
        objects[obj].update();
      }
    };
    spec.intervalId = setInterval(frame, 70);
  };
  var stopCanvas = function(spec) {
    if (spec.intervalId != undefined) {
      clearInterval(spec.intervalId);
      spec.intervalId = undefined;
    }
  };
  // Exports
  document.getCanvasById = getCanvasById;
  document.drawCanvas = drawCanvas;
  document.stopCanvas = stopCanvas;
})(window, document);

/* Particle bit pattern data {{{ */
var particle_data = [
  [[0,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0]
  ,[0,0,0,1,0,0,0]
  ,[0,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0]
  ]
, [[0,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0]
  ,[0,0,1,0,1,0,0]
  ,[0,0,0,1,0,0,0]
  ,[0,0,1,0,1,0,0]
  ,[0,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0]
  ]
, [[0,0,0,0,0,0,0]
  ,[0,1,0,0,0,1,0]
  ,[0,0,1,0,1,0,0]
  ,[0,0,0,0,0,0,0]
  ,[0,0,1,0,1,0,0]
  ,[0,1,0,0,0,1,0]
  ,[0,0,0,0,0,0,0]
  ]
, [[1,0,0,0,0,0,1]
  ,[0,1,0,0,0,1,0]
  ,[0,0,0,0,0,0,0]
  ,[0,0,0,1,0,0,0]
  ,[0,0,0,0,0,0,0]
  ,[0,1,0,0,0,1,0]
  ,[1,0,0,0,0,0,1]
  ]
, [[1,0,0,0,0,0,1]
  ,[0,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0]
  ,[1,0,0,0,0,0,1]
  ]
]
, particle_data_nr = particle_data.length
, particle_data_lines = particle_data[0].length
, particle_data_columns = particle_data[0][0].length
;
/* }}} */

/* NyanCat bit pattern data {{{ */
var nyancat_data = [
  [[0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0,0,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,0,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0,1,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,1,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0,1,4,4,3,3,3,3,3,7,3,3,7,3,3,3,3,3,4,4,1,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0,1,4,3,3,7,3,3,3,3,3,3,1,1,3,7,3,3,3,4,1,0,1,1,0,0,0]
  ,[0,0,0,0,0,0,0,1,4,3,3,3,3,3,3,3,3,1,2,2,1,3,3,3,3,4,1,1,2,2,1,0,0]
  ,[0,0,1,1,0,0,0,1,4,3,3,3,3,3,7,3,3,1,2,2,2,1,3,3,3,4,1,2,2,2,1,0,0]
  ,[0,1,2,2,1,0,0,1,4,3,3,3,7,3,3,3,3,1,2,2,2,2,1,1,1,1,2,2,2,2,1,0,0]
  ,[0,1,2,2,2,1,0,1,4,3,3,3,3,3,3,7,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0]
  ,[0,0,1,2,2,2,1,1,4,3,7,3,3,3,3,3,1,2,2,2,5,1,2,2,2,2,2,5,1,2,2,1,0]
  ,[0,0,0,1,2,2,2,1,4,3,3,3,3,3,3,3,1,2,2,2,1,1,2,2,2,1,2,1,1,2,2,1,0]
  ,[0,0,0,0,1,1,1,1,4,3,3,3,3,3,7,3,1,2,6,6,2,2,2,2,2,2,2,2,2,6,6,1,0]
  ,[0,0,0,0,0,0,0,1,4,4,3,7,3,3,3,3,1,2,6,6,2,1,2,2,1,2,2,1,2,6,6,1,0]
  ,[0,0,0,0,0,0,0,1,4,4,4,3,3,3,3,3,3,1,2,2,2,1,1,1,1,1,1,1,2,2,1,0,0]
  ,[0,0,0,0,0,0,1,1,1,4,4,4,4,4,4,4,4,4,1,2,2,2,2,2,2,2,2,2,2,1,0,0,0]
  ,[0,0,0,0,0,1,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0]
  ,[0,0,0,0,0,1,2,2,1,1,0,1,2,2,1,0,0,0,0,1,2,2,1,0,1,2,2,1,0,0,0,0,0]
  ,[0,0,0,0,0,1,1,1,1,0,0,1,1,1,0,0,0,0,0,0,1,1,1,0,0,1,1,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  ]
, [[0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0,0,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,0,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0,1,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,1,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0,1,4,4,3,3,3,3,3,7,3,3,7,3,3,3,3,3,4,4,1,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0,1,4,3,3,7,3,3,3,3,3,3,3,1,1,3,7,3,3,4,1,0,0,1,1,0,0]
  ,[0,0,0,0,0,0,0,1,4,3,3,3,3,3,3,3,3,3,1,2,2,1,3,3,3,4,1,0,1,2,2,1,0]
  ,[0,0,0,0,0,0,0,1,4,3,3,3,3,3,7,3,3,3,1,2,2,2,1,3,3,4,1,1,2,2,2,1,0]
  ,[0,0,1,1,0,0,0,1,4,3,3,3,7,3,3,3,3,3,1,2,2,2,2,1,1,1,1,2,2,2,2,1,0]
  ,[0,1,2,2,1,0,0,1,4,3,3,3,3,3,3,7,3,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1]
  ,[0,1,2,2,2,1,1,1,4,3,7,3,3,3,3,3,3,1,2,2,2,5,1,2,2,2,2,2,5,1,2,2,1]
  ,[0,0,1,1,2,2,2,1,4,3,3,3,3,3,3,3,3,1,2,2,2,1,1,2,2,2,1,2,1,1,2,2,1]
  ,[0,0,0,1,1,1,1,1,4,3,3,3,3,3,7,3,3,1,2,6,6,2,2,2,2,2,2,2,2,2,6,6,1]
  ,[0,0,0,0,0,0,0,1,4,4,3,7,3,3,3,3,3,1,2,6,6,2,1,2,2,1,2,2,1,2,6,6,1]
  ,[0,0,0,0,0,0,0,1,4,4,4,3,3,3,3,3,3,3,1,2,2,2,1,1,1,1,1,1,1,2,2,1,0]
  ,[0,0,0,0,0,0,0,1,1,4,4,4,4,4,4,4,4,4,4,1,2,2,2,2,2,2,2,2,2,2,1,0,0]
  ,[0,0,0,0,0,0,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0]
  ,[0,0,0,0,0,0,1,2,2,1,0,1,2,2,1,0,0,0,0,0,1,2,2,1,0,1,2,2,1,0,0,0,0]
  ,[0,0,0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0]
  ,[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  ]
, [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0,0,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,0,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0,1,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,1,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0,1,4,4,3,3,3,3,3,7,3,3,7,3,3,3,3,3,4,4,1,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0,1,4,3,3,7,3,3,3,3,3,3,3,1,1,3,7,3,3,4,1,0,0,1,1,0,0]
  ,[0,0,0,0,0,0,0,1,4,3,3,3,3,3,3,3,3,3,1,2,2,1,3,3,3,4,1,0,1,2,2,1,0]
  ,[0,0,0,0,0,0,0,1,4,3,3,3,3,3,7,3,3,3,1,2,2,2,1,3,3,4,1,1,2,2,2,1,0]
  ,[0,0,0,0,0,0,0,1,4,3,3,3,7,3,3,3,3,3,1,2,2,2,2,1,1,1,1,2,2,2,2,1,0]
  ,[0,0,0,0,0,0,0,1,4,3,3,3,3,3,3,7,3,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1]
  ,[0,0,0,0,0,0,1,1,4,3,7,3,3,3,3,3,3,1,2,2,2,5,1,2,2,2,2,2,5,1,2,2,1]
  ,[0,0,0,1,1,1,2,1,4,3,3,3,3,3,3,3,3,1,2,2,2,1,1,2,2,2,1,2,1,1,2,2,1]
  ,[0,0,1,2,2,2,1,1,4,3,3,3,3,3,7,3,3,1,2,6,6,2,2,2,2,2,2,2,2,2,6,6,1]
  ,[0,1,2,2,1,1,0,1,4,4,3,7,3,3,3,3,3,1,2,6,6,2,1,2,2,1,2,2,1,2,6,6,1]
  ,[0,0,1,1,0,0,0,1,4,4,4,3,3,3,3,3,3,3,1,2,2,2,1,1,1,1,1,1,1,2,2,1,0]
  ,[0,0,0,0,0,0,0,1,1,4,4,4,4,4,4,4,4,4,4,1,2,2,2,2,2,2,2,2,2,2,1,0,0]
  ,[0,0,0,0,0,0,0,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0]
  ,[0,0,0,0,0,0,0,1,2,2,1,0,1,2,2,1,0,0,0,0,0,1,2,2,1,0,1,2,2,1,0,0,0]
  ,[0,0,0,0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,1,1,1,0,0,1,1,1,0,0,0]
  ]
, [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0,0,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,0,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0,1,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,1,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0,1,4,4,3,3,3,3,3,7,3,3,7,3,3,3,3,3,4,4,1,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0,1,4,3,3,7,3,3,3,3,3,3,3,1,1,3,7,3,3,4,1,0,0,1,1,0,0]
  ,[0,0,0,0,0,0,0,1,4,3,3,3,3,3,3,3,3,3,1,2,2,1,3,3,3,4,1,0,1,2,2,1,0]
  ,[0,0,0,0,0,0,0,1,4,3,3,3,3,3,7,3,3,3,1,2,2,2,1,3,3,4,1,1,2,2,2,1,0]
  ,[0,0,0,0,0,0,0,1,4,3,3,3,7,3,3,3,3,3,1,2,2,2,2,1,1,1,1,2,2,2,2,1,0]
  ,[0,0,0,0,0,0,0,1,4,3,3,3,3,3,3,7,3,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1]
  ,[0,0,0,0,0,1,1,1,4,3,7,3,3,3,3,3,3,1,2,2,2,5,1,2,2,2,2,2,5,1,2,2,1]
  ,[0,0,0,1,1,2,2,1,4,3,3,3,3,3,3,3,3,1,2,2,2,1,1,2,2,2,1,2,1,1,2,2,1]
  ,[0,0,1,2,2,2,1,1,4,3,3,3,3,3,7,3,3,1,2,6,6,2,2,2,2,2,2,2,2,2,6,6,1]
  ,[0,1,2,2,1,1,0,1,4,4,3,7,3,3,3,3,3,1,2,6,6,2,1,2,2,1,2,2,1,2,6,6,1]
  ,[0,1,2,2,1,0,0,1,4,4,4,3,3,3,3,3,3,3,1,2,2,2,1,1,1,1,1,1,1,2,2,1,0]
  ,[0,0,1,1,0,0,0,1,1,4,4,4,4,4,4,4,4,4,4,1,2,2,2,2,2,2,2,2,2,2,1,0,0]
  ,[0,0,0,0,0,0,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0]
  ,[0,0,0,0,0,0,1,2,2,1,0,1,2,2,1,0,0,0,0,0,1,2,2,1,0,1,2,2,1,0,0,0,0]
  ,[0,0,0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0]
  ]
, [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0,0,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,0,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0,1,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,1,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0,1,4,4,3,3,3,3,3,7,3,3,7,3,3,3,3,3,4,4,1,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0,1,4,3,3,7,3,3,3,3,3,3,1,1,3,7,3,3,3,4,1,0,1,1,0,0,0]
  ,[0,0,0,0,0,0,0,1,4,3,3,3,3,3,3,3,3,1,2,2,1,3,3,3,3,4,1,1,2,2,1,0,0]
  ,[0,0,0,0,0,0,0,1,4,3,3,3,3,3,7,3,3,1,2,2,2,1,3,3,3,4,1,2,2,2,1,0,0]
  ,[0,1,1,1,1,0,0,1,4,3,3,3,7,3,3,3,3,1,2,2,2,2,1,1,1,1,2,2,2,2,1,0,0]
  ,[1,2,2,2,1,1,1,1,4,3,3,3,3,3,3,7,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0]
  ,[1,1,2,2,2,2,1,1,4,3,7,3,3,3,3,3,1,2,2,2,5,1,2,2,2,2,2,5,1,2,2,1,0]
  ,[0,0,1,1,1,2,2,1,4,3,3,3,3,3,3,3,1,2,2,2,1,1,2,2,2,1,2,1,1,2,2,1,0]
  ,[0,0,0,0,0,1,1,1,4,3,3,3,3,3,7,3,1,2,6,6,2,2,2,2,2,2,2,2,2,6,6,1,0]
  ,[0,0,0,0,0,0,0,1,4,4,3,7,3,3,3,3,1,2,6,6,2,1,2,2,1,2,2,1,2,6,6,1,0]
  ,[0,0,0,0,0,0,0,1,4,4,4,3,3,3,3,3,3,1,2,2,2,1,1,1,1,1,1,1,2,2,1,0,0]
  ,[0,0,0,0,0,0,1,1,1,4,4,4,4,4,4,4,4,4,1,2,2,2,2,2,2,2,2,2,2,1,0,0,0]
  ,[0,0,0,0,0,1,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0]
  ,[0,0,0,0,0,1,2,2,1,0,1,2,2,1,0,0,0,0,0,1,2,2,1,0,1,2,2,1,0,0,0,0,0]
  ,[0,0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0,0]
  ]
, [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0,0,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,0,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0,1,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,1,0,0,0,0,0,0]
  ,[0,0,0,0,0,0,0,1,4,4,3,3,3,3,3,7,3,7,1,1,3,3,3,3,4,4,1,0,1,1,0,0,0]
  ,[0,0,0,0,0,0,0,1,4,3,3,7,3,3,3,3,3,1,2,2,1,7,3,3,3,4,1,1,2,2,1,0,0]
  ,[0,0,0,0,0,0,0,1,4,3,3,3,3,3,3,3,3,1,2,2,2,1,3,3,3,4,1,2,2,2,1,0,0]
  ,[0,0,1,1,0,0,0,1,4,3,3,3,3,3,7,3,3,1,2,2,2,2,1,1,1,1,2,2,2,2,1,0,0]
  ,[0,1,2,2,1,0,0,1,4,3,3,3,7,3,3,3,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0]
  ,[0,1,2,2,1,1,1,1,4,3,3,3,3,3,3,7,1,2,2,2,5,1,2,2,2,2,2,5,1,2,2,1,0]
  ,[0,0,1,2,2,2,1,1,4,3,7,3,3,3,3,3,1,2,2,2,1,1,2,2,2,1,2,1,1,2,2,1,0]
  ,[0,0,0,1,1,2,2,1,4,3,3,3,3,3,3,3,1,2,6,6,2,2,2,2,2,2,2,2,2,6,6,1,0]
  ,[0,0,0,0,0,1,1,1,4,3,3,3,3,3,7,3,1,2,6,6,2,1,2,2,1,2,2,1,2,6,6,1,0]
  ,[0,0,0,0,0,0,0,1,4,4,3,7,3,3,3,3,3,1,2,2,2,1,1,1,1,1,1,1,2,2,1,0,0]
  ,[0,0,0,0,0,0,0,1,4,4,4,3,3,3,3,3,3,3,1,2,2,2,2,2,2,2,2,2,2,1,0,0,0]
  ,[0,0,0,0,0,0,1,1,1,4,4,4,4,4,4,4,4,4,4,1,1,1,1,1,1,1,1,1,1,0,0,0,0]
  ,[0,0,0,0,0,1,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0]
  ,[0,0,0,0,0,1,2,2,1,0,1,2,2,1,0,0,0,0,0,1,2,2,1,0,1,2,2,1,0,0,0,0,0]
  ,[0,0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0,0]
  ]
]
, nyancat_data_nr = nyancat_data.length
, nyancat_data_lines = nyancat_data[0].length
, nyancat_data_columns = nyancat_data[0][0].length
;
/* }}} */

/* Particles Object {{{ */
var particlesObject = function(spec, canvas) {
  var that = {}
    , context = canvas.context
    , width = canvas.width
    , height = canvas.height
    , number = spec.number
    , particles = []
    ;

  while (number--) {
    var particle = {
      size: spec.size
    , color: 'rgba(255, 255, 255, 1)'
    , k: number % particle_data_nr
    };
    initialize(particle);
    particles.push(particle);
  }
  function initialize(p) {
    p.x = (width + 50) * Math.random() + 50;
    p.y = height * Math.random();
  }
  that = {
    update: function() {
      for (var i = 0, p; p = particles[i++];) {
        if (++p.k > particle_data_nr - 1) {
          p.k = 0;
          initialize(p);
        }
        p.x += - p.k * 20;
      }
    }
  , render: function() {
      for (var i = 0, p; p = particles[i++];) {
        context.fillStyle = p.color;
        var size = p.size;
        for (var m = 0; m < particle_data_lines; m++) {
          for (var n = 0; n < particle_data_columns; n++) {
            switch (particle_data[p.k][m][n]) {
              case 1:
                context.fillRect(
                    p.x + m * size, p.y + n * size, size, size);
                break;
              default:
                break;
            }
          }
        }
      }
    }
  };
  return that;
};
/* }}} */

/* NyanCat Object {{{ */
var nyancatObject = function(spec, canvas) {
  var that = {}
    , context = canvas.context
    ;
  var nyancat = spec;
  initialize(nyancat);
  function initialize(nc) {
    nc.k = 0;
    nc.rainbow = rainbowObject({
        x0 : nc.x
      , y0 : nc.y
      , size: nc.size
      , colors : [
          'rgba(255,  0,  0,1)' // red
        , 'rgba(255,153,  0,1)' // orange
        , 'rgba(255,255,  0,1)' // yellow
        , 'rgba(  0,255,  0,1)' // green
        , 'rgba(  0,  0,255,1)' // blue
        , 'rgba(102,  0,153,1)' // purple
      ]
    }, canvas);
  }
  that = {
    update: function() {
      nyancat.rainbow.update();
      if (++nyancat.k > nyancat_data_nr - 1) {
        nyancat.k = 0;
      }
    }
  , render: function() {
      nyancat.rainbow.render();
      var size = nyancat.size;
      for (var m = 0; m < nyancat_data_lines; m++) {
        for (var n = 0; n < nyancat_data_columns; n++) {
          switch (nyancat_data[nyancat.k][m][n]) {
            case 1:
              context.fillStyle = 'rgba(  0,  0,  0,1)'; // #000000
              break;
            case 2:
              context.fillStyle = 'rgba(153,153,153,1)'; // #999999
              break;
            case 3:
              context.fillStyle = 'rgba(255,153,204,1)'; // #ff99cc
              break;
            case 4:
              context.fillStyle = 'rgba(255,204,153,1)'; // #ffcc99
              break;
            case 5:
              context.fillStyle = 'rgba(255,255,255,1)'; // #ffffff
              break;
            case 6:
              context.fillStyle = 'rgba(255,102,153,1)'; // #ff6699
              break;
            case 7:
              context.fillStyle = 'rgba(255, 51,153,1)'; // #ff3399
              break;
            default:
              context.fillStyle = 'rgba(  0,  0,  0,0)';
              break;
          }
          context.fillRect(
              nyancat.x + n * size, nyancat.y + m * size, size, size);
        }
      }
    }
  };
  return that;
};
/* }}} */

/* Rainbow Object {{{ */
var rainbowObject = function(spec, canvas) {
  var that = {}
    , context = canvas.context
    , color_nr = spec.colors.length
    ;
  var rainbow = spec;
  initialize(rainbow);
  function initialize(rb) {
    rb.reverse = 1;
    rb.k = 0;
    rb.x0 += rb.size * 2;
    rb.y0 += rb.size * 3;
    rb.width = rb.size * 7;
    rb.weight = rb.size * 2;
    rb.number = rb.x0 / rb.width + 2 >> 0;
    rb.step = rb.weight / 2 >> 0;
    rb.y_pos = new Array(rb.number);
    setPosY(rb.y0, rb.reverse, rb.step, rb.weight);
  }
  function setPosY(y0, reverse, step, weight) {
    for (var i = 0; i < rainbow.number; i++) {
      switch (i % 6) {
        case 0: case 4:
          rainbow.y_pos[i] = y0 + reverse * step;
          break;
        case 1: case 3:
          rainbow.y_pos[i] = y0;
          break;
        case 2:
          rainbow.y_pos[i] = y0 - reverse * step;
          break;
        case 5:
          rainbow.y_pos[i] = y0 + reverse * weight;
          break;
        default:
          rainbow.y_pos[i] = y0;
          break;
      }
    }
  }
  that = {
    update: function() {
      if (++rainbow.k > 5) {
        rainbow.k = 0;
        rainbow.reverse = - rainbow.reverse;
        setPosY(rainbow.y0, rainbow.reverse, rainbow.step, rainbow.weight);
      }
    }
  , render: function() {
      for(var i = 0, x = rainbow.x0, y; y = rainbow.y_pos[i++];) {
        for (var color in rainbow.colors) {
          context.fillStyle = rainbow.colors[color];
          context.fillRect(x, y, rainbow.width, rainbow.weight);
          y += rainbow.weight;
        }
        y -= rainbow.weight * color_nr;
        x -= rainbow.width;
      }
    }
  };
  return that;
};
/* }}} */

// Your definition's area
var main = function() {
  var canvasSpec = {
      'canvasId': 'nyancat'
    , 'objects': {
        'nyancat': []
      }
    , 'intervalId': undefined
  };
  var cvs = canvasSpec.canvas = document.getCanvasById(canvasSpec.canvasId);
  var width = cvs.width;
  var height = cvs.height;
  var size = width < height ? width >> 5 : height >> 5;
  var nyancatSpec = {
      'size': size
    , 'x': width / 3 >> 0
    , 'y': height / 3 >> 0
  };
  var particlesSpec = {
      'number': size / 3 > 5 ? size / 3 >> 0 : 5
    , 'size':   size / 2 > 0 ? size / 2 >> 0 : 1
  };
  canvasSpec.objects.nyancat.push(nyancatObject(nyancatSpec, cvs));
  canvasSpec.objects.nyancat.push(particlesObject(particlesSpec, cvs));
  document.drawCanvas(canvasSpec, 'nyancat');
  // controller
  var controller = document.getElementById("controller");
  var draw_flag = true;
  controller.addEventListener('mousedown', function() {
    if (draw_flag) {
      document.stopCanvas(canvasSpec);
      controller.src = "assets/images/controller-play.png";
      draw_flag = false;
    } else {
      document.drawCanvas(canvasSpec, 'nyancat');
      controller.src = "assets/images/controller-pause.png";
      draw_flag = true;
    }
  }, false);
  // camera
  var camera = document.getElementById("camera");
  var store = document.getElementById("store");
  var nyancat_img = document.getElementById("nyancat_img");
  camera.addEventListener('mousedown', function() {
    nyancat_img.style.visibility = 'visible';
    store.style.padding = '10px 10px';
    store.style.width = '860px';
    store.style.height = store.style.height || '10px';
    var id;
    var h = 0;
    function frame() {
      h = parseInt(store.style.height.replace('px', ''), 10);
      if (h >= 400) {
        store.style.height = '400px';
        clearInterval(id);
        var o = 0;
        nyancat_img.style.opacity = 0;
        nyancat_img.src = cvs.self.toDataURL('image/png');
        function imgframe() {
          o += 0.1;
          nyancat_img.style.opacity = o;
          if (o >= 1) {
            nyancat_img.style.opacity = 1;
            clearInterval(id);
          }
        }
        id = setInterval(imgframe, 10);
      } else {
        h += 15;
        store.style.height = h + 'px';
      }
    }
    id = setInterval(frame, 10);
  }, false)
};

window.document.addEventListener('DOMContentLoaded', main, false);

/*
 * vim:set ts=8 sts=2 sw=2 tw=0:
 * vim:set fdm=marker:
 */
