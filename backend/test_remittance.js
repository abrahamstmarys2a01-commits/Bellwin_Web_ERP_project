const mongoose = require('mongoose');
const Remittance = require('./models/Remittance');
const Counter = require('./models/Counter');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to DB');
    const newRemittance = new Remittance({
      remittanceNo: 'CASH-1234',
      date: new Date(),
      remittanceType: 'Cash Remittance',
      amount: 15000,
      fromBranch: 'Head Office',
      toBranch: 'Main Branch',
      requestedBy: 'Test',
      paymentMode: 'Cash',
      status: 'Pending'
    });
    const saved = await newRemittance.save();
    console.log('Saved:', saved);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
