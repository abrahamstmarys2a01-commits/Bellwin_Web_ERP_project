const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI || 'mongodb+srv://techview828_db_user:TlGkuJAiAzp2Eo77@cluster0.ttxlb53.mongodb.net/belwin_erp?appName=Cluster0';

mongoose.connect(uri)
  .then(async () => {
    const Employee = require('./models/Employee');
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');
    
    const users = await User.find({}).populate('employeeId');
    console.log("Users in DB:");
    users.forEach(u => {
      console.log(`- Username: ${u.username}, Role: ${u.role}, Status: ${u.employeeId ? u.employeeId.status : 'No Employee Record'}`);
    });

    // Reset password for 'admin' user to 'admin123' if it exists
    const adminUser = await User.findOne({ username: 'admin' });
    if (adminUser) {
      const salt = await bcrypt.genSalt(10);
      adminUser.password = await bcrypt.hash('admin123', salt);
      await adminUser.save();
      console.log("\n[SUCCESS] Password for 'admin' has been reset to 'admin123'");
    }

    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
