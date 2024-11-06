const { addEmailToWaitlist, getWaitlistPosition } = require('../models/waitlist');

const joinWaitlist = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const newEntry = await addEmailToWaitlist(email);
    if (!newEntry) {
        return res.status(409).json({ message: 'Email already on waitlist' });
    }

    res.status(201).json({ message: 'Successfully joined the waitlist' });
};

const checkWaitlistPosition = async (req, res) => {
    const { email } = req.params;
    const position = await getWaitlistPosition(email);

    if (!position) {
        return res.status(404).json({ message: 'Email not found on waitlist' });
    }

    res.status(200).json({ position });
};

module.exports = { joinWaitlist, checkWaitlistPosition };
