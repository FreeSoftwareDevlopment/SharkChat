const hash = require("shark-hashlib");
const passport = require("passport");
const exs = require("express-session");
const lo = require("passport-local");
const users = require("./user.js");
module.exports = (app, aus) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    users.getid({ id: id }).then(
      user => {
        if (!user) {
          done("NotFound");
        }
        done(null, user);
      },
      err => {
        done(err);
      }
    );
  });
  passport.use(
    new lo((username, password, done) => {
      const hashs = hash(2, password);
      users.getid({ username: username, password: hashs }).then(
        user => {
          if (!user) {
            done("user not found");
          } else {
            done(null, user);
          }
        },
        err => {
          done(err);
        }
      );
    })
  );
  app.use(
    exs({
      secret: hash(1, process.env.SECRET),
      resave: false,
      saveUninitialized: false
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.post(
    "/login",
    passport.authenticate("local", { failueRedirect: "/#fail" }),
    (err, res, req, next) => {
      if (err) {
        req.redirect("/#login-failed");
      } else {
        next();
      }
    },
    (req, res) => {
      res.redirect("/chat");
    }
  );
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });
  app.get("/alluser",  aus("/"), (req, res) => {
    if (req.user.perm == 1) {
      users.getalls((err, rows, resp) => {
        if (err) {
          resp.status(400);
          resp.send("Error");
        } else {
          if (req.query.failed != 1) {
            resp.render(__dirname + "/views/utable.pug", {
              entrys: rows,
              ok: true
            });
          } else {
            resp.render(__dirname + "/views/utable.pug", {
              entrys: rows,
              ok: false
            });
          }
        }
      }, res);
    }
  });
  app.post(
    "/api/add/users",
    aus("/"),
    (req, res) => {
      if (req.user.perm == 1) {
        console.log(req.user);
        users.add(req.body, hash).then(
          complete => {
            res.redirect("/alluser");
          },
          err => {
            res.redirect("/alluser?failed=1");
          }
        );
      }
    }
  );
  app.post(
    "/api/rmu/users",
    aus("/"),
    (request, response) => {
      if (request.user.perm == 1) {
        users.rem(request, response, "/alluser");
      }
    }
  );
};
