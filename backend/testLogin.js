const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const uri = 'mongodb+srv://techview828_db_user:TlGkuJAiAzp2Eo77@cluster0.ttxlb53.mongodb.net/belwin_erp?retryWrites=true&w=majority';
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

mongoose.connect(uri).then(async () => {
    const username = 'admin';
    const password = '123';
    const trimmedUsername = username.trim();
    const user = await User.findOne({ username: trimmedUsername }).populate('employeeId');
    console.log('User found:', user ? user.username : 'No user');
    if (user) {
        console.log('Is account inactive?', user.employeeId && user.employeeId.status === 'Inactive');
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch);
    }
    process.exit();
}).catch(console.error);
