// Axios for making HTTP requests to EmailJS API
const axios = require('axios');

// EmailJS configuration
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
const EMAILJS_USER_ID = process.env.EMAILJS_USER_ID || 'YOUR_USER_ID';
const EMAILJS_WELCOME_TEMPLATE_ID = process.env.EMAILJS_WELCOME_TEMPLATE_ID || 'YOUR_WELCOME_TEMPLATE_ID';
const EMAILJS_REPORT_TEMPLATE_ID = process.env.EMAILJS_REPORT_TEMPLATE_ID || 'YOUR_REPORT_TEMPLATE_ID';

const emailService = {
  // Send welcome email when user logs in
  sendWelcomeEmail: async (user) => {
    try {
      console.log('\n📧 SENDING WELCOME EMAIL TO:', user.email);
      
      const templateParams = {
        to_name: user.username,
        to_email: user.email,
        subject: 'Welcome to MindCare Mental Health System',
        message: `Welcome to MindCare! We're excited to have you join our community. Our platform offers various tools to help you track and improve your mental wellbeing.`
      };
      
      // Make API request to EmailJS
      await axios.post(
        'https://api.emailjs.com/api/v1.0/email/send',
        {
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_WELCOME_TEMPLATE_ID,
          user_id: EMAILJS_USER_ID,
          template_params: templateParams
        }
      );
      
      console.log('✅ Welcome email sent successfully to:', user.email);
      return { success: true, message: 'Welcome email sent successfully' };
    } catch (error) {
      console.error('❌ Error sending welcome email:', error.message);
      return { success: false, error: error.message };
    }
  },
  
  // Send report email to user
  sendReport: async (userEmail, reportData) => {
    try {
      console.log('\n📧 SENDING REPORT EMAIL TO:', userEmail);
      console.log('═══════════════════════════════════════');
      console.log('🧠 MINDCARE MENTAL HEALTH REPORT');
      console.log('═══════════════════════════════════════');
      
      // Log report details for debugging
      console.log(`📅 Date: ${new Date().toLocaleDateString()}`);
      console.log(`📊 Assessment Score: ${reportData.score}/30`);
      console.log(`🎯 Mental Health Level: ${reportData.level}`);
      console.log(`🏆 Wellness Points: ${reportData.points || 0}`);
      console.log(`🔥 Current Streak: ${reportData.streak || 0} days`);
      
      if (reportData.badges && reportData.badges.length > 0) {
        console.log('🏅 Recent Achievements:');
        reportData.badges.forEach(badge => {
          console.log(`   ${badge.icon} ${badge.name} - ${badge.description}`);
        });
      }
      
      console.log('\n💡 Personalized Recommendations:');
      console.log(reportData.recommendation || 'Continue your wellness journey!');
      
      if (reportData.score <= 4) {
        console.log('\n🆘 CRISIS SUPPORT RESOURCES:');
        console.log('• National Suicide Prevention Lifeline: 988');
        console.log('• Crisis Text Line: Text HOME to 741741');
      }
      
      // Prepare template parameters for EmailJS
      const templateParams = {
        to_email: userEmail,
        subject: 'Your MindCare Mental Health Report',
        date: new Date().toLocaleDateString(),
        score: reportData.score,
        level: reportData.level,
        points: reportData.points || 0,
        streak: reportData.streak || 0,
        recommendation: reportData.recommendation || 'Continue your wellness journey!'
      };
      
      // Make API request to EmailJS
      await axios.post(
        'https://api.emailjs.com/api/v1.0/email/send',
        {
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_REPORT_TEMPLATE_ID,
          user_id: EMAILJS_USER_ID,
          template_params: templateParams
        }
      );
      
      console.log('═══════════════════════════════════════\n');
      console.log('✅ Report email sent successfully to:', userEmail);
      
      return { success: true, message: 'Report sent successfully' };
    } catch (error) {
      console.error('❌ Error sending report email:', error.message);
      return { success: false, error: error.message };
    }
  }
};

module.exports = emailService;