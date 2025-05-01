// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.post("/api/orders", async (req, res) => {
  const { customer, items, total, paymentMethod } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail", // You can use any SMTP provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const itemList = items.map(
    (item) => `${item.name} - NPR ${item.price}`
  ).join("\n");

  const mailOptions = {
    from: `"Zynex Orders" <${process.env.EMAIL_USER}>`,
    to: process.env.ORDER_RECEIVER_EMAIL,
    subject: "New Order Received",
    text: `
New Order Placed

Customer:
Name: ${customer.name}
Email: ${customer.email}
Address: ${customer.address}
Phone: ${customer.phone}
Payment Method: ${paymentMethod}

Items:
${itemList}

Total: NPR ${total}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Order sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send order." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
