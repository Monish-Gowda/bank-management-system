// adminRoutes.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const {
  viewAllUsers,
  viewUserTransactions,
  updateUserRole,
  deleteUserAccount
} = require('../controllers/adminController');

// Route to view all users
router.get('/users', authMiddleware, adminMiddleware, viewAllUsers);

// Route to view a specific user's transactions
router.get('/users/:userId/transactions', authMiddleware, adminMiddleware, viewUserTransactions);

// Route to update a user's role (e.g., user to admin)
router.put('/users/role', authMiddleware, adminMiddleware, updateUserRole);

// Route to delete a user account
router.delete('/users/:userId', authMiddleware, adminMiddleware, deleteUserAccount);

module.exports = router;
