require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


// Test route
app.get('/health', (req, res) => {
  res.json({ status: 'API up' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 FedesCRM backend corriendo en el puerto ${PORT}`);
});
