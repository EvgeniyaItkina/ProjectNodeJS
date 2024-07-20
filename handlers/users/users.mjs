import { app } from "../../app.mjs";

// GET
app.get("/users", (req, res) => {
  res.send('');
});

app.get("/users/:id", (req, res) => {
  res.send('');
});

// POST
app.post("/users", (req, res) => {
  res.send('');
});

app.post("/users/:id", (req, res) => {
  res.send('');
});

// PUT
app.put('/users/:id', (req, res) => {
  res.send('');
});

// PATCH
app.patch('/users/:id', (req, res) => {
  res.send('');
});

// DELETE
app.delete("/users/:id", (req, res) => {
  res.send('');
});
