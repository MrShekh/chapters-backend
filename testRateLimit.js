const axios = require('axios');

(async () => {
  for (let i = 1; i <= 35; i++) {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/chapters");
      console.log(`${i}: ${res.status}`);
    } catch (err) {
      console.log(`${i}: ${err.response?.status || 'error'}`);
    }
  }
})();
