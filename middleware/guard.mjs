import jwt from 'jsonwebtoken';
import { session } from '../handlers/users/user.model.mjs';

// Middleware to verify the token and store user data in req.user
export const guard = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the token is provided in the request header
  if (!authHeader) {
    return res.status(401).send({ message: 'No token provided' });
  }

  // Verify the token using the secret key from the environment variables
  jwt.verify(authHeader, process.env.JWT_SECRET, async (err, data) => {
    if (err) {
      return res.status(403).send({ message: 'Invalid token' });
    }

    if (data._id == undefined && data.isBusiness == undefined && data.isAdmin == undefined) {
      res.status(403).send({ message: 'invalid token' });
    }

    // Проверка на наличие userID в коллекции session
    const sessionExists = await session.exists({ userID: mongoose.Types.ObjectId(data._id) });

    if (!sessionExists) {
      return res.status(403).send({ message: 'Session does not exist. Unauthorized.' });
    }
    // Store the decoded user data in req.user for further use

    req.user = data._id;
    next();
  });
};

// Middleware to check if the user is a business user or an admin
export const businessGuard = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    jwt.verify(authHeader, process.env.JWT_SECRET, (err, data) => {
      if (err) {
        return res.status(403).send({ message: 'Invalid token' });
      }

      if (data._id == undefined && data.isBusiness == undefined && data.isAdmin == undefined) {
        res.status(403).send({ message: 'invalid token' });
      }
      // Check if the user is either a business user or an admin
      if (data.isBusiness || data.isAdmin) {
        next();
      }
    });

  } catch (err) {
    res.status(403).send({ "message": err.message });
  }
};

export const adminGuard = (req, res, next) => {
  // Check if the user is an admin
  if (req.user?.isAdmin) {
    next(); // User is an admin, proceed to the next middleware or route handler
  } else {
    res.status(401).send('User is not authorized'); // User is not an admin
  }
};

// Function to get the user data from the request
export const getUser = (req) => {
  const authHeader = req.headers.authorization;
  // Return null if the authorization header is not provided
  if (!authHeader) {
    return null;
  }

  // Decode the token to get the user data
  const user = jwt.decode(authHeader, process.env.JWT_SECRET);

  // Return null if the user data could not be decoded
  if (!user) {
    return null;
  }

  // Return the decoded user data
  return user;
};
