















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
}