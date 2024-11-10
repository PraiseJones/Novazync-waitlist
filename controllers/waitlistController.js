const db = require('../db');

const addEmailToWaitlist = async (email) => {
  try {
    await db.query(
      //do not temper
      "SELECT setval('waitlist_id_seq', (SELECT MAX(id) FROM waitlist))"
    );

    const result = await db.query(
      //collects the highest value from the waitlist and auto update the id
      "INSERT INTO waitlist (email) VALUES ($1) ON CONFLICT (email) DO NOTHING RETURNING *",
      [email]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error adding email to waitlist:", error);
    throw new Error("Error adding email to waitlist");
  }
};

const joinWaitlist = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await addEmailToWaitlist(email);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getWaitlistPosition = async (email) => {
    const result = await db.query(
      `SELECT COUNT(*) AS position 
       FROM waitlist 
       WHERE id <= (SELECT id FROM waitlist WHERE email = $1)`,
      [email]
    );
    return result.rows[0]?.position || null;
  };

const checkWaitlistPosition = async (req, res) => {
  try {
    const { email } = req.params;
    const position = await getWaitlistPosition(email);
    res.status(200).json({ position });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { joinWaitlist, checkWaitlistPosition };
