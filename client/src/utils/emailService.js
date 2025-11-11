import emailjs from '@emailjs/browser';

const initEmailJS = () => {
  emailjs.init('v07TjVBRf3OSqfsHd');
};

initEmailJS();

const emailService = {
  // Send welcome email when user registers
  sendWelcomeEmail: async (user) => {
    try {
      // Reinitialize EmailJS
      emailjs.init('v07TjVBRf3OSqfsHd');
      
      console.log('Sending welcome email to:', user.email);
      
      const templateParams = {
        to_name: user.username,
        to_email: user.email,
        from_name: 'MindCare Team',
        reply_to: 'support@mindcare.com'
      };
      
      console.log('Welcome email params:', templateParams);
      
      const result = await emailjs.send(
        'service_kcaqp0k',
        'template_3hbtbdc',
        templateParams
      );
      
      console.log('Welcome email sent successfully:', result);
      return { success: true };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      console.error('Error details:', error.text || error.message);
      return { success: false, error: error.text || error.message || 'Unknown error' };
    }
  },
  
  // Send report email to user
  sendReportEmail: async (userEmail, userName, reportData) => {
    try {
      // Reinitialize EmailJS to ensure fresh connection
      emailjs.init('v07TjVBRf3OSqfsHd');
      
      console.log('Sending report email to:', userEmail);
      console.log('Report data:', reportData);
      
      const templateParams = {
        to_name: userName,
        to_email: userEmail,
        from_name: 'MindCare Team',
        reply_to: 'support@mindcare.com',
        report_date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        quiz_score: reportData.latestScore || 'N/A',
        mental_health_level: reportData.level || 'Not assessed',
        total_assessments: reportData.totalAssessments || 0,
        total_mood_entries: reportData.totalMoodEntries || 0,
        wellness_points: reportData.points || 0,
        current_streak: reportData.streak || 0,
        total_badges: reportData.badges?.length || 0,
        badges_list: reportData.badges?.map(b => b.name).join(', ') || 'No badges yet',
        recent_moods: reportData.recentMoods?.join(', ') || 'No mood entries',
        recommendation: reportData.recommendation || 'Continue your wellness journey!',
        avg_score: reportData.avgScore || 'N/A'
      };
      
      console.log('Template params:', templateParams);
      
      const result = await emailjs.send(
        'service_kcaqp0k',
        'template_0c0ni2s',
        templateParams
      );
      
      console.log('Report email sent successfully:', result);
      return { success: true, result };
    } catch (error) {
      console.error('Error sending report email:', error);
      console.error('Error details:', error.text || error.message);
      return { success: false, error: error.text || error.message || 'Unknown error' };
    }
  }
};

export default emailService;