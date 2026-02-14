import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReferralEmailForm from './ReferralEmailForm';
import EmailResult from './EmailResult';
import './css/Editor.css';
import './css/Loading.css';

const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://coldmailer-wy4n.onrender.com/api' 
  : 'http://localhost:5000/api';

const ReferralEmailComposer = ({ 
  generatedEmail, 
  setGeneratedEmail, 
  loading, 
  setLoading, 
  error, 
  setError 
}) => {
  const [templates, setTemplates] = useState([
    {
      id: 'default',
      name: 'Default Template',
      description: 'Professional referral email template'
    },
    {
      id: 'formal',
      name: 'Formal',
      description: 'Professional and respectful approach'
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Engaging and memorable approach'
    },
    {
      id: 'direct',
      name: 'Direct',
      description: 'Concise and to the point'
    }
  ]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('default');

  // If you want to fetch templates from backend, uncomment this:
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setTemplatesLoading(true);
      const response = await axios.get(`${API_BASE}/referral-templates`);
      if (response.data.templates && response.data.templates.length > 0) {
        setTemplates(response.data.templates);
      }
    } catch (error) {
      console.error('Error fetching referral templates:', error);
      // Keep default templates if fetch fails
    } finally {
      setTemplatesLoading(false);
    }
  };
  

  return (
    <>
      <div className="editor-container">
        <div className="editor-header">
          <div className="editor-title">
            <span>🤝</span>
            AI Referral Composer
          </div>
          {/* <div className="editor-subtitle">
            Craft professional referral emails. Just upload/paste the JD - AI will extract company & position details automatically!
          </div> */}
        </div>

        <ReferralEmailForm 
          templates={templates}
          templatesLoading={templatesLoading}
          loading={loading}
          setLoading={setLoading}
          error={error}
          setError={setError}
          setGeneratedEmail={setGeneratedEmail}
          API_BASE={API_BASE}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
        />
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <h3>🤖 AI is Analyzing the Job Description</h3>
            <p>Extracting company name, position, and job ID... Then crafting the perfect referral email!</p>
          </div>
        </div>
      )}

      {/* Generated Email Display */}
      {generatedEmail && (
        <EmailResult 
          generatedEmail={generatedEmail}
          templates={templates}
          selectedTemplate={selectedTemplate}
        />
      )}
    </>
  );
};

export default ReferralEmailComposer;