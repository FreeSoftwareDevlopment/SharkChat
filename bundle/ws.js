/*
  This Script it Sharkbytes Property!
*/
import cookes from './cooks.js';
import userrgb from './rcolor.js';
import scrolldown from './scroll.js';
var prot = "ws://";
var head =
  '<table class="table table-hover"><thead><tr><th>user</th><th>message</th></tr></thead><tbody>';
var end = "</tbody></table>";
var username = "";
var cleanseString = function cleanseString(string) {
  return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

var messages = [];

if (document.location.protocol == "https:") {
  prot = "wss://";
  console.info("Secure Websocket");
}

var url = prot + document.location.host + "/student/provider/securesock";
console.info("Connect with WebSocket");
var conn = false;

function reconn() {
  var connection = new WebSocket(url);
  connection.onerror = function(error) {
    console.error("WebSocket disconnected retry");
    document.getElementById("errormessage").style = "display:block";
    document.getElementById("okmessage").style = "display:none";
    conn = false;
    reconn();
  };
  connection.onmessage = function(e) {
    console.log("Incoming Message: " + e.data);

    var datas = JSON.parse(e.data);

    if (datas.action === "welcome") {
      document.getElementById("errormessage").style = "display:none";
      document.getElementById("okmessage").style = "display:block";
      console.info("Connected");
      if (cookes().search("username") === "") {
        username = datas.data;
        cookes().add("username", username);
      } else {
        username = cookes().search("username");
      }

      document.getElementById("formdsj").onsubmit = function() {
        var valumse = document.getElementById("inputmsg").value;
        document.getElementById("inputmsg").value = "";

        if (valumse != "") {
          connection.send(
            JSON.stringify({
              action: "push",
              user: username,
              data: valumse
            })
          );
        }

        return false;
      };

      document.getElementById("userid").innerText =
        "Your Username:\n" + username;
    } else if (datas.action === "recieve") {
      var colorxs = userrgb(datas.user);
      var parsed =
        '<tr style="' +
        colorxs +
        '"><td>' +
        cleanseString(datas.user) +
        "</td><td>" +
        cleanseString(datas.data) +
        "</td></tr>";
      messages.push(parsed);
      var clone = messages;
      document.getElementById("msgs").innerHTML = head + clone.join("") + end;
      scrolldown();
    } else if (datas.action === "join") {
      var _parsed =
        '<tr class="joins"><td></td><td>' +
        cleanseString(datas.user) +
        " joined!</td></tr>";

      messages.push(_parsed);
      var _clone = messages;
      document.getElementById("msgs").innerHTML = head + _clone.join("") + end;
    } else if (datas.action === "Spam") {
      var _parsed2 =
        '<tr class="serverspama"><td>Server</td><td>You sent the same message too many times. To avoid spam, your message was not sent.</td></tr>';
      messages.push(_parsed2);
      var _clone2 = messages;
      document.getElementById("msgs").innerHTML = head + _clone2.join("") + end;
    } else {
      console.warn("Something went Wrong");
    }
  };
}

reconn();
