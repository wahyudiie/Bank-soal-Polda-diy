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
    // If keys are not configured, log a warning and skip (so app doesn't crash)
    if (SERVICE_ID === 'service_id_here' || TEMPLATE_ID === 'template_id_here' || PUBLIC_KEY === 'public_key_here') {
      console.warn('EmailJS keys not configured. Email will not be sent.');
      console.log('Would have sent email to:', toEmail, 'with credentials:', { username, password });
      return;
    }

    try {
      const templateParams = {
        to_email: toEmail,
        to_name: name,
        user_username: username,
        user_password: password || 'Sudah diatur oleh Admin',
        app_name: 'Bank Soal Polda DIY',
      };

      const response = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams,
        PUBLIC_KEY
      );

      console.log('Email sent successfully!', response.status, response.text);
      return response;
    } catch (err) {
      console.error('Failed to send email:', err);
      throw err;
    }
  }
};
