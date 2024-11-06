const express = require('express');
const waitlistRoutes = require('./routes/waitlist');
const path = require('path');
require('dotenv').config();

const app = express();
const cors = require('cors');
app.use(cors())
app.use(express.json());

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Waitlist API routes
app.use('/api/waitlist', waitlistRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
