import express from "express";
import routes from "./routes/index";
import bodyParser from "body-parser";

const app: express.Application = express();
const port = 5000;

app.use(bodyParser.json());
app.use(routes);

app.listen(port, function () {
  console.log(`starting app on: http://localhost:${port}`);
});

export default app;
