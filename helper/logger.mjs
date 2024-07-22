import morgan from 'morgan';

export const logger = {
  log(message) {
    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
  }
}