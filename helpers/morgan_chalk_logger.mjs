import morgan from 'morgan';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { createStream } from 'rotating-file-stream';
import moment from 'moment';

// Check if the log directory exists, if not, create it
// process.cwd() returns the current working directory of the Node.js process,
// ensuring that the 'helpers/logs' directory is created in the root of the project
const logDirectory = path.join(process.cwd(), 'helpers/logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory, { recursive: true });

// Create a rotating write stream to store log files
const accessLogStream = createStream((time, index) => {
  if (!time) return 'access.log';
  return `${moment(time).format('YYYY_MM_DD')}-access.log`;
}, {
  interval: '1d', // check log files every day
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

// Export the setupLogging function that applies the logging middleware to the app

export const setupLogging = (app) => {
  app.use(morgan(consoleFormat));
  app.use(morgan('custom', { stream: accessLogStream }));
}