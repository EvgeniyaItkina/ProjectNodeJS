import { app } from "../../app.mjs";
import { guardAdmin, guardUser } from "./guard.mjs";
import { User } from "./user.model.mjs";
import bcrypt from "bcryptjs";
import { UserJoiRegister } from "./users.joi.mjs";

// GET all users
app.get("/users", guardAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving users", error });
  }
});

// GET a user by ID
app.get("/users/:id", guardAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving user", error });
  }
});

// POST create a new user - registration
app.post("/users", async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      phone,
      email,
      password,
      image,
      address,
      isAdmin,
      isBusiness } = req.body;

    const { error } = UserJoiRegister.validate(req.body, {
      allowUnknown: true,
    });

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User with this email already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name: {
        firstName,
        middleName,
        lastName,
      },
      phone,
      email,
      password: hashedPassword, // Hashing the password before saving
      image: {
        url: image.url,
        alt: image.alt,
      },
      address: {
        state: address.state,
        country: address.country,
        city: address.city,
        street: address.street,
        houseNumber: address.houseNumber,
        zip: address.zip,
      },
      isAdmin,
      isBusiness,
    });

    const newUser = await user.save();
    res.status(201).send(newUser);
  } catch (error) {
    res.status(500).send({ message: "Error creating user", error });
  }
});

// PUT update a user by ID
app.put("/users/:id", guardUser, async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      phone,
      email,
      image,
      address,
      isAdmin,
      isBusiness } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: {
          firstName,
          middleName,
          lastName,
        },
        phone,
        email,
        image: {
          url: image.url,
          alt: image.alt,
        },
        address: {
          state: address.state,
          country: address.country,
          city: address.city,
          street: address.street,
          houseNumber: address.houseNumber,
          zip: address.zip,
        },
        isAdmin,
        isBusiness,
      },
      {
        new: true, // Returns the updated document instead of the old one
        runValidators: true // Forces the validation of the updated fields
      }
    );

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: "Error updating user", error });
  }
});

// PATCH update only the business status of a user by ID
app.patch("/users/:id/business-status", guardAdmin, async (req, res) => {
  try {
    const { isBusiness } = req.body;

    if (typeof isBusiness !== 'boolean') {
      return res.status(400).send({ message: "Invalid value for isBusiness" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBusiness },
      {
        new: true, // Returns the updated document instead of the old one
        runValidators: true // Forces the validation of the updated fields
      }
    );

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: "Error updating user", error });
  }
});
// DELETE a user by ID
app.delete("/users/:id", guardAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error deleting user", error });
  }
});