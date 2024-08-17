import { app } from "../../app.mjs";
import { guard, adminGuard, businessGuard } from "../../middleware/guard.mjs";
import { User } from "./user.model.mjs";
import bcrypt from "bcryptjs";
import { UserJoiRegister } from "./users.joi.mjs";

// GET all users
app.get("/users", guard, adminGuard, async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving users", error });
  }
});

// GET a user by ID
app.get("/users/:id", guard, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Проверяем, что запрашивающий пользователь либо сам запрашивает свои данные, либо является администратором
    if (req.user._id !== req.params.id && !req.user.isAdmin) {
      return res.status(403).send({ message: "Unauthorized access" });
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
      name: { firstName, middleName, lastName } = {},
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
      const details = error.details.map(err => err.message).join(", ");
      return res.status(400).send(`Validation error: ${details}`);
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
      password: hashedPassword,
      image: image ? {
        url: image?.url,
        alt: image?.alt
      } : undefined,
      address: {
        state: address?.state,
        country: address?.country,
        city: address?.city,
        street: address?.street,
        houseNumber: address?.houseNumber,
        zip: address?.zip,
      },
      isAdmin,
      isBusiness,
    });

    const newUser = await user.save();
    res.status(201).send(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send({ message: "Error creating user", error });
  }
});

// PUT update a user by ID
app.put("/users/:id", guard, async (req, res) => {
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
      isBusiness
    } = req.body;

    // Найдите пользователя по ID
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Обновите только те поля, которые были переданы в запросе
    if (firstName !== undefined) user.name.firstName = firstName;
    if (middleName !== undefined) user.name.middleName = middleName;
    if (lastName !== undefined) user.name.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
    if (email !== undefined) user.email = email;

    if (image) {
      if (image.url !== undefined) user.image.url = image.url;
      if (image.alt !== undefined) user.image.alt = image.alt;
    }

    if (address) {
      if (address.state !== undefined) user.address.state = address.state;
      if (address.country !== undefined) user.address.country = address.country;
      if (address.city !== undefined) user.address.city = address.city;
      if (address.street !== undefined) user.address.street = address.street;
      if (address.houseNumber !== undefined) user.address.houseNumber = address.houseNumber;
      if (address.zip !== undefined) user.address.zip = address.zip;
    }

    if (isAdmin !== undefined) user.isAdmin = isAdmin;
    if (isBusiness !== undefined) user.isBusiness = isBusiness;

    // Сохраните обновленного пользователя
    const updatedUser = await user.save();

    res.send(updatedUser);
  } catch (error) {
    res.status(500).send({ message: "Error updating user", error });
  }
});


// PATCH update only the business status of a user by ID
app.patch("/users/:id/business-status", guard, async (req, res) => {
  try {
    const userId = req.user._id;
    const { isBusiness } = req.body;

    if (userId !== req.params.id && !req.user.isAdmin) {
      return res.status(403).send({ message: "Unauthorized to update this user" });
    }

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
app.delete("/users/:id", guard, async (req, res) => {
  try {
    const userId = req.user._id; // Получаем ID пользователя из токена

    if (userId !== req.params.id && !req.user.isAdmin) {
      return res.status(403).send({ message: "Unauthorized to delete this user" });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error deleting user", error });
  }
});