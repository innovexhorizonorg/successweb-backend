/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - subscription_level
 *         - role
 *         - status
 *         - total_balance
 *         - available_balance
 *         - missed_balance
 *         - withdrawal_balance
 *         - total_income
 *         - level_income
 *         - leadership_income
 *         - reward_income
 *         - weekly_reward
 *         - monthly_salary
 *         - total_direct
 *         - active_direct
 *         - total_team
 *         - active_team
 *         - invited_by
 *         - upline_one
 *         - upline_two
 *         - upline_three
 *         - upline_four
 *         - upline_five
 *         - upline_six
 *         - upline_seven
 *         - upline_eight
 *         - soft_delete
 *       properties:
 *         id:
 *           type: integer
 *           format: int32
 *           description: Auto-incremented unique user ID (customized with +3 increment starting at 2000)
 *           example: 2003
 *         name:
 *           type: string
 *           maxLength: 255
 *           description: Full name of the user
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 255
 *           description: Unique email address of the user
 *           example: john.doe@example.com
 *         phone:
 *           type: string
 *           maxLength: 255
 *           description: Optional phone number
 *           example: "+1234567890"
 *         password:
 *           type: string
 *           maxLength: 255
 *           description: Hashed password string
 *           example: "$2b$10$EixZaYVK1fsbw1ZfbX3OXe..."
 *         subscription_level:
 *           type: integer
 *           description: Subscription level identifier, defaults to 0
 *           example: 1
 *         role:
 *           type: string
 *           enum: [admin, user]
 *           default: user
 *           description: Role of the user
 *           example: user
 *         status:
 *           type: string
 *           enum: [pending, active, inactive]
 *           default: pending
 *           description: Account status
 *           example: active
 *         total_balance:
 *           type: number
 *           format: float
 *           default: 0
 *           description: Total balance available for the user
 *           example: 1200.50
 *         available_balance:
 *           type: number
 *           format: float
 *           default: 0
 *           description: Balance available for withdrawal
 *           example: 850.00
 *         missed_balance:
 *           type: number
 *           format: float
 *           default: 0
 *           description: Missed balance amount
 *           example: 50.00
 *         withdrawal_balance:
 *           type: number
 *           format: float
 *           default: 0
 *           description: Balance requested for withdrawal
 *           example: 200.00
 *         total_income:
 *           type: number
 *           format: float
 *           default: 0
 *           description: Total income earned by the user
 *           example: 5000.00
 *         level_income:
 *           type: number
 *           format: float
 *           default: 0
 *           description: Income from user levels
 *           example: 1000.00
 *         leadership_income:
 *           type: number
 *           format: float
 *           default: 0
 *           description: Income from leadership bonuses
 *           example: 1500.00
 *         reward_income:
 *           type: number
 *           format: float
 *           default: 0
 *           description: Income from rewards
 *           example: 300.00
 *         weekly_reward:
 *           type: number
 *           format: float
 *           default: 0
 *           description: Weekly reward amount
 *           example: 75.00
 *         monthly_salary:
 *           type: number
 *           format: float
 *           default: 0
 *           description: Monthly salary amount
 *           example: 1200.00
 *         total_direct:
 *           type: integer
 *           default: 0
 *           description: Total number of direct referrals
 *           example: 10
 *         active_direct:
 *           type: integer
 *           default: 0
 *           description: Number of active direct referrals
 *           example: 8
 *         total_team:
 *           type: integer
 *           default: 0
 *           description: Total number of team members
 *           example: 50
 *         active_team:
 *           type: integer
 *           default: 0
 *           description: Number of active team members
 *           example: 45
 *         referral_code:
 *           type: string
 *           maxLength: 100
 *           nullable: true
 *           description: Unique referral code URL
 *           example: "successweb.pro/register?ref=002000"
 *         invited_by:
 *           type: string
 *           maxLength: 255
 *           description: Identifier of the inviter
 *           example: "John Doe"
 *         upline_one:
 *           type: integer
 *           default: 0
 *           description: Upline level 1 identifier
 *           example: 1001
 *         upline_two:
 *           type: integer
 *           default: 0
 *           description: Upline level 2 identifier
 *           example: 1002
 *         upline_three:
 *           type: integer
 *           default: 0
 *           description: Upline level 3 identifier
 *           example: 1003
 *         upline_four:
 *           type: integer
 *           default: 0
 *           description: Upline level 4 identifier
 *           example: 1004
 *         upline_five:
 *           type: integer
 *           default: 0
 *           description: Upline level 5 identifier
 *           example: 1005
 *         upline_six:
 *           type: integer
 *           default: 0
 *           description: Upline level 6 identifier
 *           example: 1006
 *         upline_seven:
 *           type: integer
 *           default: 0
 *           description: Upline level 7 identifier
 *           example: 1007
 *         upline_eight:
 *           type: integer
 *           default: 0
 *           description: Upline level 8 identifier
 *           example: 1008
 *         soft_delete:
 *           type: boolean
 *           default: false
 *           description: Soft delete flag for the user
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the user was created
 *           example: "2025-05-20T10:20:30Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the user was last updated
 *           example: "2025-05-21T12:30:40Z"
 */




