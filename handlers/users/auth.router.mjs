
import { UserJoiLogin } from "../users/users.joi.mjs";
import { app } from "../../app.mjs";
import { User } from "./user.model.mjs";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { Session } from "./user.model.mjs";
import { guard } from "../../middleware/guard.mjs";

app.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const validate = UserJoiLogin.validate({ email, password });

    if (validate.error) {
      return res.status(400).send(validate.error.details[0].message);
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(403).send("Email or password is incorrect");
    }

    //check password 
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).send("Email or password is incorrect");
    }

    const token = jwt.sign(
      {
        _id: user._id,
        firstName: user.name.firstName,
        lastName: user.name.lastName,
        isBusiness: user.isBusiness,
        isAdmin: user.isAdmin
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' });

    await Session.create({ userID: user._id });
    /* await Session.deleteMany({ userID: user._id });
    const newSession = new Session({ userID: user._id });
    await newSession.save(); */
    res.send({ token });
  } catch (error) {
    res.status(500).send({ message: "Error logging in", error });
  }
})

app.get('/logout', guard, async (req, res) => {
  try {
    console.log("Logging out user with ID:", req.user ? req.user._id : 'undefined');

    //почему то в res.user соделжится только ID и не надо его извлекать отдельно 
    const sessionDeleted = await Session.findOneAndDelete({ userID: req.user._id });

    if (!sessionDeleted) {
      return res.status(404).send({ message: "Session not found" });
    }

    res.clearCookie('token');
    res.send({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error logging out", error });
  }
});

