const express = require('express');
const axios = require('axios');
const router = express.Router();

const EMAILJS_SERVICE_ID = 'service_xppz61o';
const EMAILJS_TEMPLATE_ID = 'template_53d0cd2';
const EMAILJS_PRIVATE_KEY = '4CLyFY7Du_W3_uTMx';

router.post('/send-inquiry-email', async (req, res) => {
  const data = req.body;

  // Compose your template params as per your EmailJS template
  const templateParams = {
    name: data.name,
    gmail: data.gmail,
    phone: data.phone,
    classType: data.classType,
    from: data.from,
    to: data.to,
    departure: data.departure,
    return: data.return,
    tripType: data.tripType,
    direct: data.direct ? 'Yes' : 'No',
    adults: data.passenger?.adults,
    children: data.passenger?.children,
    infants: data.passenger?.infants,
    selectedButton: data.selectedButton,
  };

  try {
    // Send POST request to EmailJS API
    const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send', {
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PRIVATE_KEY, // YES, user_id is your private API key here!
      template_params: templateParams,
    });

    // EmailJS returns 200 if successful
    if (response.status === 200) {
      res.json({ success: true, message: 'Inquiry email sent via EmailJS.' });
    } else {
      res.status(500).json({ success: false, message: 'EmailJS send failed.' });
    }
  } catch (err) {
    console.error('EmailJS error:', err?.response?.data || err);
    res.status(500).json({ success: false, message: 'Failed to send email.', details: err?.response?.data || err.message });
  }
});

module.exports = router;
