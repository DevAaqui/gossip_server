require('dotenv').config();
const app = require('./src/app');

const PORT = parseInt(process.env.PORT, 10) || 3000;

app.listen(PORT, () => {
  console.log(`Gossip server running on http://localhost:${PORT}`);
});
