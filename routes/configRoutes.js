const indexR = require("./index");
const usersR = require("./users");

exports.routesInit = (app) => {
  app.use("/", indexR);
  app.use("/users", usersR);

  //show 404 routes
  app.use("/*", (req, res) => {
    res.status(404).json({ msg: "Endpoint/page not found, 404" })
  })
}