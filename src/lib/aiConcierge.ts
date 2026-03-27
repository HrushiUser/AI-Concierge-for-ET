import { ET_SERVICES, Service } from './services';

export interface ProfilingData {
  profession?: string;
  income?: string;
  goals?: string[];
  interests?: string[];
  riskProfile?: string;
  currentStage?: string;
  recommendations?: Service[];
}

export class AIConcierge {
  private profilingData: ProfilingData = {};
  private messageCount = 0;
  private conversationState = 'initial';

  constructor(existingData?: ProfilingData) {
    if (existingData) {
      this.profilingData = existingData;
    }
  }

  getGreeting(): string {
    return "👋 Welcome to ET AI Concierge! I'm here to guide you through the entire Economic Times ecosystem. Whether you're looking to grow wealth, learn investing, find the right financial products, or explore career opportunities, I'll help you discover exactly what you need.\n\nLet's get started! Are you a Student, Investor, or Professional?";
  }

  async processMessage(userMessage: string): Promise<string> {
    this.messageCount++;
    const lowerMessage = userMessage.toLowerCase();

    if (this.messageCount === 1) {
      this.profilingData.profession = this.extractProfession(lowerMessage);
      this.conversationState = 'profession-selected';
      return this.getGoalsQuestion();
    }

    if (this.messageCount === 2) {
      this.profilingData.goals = this.extractGoals(lowerMessage);
      this.conversationState = 'goals-selected';
      return this.getRiskProfileQuestion();
    }

    if (this.messageCount === 3) {
      this.profilingData.riskProfile = this.extractRiskProfile(lowerMessage);
      this.conversationState = 'risk-selected';
      return this.getIncomeQuestion();
    }

    if (this.messageCount === 4) {
      this.profilingData.income = this.extractIncome(lowerMessage);
      this.conversationState = 'profiling-complete';

      this.profilingData.recommendations = this.generateRecommendations();
      return this.formatRecommendations(this.profilingData.recommendations);
    }

    return this.getFollowUpQuestion();
  }

  private getGoalsQuestion(): string {
    const profession = this.profilingData.profession;

    if (profession === 'student') {
      return "Great! As a student, what are your financial priorities? Are you interested in:\n• Learning about investing & markets\n• Building financial literacy\n• Finding part-time opportunities\n• Planning for the future";
    } else if (profession === 'investor') {
      return "Perfect! What's your primary investment focus?\n• Growing wealth through stocks & mutual funds\n• Learning advanced trading strategies\n• Diversifying your portfolio\n• Finding premium financial advisory";
    } else {
      return "Excellent! As a professional, what matters most to you?\n• Career advancement opportunities\n• Wealth & portfolio management\n• Financial protection & insurance\n• Business insights & news";
    }
  }

  private getRiskProfileQuestion(): string {
    return "How would you describe your comfort with financial risk?\n• Conservative (Safety first, stable growth)\n• Moderate (Balanced approach, some growth)\n• Aggressive (High growth potential, accept volatility)";
  }

  private getIncomeQuestion(): string {
    return "One last question: What's your approximate annual income range?\n• Below ₹5 Lakhs\n• ₹5-15 Lakhs\n• ₹15-50 Lakhs\n• Above ₹50 Lakhs";
  }

  private getFollowUpQuestion(): string {
    return "Is there anything specific about these recommendations you'd like to explore further? Or would you like me to suggest something different?";
  }

  private extractProfession(message: string): string {
    if (message.includes('student')) return 'student';
    if (message.includes('investor')) return 'investor';
    if (message.includes('professional') || message.includes('working') || message.includes('employ')) return 'professional';
    if (message.includes('entrepreneur') || message.includes('business')) return 'entrepreneur';
    return 'professional';
  }

  private extractGoals(message: string): string[] {
    const goals: string[] = [];
    if (message.includes('invest') || message.includes('wealth') || message.includes('stock') || message.includes('portfolio')) {
      goals.push('investing');
    }
    if (message.includes('learn') || message.includes('educate') || message.includes('literacy') || message.includes('knowledge')) {
      goals.push('education');
    }
    if (message.includes('news') || message.includes('analysis') || message.includes('insight') || message.includes('market')) {
      goals.push('news');
    }
    if (message.includes('protect') || message.includes('insurance') || message.includes('security')) {
      goals.push('protection');
    }
    if (message.includes('career') || message.includes('job') || message.includes('opportunity') || message.includes('growth')) {
      goals.push('career');
    }
    if (message.includes('loan') || message.includes('credit') || message.includes('finance')) {
      goals.push('finance');
    }
    return goals.length > 0 ? goals : ['investing'];
  }

