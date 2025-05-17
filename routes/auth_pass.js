import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/User.js";

const router = express.Router();


// Forgot Password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ message: "user not registered" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, { expiresIn: "5m" });
    const encodedToken = encodeURIComponent(token).replace(/\./g, "%2E");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,       // Replace with your actual email
        pass: process.env.EMAIL_PASS, // Replace with real app password
      },
    });

    const mailOptions = {
      from: "your email@gmail.com",
      to: email,
      subject: "Reset Password",
      text : `https://employeetrack-frontend-ten.vercel.app/resetPassword/${encodedToken}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) return res.json({ message: "error sending email" });
      return res.json({ status: true, message: "email sent" });
    });
  } catch (err) {
    console.log(err);
  }
});

// Reset Password
router.post("/resetPassword/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const id = decoded.id;
    const hashPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate({ _id: id }, { password: hashPassword });

    return res.json({ status: true, message: "password updated" });
  } catch (err) {
    return res.json("invalid token");
  }
});

// Logout
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ status: true });
});

export default router;
