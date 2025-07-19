const express = require('express');
const router = express.Router();
const { accounts, users } = require('../../models'); // adjust path as needed

// Create new account
router.post('/create/:user_id', async (req, res) => {
  try {
    const { title, name, number, bank_name = '' } = req.body;
    const user_id = req?.params?.user_id;

    console.log(req.body)
    console.log(user_id)

    if (!user_id || !name || !number) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Check if user exists
    const user = await users.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }


    // Check for duplicate account number
    const existingAccount = await accounts.findOne({ where: { name, title, number } });
    if (existingAccount) {
      return res.status(409).json({ success: false, message: 'Account number already exists' });
    }

    const newAccount = await accounts.create({ user_id, title, name, bank_name, number });
    return res.status(201).json({ success: true, message: 'Account created', data: newAccount });
  } catch (error) {
    console.error('Error creating account:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Get all accounts
router.get('/get/:user_id', async (req, res) => {
  const user_id = req.params.user_id;
  try {
    const allAccounts = await accounts.findAll({ where: { user_id } });
    return res.status(200).json({ success: true, message: 'Accounts fetched successfully', data: allAccounts });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return res.status(500).json({ success: true, message: 'Internal server error', error: error.message });
  }
});

// Get account by ID
router.get('/get/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const account = await accounts.findByPk(id);

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    return res.status(200).json({ data: account });
  } catch (error) {
    console.error('Error fetching account:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Update account by ID
router.put('/update/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { user_id, title, name, number } = req.body;

    const account = await accounts.findByPk(id);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Validate user if user_id provided and different
    if (user_id && user_id !== account.user_id) {
      const user = await users.findByPk(user_id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
    }

    // Check for duplicate account number if changed
    if (number && number !== account.number) {
      const duplicate = await accounts.findOne({ where: { number } });
      if (duplicate) {
        return res.status(409).json({ message: 'Account number already in use' });
      }
    }

    account.user_id = user_id ?? account.user_id;
    account.title = title ?? account.title;
    account.name = name ?? account.name;
    account.number = number ?? account.number;

    await account.save();

    return res.status(200).json({ message: 'Account updated', data: account });
  } catch (error) {
    console.error('Error updating account:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Delete account by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const account = await accounts.findByPk(id);

    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    await account.destroy();

    return res.status(200).json({ success: true, message: 'Account deleted' });
  } catch (error) {
    console.error('Error deleting account:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
