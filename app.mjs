import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import chalk from 'chalk';
import dotenv from 'dotenv';
import { setupLogging } from './helpers/morgan_chalk_logger.mjs';

dotenv.config();


export const app = express();

async function main() {
  try {
    const db = process.env.NODE_ENV === 'development' ? process.env.MONGO_DB_URL : process.env.ATLAS_URL
    await mongoose.connect(db);
    console.log(chalk.green('mongodb connected'));
  } catch (err) {
    console.log(chalk.red('Failed to connect to MongoDB:', err));
  }
}
main();

app.use(express.json());

// morgan and chalk
setupLogging(app);

app.use(express.static("public"));

app.use(cors({
  origin: true,
  methods: 'GET,PUT,POST,PATCH,DELETE,OPTIONS',
  credentials: true,
  allowedHeaders: 'Content-Type, Accept, Authorization',
}));

app.listen(process.env.PORT, () => {
  console.log('listen on port 2024');
});

/* 
import("./handlers/users/users.router.mjs");
import("./handlers/users/auth.router.mjs");
import("./handlers/cards/cards.router.mjs");
await import("./initial-data/initial-data.service.mjs") */


(async () => {
  await import("./handlers/users/auth.router.mjs");
  await import("./handlers/users/users.router.mjs");
  await import("./handlers/cards/cards.router.mjs");
  await import("./initial-data/initial-data.service.mjs");

  app.get('/*', (req, res) => {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.write(`<meta charset="UTF-8">`);
    res.write(`
            <style>
                * {
                    direction: rtl;
                    text-align: center;
                    color: red;
                }
            </style>
        `);
    res.write("<h1>Error 404</h1>");
    res.write("<h2>Page is not found<h2>");
    res.end();
  });
})()