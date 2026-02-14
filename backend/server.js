const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "text/plain",
    "application/pdf",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only images, text files, and PDFs are allowed."
      ),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const emailTemplates = {
  formal: {
    name: "Formal",
    description: "Professional and traditional approach",
    prompt: `Write a formal job application email that highlights the candidate's relevant skills and experience matching the job description. Use professional language, proper business format, and maintain a respectful tone throughout. Include a clear subject line, proper salutation, structured body paragraphs, and professional closing.`,
  },
  creative: {
    name: "Creative",
    description: "Engaging and memorable approach",
    prompt: `Write a creative and engaging job application email that showcases the candidate's personality while maintaining professionalism. Make it memorable with a unique opening, showcase enthusiasm for the role, and use compelling language that stands out without being overly casual. Include specific examples of how the candidate's skills match the role.`,
  },
  direct: {
    name: "Direct",
    description: "Concise and to the point",
    prompt: `Write a direct and concise job application email that gets straight to the point. Focus on key qualifications and how they directly match the job requirements. Use clear, straightforward language, bullet points for key skills, and avoid unnecessary fluff while maintaining professionalism.`,
  },
  default: {
    name: "Standard",
    description: "Balanced professional approach",
    //     prompt: `Write a professional job application email and use the attached template (don't write more than this just write the blank names from the jd )

    //     Subject: Application for [Role Name] – [Company Name]
    //     Dear Hiring Manager (if name present than name),

    // I hope this email finds you well. I came across your post regarding the [Role Name] openings at [Company Name], and I would like to express my keen interest in this opportunity.

    // My name is Khushboo Gupta, and I am pursuing a Bachelor of Technology in Computer Science and Engineering, with a strong focus on Java Full-Stack Development. I have hands-on experience working with Java,Spring Core, OOPs, React.js, JavaScript, Tailwind CSS, MySQL, Docker, and Python, and I am passionate about building scalable, efficient, and user-friendly applications through practical projects and real-world problem solving.
    // I would welcome the opportunity to discuss how my technical skills and project experience align with your team’s requirements. I am also open to learning new technologies as needed.

    // I am a 2026 graduate and available for immediate joining.

    // Here are my links for reference:

    // Resume: https://drive.google.com/file/d/1ZvYo3SVca7QhZDLuAOn_DqqCetYNohRC/view?usp=drivesdk

  

    // Thank you for your time and consideration. I look forward to the possibility of connecting with you for a brief conversation this week.

    // Best regards,
    // Khushboo Gupta
    // Phone: 7089231359
    // Email: khubu.guptaa20@gmail.com

    //     .`,
    prompt: `
    Write a professional job application email and use the attached template (don't write more than this just write the blank names from the jd )Subject: Application for [Role Name]

Dear Hiring Manager,

I hope this email finds you well. I am writing to express my interest in the [Role Name] position at [Company Name].

My name is Khushboo Gupta, and I am pursuing a Bachelor of Technology in Computer Science and Engineering, with a strong focus on Java Full-Stack Development. I have hands-on experience working with Java,Spring Core,Spring Boot, Python,OOPs, React.js, JavaScript, Tailwind CSS, MySQL, PowerBI and I am passionate about building scalable, efficient, and user-friendly applications through practical projects and real-world problem solving.

As a 2025 Computer Science graduate, I am available for immediate joining and would welcome the opportunity to discuss how my technical skills and project experience can contribute to your team’s success.

Please find my details below for your reference:

Resume: https://drive.google.com/file/d/1ZvYo3SVca7QhZDLuAOn_DqqCetYNohRC/view?usp=drivesdk
Portfolio: https://portfolio-psi-five-62.vercel.app/

Thank you for your time and consideration. I would be glad to connect for a brief discussion at your convenience.

Warm regards,
Khushboo Gupta
7089231359
[khubu.gupta20@@gmail.com]`,
  },
};

// Email templates for referral requests
const referralTemplates = {
  formal: {
    name: "Formal",
    description: "Professional and respectful approach",
    prompt: `Write a formal referral request email. Use professional language, proper business format, and maintain a respectful tone throughout. Include a clear subject line, proper salutation, structured body paragraphs asking for referral, and professional closing.`,
  },
  creative: {
    name: "Creative",
    description: "Engaging and memorable approach",
    prompt: `Write a creative and engaging referral request email that showcases the candidate's personality while maintaining professionalism. Make it memorable with a unique opening, showcase enthusiasm for the role, and use compelling language that stands out without being overly casual.`,
  },
  direct: {
    name: "Direct",
    description: "Concise and to the point",
    prompt: `Write a direct and concise referral request email that gets straight to the point. Focus on key qualifications and how they directly match the job requirements. Use clear, straightforward language and avoid unnecessary fluff while maintaining professionalism.`,
  },
  default: {
    name: "Standard",
    description: "Balanced professional approach",
    prompt: `
    Write a professional job application email and use the attached template (don't write more than this just write the blank names from the jd )
    Hi [Name of person],

I hope you’re doing well.

I'm Khushboo Gupta, I am pursuing a Bachelor of Technology in Computer Science and Engineering from LNCT Bhopal.

I recently came across [position name] opening at [Company Name] (Req ID: R_329678) for 2026 B.Tech graduates in IT/Computer Science.

The role aligns well with my skillset in Java, JavaScript, OOP, SDLC, and  Java full-stack development, and I’m very interested in applying.
It would mean a lot if you could kindly refer me for this position.

Here’s my resume for your reference:
 https://drive.google.com/file/d/1ZvYo3SVca7QhZDLuAOn_DqqCetYNohRC/view?usp=drivesdk
Thank you so much for your time and support!

Best regards,
Khushboo Gupta
Email: khubu.gupta20@gmail.com`,
  },
};

