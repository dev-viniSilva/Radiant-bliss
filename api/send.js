import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { first_name, last_name, phone, city, service_type, message } = req.body;

  const nameRegex = /^[a-zA-ZÀ-ÿ\s]{2,50}$/;
  const phoneRegex = /^[0-9()+\-\s]{7,20}$/;

  if (!nameRegex.test(first_name)) {
    return res.status(400).json({ success: false, message: "Invalid first name" });
  }

  if (!nameRegex.test(last_name)) {
    return res.status(400).json({ success: false, message: "Invalid last name" });
  }

  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ success: false, message: "Invalid phone" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Cleaning Lead - Radiant Bliss",
      text: `
NEW CLIENT | Radiant bliss:

Name: ${first_name} ${last_name}
Phone: ${phone}
City: ${city}
Service: ${service_type}
Message: ${message || "N/A"}
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false });
  }
}