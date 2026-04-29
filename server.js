process.on("uncaughtException", err => {
  console.error("CRASH:", err);
});

process.on("unhandledRejection", err => {
  console.error("PROMISE ERROR:", err);
});

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { success: false, message: "Too many requests. Slow down." }
});

app.use(limiter);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function validate(data) {
  const nameRegex = /^[a-zA-ZÀ-ÿ\s]{2,50}$/;
  const phoneRegex = /^[0-9()+\-\s]{7,20}$/;

  if (!nameRegex.test(data.first_name)) return "Invalid first name";
  if (!nameRegex.test(data.last_name)) return "Invalid last name";
  if (!phoneRegex.test(data.phone)) return "Invalid phone";

  if (!data.city || data.city.length < 2) return "Invalid city";
  if (!data.service_type) return "Invalid service";

  if (data.message && data.message.length > 500) return "Message too long";

  return null;
}

app.post("/send", async (req, res) => {
  const error = validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error });
  }

  const {
    first_name,
    last_name,
    phone,
    city,
    service_type,
    message
  } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Cleaning Lead - Radiant Bliss",
      text: `
NEW CLIENT:

Name: ${first_name} ${last_name}
Phone: ${phone}
City: ${city}
Service: ${service_type}
Message: ${message || "N/A"}
      `,
    });

    return res.json({ success: true });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});