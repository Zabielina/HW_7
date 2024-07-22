

const orderForm = document.getElementById('orderForm');
const messageDiv = document.getElementById('message');

orderForm.addEventListener('submit', async function(event) {
  event.preventDefault();

  const formData = new FormData(this);
  const feedback = {
    PhoneNumber: formData.get('PhoneNumber'),
    FirstName: formData.get('FirstName'),
    LastName: formData.get('LastName')
  };

  try {
    const response = await fetch('/api/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(feedback)
    });

    const result = await response.json();
    messageDiv.textContent = result.message;
  } catch (error) {
    console.error('Error:', error);
    messageDiv.textContent = 'Помилка під час відправлення замовлення';
  }
});
