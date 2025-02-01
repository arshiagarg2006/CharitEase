import { Link } from "react-router-dom";  // Importing Link for navigation

export default function Home() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Welcome to Donor</h1>
      <p>Donate items to trusted organizations from the comfort of your home.</p>
      <Link to="/donate">
        <button style={{ padding: "10px 20px", fontSize: "16px" }}>Donate Now</button>
      </Link>
    </div>
  );
}
