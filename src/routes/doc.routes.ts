import app from '../app';
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and account management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       properties:
 *         username or email:
 *           type: string
 *         password:
 *           type: string
 *       required:
 *         - username
 *         - password
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     description: Logs in a registered user and returns an authentication token.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
app.post('/auth/login', (req, res) => {
    // Your existing route logic
});

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *       required:
 *         - username
 *         - email
 *         - password
 */

/**
 * @swagger
 * /auth/register:
 *  post:
 *   summary: Register a new user
 *  description: Register a new user with the system
 *  requestBody:
 *   content:
 *   application/json:
 *   schema:
 *   $ref: '#/components/schemas/RegisterRequest'
 * responses:
 * 200:
 * description: User created
 * 400:
 * description: Invalid request body
 * 500:
 * description: Internal server error
 * 409:
 * description: Username or email already exists
 * 401:
 * description: Unauthorized
 * 403:
 * description: Forbidden
 * 404:
 * description: Not found
 * 422:
 * description: Unprocessable entity
 * 503:
 *
 * description: Service unavailable
 */
app.post('/auth/register', (req, res) => {
    // Your existing route logic    
});
/**
 * @swagger
 * components:
 *   schemas:
 *     VerifyEmailRequest:
 *       type: object
 *       properties:
 *         verifyToken:
 *           type: string
 *       required:
 *         - verifyToken
 */