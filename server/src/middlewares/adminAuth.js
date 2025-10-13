export function requireAdmin(req, res, next) {
  const token = req.get('X-ADMIN-TOKEN');
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorised' });
  }
  next();
}
