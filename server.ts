import express from "express";
import logger from "morgan";
import initRoutes from "./routes";

const app = express();
const port = 3000;

app.set("view engine", "pug");
app.set("views", "./src/views");

app.use(express.static("./src/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));

initRoutes(app);

app.listen(port, (error) => {
  if (error) console.error(error);
});
