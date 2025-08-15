const router = require('express').Router();
const nodemailer = require('nodemailer');
// require('dotenv').config();
const dotenv = require('dotenv');

dotenv.config();

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER || 'galpha964@gmail.com',
    pass: process.env.SMTP_PASS || 'yzjuaepkiazgufmc',
  },
  connectionTimeout: 10000,
  greetingTimeout: 5000,
  socketTimeout: 45000
  // tls: {
  //     ciphers: 'SSLv3'
  // }
});

router.post('/send-mail', async (req, res) => {
  const {
    from,
    to,
    departure,
    return: returnDate,
    passenger,
    tripType,
    classType,
    direct,
    selectedButton,
    name,
    phone,
    gmail,
  } = req.body;

  const htmlMessage = `
    <div style="max-width: 600px; font-family: Arial, sans-serif; border-radius: 30px 30px 0 0; overflow: hidden;">
      <div style="background: #FFA500; padding: 32px 0 20px 0; text-align: center; border-radius: 30px 30px 0 0;">
        <span style="color: #fff; font-size: 2.5em; font-weight: bold; letter-spacing: 2px;">
          Panama Travel Ltd
        </span>
      </div>
      <div style="padding: 24px 32px; background: #fff;">
        <p>You received a new inquiry:</p>
        <p>
          <b>Name:</b> ${name}<br>
          <b>Email:</b> <a href="mailto:${gmail}">${gmail}</a><br>
          <b>Phone:</b> ${phone}<br>
          <b>Trip Type:</b> ${tripType}<br>
          <b>From:</b> ${from}<br>
          <b>To:</b> ${to}<br>
          <b>Departure:</b> ${departure}<br>
          <b>Return:</b> ${returnDate}<br>
          <b>Passengers:</b> Adults - ${passenger?.adults || 0}, Youth - ${passenger?.youth || 0} Children - ${passenger?.children || 0}, Infants - ${passenger?.infants || 0}<br>
          <b>Class:</b> ${classType}<br>
          <br>
          Direct Flight Only: ${direct ? "Yes" : "No"}<br>
          Inquiry For: ${selectedButton}
        </p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      // from: `"Panama Travel Ltd" <${process.env.SMTP_USER || 'sales@panamatravel.co.uk'}>`,
      from: "galpha964@gmail.com",
      to: `sales@panamatravel.co.uk`, // Sending to sales + user
      subject: `New Inquiry by ${gmail}`,
      html: htmlMessage,
    });

    res.status(200).json({ success: true, message: 'Email sent to Panama Travel successfully!' });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email', error });
  }
});



// ---- POST /api/inquiry ----
router.post("/inquiry", async (req, res) => {
  try {
    const {
      name,
      email,        // user email
      phone,
      checkIn,
      checkOut,
      guests,
      description,
    } = req.body || {};

    // ---- Basic validation ----
    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and Email are required." });
    }

    // optional: guests number normalize
    const guestsNum = Number(guests || 1);

    // ---- Email HTML ----
    const htmlMessage = `
      <div style="max-width: 640px; font-family: Arial, sans-serif;">
        <div style="background:#1f73b7; color:#fff; padding:20px 24px; border-radius:12px 12px 0 0;">
          <h2 style="margin:0;">New Inquiry</h2>
        </div>
        <div style="border:1px solid #eee; border-top:none; padding:20px 24px; border-radius:0 0 12px 12px;">
          <p style="margin:0 0 12px 0;">You received a new inquiry from your website.</p>
          <table cellpadding="6" style="width:100%; border-collapse:collapse;">
            <tr><td><b>Name</b></td><td>${name}</td></tr>
            <tr><td><b>Email</b></td><td><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td><b>Phone</b></td><td>${phone || "-"}</td></tr>
            <tr><td><b>Check In</b></td><td>${checkIn || "-"}</td></tr>
            <tr><td><b>Check Out</b></td><td>${checkOut || "-"}</td></tr>
            <tr><td><b>Guests</b></td><td>${Number.isFinite(guestsNum) ? guestsNum : "-"}</td></tr>
            <tr><td><b>Description</b></td><td>${(description || "-")
        .toString()
        .slice(0, 2000)}</td></tr>
          </table>
        </div>
      </div>
    `;

    // ---- Send email to Sales + User ----
    await transporter.sendMail({
      from: `"Website Inquiries" <${'galpha964@gmail.com'}>`,
      to: `${"sales@panamatravel.co.uk"}`,
      replyTo: email,
      subject: `New Inquiry Received from ${email}`,
      html: htmlMessage,
    });

    return res.status(200).json({ success: true, message: "Inquiry email sent successfully." });
  } catch (error) {
    console.error("Inquiry email error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send inquiry email.", error: error?.message });
  }
});



module.exports = router;
