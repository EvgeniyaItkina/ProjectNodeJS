import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.mjs';


export const checkToken = (req, res, next) => {
  const token = req.headers.authorization;

  // Проверяем, предоставлен ли заголовок
  if (!token) {
    return res.status(401).send({ message: 'Access Denied: No Token Provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  })
}

export const getUser = (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return null;
  }
  const user = jwt.decode(token, JWT_SECRET);
  if (!user) {
    return null;
  }
  return user;
}

// Middleware для проверки токена и роли пользователя
export const checkTokenAndRole = (roles = []) => {
  // Роли могут быть переданы как строка или массив
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).send({ message: 'Access Denied: No Token Provided' });
    }

    // Проверяем токен
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).send({ message: 'Invalid token' });
      }

      // Проверяем роль пользователя
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).send('Access Denied: You do not have permission');
      }

      req.user = user; // Сохраняем данные пользователя в запросе
      next(); // Передаём управление следующему обработчику
    });
  };
};


/* 
export const guardUser = async (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).send('User not logged in');
  }
}

export const guardBusiness = async (req, res, next) => {
  if (req.session.user && req.session.user.isBusiness) {
    next();
  } else {
    res.status(401).send('User is not Business');
  }
}

export const guardAdmin = async (req, res, next) => {
  if (req.session.user && req.session.user.isAdmin) {
    next();
  } else {
    res.status(401).send('User is not admin');
  }
} */