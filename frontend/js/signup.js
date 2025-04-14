document.getElementById('signupForm').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value.trim();
  
    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        return alert(data.message || 'Signup failed');
      }
  
      alert('Signup successful! Please login.');
      window.location.href = 'login.html';
  
    } catch (err) {
      alert('Error signing up');
      console.error(err);
    }
  });
  