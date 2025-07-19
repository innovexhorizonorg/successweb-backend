/**
 * @swagger
 * components:
 *   schemas:
 *     Subscription:
 *       type: object
 *       required:
 *         - user_id
 *         - amount
 *         - subscription_type
 *         - subscription_plan
 *         - old_level
 *         - subscription_level
 *         - status
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: integer
 *           format: int32
 *           description: Auto-incremented unique subscription ID
 *           example: 101
 *         user_id:
 *           type: integer
 *           format: int32
 *           description: ID of the user owning this subscription
 *           example: 2003
 *         amount:
 *           type: number
 *           format: float
 *           description: Subscription payment amount
 *           example: 99.99
 *         subscription_type:
 *           type: string
 *           maxLength: 50
 *           description: Type of subscription (e.g., "initial_payment", "commission")
 *           example: initial_payment
 *         subscription_plan:
 *           type: string
 *           maxLength: 50
 *           description: Subscription plan name (millionare, billionaire, billionaire_plus, trillionaire)
 *           example: billionaire
 *         old_level:
 *           type: string
 *           enum:
 *             - '0'
 *             - '1'
 *             - '2'
 *             - '3'
 *           description: Previous subscription level
 *           example: '0'
 *         subscription_level:
 *           type: string
 *           enum:
 *             - '0'
 *             - '1'
 *             - '2'
 *             - '3'
 *           description: Current subscription level
 *           example: '1'
 *         status:
 *           type: string
 *           enum:
 *             - active
 *             - inactive
 *           default: inactive
 *           description: Subscription status
 *           example: active
 *         imageUrl:
 *           type: string
 *           maxLength: 500
 *           nullable: true
 *           description: URL to subscription image
 *           example: "https://example.com/images/subscription_101.png"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of subscription creation
 *           example: "2025-05-20T10:20:30Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of last subscription update
 *           example: "2025-05-21T12:30:40Z"
 */





/**
 * @swagger
 * /subscriptions/create/{user_id}:
 *   post:
 *     summary: Create a subscription for a user
 *     tags:
 *       - Subscriptions
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2003
 *         description: ID of the user for whom subscription is created
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - subscription_type
 *               - subscription_level
 *             properties:
 *               amount:
 *                 type: number
 *                 format: float
 *                 description: Subscription payment amount
 *                 example: 99.99
 *               subscription_type:
 *                 type: string
 *                 description: Type of subscription ("direct" or "indirect")
 *                 enum: [direct, indirect]
 *                 example: indirect
 *               subscription_level:
 *                 type: string
 *                 description: Subscription level ("0", "1", "2", "3")
 *                 example: "1"
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image file required only if subscription_type is "indirect"
 *     responses:
 *       201:
 *         description: Subscription created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Subscription created successfully
 *                 transaction:
 *                   $ref: '#/components/schemas/Subscription'
 *       400:
 *         description: Bad request due to validation error or pending subscription
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User already has a pending subscription / Image is required / File size should not exceed 200KB / Insufficient balance to Activate this Plan
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
 *                   example: User with id 2003 not found
 *       500:
 *         description: Internal server error while creating subscription
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 error:
 *                   type: string
 *                   example: Detailed error message
 */




/**
 * @swagger
 * /subscriptions/approve/update/{user_id}/{subscription_id}:
 *   patch:
 *     summary: Activate a user's subscription
 *     tags:
 *       - Subscriptions
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2003
 *         description: ID of the user owning the subscription
 *       - in: path
 *         name: subscription_id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 101
 *         description: ID of the subscription to activate
 *     responses:
 *       200:
 *         description: Subscription activated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Subscription activated successfully
 *       400:
 *         description: Subscription is already active
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Subscription is already active
 *       404:
 *         description: Subscription not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Subscription not found
 *       500:
 *         description: Internal server error during subscription update
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 error:
 *                   type: string
 *                   example: Detailed error message
 */
