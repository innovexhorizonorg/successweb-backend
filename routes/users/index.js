const express = require("express");
const router = express.Router();
const { users, withdrawals, subscriptions, password_logs, sequelize, } = require("../../models");
const bcrypt = require("bcrypt");
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");

const { uploadImage, removeImageFromImagekit } = require("../../utils/middlewares/UploadFile");
const fileUpload = require("express-fileupload");


// Make sure to use express-fileupload middleware at the top
router.use(fileUpload());


// const { v4: uuidv4 } = require("uuid");
// const { Op } = require('sequelize');

// Middleware for error handling
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};


router.use('/', require('./../levels/index'));



/**
 * @route   GET /users
 * @desc    Get all users
 * @access  Admin
 */
router.get("/admin/stats", asyncHandler(async (req, res) => {
  try {
    // Exclude admin/system user ids
    const excludeIds = [0, 1, 2, 3];

    // Total users
    const totalUsers = await users.count({
      where: {
        id: { [Op.notIn]: excludeIds },
      }
    });

    // Active users (subscription != 0)
    const activeUsers = await users.count({
      where: {
        id: { [Op.notIn]: excludeIds },
        subscription_level: { [Op.ne]: 0 }
      }
    });

    // Total withdrawal requests (pending)
    const totalWithdrawalRequests = await withdrawals.count({
      where: {
        status: "pending"
      }
    });

    // Total subscriptions (inactive)
    const totalInactiveSubscriptions = await subscriptions.count({
      where: {
        status: "inactive"
      }
    });

    // Get data for user with id 0
    const userZero = await users.findOne({ where: { id: 0 } });

    const totalIncome = userZero ? userZero.total_income : 0;
    const totalWithdrawal = userZero ? userZero.withdrawal_balance : 0;
    const totalTeam = userZero ? userZero.total_team : 0;

    return res.status(200).json({
      success: true,
      payload: {
        totalIncome,
        totalWithdrawal,
        totalUsers,
        activeUsers,
        totalWithdrawalRequests,
        totalInactiveSubscriptions,
        totalTeam
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}));



/**
 * @route   GET /users
 * @desc    Get all users
 * @access  Admin
 */
router.get("/get", asyncHandler(async (req, res) => {
  try {
    const allUsers = await users.findAll({
      where: {
        id: { [Op.notIn]: [0] }, // Exclude users with id 0, 1, 2, 3
      },
    });
    if (!allUsers || allUsers.length === 0) {
      return res.status(404).json({ success: false, message: "No users found" });
    }
    res.status(200).json({ success: true, payload: allUsers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}));



/**
 * @route   GET /users/subscriptions/pending/
 * @desc    Get all pending subscriptions
 * @access  Private (Admin Access Only)
 */
router.get('/all/subscriptions/pending', asyncHandler(async (req, res) => {
  try {
    const allUsersWithPendingSubscriptions = await users.findAll({
      include: {
        model: subscriptions,
        where: {
          status: 'inactive'
        }
      }
    });

    if (allUsersWithPendingSubscriptions.length === 0) {
      return res.status(204).json({ success: false, message: "No pending subscriptions found" });
    }

    res.status(200).json({ success: true, payload: allUsersWithPendingSubscriptions });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}));



/**
 * @route   GET /users/:id
 * @desc    Get a single user by ID
 * @access  Public
 */
router.get("/get/:id", asyncHandler(async (req, res) => {
  const user = await users.findByPk(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  res.json({ success: true, payload: user });
}));



/**
 * @route   POST /users/create
 * @desc    Register a new user
 * @access  Public
 */
router.post("/create", asyncHandler(async (req, res) => {
  const { name, phone, email, password } = req.body;
  let invited_by = req.body.invited_by || 1;
  let upline_user = null;
  const body = req.body;

  // Start a transaction
  const t = await users.sequelize.transaction();

  try {
    // Validate required fields
    if (!email || email === "") {
      await t.rollback();
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    if (!password || password === "") {
      await t.rollback();
      return res.status(400).json({ success: false, message: "Password is required" });
    }
    if (!name || name === "") {
      await t.rollback();
      return res.status(400).json({ success: false, message: "Name is required" });
    }
    if (!phone || phone === "") {
      await t.rollback();
      return res.status(400).json({ success: false, message: "Phone is required" });
    }

    // Check if user exists
    const existingUser = await users.findOne({
      where: { email },
      t
    });
    if (existingUser) {
      await t.rollback();
      return res.status(400).json({ success: false, message: "User already exists with the provided email" });
    }
    // Check if user exists
    const existingUserWithPhone = await users.findOne({
      where: { phone },
      t
    });
    if (existingUserWithPhone) {
      await t.rollback();
      return res.status(400).json({ success: false, message: "User already exists with this Phone Number" });
    }

    // Handle invited_by and update uplines
    if (invited_by !== 0) {
      upline_user = await users.findOne({ where: { id: invited_by }, t });
      if (!upline_user) {
        invited_by = 0;
      } else if (upline_user.invited_by !== 0) {
        upline_user.total_team += 1;
        upline_user.total_direct += 1;
        await upline_user.save({ t });

        body.upline_one = upline_user.invited_by;
        body.upline_two = upline_user.upline_one || 0;
        body.upline_three = upline_user.upline_two || 0;
        body.upline_four = upline_user.upline_three || 0;
        body.upline_five = upline_user.upline_four || 0;
        body.upline_six = upline_user.upline_five || 0;
        body.upline_seven = upline_user.upline_six || 0;
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with transaction
    const newUser = await users.create({
      ...body,
      password: hashedPassword,
      role: "user",
      invited_by,
    }, { t });

    // Update total_team for uplines (upline_one to upline_seven)
    for (let i = 1; i <= 7; i++) {
      const uplineId = body[`upline_${["one", "two", "three", "four", "five", "six", "seven"][i - 1]}`];
      if (uplineId && uplineId !== 0) {
        upline_user = await users.findOne({ where: { id: uplineId }, t });
        if (upline_user) {
          upline_user.total_team += 1;
          await upline_user.save({ t });
        }
      }
    }

    // Commit transaction if all good
    await t.commit();

    res.status(201).json({ success: true, message: "User created successfully", payload: newUser });

  } catch (error) {
    // Rollback on error
    if (t) await t.rollback();
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}));



/**
 * @route   POST /users/login
 * @desc    Login user with email and password
 * @access  Public
 */
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if fields are provided
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  const jwt_content = { email, password };
  const secretKey = 'af9843wiejflakq2#$afsd'; // keep this secret and secure

  // Sign the payload to create a token (optionally set expiration, etc.)
  const token = jwt.sign(jwt_content, secretKey, { expiresIn: '6h' });

  // Find user by email
  const user = await users.findOne({ where: { email } });

  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  // Validate password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  // Send minimal user data 
  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    country: user.country,
    subscription_level: user.subscription_level,
    role: user.role,
    invited_by: user.invited_by,
    referral_code: user.referral_code,
    status: user.status,
    total_balance: user.total_balance || 0,
    available_balance: user.available_balance || 0,
    missed_balance: user.missed_balance || 0,
    withdrawal_balance: user.withdrawal_balance || 0,
    total_income: user.total_income || 0,
    direct_income: user.direct_income || 0,
    level_income: user.level_income || 0,
    leadership_income: user.leadership_income || 0,
    profile_image: user.profile_image,
    reward_income: user.reward_income || 0,
    weekly_reward: user.weekly_reward || 0,
    monthly_salary: user.monthly_salary || 0,
    total_direct: user.total_direct || 0,
    active_direct: user.active_direct || 0,
    total_team: user.total_team || 0,
    active_team: user.active_team || 0,
    upline_one: user.upline_one || 0,
    upline_two: user.upline_two || 0,
    upline_three: user.upline_three || 0,
    upline_four: user.upline_four || 0,
    upline_five: user.upline_five || 0,
    upline_six: user.upline_six || 0,
    upline_seven: user.upline_seven || 0,
    upline_eight: user.upline_eight || 0,
    soft_delete: user.soft_delete,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  console.log(userData)

  res.status(200).json({ success: true, message: "Login successful", payload: { token, user: userData } });
}));



/**
 * @route   POST /users/token/login
 * @desc    Login user with email and password
 * @access  Public
 */
router.post('/token/login', asyncHandler(async (req, res) => {
  const { token } = req.body;
  try {

    const secretKey = 'af9843wiejflakq2#$afsd'; // keep this secret and secure

    if (!token) {
      return res.status(400).json({ success: false, message: "Token is required" });
    }
    // Sign the payload to create a token (optionally set expiration, etc.)
    const decoded = jwt.verify(token, secretKey);
    console.log(decoded); // verified payload
    const { email, password } = decoded;
    // Check if fields are provided
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // Find user by email
    const user = await users.findOne({ where: { email: decoded.email, role: "user" } });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Send minimal user data 
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      country: user.country,
      subscription_level: user.subscription_level,
      role: user.role,
      invited_by: user.invited_by,
      referral_code: user.referral_code,
      status: user.status,
      total_balance: user.total_balance || 0,
      available_balance: user.available_balance || 0,
      missed_balance: user.missed_balance || 0,
      withdrawal_balance: user.withdrawal_balance || 0,
      total_income: user.total_income || 0,
      direct_income: user.direct_income || 0,
      level_income: user.level_income || 0,
      leadership_income: user.leadership_income || 0,
      profile_image: user.profile_image,
      reward_income: user.reward_income || 0,
      weekly_reward: user.weekly_reward || 0,
      monthly_salary: user.monthly_salary || 0,
      total_direct: user.total_direct || 0,
      active_direct: user.active_direct || 0,
      total_team: user.total_team || 0,
      active_team: user.active_team || 0,
      upline_one: user.upline_one || 0,
      upline_two: user.upline_two || 0,
      upline_three: user.upline_three || 0,
      upline_four: user.upline_four || 0,
      upline_five: user.upline_five || 0,
      upline_six: user.upline_six || 0,
      upline_seven: user.upline_seven || 0,
      upline_eight: user.upline_eight || 0,
      soft_delete: user.soft_delete,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // console.log(userData)

    res.status(200).json({ success: true, message: "Login successful", payload: { token, user: userData } });

  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
}));



/**
 * @route   PUT /users/direct/get/:id
 * @desc    Get user direct Referrals 
 * @access  Public
 */
router.get("/direct/get/:id", asyncHandler(async (req, res) => {
  const user = await users.findByPk(req.params.id);

  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  const directReferrals = await users.findAll({
    where: { invited_by: user.id },
  });

  res.json({ success: true, payload: directReferrals });
}));



/**
 * @route   PUT /users/update/:id
 * @desc    Update user details
 * @access  Public
 */
router.put("/update/:id", [
  body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('phone').isMobilePhone().optional().withMessage('Invalid phone number'),
  body('country').isLength({ min: 1 }).withMessage('Country is required'),
  body('subscription_level').isNumeric().optional().withMessage('Subscription level must be a number'),
  // Add more validation rules as needed
], asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate the incoming request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Invalid input', errors: errors.array() });
  }

  try {
    const user = await users.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const reqdata = req.body;

    // Prepare the body for update
    const body = {
      name: reqdata.name || user.name,
      phone: reqdata.phone || user.phone,
      email: reqdata.email || user.email,
      country: reqdata.country || user.country,
      subscription_level: reqdata.subscription_level != null ? parseFloat(reqdata.subscription_level) : user.subscription_level,
      status: reqdata.status || user.status,
      total_balance: reqdata.total_balance != null ? parseFloat(reqdata.total_balance) : user.total_balance,
      available_balance: reqdata.available_balance != null ? parseFloat(reqdata.available_balance) : user.available_balance,
      missed_balance: reqdata.missed_balance != null ? parseFloat(reqdata.missed_balance) : user.missed_balance,
      withdrawal_balance: reqdata.withdrawal_balance != null ? parseFloat(reqdata.withdrawal_balance) : user.withdrawal_balance,
      total_income: reqdata.total_income != null ? parseFloat(reqdata.total_income) : user.total_income,
      direct_income: reqdata.direct_income != null ? parseFloat(reqdata.direct_income) : user.direct_income,
      level_income: reqdata.level_income != null ? parseFloat(reqdata.level_income) : user.level_income,
      leadership_income: reqdata.leadership_income != null ? parseFloat(reqdata.leadership_income) : user.leadership_income,
      reward_income: reqdata.reward_income != null ? parseFloat(reqdata.reward_income) : user.reward_income,
      weekly_reward: reqdata.weekly_reward != null ? parseFloat(reqdata.weekly_reward) : user.weekly_reward,
      monthly_salary: reqdata.monthly_salary != null ? parseFloat(reqdata.monthly_salary) : user.monthly_salary,
      total_direct: reqdata.total_direct != null ? parseFloat(reqdata.total_direct) : user.total_direct,
      active_direct: reqdata.active_direct != null ? parseFloat(reqdata.active_direct) : user.active_direct,
      total_team: reqdata.total_team != null ? parseFloat(reqdata.total_team) : user.total_team,
      active_team: reqdata.active_team != null ? parseFloat(reqdata.active_team) : user.active_team
    }

    // Update the user in the database
    await user.update(body);

    res.status(200).json({ success: true, message: "User details updated successfully", payload: user });

  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}));



/**
 * @route   PATCH /users/name/update/:id
 * @desc    Update user Profile Name 
 * @access  Public
 */
router.patch("/name/update/:id", asyncHandler(async (req, res) => {
  const { name } = req.body;
  try {
    const user = await users.findByPk(req.params.id);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    await user.update({
      name: name || user.name,
    });

    res.status(200).json({ success: true, message: "Profile Name updated successfully", payload: user });
  } catch (error) {
    console.error("Error updating profile name:", error);
    res.status(500).json({ success: false, message: "Internal server error" });

  }
}));



/**
 * @route  PATCH /users/profile/update/:id
 * @desc   Update User Profile Image
 * @access Public
 */
router.patch("/profile/update/:id", asyncHandler(async (req, res) => {
  try {
    const user = await users.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const file = req.files ? req.files.file : null; // Assuming file is uploaded via form-data
    let imageUrl = null;

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
    }

    if (!imageUrl) {
      return res.status(400).json({ success: false, message: "Image upload failed" });
    }

    // Update the user profile image
    user.profile_image = imageUrl;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      profile_image: imageUrl
    });
  } catch (error) {
    console.error("Error updating profile image:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}));



/**
 * @route  PATCH /users/profile/update/:id
 * @desc   Update User Profile Image
 * @access Public
 */
router.delete("/profile/remove/update/:id", asyncHandler(async (req, res) => {
  try {
    const user = await users.findByPk(req.params.id);
    console.log("Profile image Remove method is working");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.profile_image) {
      return res.status(400).json({ success: false, message: "Profile image not found" });
    }

    const profile_image = JSON.parse(user.profile_image) || user.profile_image;

    // Remove image from ImageKit
    console.log(profile_image)
    await removeImageFromImagekit(profile_image.fileId);


    // Update the user profile image
    user.profile_image = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile image removed successfully",
      profile_image: null
    });
  } catch (error) {
    console.error("Error updating profile image:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}));



/**
 * @route  PATCH /users/approve/:id
 * @desc   Approve a user 
 * @access Admin Only
 */
router.patch("/approve/:id", asyncHandler(async (req, res) => {
  try {
    const user = await users.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Prevent redundant update if already approved
    if (user.status == "active") {
      return res.status(200).json({ success: true, message: "User is already Activated." });
    }

    user.status = "active";
    await user.save();

    return res.status(200).json({ success: true, message: "User is Activated." });
  } catch (error) {
    console.error("Activation error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}));



/**
 * @route  PATCH /users/password/update/:id
 * @desc   Update User Password
 * @access Public
 */
router.patch('/password/update/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { password, newPassword } = req.body;

  try {
    // Validate if the current password and new password are provided
    if (!password) {
      return res.status(400).json({ success: false, message: "Current password is required" });
    }

    if (!newPassword) {
      return res.status(400).json({ success: false, message: "New password is required" });
    }

    // Prevent setting the same password again
    if (password === newPassword) {
      return res.status(400).json({ success: false, message: "New password cannot be the same as the current password" });
    }


    // Validate the strength of the new password (at least 8 characters with letters and numbers)
    const passwordStrengthRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordStrengthRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters long and contain both letters and numbers",
      });
    }

    // Fetch user by ID
    const user = await users.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Validate if the current password matches the stored one
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect current password" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);



    const updatePasswordLogs = await password_logs.create({
      user_id: id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: password,
      hashed_password: user.password,

      new_password: newPassword,
      hashed_new_password: hashedPassword
    })



    // Update the password in the database
    user.password = hashedPassword;
    await user.save();


    return res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
}));



/**
 * @route  POST /users/reset/password/:id
 * @desc   Reset User Password
 * @access Admin
 */
router.post('/reset/password/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch user by ID
    const user = await users.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('12345678', salt);

    const updatePasswordLogs = await password_logs.create({
      user_id: id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: 'password',
      hashed_password: 'user.password',

      new_password: '12345678',
      hashed_new_password: hashedPassword
    })

    // Update the password in the database
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ success: true, message: "Password Reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
}));



/**
 * @route   DELETE /users/:id
 * @desc    Delete a user
 * @access  Admin
 */
router.delete("/delete/:id", asyncHandler(async (req, res) => {
  const user = await users.findByPk(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  await user.destroy();
  res.json({ success: true, message: "User deleted successfully" });
}));



module.exports = router;