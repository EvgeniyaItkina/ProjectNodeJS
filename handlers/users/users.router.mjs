import { app } from "../../app.mjs";
import { User } from "./user.model.mjs";

// GET
app.get("/users", async (req, res) => {
  res.send(await User.find());
});

app.get("/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(403).send({ massage: "User not found" });
  }
  res.send(user);
});

// POST
app.post("/users", async (req, res) => {
  const user = new User({
    name: {
      firstName: req.body.name.firstName,
      middleName: req.body.name.middleName,
      lastName: req.body.name.lastName,
    },
    phone: req.body.phone,
    email: req.body.email,
    password: req.body.password,
    image: {
      url: req.body.image,
      alt: req.body.image.alt,
    },
    adress: {
      state: req.body.adress.state,
      country: req.body.adress.country,
      city: req.body.adress.city,
      street: req.body.adress.street,
      houseNumber: req.body.adress.houseNumber,
      zip: req.body.adress.zip,
    },
    isAdmin: req.body.isAdmin,
    isBusiness: req.body.isBusiness,
  });

  const newUser = await user.save();
  res.send(newUser);
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
