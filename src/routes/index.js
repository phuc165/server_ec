import homeRouter from "./home.js";

function route(app) {
  app.use("/", homeRouter);
}

export default route;
