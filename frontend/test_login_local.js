const axios = require('axios');

async function testLoginLocal() {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      username: 'admin',
      password: 'admin123'
    });
    console.log("Success:", response.data);
  } catch (error) {
    console.log("Error status:", error.response?.status);
    console.log("Error data:", error.response?.data);
  }
}

testLoginLocal();
