// This file contains the initial dialogue for each screen in the application

const screenDialogues = {
    // Screen 1: Introduction
    1: [
      { 
        speaker: 'EVA', 
        text: 'Welcome to the Decision Balance Exercise. Today we\'ll be exploring your thoughts about drinking alcohol. This exercise helps you understand both the positive and negative aspects of your drinking habits. Let\'s get started!'
      }
    ],
    
    // Screen 2: Pros of Drinking
    2: [
      { 
        speaker: 'EVA', 
        text: 'Let\'s start with the positives. What are some benefits or enjoyable aspects of drinking for you? If you\'d like to see common benefits others have found of drinking, please feel free to click the info button to see the benefits.'
      },
      { 
        speaker: 'Clementine', 
        text: 'Drinking let\'s me feel relaxed after a long day of work. I generally feel more happy drinking, and I feel more creative when I drink.'
      }
    ],
    
    // Screen 3: Cons of Drinking
    3: [
      { 
        speaker: 'EVA', 
        text: 'Now let\'s consider the other side. What are some negative consequences or downsides of drinking for you?'
      },
      { 
        speaker: 'Clementine', 
        text: 'Sometimes I spend too much money on alcohol. I also noticed that I sometimes feel tired and less productive the next day after drinking.'
      }
    ],
    
    // Screen 4: Prioritization of Drinking
    4: [
      { 
        speaker: 'EVA', 
        text: 'Let\'s rank the importance of these benefits and drawbacks. Which benefits matter most to you, and which drawbacks concern you the most?'
      },
      { 
        speaker: 'Clementine', 
        text: 'The relaxation is probably the biggest benefit for me. The money spent is my biggest concern.'
      }
    ],
    
    // Screen 5: Personalized Insights
    5: [
      { 
        speaker: 'EVA', 
        text: 'Looking at your benefits and drawbacks, what insights can you draw about your drinking patterns?'
      },
      { 
        speaker: 'Clementine', 
        text: 'I think I value drinking mainly for stress relief, but I should be more mindful of my spending habits around alcohol.'
      }
    ],
    
    // Screen 6: Alternatives (Getting What You Want)
    6: [
      { 
        speaker: 'EVA', 
        text: 'What are the effects you desire when drinking? Can you identify what needs drinking fulfills for you?'
      },
      { 
        speaker: 'Clementine', 
        text: 'I mainly drink to relieve stress and to feel more social at gatherings. It helps me feel less anxious in social situations.'
      }
    ],
    
    // Screen 7: Alternatives (Get Where You Want To Go)
    7: [
      { 
        speaker: 'EVA', 
        text: 'Are there other ways you could achieve these same positive effects without drinking or with less drinking?'
      },
      { 
        speaker: 'Clementine', 
        text: 'I could try meditation for stress relief. For social situations, maybe I could build my confidence in other ways or start with just one drink instead of several.'
      }
    ],
    
    // Screen 8: Alternatives (Feedback)
    8: [
      { 
        speaker: 'EVA', 
        text: 'Let\'s review some strategies that might work as alternatives to drinking. Which of these do you think might work for you?'
      },
      { 
        speaker: 'Clementine', 
        text: 'I think mindfulness meditation could help with stress. Also, setting a budget for drinking might help me be more conscious of my spending.'
      }
    ],
    
    // Screen 9: Conclusion
    9: [
      { 
        speaker: 'EVA', 
        text: 'Thank you for completing this Decision Balance Exercise. What are your key takeaways from our discussion today?'
      },
      { 
        speaker: 'Clementine', 
        text: 'I realize that while drinking has benefits for me, there are also costs. I think I can find a better balance and try some alternatives for the same positive effects.'
      }
    ]
  };
  
  export default screenDialogues;