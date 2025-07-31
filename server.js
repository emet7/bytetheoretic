// server.js
const express = require('express');
const stripe = require('stripe')('YOUR_SECRET_KEY'); // Replace with your real Stripe Secret Key
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/create-checkout-session', async (req, res) => {
  const { input } = req.body; // If you want to use input from the text box

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'API Key', // Change as needed
              description: `Key request from: ${input || 'anonymous'}`, // optional
            },
            unit_amount: 2000, // $20 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://yourdomain.com/success', // Replace with your success page
      cancel_url: 'https://yourdomain.com/cancel',   // Replace with your cancel page
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create Stripe session' });
  }
});

const PORT = 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));