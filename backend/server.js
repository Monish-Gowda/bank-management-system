const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();


const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');



const app = express();


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

app.use('/api/auth',authRoutes);
app.use('/api/user',userRoutes);
app.use('/api/admin',adminRoutes);

app.get('/', (req, res) => {
    res.send('Backend is running');
  });

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
  });
  

const PORT  = process.env.PORT || 5001;

app.listen(PORT,() => console.log(`Server is running on PORT ${PORT}`));
