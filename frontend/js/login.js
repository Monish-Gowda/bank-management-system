document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
  
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        return alert(data.message || 'Login failed');
      }
  
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
  
      
      const role = data.user.role;
      if (role === 'admin') {
        window.location.href = 'admin-dashboard.html';
      } else if (role === 'user') {
        window.location.href = 'user-dashboard.html';
      } else {
        alert('Unknown role. Please contact support.');
      }
  
    } catch (err) {
      alert('Error logging in');
      console.error(err);
    }
  });
  