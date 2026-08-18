require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`Connected to DB: ${mongoose.connection.name}`);
  const collections = await mongoose.connection.db.collections();
  const customerCol = collections.find(c => c.collectionName === 'customers');
  if (customerCol) {
    console.log(`Customers: ${await customerCol.countDocuments()}`);
  }
  const employeeCol = collections.find(c => c.collectionName === 'employees');
  if (employeeCol) {
    console.log(`Employees: ${await employeeCol.countDocuments()}`);
    const latest = await employeeCol.find().sort({_id: -1}).limit(1).toArray();
    if(latest.length > 0) {
      console.log(`Latest Employee Name: ${latest[0].name}, Role: ${latest[0].role}`);
    }
  }
  const Customer = require('./models/Customer').Customer;
  try {
    const cust = new Customer({
      customerName: 'Test Name',
      guardianName: 'Test Guardian',
      age: 30,
      mobileNumber: '9999999999',
      doorStreet: '123',
      area: 'Area',
      employeeId: 'admin-override-id',
      createdBy: 'admin-override-id'
    });
    await cust.save();
    console.log('Dummy customer saved successfully!');
  } catch(err) {
    console.error('Customer save error:', err);
  }
  process.exit(0);
}
test().catch(console.error);
