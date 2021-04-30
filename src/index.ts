import express, { Request, Response } from "express";
const logger = require("./log/config");
import morgan from "morgan";

const app = express();
const PORT = 8000;

app.use(logger.successHandler);
app.use(logger.errorHandler);

app.get("/", (req: Request, res: Response) => {
  res.send("initial commit");
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
