import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './App.css';

function App() {
  const location = useLocation();

  const shouldShowMessage = 
    location.pathname === '/' || 
    location.pathname.startsWith('/games') || 
    location.pathname === '/credits';

  useEffect(() => {
    // console.log('Current URL:', location.pathname);
  }, [location]);

  return shouldShowMessage ? (
    <div className="app-container">
      <div className="message-box">
        <h1 className="title">Redirect Notice</h1>
        <p className="redirect-info">
          For a better experience, please visit: 
          <a href="https://games.x45k.dev" target="_blank" rel="noopener noreferrer" className="redirect-button">
            games.x45k.dev
          </a>
        </p>
      </div>
    </div>
  ) : null;
}

export default App;
