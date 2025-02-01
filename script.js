// script.js
document.addEventListener('DOMContentLoaded', () => {
  console.log('The Donor App is running!');

  const donateButtons = document.querySelectorAll('.btn-secondary');
  donateButtons.forEach(button => {
    button.addEventListener('click', () => {
      alert('Thank you for your donation!');
    });
  });
});
