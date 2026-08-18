const axios = require('axios');

async function testLogin() {
  try {
    const response = await axios.post('https://bellwin-erp-project.onrender.com/api/auth/login', {
      username: 'admin',
      password: 'admin123'
    });
    console.log("Success:", response.data);
  } catch (error) {
    console.log("Error status:", error.response?.status);
    console.log("Error data:", error.response?.data);
  }
}

testLogin();
