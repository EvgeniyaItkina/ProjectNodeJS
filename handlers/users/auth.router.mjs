
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

    // check if session is already created
    let session = await Session.findOne({ userID: user._id });

    if (!session) {
      // if no - create session
      session = new Session({ userID: user._id });
    } else {
      const currentTime = Date.now();
      const timeDifference = currentTime - session.lastFailedAttempt;

      if (session.failedAttempts >= 3 && timeDifference < 24 * 60 * 60 * 1000) {
        return res.status(403).send("Your account is locked. Try again later.");
      }

      if (timeDifference >= 24 * 60 * 60 * 1000) {
        session.failedAttempts = 0;
        session.lastFailedAttempt = null;
      }
    }

    //check password 
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      session.failedAttempts += 1;
      session.lastFailedAttempt = Date.now();
      await session.save();
      return res.status(403).send("Email or password is incorrect");
    }

    session.failedAttempts = 0;
    session.lastFailedAttempt = null;
    await session.save();

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

