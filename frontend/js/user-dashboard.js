document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      alert("Unauthorized. Please login first.");
      window.location.href = "login.html";
      return;
    }
    fetchTransactions();
    // Decode the JWT token to extract user info
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    const userId = decodedPayload.id;
    const userName = decodedPayload.name || 'User';
  
    // Display user name
    document.getElementById('welcomeMessage').textContent = `Welcome, ${userName}`;
  
    // Fetch balance and transactions
    fetchBalance();
   
    // Toggle between Deposit and Withdraw forms
    window.toggleSection = function (type) {
      document.getElementById("depositSection").style.display = type === 'deposit' ? 'block' : 'none';
      document.getElementById("withdrawSection").style.display = type === 'withdraw' ? 'block' : 'none';
    };
  
    // Handle deposit
    window.makeDeposit = async function () {
      const amount = document.getElementById("depositAmount").value;
  
      if (!amount || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
      }
  
      const res = await fetch("http://localhost:5001/api/user/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount })
      });
  
      const data = await res.json();
      alert(data.message || "Deposit complete");
      fetchBalance();
      fetchTransactions(); // Refresh
      document.getElementById("depositAmount").value = '';
    };
  
    // Handle withdrawal
    window.makeWithdrawal = async function () {
      const amount = document.getElementById("withdrawAmount").value;
  
      if (!amount || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
      }
  
      const res = await fetch("http://localhost:5001/api/user/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount })
      });
  
      const data = await res.json();
      alert(data.message || "Withdrawal complete");
      fetchBalance();
      fetchTransactions(); // Refresh
      document.getElementById("withdrawAmount").value = '';
    };
  
    // Fetch and display balance
    async function fetchBalance() {
      try {
        const res = await fetch("http://localhost:5001/api/user/balance", {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        if (!res.ok) throw new Error("Could not fetch balance");
  
        const data = await res.json();
        document.getElementById("balanceDisplay").textContent = `Balance: ₹${parseFloat(data.balance).toFixed(2)}`;
      } catch (err) {
        console.error("Error fetching balance:", err);
      }
    }
  
    // Fetch and display transactions
    async function fetchTransactions() {
      try {
        const res = await fetch("http://localhost:5001/api/user/transactions", {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        const data = await res.json();
        const tbody = document.querySelector("#transactionsTable tbody");
        const noMsg = document.getElementById("noTransactionsMessage");
  
        tbody.innerHTML = "";
  
        if (data.transactions && data.transactions.length > 0) {
          noMsg.style.display = "none";
          data.transactions.forEach(tx => {
            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${tx.type}</td>
              <td>${tx.amount}</td>
              <td>${new Date(tx.created_at).toLocaleString()}</td>
            `;
            tbody.appendChild(row);
          });
        } else {
          noMsg.style.display = "block";
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }
  
    // Logout function
    window.logout = function () {
      localStorage.clear();
      window.location.href = "login.html";
    };
  });
  