// controllers/transactionController.js
// const { uploadImage } = require("../services/imageKitService");
const { users, subscriptions, transactions } = require("../../models");

const express = require("express");
const fileUpload = require("express-fileupload");
const { uploadImage } = require("../../utils/middlewares/UploadFile");
const { divide_payments_to_uplines } = require("../../utils/helpers/divide_payments_to_uplines");
const { divide_payments } = require("../../utils/helpers/payment_calculations");

const router = express.Router();
router.use(fileUpload());


router.post('/create/:user_id', async (req, res) => {
  const status = 'inactive';
  try {
    const user_id = req?.params?.user_id;
    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const existingUser = await users.findOne({ where: { id: user_id } });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("Existing user after find:");

    const pendingSubsciption = await subscriptions.findOne({
      where: {
        user_id: user_id,
        status: 'inactive'
      }
    })
    if (pendingSubsciption) {
      return res.status(400).json({ message: "User already has a pending subscription" });
    }


    const { subscription_type, subscription_level } = req.body;
    const body = { ...req.body, status: 'inactive' }

    // console.log(body)

    // console.log(req.files)
    const file = req.files ? req.files.file : null; // Assuming file is uploaded via form-data

    // console.log(file)

    let imageUrl = null;
    // Validate file upload
    if (subscription_type == 'indirect') {
      if (!file) {
        return res.status(400).json({ message: "Image is required" });
      }

      if (file) {
        console.log("file exists");
        // return res.status(400).json({ message: "Image is present" });

        if (file.data.length > 1048576) { // 200 KB in bytes
          return res.status(400).json({ message: "File size should not exceed 1MB." });
        }

        // if (file.data.length > 1048576) { // 1MB in bytes
        //   return res.status(400).json({ message: "File size should not exceed 1MB." });
        // }

        // Sanitize the file name (replace spaces with underscores)
        const filename = file.name.replace(/\s/g, "_");

        // Upload image to ImageKit
        imageUrl = await uploadImage(file.data, filename);

        // Log the image URL for debugging
        // console.log("Image URL:", imageUrl);

      }
    } else if (subscription_type == 'direct') {
      const user = await users.findOne({
        where: { id: user_id },
        attributes: ['id', 'available_balance'],
      });

      if (!user) {
        res.send(404).json({ success: false, message: `User with id ${user_id} not found` });
        // Handle user not found case, maybe return error or continue
      } else if (user.available_balance < req.body.amount) {
        res.status(400).json({ success: false, message: "Insufficient balance to Actiate this Plan" });
        // Handle insufficient balance case, maybe return error or continue
      } else {
        // console.log(user.available_balance);
        user.available_balance -= req.body.amount;
        user.withdrawal_balance += req.body.amount;
        // user.subscription_level = subscription_level;
        await user.save();
        body.status = 'active';
      }
    }


    // Save the transaction to the database
    const transaction = await subscriptions.create({
      ...body,
      user_id,
      imageUrl,
    });

    const createTransaction = await transactions.create({
      ...body,
      user_id: user_id,
      amount: req.body.amount,
      type: 'subscription',
      status: 'pending',
      transaction_id: transaction.id,
    })

    // Send success response with transaction data
    res.status(201).json({ message: "Subscription created successfully", transaction });
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});


router.get('/user/pending/get/:user_id', async (req, res) => {
  try {
    const user_id = req?.params?.user_id;
    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const pendingSubsciption = await subscriptions.findAll({
      where: {
        user_id: user_id,
        status: 'inactive'
      }
    });
    if (!pendingSubsciption) {
      return res.status(404).json({ success: false, message: "No Pending Subscription found" });
    }
    res.status(200).json({ success: false, message: "Pending Subscription fetched successfully", data: pendingSubsciption });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
})


router.patch('/approve/update/:user_id/:subscription_id', async (req, res) => {
  try {
    const { user_id, subscription_id } = req.params;
    const current_subscription = await subscriptions.findOne({
      where: {
        id: subscription_id,
        user_id: user_id,
        // status: 'pending',
      }
    });

    if (!current_subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    if (current_subscription.status !== 'inactive') {
      return res.status(400).json({ message: "Subscription is already active" });
    }

    const user = await users.findOne({ where: { id: user_id } })
    const user_old_level = user.subscription_level;
    user.subscription_level = current_subscription.subscription_level;
    if (user.subscription_level == 0) {
      user.status = 'active'
    }
    await user.save();
    await current_subscription.update({
      status: 'active'
    }, {
      where: {
        id: subscription_id,
        user_id: user_id
      }
    });

    const payments_array = await divide_payments(current_subscription.amount);

    const payments_done = await divide_payments_to_uplines(user, payments_array, user_old_level, current_subscription.amount)

    // console.log(payments_done)
    res.status(200).json({ message: "Subscription activated successfully" });
  } catch (error) {
    console.error("Error updating subscription:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});




router.patch('/cancel/update/:user_id/:subscription_id', async (req, res) => {
  try {
    const { user_id, subscription_id } = req.params;
    const current_subscription = await subscriptions.findOne({
      where: {
        id: subscription_id,
        user_id: user_id,
        // status: 'pending',
      }
    });

    if (!current_subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    if (current_subscription.status !== 'inactive') {
      return res.status(400).json({ message: "Subscription is already active" });
    }

    await current_subscription.update({
      status: 'canceled'
    }, {
      where: {
        id: subscription_id,
        user_id: user_id
      }
    });
    // console.log(payments_done)
    res.status(200).json({ message: "Subscription activated successfully" });
  } catch (error) {
    console.error("Error updating subscription:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});




module.exports = router;
