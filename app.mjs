import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

async function main() {
  await mongoose.connect('mongodb://localhost:27017/full-stack');
  console.log('mongodb connected');
}
main().catch(err => console.log(err));

export const app = express();

app.use(express.json());

app.use(cors({
  origin: true,
  methods: 'GET,PUT,POST,DELETE,OPTIONS',
  credentials: true,
  allowedHeaders: 'Content-Type, Accept',
}));

app.listen(2024, () => {
  console.log('listen on port 2024');
});

import("./handlers/users/users.mjs");
import("./handlers/cards/cards.mjs");
