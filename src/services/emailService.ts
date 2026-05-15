import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_id_here';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_id_here';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'public_key_here';

export const emailService = {
  /**
   * Sends credentials to a new user
   * @param toEmail The recipient's email address
   * @param name The recipient's name
   * @param username The assigned username
   * @param password The assigned password
   */
  sendCredentialsEmail: async (toEmail: string, name: string, username: string, password?: string) => {
    // If keys are not configured, log a warning and skip
    if (SERVICE_ID === 'service_id_here' || TEMPLATE_ID === 'template_id_here' || PUBLIC_KEY === 'public_key_here') {
      console.warn('EmailJS keys not configured. Email will not be sent.');
      return;
    }

    try {
      console.log('Email Config Check:', {
        service: SERVICE_ID,
        template: TEMPLATE_ID,
        key: PUBLIC_KEY ? `${PUBLIC_KEY.slice(0, 4)}...${PUBLIC_KEY.slice(-4)}` : 'MISSING'
      });
      // Initialize with public key
      emailjs.init(PUBLIC_KEY);
      
      const templateParams = {
        to_email: toEmail,
        user_email: toEmail,
        email: toEmail,
        to_name: name,
        user_name: name,
        name: name,
        user_username: username,
        username: username,
        user_password: password || 'Sudah diatur oleh Admin',
        password: password || 'Sudah diatur oleh Admin',
        app_name: 'Bank Soal Polda DIY',
        site_name: 'Bank Soal Polda DIY',
      };

      console.log('Sending email with params:', templateParams);

      const response = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams,
        PUBLIC_KEY
      );

      console.log('EmailJS Response:', response);
      return response;
    } catch (err: any) {
      const errorMsg = err?.text || err?.message || JSON.stringify(err) || 'Unknown email error';
      console.error('EmailJS Error Details:', err);
      throw new Error(errorMsg);
    }
  }
};
