function random() {
  var min = 0;
  var max = 255;
  return Math.round(Math.random() * (max - min)) + min;
}

function creatergb() {
  var colors = [random(), random(), random()];
  var bgcolors = [255 - colors[0], 255 - colors[1], 255 - colors[2]];
  return {
    colors: colors,
    bgcolors: bgcolors
  };
}

function settorg(thing) {
  return "rgb(" + thing[0] + ", " + thing[1] + ", " + thing[2] + ")";
}

function setcomplete() {
  var x = creatergb();
  return (
    "color: " +
    settorg(x.colors) +
    ";background-color: " +
    settorg(x.bgcolors) +
    ";"
  );
}

function outputrgb() {
  return setcomplete();
}

var colorsls = [];

export default function userrgb(username) {
  var colorend = "";
  colorsls.forEach(function(s) {
    if (s.user === username) {
      colorend = s.style;
    }
  });

  if (colorend === "") {
    var outputs = outputrgb();
    colorsls.push({
      style: outputs,
      user: username
    });
    colorend = outputs;
  }

  return colorend;
}
