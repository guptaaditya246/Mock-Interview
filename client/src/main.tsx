// import { createRoot } from "react-dom/client";
// import App from "./App";
// import "./index.css";
// console.log("%c.NET Mock Interview Questions", "color: #00ff88; font-size: 20px; font-weight: bold;");
// console.log("%cBuilt by @thelifesyntax", "color: #ffcc00; font-size: 14px;");
// console.log("%chttps://mock-interview-0mfe.onrender.com", "color: #ffffff;");
// createRoot(document.getElementById("root")!).render(<App />);


// client/src/main.tsx
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";  

console.log("%c.NET Mock Interview Questions", "color: #00ff88; font-size: 20px; font-weight: bold;");
console.log("%cBuilt by @thelifesyntax", "color: #ffcc00; font-size: 14px;");
console.log("%chttps://www.mockdotnet.dev", "color: #ffffff;");


createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);