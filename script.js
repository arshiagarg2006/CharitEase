document.getElementById("donation-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const itemDescription = document.getElementById("item").value;
    alert(`Thank you for donating: ${itemDescription}`);
    document.getElementById("item").value = "";  // Clear the input field
  });
  