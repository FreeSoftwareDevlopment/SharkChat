const wes = require("ws");
const hash = require("shark-hashlib");
module.exports = (server, token) => {
  const usern = require("username-generator");
  var user = [];
  var users = [];
  function includess(ate, hashss) {
    return new Promise((res, rej) => {
      var x = false;
      ate.forEach(s => {
        if (
          s.hash === hashss &&
          Math.round(new Date().getTime() / 1000) - 80 <= s.time
        ) {
          x = true;
        }
      });
      res(x);
    });
  }
  const wss = new wes.Server({ server });
  wss.on("connection", ws => {
    const newuser = usern.generateUsername("-");
    ws.send(JSON.stringify({ action: "welcome", data: newuser }));
    wss.clients.forEach(client => {
      if (client.readyState === wes.OPEN) {
        client.send(
          JSON.stringify({
            action: "join",
            hash: hash(0, newuser),
            user: newuser
          })
        );
      }
    });
    ws.on("message", message => {
      const jsonmessage = JSON.parse(message);
      if (token.val(jsonmessage.user, jsonmessage.token)) {
        const hashs = hash(0, jsonmessage.data + jsonmessage.user);
        ws.send(
          JSON.stringify({
            action: "newtoken",
            data: token.gen(jsonmessage.data)
          })
        );
        if (jsonmessage.action === "push") {
          const comp = () => {
            wss.clients.forEach(client => {
              if (client.readyState === wes.OPEN) {
                if (jsonmessage.data != "" && jsonmessage.user != "") {
                  client.send(
                    JSON.stringify({
                      action: "recieve",
                      hash: hashs,
                      user: jsonmessage.user,
                      data: jsonmessage.data
                    })
                  );
                }
              }
            });
          };
          includess(user, hashs).then(x => {
            if (x) {
              includess(users, hashs).then(x => {
                if (x) {
                  ws.send(JSON.stringify({ action: "Spam" }));
                  users.push({
                    hash: hashs,
                    time: Math.round(new Date().getTime() / 1000)
                  });
                } else {
                  comp();
                  users.push({
                    hash: hashs,
                    time: Math.round(new Date().getTime() / 1000)
                  });
                }
              });
            } else {
              comp();
              user.push({
                hash: hashs,
                time: Math.round(new Date().getTime() / 1000)
              });
            }
          });
        }
      } else {
        ws.send(JSON.stringify({ action: "tokenerr" }));
      }
    }); //END
  });
};
