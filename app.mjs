import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import moment from 'moment';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { createStream } from 'rotating-file-stream';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

export const app = express();

async function main() {
  await mongoose.connect('mongodb://localhost:27017/MyProject');
  console.log('mongodb connected');
}
main().catch(err => console.log(err));


app.use(express.json());

// get current url of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// check if log directory exists
const logDirectory = path.join(__dirname, 'helpers/logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory, { recursive: true });

// Create log directory if it doesn't exist
const accessLogStream = createStream((time, index) => {
  if (!time) return 'access.log';
  return `${moment(time).format('YYYY_MM_DD')}-access.log`;
}, {
  interval: '1d', // check log files every dayeck log files every day
  path: logDirectory
});

// custom format `morgan`
morgan.format('custom', (tokens, req, res) => {
  return [
    `Entry Time: ${moment().format('DD/MM/YYYY HH:mm:ss')}`,
    `Method: ${tokens.method(req, res)}`,
    `URL: ${tokens.url(req, res)}`,
    `Response Time: ${tokens['response-time'](req, res)} ms`,
    `Status: ${tokens.status(req, res)}`
  ].join('\n');
});

// Use `morgan` to console with colors
const consoleFormat = (tokens, req, res) => [
  chalk.white(`Entry Time: ${moment().format('DD/MM/YYYY HH:mm:ss')}`),
  chalk.cyan(`Method: ${tokens.method(req, res)}`),
  chalk.magenta(`URL: ${tokens.url(req, res)}`),
  chalk.green(`Status: ${tokens.status(req, res)}`),
  chalk.yellow(`Response Time: ${tokens['response-time'](req, res)} ms`)
].join('\n');
app.use(morgan(consoleFormat));

// Use `morgan` to log file
app.use(morgan('custom', { stream: accessLogStream }));


app.use(cors({
  origin: true,
  methods: 'GET,PUT,POST,PATCH,DELETE,OPTIONS',
  credentials: true,
  allowedHeaders: 'Content-Type, Accept',
}));

app.listen(2024, () => {
  console.log('listen on port 2024');
});

import("./handlers/users/users.router.mjs");
import("./handlers/cards/cards.router.mjs");
