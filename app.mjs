import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import morgan from 'morgan';

async function main() {
  await mongoose.connect('mongodb://localhost:27017/MyProject');
  console.log('mongodb connected');
}
main().catch(err => console.log(err));

export const app = express();

app.use(express.json());

app.use(morgan('combined'))

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
