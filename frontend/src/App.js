import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import EmailComposer from './components/EmailComposer';
import ReferralEmailComposer from './components/ReferralEmailComposer';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('cold-email');

  // Clear email when switching modes
  const handleModeChange = (newMode) => {
    if (mode !== newMode) {
      setGeneratedEmail('');
      setError('');
      setMode(newMode);
    }
  };

  return (
    <div className="App">
      <Navbar />
      <Hero />
      
      {/* Mode Toggle */}
      <div className="mode-toggle-container">
        <div className="mode-toggle">
          <button 
            className={`mode-btn ${mode === 'cold-email' ? 'active' : ''}`}
            onClick={() => handleModeChange('cold-email')}
          >
            📧 Direct Application
          </button>
          <button 
            className={`mode-btn ${mode === 'referral-email' ? 'active' : ''}`}
            onClick={() => handleModeChange('referral-email')}
          >
            🤝 Ask for Referral
          </button>
        </div>
        <div className="mode-description">
          {mode === 'cold-email' 
            ? "Generate professional emails to apply directly to companies"
            : "Create referral request emails to ask your connections for referrals"}
        </div>
      </div>

      <div className="container">
        {mode === 'cold-email' ? (
          <EmailComposer 
            generatedEmail={generatedEmail}
            setGeneratedEmail={setGeneratedEmail}
            loading={loading}
            setLoading={setLoading}
            error={error}
            setError={setError}
          />
        ) : (
          <ReferralEmailComposer 
            generatedEmail={generatedEmail}
            setGeneratedEmail={setGeneratedEmail}
            loading={loading}
            setLoading={setLoading}
            error={error}
            setError={setError}
          />
        )}
      </div>

      <Footer />
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;