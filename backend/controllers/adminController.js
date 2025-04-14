const db = require('../db');


exports.viewAllUsers = (req, res) => {
  const query = 'SELECT id, name, email, phone, role, balance FROM users';
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching users.' });
    }

    res.status(200).json({ users: result });
  });
};


exports.viewUserTransactions = (req, res) => {
  const userId = req.params.userId; 

  const query = 'SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC';
  db.query(query, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching transaction history.' });
    }

    res.status(200).json({ transactions: result });
  });
};


exports.updateUserRole = (req, res) => {
  const { userId, role } = req.body; 
  if (!userId || !role) {
    return res.status(400).json({ message: 'User ID and role are required.' });
  }

  const validRoles = ['user', 'admin']; 
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role.' });
  }

  const query = 'UPDATE users SET role = ? WHERE id = ?';
  db.query(query, [role, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating user role.' });
    }

    res.status(200).json({ message: 'User role updated successfully.' });
  });
};

exports.deleteUserAccount = (req, res) => {
  const userId = req.params.userId;

  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting user account.' });
    }

    res.status(200).json({ message: 'User account deleted successfully.' });
  });
};
