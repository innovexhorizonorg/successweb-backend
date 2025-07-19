const { where } = require("sequelize");
const { users } = require("../../models");

const express = require("express");
const router = express.Router();


router.get('/level/:user_id/:level', async (req, res) => {
  try {
    const { user_id, level } = req.params;
    const lvl = parseInt(level, 10);

    if (isNaN(lvl) || lvl < 0 || lvl > 7) {
      return res.status(400).json({ error: 'Level must be an integer between 0 and 7' });
    }

    // Map level to field name
    const fieldMap = {
      0: 'invited_by',
      1: 'upline_one',
      2: 'upline_two',
      3: 'upline_three',
      4: 'upline_four',
      5: 'upline_five',
      6: 'upline_six',
      7: 'upline_seven',
    };

    const conditionField = fieldMap[lvl];

    // Query users where conditionField = user_id
    const levelbaseusers = await users.findAll({
      where: {
        [conditionField]: user_id,
      },
      attributes: ['id', 'name', 'email', 'invited_by', 'total_direct', 'subscription_level', 'total_income']
    });

    res.json({ success: true, message: "Levels members fetched successfully", payload: levelbaseusers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router