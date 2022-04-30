import jwt from "jsonwebtoken";
import User from "../models/user.model";

const verifyAdmin = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res.json({
      success: false,
      msg: "Access denied. No token provided.",
    });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.json({
        success: false,
        msg: "User not found",
      });
    }
    console.log(user);
    if (!user.permissons.isAdmin) {
      return res.json({
        success: false,
        msg: "Access denied. You are not an admin.",
      });
    }
    next();
  } catch (error) {
    console.error(error.message);
    return res.json({ success: false, msg: "Forbidden" });
  }
};

export default verifyAdmin;