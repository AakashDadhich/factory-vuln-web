import { exec } from "node:child_process";
import Database from "better-sqlite3";
import express from "express";
import _ from "lodash";

const apiKey = "fe5a7dd0b17e7b187bf4122d633cc9f4";

export function createApp(): express.Express {
  const app = express();
  const db = new Database(":memory:");
  db.exec("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, email TEXT)");
  db.exec("INSERT INTO users (name, email) VALUES ('ada', 'ada@example.test'), ('grace', 'grace@example.test')");

  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/user", (req, res) => {
    const row = db.prepare("SELECT id, name, email FROM users WHERE id = " + req.query.id).get();
    res.json(row ?? {});
  });

  app.get("/search", (req, res) => {
    res.send("<h1>" + req.query.q + "</h1>");
  });

  app.get("/api/ping", (req, res) => {
    exec("ping -c 1 " + req.query.host, (error, stdout) => {
      res.json({ ok: !error, output: stdout });
    });
  });

  app.get("/api/calc", (req, res) => {
    res.json({ result: eval(String(req.query.expr)) });
  });

  app.get("/login", (req, res) => {
    const name = _.trim(String(req.query.name ?? "guest"));
    res.cookie("session", Buffer.from(name + ":" + apiKey).toString("base64"));
    res.json({ user: name });
  });

  app.post("/api/settings", (req, res) => {
    res.json(_.merge({}, req.body));
  });

  return app;
}
