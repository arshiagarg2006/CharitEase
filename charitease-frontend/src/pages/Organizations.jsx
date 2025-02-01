import React from 'react';

function Organizations() {
  const organizations = [
    { name: 'Local Food Bank', description: 'Helping feed families in need.' },
    { name: 'Clothing for All', description: 'Donating clothes to the homeless.' },
    { name: 'Toys for Tots', description: 'Providing toys to children in need.' },
  ];

  return (
    <div>
      <h2>Our Trusted Organizations</h2>
      <ul>
        {organizations.map((org, index) => (
          <li key={index}>
            <h3>{org.name}</h3>
            <p>{org.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Organizations;
