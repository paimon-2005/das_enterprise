const Stripe = require('stripe');

let stripe;
if (process.env.STRIPE_SECRET_KEY) {
    stripe = Stripe(process.env.STRIPE_SECRET_KEY);
} else {
    console.warn('STRIPE_SECRET_KEY is missing. Stripe functionality will be disabled.');
    stripe = null;
}

module.exports = stripe;
