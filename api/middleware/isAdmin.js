export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized: No user context' });
  }

  if (req.user.is_admin) {
    return next();
  }

  return res.status(403).json({ message: 'Access denied: Admins only.' });
};
