require('dotenv').config();
const express = require('express');
const cors = require('cors');
const waitlistRoutes = require('./waitlist');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api', waitlistRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});