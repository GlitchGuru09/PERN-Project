const pool = require('../../config/db');
const { logError, logSuccess } = require('../../services/errorLogger');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const createAdminUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert admin user into database
    const result = await pool.query(
      'INSERT INTO users (email, password, role, is_active, created_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING id, email, role, is_active, created_at',
      [email, hashedPassword, 'admin', true]
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    await logSuccess(`Admin user created successfully: ${email}`, req);
    return res.status(201).json({
      message: 'Admin user created successfully',
      token,
      user,
    });
  } catch (error) {
    await logError(error, req);
    res.status(500).json({ error: 'Unable to create user' });
  }
};

const loginAdminUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Check if user is active
    if (!user.is_active) {
      return res.status(403).json({ error: 'User account is inactive' });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    await logSuccess(`Admin user logged in: ${email}`, req);
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    await logError(error, req);
    res.status(500).json({ error: 'Unable to login' });
  }
};

module.exports = {
  createAdminUser,
  loginAdminUser,
};