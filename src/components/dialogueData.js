// This file contains the initial dialogue for each screen in the application

const screenDialogues = {
  // Screen 1: Introduction
  1: [
    { 
      speaker: 'EVA', 
      text: 'Hi, I am a socially interactive agent named EVA. You will now be taking the first step to reflect on your relationship with alcohol which is a courageous decision. My objective is to assist you every step of the way during this process. I understand that reflecting on your alcohol habits can be challenging, and it\'s normal to have mixed feelings. There\'s no rush, and everything here is confidential. Take your time. When you are ready to continue, please press \'Next\' button above.'
    }
  ],
  
  // Screen 2: Pros of Drinking
  2: [
    { 
      speaker: 'EVA', 
      text: 'Let\'s start with the positives. What are some benefits or enjoyable aspects of drinking for you? If you\'d like to see common benefits others have found of drinking, please feel free to click the info button to see the benefits.'
    },
    { 
      speaker: 'You', 
      text: 'Drinking let\'s me feel relaxed after a long day of work. I generally feel more happy drinking, and I feel more creative when I drink.'
    }
  ],
  
  // Screen 3: Cons of Drinking
  3: [
    { 
      speaker: 'EVA', 
      text: 'Now, let\'s look at the other side. Have there been any drawbacks or challenges you\'ve noticed with drinking?'
    },
    { 
      speaker: 'You', 
      text: 'Sometimes I feel unsure about how drinking fits into my life. I\'ve noticed that when I drink, I can lose focus or feel emotionally off the next day. It helps me relax in the moment, but afterward I sometimes question if it\'s really helping. I\'m not always proud of how I use alcohol to cope, and that makes me feel conflicted.'
    }
  ],
  
  // Screen 4: Prioritization
  4: [
    { 
      speaker: 'EVA', 
      text: 'Now let\'s think about the benefits and drawbacks a bit more. How important is each of these things to you? Drag and drop each element based on its importance to you.'
    }
  ],
  
  // Screen 5: Reflection and Strategies
  5: [
    { 
      speaker: 'EVA', 
      text: 'You\'ve shared some really thoughtful insights. Drinking seems to offer you comfort and creativity, but also comes with some challenges like feeling off or unfocused afterward. That\'s an important balance to reflect on. Would you like to explore ways to keep the benefits while reducing the downsides?'
    },
    { 
      speaker: 'You', 
      text: 'Yes, show me some options. That sounds really helpful. Thanks, EVA. I\'m looking forward to seeing how this goes.'
    }
  ],
  
  // Screen 6: Desired Effects
  6: [
    { 
      speaker: 'EVA', 
      text: 'People often drink to get something from it. It helps them relax, socialize, adjust their attitude, improve their mood, and escape. The \"desired effects\" themselves are often positive. They are part of enjoying the good things in life and help deal with life\'s stressors. What desired effects do you try to get by drinking?'
    },
    { 
      speaker: 'You', 
      text: 'I think for me, it\'s mostly about unwinding and feeling more at ease. After a long day, having a drink helps me relax and shift out of work mode. It also makes social situations feel a little easier, like I can loosen up and be more present in the moment. Plus, sometimes it sparks creativity---like if I\'m writing or just reflecting on things, it helps me see things from a different angle.'
    }
  ],
  
  // Screen 7: Alternative Ways
  7: [
    { 
      speaker: 'EVA', 
      text: 'What are some other ways to achieve these desired effects? If, for example, you tend to drink to reduce your stress and you\'re thinking about stopping or drinking less, how are you going to relax? People who don\'t develop other ways to relax may end up drinking heavily the next time they want to reduce their stress.'
    },
    { 
      speaker: 'You', 
      text: 'That\'s a good point. I guess I haven\'t thought too much about other ways to unwind. I do like going for walks or listening to music, and sometimes journaling helps me process things. Maybe I could be more intentional about those instead of just reaching for a drink automatically. I also think spending time with friends in ways that don\'t always involve drinking could help---like going to a café instead of a bar.'
    }
  ],
  
  // Screen 8: Strategies Discussion
  8: [
    { 
      speaker: 'EVA', 
      text: 'Here are your strategies as alternatives for getting what you want. Using them can reduce your risk for alcohol-related problems. It sounds like drinking helps you relax, feel present in the moment, and even tap into your creativity. Those are really valuable experiences. Have you noticed certain situations where you rely on alcohol to get those effects?'
    },
    { 
      speaker: 'You', 
      text: 'Yeah, mostly when I\'ve had a long day and just want to unwind. Sometimes, if I\'m trying to be creative---like writing or coming up with ideas---having a drink helps me feel more in the flow. I do listen to music a lot, especially when I\'m trying to get into a creative mindset. I haven\'t really thought about journaling, though---I guess that could help me get ideas flowing too.'
    }
  ],
  
  // Screen 9: Conclusion
  9: [
    { 
      speaker: 'EVA', 
      text: 'Clementine, it\'s been a pleasure working through this with you today. You\'ve come up with some great strategies to stay mindful and intentional about your drinking habits, and I\'m really excited to see how these changes make a difference. Remember, I\'ll be here to track your progress, remind you of your goals, and help reflect on your experiences. If you ever need to adjust anything or have more questions, just let me know. You\'re on the right path, and I believe you\'ve got this! I\'ll check in with you soon to see how things are going. Take care, and I\'m looking forward to hearing about your progress!'
    },
    { 
      speaker: 'You', 
      text: 'Thank you! I\'m looking forward to trying these strategies.'
    }
  ]
};

export default screenDialogues;