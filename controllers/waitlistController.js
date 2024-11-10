const db = require('../db');

const addEmailToWaitlist = async (email) => {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Reset sequence to prevent gaps in IDs
    await db.query(
      "SELECT setval('waitlist_id_seq', (SELECT COALESCE(MAX(id), 0) FROM waitlist))"
    );

    const result = await db.query(
      "INSERT INTO waitlist (email) VALUES ($1) ON CONFLICT (email) DO NOTHING RETURNING *",
      [email]
    );

    // If no row was returned due to conflict, fetch the existing entry
    if (!result.rows[0]) {
      const existing = await db.query(
        "SELECT * FROM waitlist WHERE email = $1",
        [email]
      );
      return {
        ...existing.rows[0],
        alreadyRegistered: true
      };
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error adding email to waitlist:", error);
    throw error.message === 'Invalid email format' 
      ? error 
      : new Error("Error adding email to waitlist");
  }
};

const getWaitlistPosition = async (email) => {
  try {
    // First check if email exists
    const emailCheck = await db.query(
      "SELECT id FROM waitlist WHERE email = $1",
      [email]
    );

    if (!emailCheck.rows[0]) {
      return null;
    }

    const result = await db.query(
      `SELECT 
        COUNT(*) AS position,
        (SELECT COUNT(*) FROM waitlist) AS total_count
       FROM waitlist 
       WHERE id <= (SELECT id FROM waitlist WHERE email = $1)`,
      [email]
    );

    return {
      position: parseInt(result.rows[0].position),
      totalCount: parseInt(result.rows[0].total_count)
    };
  } catch (error) {
    console.error("Error getting waitlist position:", error);
    throw new Error("Error retrieving waitlist position");
  }
};

const joinWaitlist = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        error: 'Email is required' 
      });
    }

    const result = await addEmailToWaitlist(email);
    const position = await getWaitlistPosition(email);

    res.status(result.alreadyRegistered ? 200 : 201).json({
      success: true,
      data: {
        ...result,
        ...position,
        message: result.alreadyRegistered 
          ? 'Email already registered' 
          : 'Successfully joined waitlist'
      }
    });

  } catch (error) {
    const statusCode = error.message === 'Invalid email format' ? 400 : 500;
    res.status(statusCode).json({ 
      success: false,
      error: error.message 
    });
  }
};

const checkWaitlistPosition = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        error: 'Email is required' 
      });
    }

    const position = await getWaitlistPosition(email);

    if (position === null) {
      return res.status(404).json({
        success: false,
        error: 'Email not found in waitlist'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        email,
        ...position
      }
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

module.exports = { 
  joinWaitlist, 
  checkWaitlistPosition,
  // Exporting for testing purposes
  addEmailToWaitlist,
  getWaitlistPosition
};