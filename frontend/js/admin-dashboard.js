document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      alert("Unauthorized. Please login first.");
      window.location.href = "login.html";
      return;
    }
  
    fetchUsers();
  
    async function fetchUsers() {
      try {
        const res = await fetch('http://localhost:5001/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        const data = await res.json();
  
        if (data.users && Array.isArray(data.users)) {
          const users = data.users;
          const tableBody = document.querySelector('#usersTable tbody');
          tableBody.innerHTML = '';
  
          users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${user.name}</td>
              <td>${user.email}</td>
              <td>${user.role}</td>
              <td>
                <button onclick="viewTransactions(${user.id}, '${user.email}')">View Transactions</button>
                <button onclick="deleteUser(${user.id})">Delete</button>
              </td>
            `;
            tableBody.appendChild(row);
          });
        } else {
          console.error("Expected an array inside 'users' but received:", data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        alert('Failed to fetch users');
      }
    }
  
    window.viewTransactions = async function (userId, userEmail) {
      try {
        const res = await fetch(`http://localhost:5001/api/admin/users/${userId}/transactions`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        const transactionsSection = document.getElementById('transactionsSection');
        const userEmailElement = document.getElementById('userEmail');
        const transactionTable = document.getElementById('transactionsTable');
        const tbody = transactionTable.querySelector('tbody');
  
        // Clear table and update email
        tbody.innerHTML = '';
        userEmailElement.innerText = userEmail;
        transactionsSection.style.display = 'block';
  
        if (!res.ok) {
          throw new Error('Failed to fetch transactions');
        }
  
        const data = await res.json();
  
        if (data.transactions && data.transactions.length > 0) {
          transactionTable.style.display = 'table';
  
          data.transactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${transaction.type}</td>
              <td>${transaction.amount}</td>
              <td>${transaction.created_at}</td>
            `;
            tbody.appendChild(row);
          });
        } else {
          const messageRow = document.createElement('tr');
          messageRow.innerHTML = `
            <td colspan="3" style="text-align:center; color: gray;">
              No transactions found for this user.
            </td>`;
          tbody.appendChild(messageRow);
        }
  
      } catch (error) {
        console.error('Error fetching transactions:', error);
        alert('Error fetching transactions. Please try again later.');
      }
    };
  
    window.deleteUser = async function (userId) {
      if (confirm("Are you sure you want to delete this user?")) {
        try {
          const res = await fetch(`http://localhost:5001/api/admin/users/${userId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
          });
          const msg = await res.json();
          alert(msg.message);
          fetchUsers();
        } catch (error) {
          console.error('Error deleting user:', error);
          alert('Failed to delete user.');
        }
      }
    };
  
    window.logout = function () {
      localStorage.clear();
      window.location.href = 'login.html';
    };
  });
  