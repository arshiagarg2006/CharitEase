import { Routes, Route } from "react-router-dom";  // Importing React Router's Routes and Route components
import Home from "./pages/Home";  // Importing the Home page
import Donate from "./pages/Donate";  // Importing the Donate page
import Organizations from "./pages/Organizations";  // Importing the Organizations page

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />  {/* Home page */}
      <Route path="/donate" element={<Donate />} />  {/* Donate page */}
      <Route path="/organizations" element={<Organizations />} />  {/* Organizations page */}
    </Routes>
  );
}

export default App;
