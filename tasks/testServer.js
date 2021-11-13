import express from "express";
import path from "path";

/*
 * Simplistic static server using Express.
 */
export default async function start(port) {
  const app = express();
  const rootPath = path.join(process.cwd(), "..");
  app.use("/", express.static(rootPath));
  let server;
  await new Promise((resolve) => {
    server = app.listen(port, resolve);
  });
  return server;
}
