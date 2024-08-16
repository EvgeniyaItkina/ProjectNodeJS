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
    await mongoose.connect(process.env.MONGO_DB_URL);
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

/* app.post('/login', (req, res) => {
  return "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
}) */
import("./handlers/users/users.router.mjs");
import("./handlers/users/auth.router.mjs");
import("./handlers/cards/cards.router.mjs");
await import("./initial-data/initial-data.service.mjs")

/* 
(async () => {
  import("./handlers/users/users.router.mjs");
  import("./handlers/users/auth.router.mjs");
  import("./handlers/cards/cards.router.mjs");
  await import("./initial-data/initial-data.service.mjs");

  app.get("*", (req, res) => {
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
})() */