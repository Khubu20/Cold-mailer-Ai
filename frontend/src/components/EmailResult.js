import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/Results.css";

const EmailResult = ({ generatedEmail, templates, selectedTemplate }) => {
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(generatedEmail)
      .then(() => {
        toast.success("✨ Email copied to clipboard!", {
          style: {
            background: "#fff",
            color: "#1e293b",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            fontSize: "15px",
            fontWeight: "500",
            padding: "14px 16px",
            maxWidth: "380px",
            border: "1px solid #10B981",
          },
          progressStyle: {
            background: "#10B981",
            height: "4px",
            borderRadius: "0 0 12px 12px",
          },
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast.error("❌ Failed to copy to clipboard. Please copy manually.", {
          style: {
            background: "#fff",
            color: "#1e293b",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            fontSize: "15px",
            fontWeight: "500",
            padding: "14px 16px",
            maxWidth: "380px",
            border: "1px solid #EF4444",
          },
          progressStyle: {
            background: "#EF4444",
            height: "4px",
            borderRadius: "0 0 12px 12px",
          },
        });
      });
  };

  const openInEmail = () => {
    const lines = generatedEmail.split("\n");
    let subject = "Job Application";
    let body = generatedEmail;

    const subjectLine = lines.find((line) =>
      line.toLowerCase().includes("subject:")
    );
    if (subjectLine) {
      subject = subjectLine.replace(/subject:\s*/i, "").trim();
      body = lines
        .filter((line) => !line.toLowerCase().includes("subject:"))
        .join("\n");
    }

    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    const mailtoLink = `mailto:?subject=${encodedSubject}&body=${encodedBody}`;

    let secondsRemaining = 3;
    
    const toastId = toast.info(
      `📧 Opening your Gmail in ${secondsRemaining} seconds...`,
      {
        style: {
          background: "#fff",
          color: "#1e293b",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          fontSize: "15px",
          fontWeight: "500",
          padding: "14px 16px",
          maxWidth: "380px",
          border: "1px solid #6C63FF",
        },
        progressStyle: {
          background: "#6C63FF",
          height: "4px",
          borderRadius: "0 0 12px 12px",
        },
        autoClose: 3000,
        closeOnClick: false,
      }
    );

    // Update countdown every second
    const countdownInterval = setInterval(() => {
      secondsRemaining--;
      
      if (secondsRemaining > 0) {
        toast.update(toastId, {
          render: `📧 Opening your Gmail in ${secondsRemaining} second${secondsRemaining !== 1 ? 's' : ''}...`,
        });
      } else {
        clearInterval(countdownInterval);
        toast.update(toastId, {
          render: "🚀 Opening Gmail now...",
          autoClose: 1000,
        });
      }
    }, 1000);

    // Redirect after 3 seconds
    setTimeout(() => {
      clearInterval(countdownInterval);
      window.location.href = mailtoLink;
    }, 3000);
  };

  return (
    <div className="result-section">
      <div className="result-header">
        <div className="template-box">
          <h2>🎉 Email Ready!</h2>
          <span className="template-badge">
            🎨{" "}
            {templates.find((t) => t.id === selectedTemplate)?.name ||
              "Default Template"}
          </span>
        </div>
        <div className="result-actions">
          <div className="email-buttons">
            <button onClick={copyToClipboard} className="btn btn-success">
              📋 Copy to Clipboard
            </button>
            <button onClick={openInEmail} className="btn btn-primary">
              📧 Open in Email
            </button>
          </div>
        </div>
      </div>
      <div className="email-content">
        <pre>{generatedEmail}</pre>
      </div>
      <div className="result-footer">
        <p>
          💡 <strong>Pro tip:</strong> Review and personalize the email before
          sending. Add specific company details or projects you're proud of!
        </p>
      </div>
    </div>
  );
};

export default EmailResult;