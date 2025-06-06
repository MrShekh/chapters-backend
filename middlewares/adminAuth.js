// middlewares/adminAuth.js
module.exports = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token || token !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ message: "Unauthorized: Admin access only" });
  }
  next();
};
