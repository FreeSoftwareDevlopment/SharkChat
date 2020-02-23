var keksies = document.cookie;
var cookess = {
  search: function search(keksiename) {
    var value = "";
    var xc = keksies.split("; ");
    xc.forEach(function (keks) {
      var elements = keks.split("=");
      if (elements[0] === keksiename) {
        value = elements[1];
      }
    });
    return value;
  },
  add: function add(name, value) {
    document.cookie = name + "=" + value;
  }
};
export default function cookes() {
  return cookess;
}