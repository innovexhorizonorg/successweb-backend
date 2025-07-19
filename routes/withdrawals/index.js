const express = require('express');
const router = express.Router();
const { withdrawals, users } = require('../../models');
const { where } = require('sequelize');

// Create new withdrawal
router.post('/create/:user_id', async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const {
      account_name,
      bank_name,
      account_number,
      account_title,
      amount,
      currency,
      status = 'pending',
      amount_withdrawn = 0,
    } = req.body;

    if (!user_id || !account_number || !amount) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    const user = await users.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const withdrawal = await withdrawals.create({
      user_id,
      account_name,
      bank_name,
      account_number,
      account_title,
      amount,
      amount_withdrawn,
      currency,
      status,
    });

    return res.status(201).json({ success: true, message: 'Withdrawal created', data: withdrawal });
  } catch (error) {
    console.error('Error creating withdrawal:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Get all withdrawals for a user
router.get('/user/all/get/:user_id', async (req, res) => {
  try {
    const user_id = req.params.user_id;

    const user = await users.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const withdrawalsList = await withdrawals.findAll({ where: { user_id } });

    return res.status(200).json({ success: true, message: 'Withdrawals fetched', data: withdrawalsList });
  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});


router.get('/admin/all/get', async (req, res) => {
  try {
    const withdrawalsList = await withdrawals.findAll({
      where: { status: 'pending' },
      include: [
        {
          model: users,
          attributes: ['id', 'name', 'email'] // optional: select needed user fields
        }
      ]
    });

    return res.status(200).json({
      success: true,
      message: 'Withdrawals fetched successfully',
      data: withdrawalsList
    });
  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get withdrawal by ID
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const withdrawal = await withdrawals.findByPk(id);

    if (!withdrawal) {
      return res.status(404).json({ success: false, message: 'Withdrawal not found' });
    }

    return res.status(200).json({ success: true, data: withdrawal });
  } catch (error) {
    console.error('Error fetching withdrawal:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});


router.post('/admin/approve/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if withdrawal exists
    const withdrawal = await withdrawals.findByPk(id);
    if (!withdrawal) {
      return res.status(404).json({ success: false, message: 'Withdrawal not found' });
    }

    // Check if the associated user exists
    const user = await users.findByPk(withdrawal.user_id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Ensure that the user has enough available balance
    if (user.available_balance < withdrawal.amount) {
      return res.status(400).json({ success: false, message: 'Insufficient balance for withdrawal' });
    }


    // Update withdrawal status to 'approved'
    withdrawal.status = 'approved';
    await withdrawal.save();

    // Deduct the withdrawal amount from available_balance and add it to withdrawal_balance
    user.available_balance -= withdrawal.amount;
    user.withdrawal_balance += withdrawal.amount;

    // Save the updated user balance
    await user.save();

    const adminUser = await users.findByPk(0);
    adminUser.withdrawal_balance += withdrawal.amount;
    await adminUser.save();

    return res.status(200).json({ success: true, message: 'Withdrawal approved' });
  } catch (error) {
    console.error('Error approving withdrawal:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});


router.post('/admin/reject/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if withdrawal exists
    const withdrawal = await withdrawals.findByPk(id);
    if (!withdrawal) {
      return res.status(404).json({ success: false, message: 'Withdrawal not found' });
    }

    // Update withdrawal status to 'rejected'
    withdrawal.status = 'rejected';
    await withdrawal.save();

    return res.status(200).json({ success: true, message: 'Withdrawal rejected' });
  } catch (error) {
    console.error('Error rejecting withdrawal:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Update withdrawal by ID
router.put('/update/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { account_name, bank_name, account_number, account_title, amount, currency, status, amount_withdrawn } = req.body;

    const withdrawal = await withdrawals.findByPk(id);
    if (!withdrawal) {
      return res.status(404).json({ success: false, message: 'Withdrawal not found' });
    }

    withdrawal.account_name = account_name ?? withdrawal.account_name;
    withdrawal.bank_name = bank_name ?? withdrawal.bank_name;
    withdrawal.account_number = account_number ?? withdrawal.account_number;
    withdrawal.account_title = account_title ?? withdrawal.account_title;
    withdrawal.amount = amount ?? withdrawal.amount;
    withdrawal.currency = currency ?? withdrawal.currency;
    withdrawal.status = status ?? withdrawal.status;
    withdrawal.amount_withdrawn = amount_withdrawn ?? withdrawal.amount_withdrawn;

    await withdrawal.save();

    return res.status(200).json({ success: true, message: 'Withdrawal updated', data: withdrawal });
  } catch (error) {
    console.error('Error updating withdrawal:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Delete withdrawal by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const withdrawal = await withdrawals.findByPk(id);
    if (!withdrawal) {
      return res.status(404).json({ success: false, message: 'Withdrawal not found' });
    }

    await withdrawal.destroy();

    return res.status(200).json({ success: true, message: 'Withdrawal deleted' });
  } catch (error) {
    console.error('Error deleting withdrawal:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
