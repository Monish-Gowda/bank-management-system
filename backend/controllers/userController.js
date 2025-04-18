const db = require('../db'); 
const { validationResult } = require('express-validator');


//deposit 
exports.deposit = (req, res) => {
    const { amount } = req.body;
    const userId = req.user.id;
  
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Please provide a valid amount.' });
    }
  
    // Update balance in the database
    const query = `UPDATE users SET balance = balance + ? WHERE id = ?`;
    db.query(query, [amount, userId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Server error during deposit.' });
      }
  
      // Retrieve the updated balance after deposit
      const balanceQuery = `SELECT balance FROM users WHERE id = ?`;
      db.query(balanceQuery, [userId], (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Error fetching updated balance.' });
        }
  
        const updatedBalance = parseFloat(result[0].balance);
        if (isNaN(updatedBalance)) {
          return res.status(500).json({ message: 'Invalid balance after deposit.' });
        }
  
        // Log the transaction
        const transactionQuery = `INSERT INTO transactions (user_id, type, amount) VALUES (?, 'deposit', ?)`;
        db.query(transactionQuery, [userId, amount], (err, result) => {
          if (err) {
            return res.status(500).json({ message: 'Error logging transaction' });
          }
  
          res.status(200).json({
            message: 'Deposit successful',
            newBalance: updatedBalance.toFixed(2), // Ensure balance is returned as a fixed decimal
          });
        });
      });
    });
  };
  
//withdrawals

exports.withdraw = (req, res) => {
    const { amount } = req.body;
    const userId = req.user.id;
  
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Please provide a valid amount.' });
    }
  
    
    const query = `SELECT balance FROM users WHERE id = ?`;
    db.query(query, [userId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Server error during withdrawal.' });
      }
     
      const user = result[0];
      console.log(user.balance);
      const amount = parseFloat(req.body.amount);
      if (user.balance < amount) {
        return res.status(400).json({ message: 'Insufficient funds.' });
      }
  
      
      const updateBalanceQuery = `UPDATE users SET balance = balance - ? WHERE id = ?`;
      db.query(updateBalanceQuery, [amount, userId], (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Error updating balance.' });
        }
  
       
        const transactionQuery = `INSERT INTO transactions (user_id, type, amount) VALUES (?, 'withdrawal', ?)`;
        db.query(transactionQuery, [userId, amount], (err, result) => {
          if (err) {
            return res.status(500).json({ message: 'Error logging transaction' });
          }
  
          res.status(200).json({
            message: 'Withdrawal successful.',
            newBalance: (parseFloat(user.balance) - amount).toFixed(2),
          });
        });
      });
    });
  };
  exports.getBalance = (req, res) => {
    const userId = req.user.id; 
  
    const query = 'SELECT balance FROM users WHERE id = ?';
    db.query(query, [userId], (err, result) => {
      if (err) {
        console.error("Error fetching balance:", err);
        return res.status(500).json({ message: 'Server error' });
      }
  
      if (result.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      
      res.status(200).json({ balance: result[0].balance });
    });
  };

  // Transaction History Route
exports.transactionHistory = (req, res) => {
    const userId = req.user.id;
  
    const query = `SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC`;
    db.query(query, [userId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching transaction history.' });
      }
  
      res.status(200).json({
        transactions: result,
      });
    });
  };
  