// Retrieve all Users
/**
 * @swagger
 * /users/get:
 *   get:
 *     summary: Retrieve all users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: List of all users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 payload:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       404:
 *         description: No users found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: No users found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Internal server error message
 */


// Get direct referrals of a user by user ID
/**
 * @swagger
 * /direct/get/{id}:
 *   get:
 *     summary: Get direct referrals of a user by user ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user to get direct referrals for
 *     responses:
 *       200:
 *         description: List of direct referral users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 payload:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not found
 */


// Get User by ID
/**
 * @swagger
 * /users/get/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to retrieve
 *         schema:
 *           type: integer
 *           example: 2003
 *     responses:
 *       200:
 *         description: User found and returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 payload:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not found
 */


// Create a new User
/**
 * @swagger
 * /users/create:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the user
 *                 example: Jane Smith
 *               phone:
 *                 type: string
 *                 description: User's phone number
 *                 example: "+1234567890"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Unique email address of the user
 *                 example: jane.smith@example.com
 *               password:
 *                 type: string
 *                 description: User password (plaintext, will be hashed)
 *                 example: mysecretpassword
 *               invited_by:
 *                 type: integer
 *                 description: ID of the inviter user, defaults to 1
 *                 example: 2
 *               upline_one:
 *                 type: integer
 *                 description: Upline level 1 user ID (optional)
 *               upline_two:
 *                 type: integer
 *               upline_three:
 *                 type: integer
 *               upline_four:
 *                 type: integer
 *               upline_five:
 *                 type: integer
 *               upline_six:
 *                 type: integer
 *               upline_seven:
 *                 type: integer
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 payload:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - missing required fields or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Email is required / User already exists with the provided email
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Server error
 */


// Authenticate user and login
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Authenticate user and login
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *                 description: User email address
 *               password:
 *                 type: string
 *                 example: mypassword123
 *                 description: User password (plaintext)
 *     responses:
 *       200:
 *         description: Login successful, returns user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 payload:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 2003
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *                     phone:
 *                       type: string
 *                       example: "+1234567890"
 *                     subscription_level:
 *                       type: integer
 *                       example: 1
 *                     role:
 *                       type: string
 *                       example: user
 *                     invited_by:
 *                       type: string
 *                       example: "1"
 *                     referral_code:
 *                       type: string
 *                       example: successweb.pro/register?ref=002003
 *                     status:
 *                       type: string
 *                       example: active
 *                     total_balance:
 *                       type: number
 *                       format: float
 *                       example: 1000.0
 *                     available_balance:
 *                       type: number
 *                       format: float
 *                       example: 800.0
 *                     missed_balance:
 *                       type: number
 *                       format: float
 *                       example: 50.0
 *                     withdrawal_balance:
 *                       type: number
 *                       format: float
 *                       example: 150.0
 *                     total_income:
 *                       type: number
 *                       format: float
 *                       example: 5000.0
 *                     level_income:
 *                       type: number
 *                       format: float
 *                       example: 1200.0
 *                     leadership_income:
 *                       type: number
 *                       format: float
 *                       example: 1000.0
 *                     reward_income:
 *                       type: number
 *                       format: float
 *                       example: 300.0
 *                     weekly_reward:
 *                       type: number
 *                       format: float
 *                       example: 75.0
 *                     monthly_salary:
 *                       type: number
 *                       format: float
 *                       example: 1000.0
 *                     total_direct:
 *                       type: integer
 *                       example: 10
 *                     active_direct:
 *                       type: integer
 *                       example: 8
 *                     total_team:
 *                       type: integer
 *                       example: 50
 *                     active_team:
 *                       type: integer
 *                       example: 45
 *                     upline_one:
 *                       type: integer
 *                       example: 1001
 *                     upline_two:
 *                       type: integer
 *                       example: 1002
 *                     upline_three:
 *                       type: integer
 *                       example: 1003
 *                     upline_four:
 *                       type: integer
 *                       example: 1004
 *                     upline_five:
 *                       type: integer
 *                       example: 1005
 *                     upline_six:
 *                       type: integer
 *                       example: 1006
 *                     upline_seven:
 *                       type: integer
 *                       example: 1007
 *                     upline_eight:
 *                       type: integer
 *                       example: 1008
 *                     soft_delete:
 *                       type: boolean
 *                       example: false
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-20T10:20:30Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-21T12:30:40Z"
 *       400:
 *         description: Email and password are required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Email and password are required
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid email or password
 */


// Approve (activate) a user by ID
/**
 * @swagger
 * /users/approve/{id}:
 *   patch:
 *     summary: Approve (activate) a user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to activate
 *         schema:
 *           type: integer
 *           example: 2003
 *     responses:
 *       200:
 *         description: User activated successfully or was already active
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User is Activated.
 *       404:
 *         description: User not found with the specified ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error during activation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */



