import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import pool from './config/db.js';


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());

app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, time: result.rows[0] });
  } catch (error) {
    console.error('Database connection error:', error);
    
    res.status(500).json({ success: false, message: 'Database connection error' });
  }
});

app.get('/', (req, res) => {
  res.send('Rootverse Backend is running');
});

export default app;