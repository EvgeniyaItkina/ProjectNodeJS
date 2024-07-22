import { app } from "../../app.mjs";

// GET
app.get("/cards", (req, res) => {
  res.send(req.path);
});

app.get("/cards/my-cards", (req, res) => {
  res.send('');
});

app.get("/cards/:id", (req, res) => {
  res.send('');
});

// POST
app.post("/cards", (req, res) => {
  res.send('');
});

// PUT
app.put('/cards/:id', (req, res) => {
  res.send('');
});

// PATCH
app.patch('/cards/:id', (req, res) => {
  res.send('');
});

// DELETE
app.delete("/cards/:id", (req, res) => {
  res.send('');
});
