import jwt from 'jsonwebtoken';

const generateToken = (user) => {
  return jwt.sign({ id: user.id, isAdmin: user.is_admin }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

export default generateToken;
