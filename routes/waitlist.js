const express = require('express');
const { joinWaitlist, checkWaitlistPosition } = require('../controllers/waitlistController');

const router = express.Router();

router.post('/join', joinWaitlist);
router.get('/position/:email', checkWaitlistPosition);

module.exports = router;
