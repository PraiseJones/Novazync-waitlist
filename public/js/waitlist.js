document.getElementById('waitlistForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('emailInput').value;
  const successMessage = document.getElementById('successMessage');

  try {
      const response = await fetch('/api/waitlist/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
      });
      const data = await response.json();
      successMessage.textContent = data.message || data.error;
  } catch (error) {
      successMessage.textContent = 'An error occurred';
  }
});

document.getElementById('checkPositionButton').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const positionMessage = document.getElementById('positionMessage');

  try {
      const response = await fetch(`/api/waitlist/position/${email}`);
      const data = await response.json();
      positionMessage.textContent = data.position ? `Your position is: ${data.position}` : data.message;
  } catch (error) {
      positionMessage.textContent = 'An error occurred';
  }
});
