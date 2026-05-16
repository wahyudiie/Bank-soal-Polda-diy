import emailjs from '@emailjs/browser';

/**
 * [SAFETY LOCK - DO NOT MODIFY WITHOUT PERMISSION]
 * Configuration for Bank Soal Polda DIY Email Notification System.
 * These keys are vital for the account credential delivery system.
 */
const EMAIL_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_3llqvnp',
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_f2h92te',
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YuQOL2eEylQT4n3Oh',
};

// Initialize EmailJS once using the locked config
emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);

export const emailService = {
  /**
   * Sends premium credentials email to a new user.
   * [PROTECTED FUNCTION]
   */
  sendCredentialsEmail: async (toEmail: string, name: string, username: string, password?: string) => {
    // 1. Safety Validations
    const cleanEmail = (toEmail || '').trim();
    if (!cleanEmail) throw new Error('Recipient email is required for notification.');
    
    // 2. Check if config is still using placeholders
    if (EMAIL_CONFIG.SERVICE_ID.includes('_id_here')) {
      console.warn('System: EmailJS keys not configured. Skipping delivery.');
      return;
    }

    try {
      console.log('System: Preparing credential delivery for:', cleanEmail);
      
      // 3. Mapping variables for Premium HTML Template
      const templateParams = {
        to_email: cleanEmail,
        to_name: name || 'Personel Polda DIY',
        username: username,
        password: password || 'Sudah diatur oleh Admin',
        
        // Aliases for legacy template compatibility
        user_email: cleanEmail,
        user_name: name,
        user_username: username,
        user_password: password || 'Sudah diatur oleh Admin',
        app_name: 'Bank Soal Polda DIY',
      };

      const response = await emailjs.send(
        EMAIL_CONFIG.SERVICE_ID, 
        EMAIL_CONFIG.TEMPLATE_ID, 
        templateParams, 
        EMAIL_CONFIG.PUBLIC_KEY
      );
      
      console.log('System: Email successfully delivered.', response.status);
      return response;
    } catch (err: any) {
      console.error('System: Email delivery failed.', err);
      const errorMsg = err?.text || err?.message || 'Gagal mengirim email. Periksa kuota EmailJS.';
      throw new Error(errorMsg);
    }
  },

  /**
   * Diagnostic Tool: Verifies the connection to EmailJS server.
   * Used for maintenance and troubleshooting.
   */
  sendTestEmail: async (testEmail: string) => {
    const cleanEmail = testEmail.trim();
    try {
      const templateParams = {
        to_email: cleanEmail,
        to_name: 'Maintenance Tester',
        username: 'TEST_USER',
        password: 'TEST_PASSWORD',
        message: 'Koneksi EmailJS berhasil diverifikasi.',
        app_name: 'Bank Soal (DIAGNOSTIC MODE)',
      };

      const response = await emailjs.send(
        EMAIL_CONFIG.SERVICE_ID, 
        EMAIL_CONFIG.TEMPLATE_ID, 
        templateParams, 
        EMAIL_CONFIG.PUBLIC_KEY
      );
      return { success: true, response };
    } catch (err: any) {
      console.error('System Diagnostic Failure:', err);
      return { success: false, error: err?.text || err?.message || 'Server Error' };
    }
  }
};
