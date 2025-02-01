import React, { useState } from 'react';

function Donate() {
  const [itemCategory, setItemCategory] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [image, setImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleDonateSubmit = () => {
    // Add logic to send the donation details to the backend (this is just a basic implementation)
    console.log({
      itemCategory,
      itemDescription,
      image,
    });
    alert('Donation details submitted!');
  };

  return (
    <div>
      <h2>Donate Items</h2>
      <form onSubmit={handleDonateSubmit}>
        <div>
          <label>
            Item Category:
            <input
              type="text"
              value={itemCategory}
              onChange={(e) => setItemCategory(e.target.value)}
              placeholder="Enter item category (e.g., Clothes, Toys, etc.)"
            />
          </label>
        </div>
        <div>
          <label>
            Item Description:
            <textarea
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              placeholder="Describe your items"
            />
          </label>
        </div>
        <div>
          <label>
            Upload Image:
            <input type="file" onChange={handleImageUpload} />
            {image && <img src={image} alt="Item" width="100" />}
          </label>
        </div>
        <button type="submit">Submit Donation</button>
      </form>
    </div>
  );
}

export default Donate;