  private extractRiskProfile(message: string): string {
    if (message.includes('conservative') || message.includes('safe') || message.includes('stable') || message.includes('low')) {
      return 'conservative';
    }
    if (message.includes('aggressive') || message.includes('high') || message.includes('growth') || message.includes('volatility')) {
      return 'aggressive';
    }
    return 'moderate';
  }

  private extractIncome(message: string): string {
    if (message.includes('above 50') || message.includes('>50') || message.includes('50+')) return 'high';
    if (message.includes('15-50') || message.includes('15 to 50')) return 'upper-middle';
    if (message.includes('5-15') || message.includes('5 to 15') || message.includes('15')) return 'middle';
    return 'varied';
  }

  generateRecommendations(): Service[] {
    const profession = this.profilingData.profession || 'professional';
    const goals = this.profilingData.goals || [];
    const riskProfile = this.profilingData.riskProfile || 'moderate';
    const income = this.profilingData.income || 'middle';

    const recommendations: Service[] = [];
    const recommendedIds = new Set<string>();

    if (profession === 'student') {
      this.addIfNotExists(recommendations, recommendedIds, 'et-prime');
      this.addIfNotExists(recommendations, recommendedIds, 'et-investing');
      this.addIfNotExists(recommendations, recommendedIds, 'et-jobs');
      this.addIfNotExists(recommendations, recommendedIds, 'et-masterclass');
    }

    if (profession === 'investor') {
      this.addIfNotExists(recommendations, recommendedIds, 'et-prime');
      this.addIfNotExists(recommendations, recommendedIds, 'et-markets');
      this.addIfNotExists(recommendations, recommendedIds, 'et-wealth');
      this.addIfNotExists(recommendations, recommendedIds, 'mutual-funds');
    }

    if (profession === 'professional') {
      this.addIfNotExists(recommendations, recommendedIds, 'et-prime');
      this.addIfNotExists(recommendations, recommendedIds, 'et-markets');
      this.addIfNotExists(recommendations, recommendedIds, 'et-wealth');
      this.addIfNotExists(recommendations, recommendedIds, 'et-events');
      if (income === 'high' || income === 'upper-middle') {
        this.addIfNotExists(recommendations, recommendedIds, 'credit-cards');
      }
    }

    if (goals.includes('investing') || goals.includes('education')) {
      this.addIfNotExists(recommendations, recommendedIds, 'mutual-funds');
      this.addIfNotExists(recommendations, recommendedIds, 'et-masterclass');
    }

    if (goals.includes('protection')) {
      this.addIfNotExists(recommendations, recommendedIds, 'insurance');
    }

    if (goals.includes('finance')) {
      this.addIfNotExists(recommendations, recommendedIds, 'loans');
      this.addIfNotExists(recommendations, recommendedIds, 'credit-cards');
    }

    if (goals.includes('career')) {
      this.addIfNotExists(recommendations, recommendedIds, 'et-jobs');
    }

    if (riskProfile === 'aggressive' && goals.includes('investing')) {
      this.addIfNotExists(recommendations, recommendedIds, 'et-markets');
    }

    this.addIfNotExists(recommendations, recommendedIds, 'et-events');

    return recommendations.slice(0, 6);
  }

  private addIfNotExists(recommendations: Service[], ids: Set<string>, serviceId: string): void {
    if (!ids.has(serviceId)) {
      const service = ET_SERVICES.find(s => s.id === serviceId);
      if (service) {
        recommendations.push(service);
        ids.add(serviceId);
      }
    }
  }

  private formatRecommendations(recommendations: Service[]): string {
    const profession = this.profilingData.profession || 'user';
    const riskLevel = this.profilingData.riskProfile || 'moderate';

    let response = `\n✨ **Your Personalized ET Journey**\n\n`;
    response += `Based on your profile as a ${profession} with ${riskLevel} risk tolerance, I've curated the perfect services for you:\n\n`;
    response += `**Recommended Services:**\n`;

    recommendations.forEach((rec, index) => {
      response += `${index + 1}. **${rec.name}** (${rec.category})\n`;
    });

    response += `\n💡 Each of these services is tailored to your needs and goals. Click "Explore" on any recommendation to get started immediately!\n\nWould you like me to explain any of these recommendations in more detail?`;

    return response;
  }

  getProfilingData(): ProfilingData {
    return this.profilingData;
  }

  getConversationState(): string {
    return this.conversationState;
  }
}
