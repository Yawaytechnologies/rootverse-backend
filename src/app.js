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
import vesselRegRouter from './modules/wildcapture/vesselregistration/vesselreg.router.js';
import tripPlanRouter from './modules/trip-planning/trip_plan_router.js'
import fishTypes from './modules/fish_types/fish_types_router.js'
import loginRoutes from './modules/auth/auth.routes.js';
import qualityCheckerRouter from './modules/quality_checker/quality.router.js';
import userRoutes from './modules/users/user.routes.js';
import locationRoutes from './modules/location/location_router.js';


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());

app.use('/api/auth',loginRoutes);
app.use('/api/me',userRoutes);
app.use('/api', ownerRouter);
app.use('/api', stateRouter);
app.use('/api', districtRouter);
app.use('/api', qrsRouter);
app.use('/api/vessels', vesselRegRouter);
app.use('/api', tripPlanRouter);
app.use('/api', fishTypes);
app.use('/api/quality-checker', qualityCheckerRouter);
app.use('/api/locations', locationRoutes);


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
