import { JWT_SECRET } from "../../config.mjs";
import { UserJoiLogin } from "../users/users.joi.mjs";
import { app } from "../../app.mjs";
import { User } from "./user.model.mjs";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';


app.post("/users/login", async (req, res) => {
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
      },
      JWT_SECRET,
      { expiresIn: '1h' });

    req.session.user = user; // Сохранение пользователя в сессии
    res.send({ user, token });
  } catch (error) {
    res.status(500).send({ message: "Error logging in", error });
  }
})

app.get("/logout", (req, res) => {
  try {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).send({ message: "Error logging out", error: err });
      }
      res.clearCookie('MyProject-session'); // Очистка куки сессии
      res.send({ message: "Logged out successfully" });
    });
  } catch (error) {
    res.status(500).send({ message: "Error logging out", error });
  } delete req.session.user;
  res.end();
});