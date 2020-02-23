const express = require("express");
const app = express();
const http = require("http");
const helmet = require("helmet");
const morgan = require("morgan");
const wsock = require("./ws.js");
const compress = require("compression");
app.use(helmet());
const { ensureLoggedIn } = require("connect-ensure-login");
app.use(morgan("common", { immedate: true }));
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const token=require("./token.js");
app.use(bodyParser.json());
app.use(compress());
app.set("trust proxy", 1); // trust first proxy//
require("./auth.js")(app, ensureLoggedIn);
app.set("view engine", "pug");

app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/chat", ensureLoggedIn("/"),(request, response) => {
  var admin=false;
  const usern=request.user.username;
  if(request.user.perm==1){
    admin=true;
  }
  response.render(__dirname + "/views/index.pug", {perm:admin, name:usern,token:token.gen(usern)});
});

app.get("/", (req, res) => {
  res.render(__dirname + "/views/login.pug");
});
app.get("/blog", (req, res) => {
  res.redirect("https://bit.ly/BlogShark2");
});

const server = new http.createServer(app);
wsock(server,token);
// listen for requests :)
const listener = server.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
