const emailService = {
  sendReport: async (userEmail, reportData) => {
    try {
      console.log('\n📧 EMAIL REPORT SENT TO:', userEmail);
      console.log('═══════════════════════════════════════');
      console.log('🧠 MINDCARE MENTAL HEALTH REPORT');
      console.log('═══════════════════════════════════════');
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
      
      console.log('═══════════════════════════════════════\n');
      
      return { success: true, message: 'Report sent successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

module.exports = emailService;