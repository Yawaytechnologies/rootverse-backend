import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import db from './config/db.js';
import ownerRouter from './modules/owner/owner.router.js';
import stateRouter from './modules/state/state.router.js';
import districtRouter from './modules/district/district.router.js';
import qrsRouter from './modules/qrs/qrs.router.js'


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());

app.use('/api', ownerRouter);
app.use('/api', stateRouter);
app.use('/api', districtRouter);
app.use('/api', qrsRouter);

app.get("/db-test", async (req, res) => {
  try {
    const client =
      (db.client && db.client.config && db.client.config.client) || "";
    const sql = client.includes("sqlite")
      ? "SELECT datetime('now') as now"
      : "SELECT NOW() as now";

    const result = await db.raw(sql);

    // Normalize result across drivers (Postgres returns { rows }, sqlite returns array)
    let rows = result?.rows ?? result?.[0] ?? result;
    let time = Array.isArray(rows) ? rows[0]?.now ?? rows[0] : rows?.now ?? rows;

    res.json({ success: true, time });
  } catch (error) {
    console.error("Database connection error:", error);
    res
      .status(500)
      .json({ success: false, message: "Database connection error" });
  }
});

app.get("/", (req, res) => {
  res.send("Rootverse Backend is running");
});

export default app;
