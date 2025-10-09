import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Import Convex client
import { ConvexProvider, ConvexReactClient } from "convex/react";

// Get Convex URL from environment variables
const convex = new ConvexReactClient(process.env.REACT_APP_CONVEX_URL);
// Provide the JWT from localStorage to Convex so server-side ctx.auth works
convex.setAuth(async () => {
  try {
    const token = localStorage.getItem("jwtToken");
    return token || null;
  } catch {
    return null;
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ConvexProvider client={convex}> {/* Wrap App with ConvexProvider */}
      <App />
    </ConvexProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