const extractTextFromFile = async (filePath, mimetype) => {
  try {
    if (mimetype.startsWith("image/")) {
      return "Image file uploaded - please ensure the job description is clear and readable in the image.";
    } else if (mimetype === "application/pdf") {
      return "PDF file uploaded - processing text from PDF would be implemented in production.";
    } else if (mimetype === "text/plain") {
      return fs.readFileSync(filePath, "utf8");
    } else {
      return "File uploaded - content processing would be implemented based on file type.";
    }
  } catch (error) {
    throw new Error(`Error reading file: ${error.message}`);
  }
};

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Job Mail Generator API is running!",
    endpoints: {
      templates: "/api/templates",
      referralTemplates: "/api/referral-templates",
      generateEmail: "/api/generate-email",
      generateReferralEmail: "/api/generate-referral-email",
    },
  });
});

app.post("/api/generate-email", upload.single("file"), async (req, res) => {
  try {
    const { text, template = "default", userDetails } = req.body;
    const file = req.file;

    console.log("Direct application request received:", {
      hasText: !!text,
      hasFile: !!file,
      template,
      userDetailsLength: userDetails?.length,
    });

    if (!text && !file) {
      return res.status(400).json({
        success: false,
        error: "Either text description or file upload is required",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    let jobDescription = "";

    if (file) {
      console.log("Processing file:", file.originalname, file.mimetype);
      jobDescription = await extractTextFromFile(file.path, file.mimetype);

      fs.unlink(file.path, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    } else {
      jobDescription = text;
    }

    const selectedTemplate = emailTemplates[template] || emailTemplates.default;

    const prompt = `
      ${selectedTemplate.prompt}
      
      JOB DESCRIPTION:
      ${jobDescription}
      
      ${
        userDetails
          ? `CANDIDATE INFORMATION TO INCORPORATE:
      ${userDetails}`
          : ""
      }
      
      Please generate a complete email with:
      1. A compelling subject line
      2. Professional salutation
      3. Structured body paragraphs that:
         - Express interest in the position
         - Highlight relevant skills and experience
         - Show knowledge of the company (if implied in job description)
         - Connect candidate's qualifications to job requirements
      4. Professional closing with call to action
      5. Appropriate signature
      
      Make the email personalized, professional, and tailored to the specific job description.
      Format the response as a ready-to-use email.
    `;

    console.log("Sending request to Gemini AI for direct application...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const emailContent = response.text();

    console.log("Direct application email generated successfully");
    res.json({
      success: true,
      email: emailContent,
      templateUsed: template,
      templateName: selectedTemplate.name,
      isReferral: false,
    });
  } catch (error) {
    console.error("Error generating email:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate email",
      details: error.message,
    });
  }
});

app.post(
  "/api/generate-referral-email",
  upload.single("file"),
  async (req, res) => {
    try {
      const { text, template = "default", userDetails } = req.body;
      const file = req.file;

      console.log("Referral request received:", {
        hasText: !!text,
        hasFile: !!file,
        template,
        userDetailsLength: userDetails?.length,
      });

      if (!text && !file) {
        return res.status(400).json({
          success: false,
          error: "Either text description or file upload is required",
        });
      }

      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });

      let jobDescription = "";

      if (file) {
        console.log("Processing file:", file.originalname, file.mimetype);
        jobDescription = await extractTextFromFile(file.path, file.mimetype);

        fs.unlink(file.path, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      } else {
        jobDescription = text;
      }

      const selectedTemplate =
        referralTemplates[template] || referralTemplates.default;

      const prompt = `
      JOB DESCRIPTION:
      ${jobDescription}
      
      ${
        userDetails
          ? `CANDIDATE INFORMATION:
      ${userDetails}`
          : ""
      }
      
       Please generate a complete email with:
      1. A compelling subject line
      2. Professional salutation
      3. Structured body paragraphs that:
         - Express interest in the position
         - Highlight relevant skills and experience
         - Show knowledge of the company (if implied in job description)
         - Connect candidate's qualifications to job requirements
      4. Professional closing with call to action
      5. Appropriate signature
      
      Make the email personalized, professional, and tailored to the specific job description.
      Format the response as a ready-to-use email.
    `;

      console.log("Sending request to Gemini AI for referral email...");
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const emailContent = response.text();

      console.log("Referral email generated successfully");
      res.json({
        success: true,
        email: emailContent,
        templateUsed: template,
        templateName: selectedTemplate.name,
        isReferral: true,
      });
    } catch (error) {
      console.error("Error generating referral email:", error);
      res.status(500).json({
        success: false,
        error: "Failed to generate referral email",
        details: error.message,
      });
    }
  }
);

app.get("/api/templates", (req, res) => {
  const templatesList = Object.entries(emailTemplates).map(
    ([id, template]) => ({
      id,
      name: template.name,
      description: template.description,
    })
  );

  res.json({
    success: true,
    templates: templatesList,
  });
});

app.get("/api/referral-templates", (req, res) => {
  const templatesList = Object.entries(referralTemplates).map(
    ([id, template]) => ({
      id,
      name: template.name,
      description: template.description,
    })
  );

  res.json({
    success: true,
    templates: templatesList,
  });
});

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "File too large. Maximum size is 10MB.",
      });
    }
  }

  res.status(500).json({
    success: false,
    error: error.message || "Internal server error",
  });
});

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
});

app.listen(port, () => {
  console.log(`📧 Job Mail Generator API is ready!`);
  console.log(`🔗 http://localhost:${port}`);
});
