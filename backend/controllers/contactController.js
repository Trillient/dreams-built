const asyncHandler = require('express-async-handler');
const axios = require('axios').default;
const dotenv = require('dotenv');

dotenv.config();

/**
 * @Desc Email contact form message to admin
 * @Route POST /api/contact
 * @Access Public
 */

const contactForm = asyncHandler(async (req, res) => {
  const { name, email, message, token } = req.body;

  const { data } = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`);

  if (!data.success) {
    res.status(400);
    throw new Error('ReCAPTCHA Failed!');
  }

  axios.post(process.env.AWS_SES, { name: name, email: email, message: message }).catch((e) => res.json(e));

  res.status(201).json({ message: 'Sent!' });
});

module.exports = { contactForm };
