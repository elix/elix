import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const rootPath = path.join(dirname, "..");

/*
 * Simplistic static server using Express.
 */
export default async function start(port) {
  const app = express();
  app.use("/", express.static(rootPath));
  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      resolve(server);
    });
  });
}
