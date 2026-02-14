import React from 'react';
import './css/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>ColdMailer © 2025</p>
      {/* <p>khubu.gupta20@gmail.com</p> */}
      <a href='mailto:khubu.gupta20@gmail.com' className='footerMail'>khubu.gupta20@gmail.com</a>
    </footer>
  );
};

export default Footer;