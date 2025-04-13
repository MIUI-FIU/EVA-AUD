// import React from 'react';

// const styles = {
//     screen: {
//         padding: '20px',
//         margin: '20px',
//         border: '2px solid #ccc',
//         borderRadius: '8px',
//         backgroundColor: '#f9f9f9',
//         textAlign: 'center',
//     }
// };

// export const Screen1 = ({ onNext }) => {
//     return (
//         <div style={styles.screen}>
//             <h2>Welcome to Screen 1</h2>
//             <button onClick={onNext}>Go to Screen 2</button>
//         </div>
//     );
// };

// export const Screen2 = ({ onNext }) => {
//     return (
//         <div style={styles.screen}>
//             <h2>Welcome to Screen 2</h2>
//             <button onClick={onNext}>Go to Screen 3</button>
//         </div>
//     );
// };

// export const Screen3 = ({ onFinish }) => {
//     return (
//         <div style={styles.screen}>
//             <h2>Welcome to Screen 3</h2>
//             <button onClick={onFinish}>Finish</button>
//         </div>
//     );
// };

//Updating next button 

// import React from 'react';
// import { NextButton } from './NextButton'; // Import as a named import instead of default

// const styles = {
//     screen: {
//         padding: '20px',
//         margin: '20px',
//         border: '2px solid #ccc',
//         borderRadius: '8px',
//         backgroundColor: '#f9f9f9',
//         textAlign: 'center',
//         position: 'relative' // Important for absolute positioning of the NextButton
//     }
// };

// export const Screen1 = ({ onNext }) => {
//     return (
//         <div style={styles.screen}>
//             <h2>Welcome to Screen 1</h2>
//             <NextButton onClick={onNext} />
//         </div>
//     );
// };

// export const Screen2 = ({ onNext }) => {
//     return (
//         <div style={styles.screen}>
//             <h2>Welcome to Screen 2</h2>
//             <NextButton onClick={onNext} />
//         </div>
//     );
// };

// export const Screen3 = ({ onFinish }) => {
//     return (
//         <div style={styles.screen}>
//             <h2>Welcome to Screen 3</h2>
//             <NextButton onClick={onFinish} text="Finish" />
//         </div>
//     );
// };

//Updating white box
// import React from 'react';
// import { NextButton } from './NextButton'; // Import as a named import instead of default

// const styles = {
//     screen: {
//         position: 'relative', // Important for absolute positioning of the NextButton
//         height: '100%',
//         width: '100%'
//     },
//     title: {
//         position: 'absolute',
//         top: '20px',
//         left: '50%',
//         transform: 'translateX(-50%)',
//         padding: '5px 20px',
//         backgroundColor: 'rgba(255, 255, 255, 0.7)',
//         borderRadius: '8px',
//         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//         fontFamily: '"Georgia", serif',
//         fontSize: '22px',
//         color: '#333'
//     }
// };

// export const Screen1 = ({ onNext }) => {
//     return (
//         <div style={styles.screen}>
//             <h2 style={styles.title}>Introduction to eEVA AUD</h2>
//             <NextButton onClick={onNext} />
//         </div>
//     );
// };

// export const Screen2 = ({ onNext }) => {
//     return (
//         <div style={styles.screen}>
//             <h2 style={styles.title}>Pros of Drinking</h2>
//             <NextButton onClick={onNext} />
//         </div>
//     );
// };

// export const Screen3 = ({ onFinish }) => {
//     return (
//         <div style={styles.screen}>
//             <h2 style={styles.title}>cons of Drinking</h2>
//             <NextButton onClick={onFinish} text="Finish" />
//         </div>
//     );
// };
//Updating Hamburger Menu
// import React, { useState } from 'react';
// import { NextButton } from './NextButton'; // Import as a named import instead of default
// import HamburgerMenu from './HamburgerMenu'; // Import the hamburger menu

// const styles = {
//     screen: {
//         position: 'relative', // Important for absolute positioning of the NextButton
//         height: '100%',
//         width: '100%'
//     },
//     title: {
//         position: 'absolute',
//         top: '20px',
//         left: '50%',
//         transform: 'translateX(-50%)',
//         padding: '5px 20px',
//         backgroundColor: 'rgba(255, 255, 255, 0.7)',
//         borderRadius: '8px',
//         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//         fontFamily: '"Georgia", serif',
//         fontSize: '22px',
//         color: '#333'
//     },
//     subtitle: {
//         position: 'absolute',
//         top: '80px',
//         left: '50%',
//         transform: 'translateX(-50%)',
//         padding: '5px 20px',
//         fontFamily: '"Georgia", serif',
//         fontSize: '18px',
//         color: '#666',
//         fontStyle: 'italic',
//         textAlign: 'center',
//         width: '90%'
//     }
// };

// // Common wrapper for all screens to include menu
// const ScreenWrapper = ({ children, currentScreenId, title, subtitle }) => {
//     const handleScreenChange = (screenNum) => {
//         if (window.goToScreen) {
//             window.goToScreen(screenNum);
//         } else {
//             console.warn('goToScreen function not available');
//         }
//     };

//     return (
//         <div style={styles.screen}>
//             <HamburgerMenu 
//                 currentScreen={currentScreenId}
//                 onScreenChange={handleScreenChange}
//             />
//             <h2 style={styles.title}>{title}</h2>
//             {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
//             {children}
//         </div>
//     );
// };

// export const Screen1 = ({ onNext }) => {
//     return (
//         <ScreenWrapper 
//             currentScreenId={1} 
//             title="Introduction" 
//             // subtitle="DBE Start"
//         >
//             <NextButton onClick={onNext} />
//         </ScreenWrapper>
//     );
// };

// export const Screen2 = ({ onNext }) => {
//     return (
//         <ScreenWrapper 
//             currentScreenId={2} 
//             title="Pros of Drinking" 
//             // subtitle="Evaluate the benefits of drinking"
//         >
//             <NextButton onClick={onNext} />
//         </ScreenWrapper>
//     );
// };

// export const Screen3 = ({ onNext }) => {
//     return (
//         <ScreenWrapper 
//             currentScreenId={3} 
//             title="Cons of Drinking" 
//             // subtitle="Evaluate the drawbacks of drinking"
//         >
//             <NextButton onClick={onNext} />
//         </ScreenWrapper>
//     );
// };

// export const Screen4 = ({ onNext }) => {
//     return (
//         <ScreenWrapper 
//             currentScreenId={4} 
//             title="Prioritization of Drinking" 
//             // subtitle="Ranking your benefits and drawbacks"
//         >
//             <NextButton onClick={onNext} />
//         </ScreenWrapper>
//     );
// };

// export const Screen5 = ({ onNext }) => {
//     return (
//         <ScreenWrapper 
//             currentScreenId={5} 
//             title="Personalized Insights" 
//             // subtitle="Analyze Drinking Habits"
//         >
//             <NextButton onClick={onNext} />
//         </ScreenWrapper>
//     );
// };

// export const Screen6 = ({ onNext }) => {
//     return (
//         <ScreenWrapper 
//             currentScreenId={6} 
//             title="Alternatives (Getting What You Want)" 
//             // subtitle="Desired effects of Drinking"
//         >
//             <NextButton onClick={onNext} />
//         </ScreenWrapper>
//     );
// };

// export const Screen7 = ({ onNext }) => {
//     return (
//         <ScreenWrapper 
//             currentScreenId={7} 
//             title="Alternatives (Get Where You Want To Go)" 
//             // subtitle="Other ways to achieve desired effects"
//         >
//             <NextButton onClick={onNext} />
//         </ScreenWrapper>
//     );
// };

// export const Screen8 = ({ onNext }) => {
//     return (
//         <ScreenWrapper 
//             currentScreenId={8} 
//             title="Alternatives (Feedback)" 
//             // subtitle="Strategies as alternatives"
//         >
//             <NextButton onClick={onNext} />
//         </ScreenWrapper>
//     );
// };

// export const Screen9 = ({ onFinish }) => {
//     return (
//         <ScreenWrapper 
//             currentScreenId={9} 
//             title="Conclusion" 
//             // subtitle="DBE End"
//         >
//             <NextButton onClick={onFinish} text="Finish" />
//         </ScreenWrapper>
//     );
// };

// // Main App component to manage screen navigation
// const App = () => {
//     const [currentScreen, setCurrentScreen] = useState(1);
    
//     // Define functions for navigation
//     const goToNextScreen = () => {
//         setCurrentScreen(prevScreen => Math.min(prevScreen + 1, 9));
//     };
    
//     const goToScreen = (screenNum) => {
//         setCurrentScreen(screenNum);
//     };
    
//     // Make goToScreen available globally for the HamburgerMenu
//     window.goToScreen = goToScreen;
    
//     // Render the current screen
//     const renderScreen = () => {
//         switch (currentScreen) {
//             case 1:
//                 return <Screen1 onNext={goToNextScreen} />;
//             case 2:
//                 return <Screen2 onNext={goToNextScreen} />;
//             case 3:
//                 return <Screen3 onNext={goToNextScreen} />;
//             case 4:
//                 return <Screen4 onNext={goToNextScreen} />;
//             case 5:
//                 return <Screen5 onNext={goToNextScreen} />;
//             case 6:
//                 return <Screen6 onNext={goToNextScreen} />;
//             case 7:
//                 return <Screen7 onNext={goToNextScreen} />;
//             case 8:
//                 return <Screen8 onNext={goToNextScreen} />;
//             case 9:
//                 return <Screen9 onFinish={() => alert('Assessment completed!')} />;
//             default:
//                 return <Screen1 onNext={goToNextScreen} />;
//         }
//     };
    
//     return (
//         <div style={{ height: '100vh', width: '100vw' }}>
//             {renderScreen()}
//         </div>
//     );
// };

// export default App;

import React, { useState } from 'react';
import HamburgerMenu from './HamburgerMenu';
import ListDisplay from './ListDisplay';
import InfoButton from './InfoButton';
import RankableListDisplay from './RankableListDisplay';
import { NextButton } from './NextButton';
import DialogueInputComponent from './DialogueInputComponent';
import screenDialogues from './dialogueData';
import ProgressBar from './ProgressBar';

const styles = {
    screen: {
        position: 'relative',
        height: '100%',
        width: '100%'
    },
    title: {
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '5px 20px',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        fontFamily: '"Georgia", serif',
        fontSize: '22px',
        color: '#333'
    }
    // Dialogue container positioning is now handled inside the DialogueInputComponent
};

// Common wrapper for all screens to include menu and dialogue system
const ScreenWrapper = ({ children, currentScreenId, title }) => {
    const handleScreenChange = (screenNum) => {
        if (window.goToScreen) {
            window.goToScreen(screenNum);
        } else {
            console.warn('goToScreen function not available');
        }
    };

    return (
        <div style={styles.screen} id={`screen-${currentScreenId}`}>
            <HamburgerMenu 
                currentScreen={currentScreenId}
                onScreenChange={handleScreenChange}
            />
            {/* Add the progress bar here */}
            <ProgressBar currentScreen={currentScreenId} totalScreens={9} />
            
            <h2 style={styles.title}>{title}</h2>
            
            <DialogueInputComponent 
                initialDialogue={screenDialogues[currentScreenId] || []}
                placeholder="Type your response here..."
            />
            
            {children}
        </div>
    );
};

export const Screen1 = ({ onNext }) => {
    return (
        <ScreenWrapper 
            currentScreenId={1} 
            title="Introduction"
        >
            <NextButton onClick={onNext} />
        </ScreenWrapper>
    );
};

export const Screen2 = ({ onNext }) => {
    const [showCommon, setShowCommon] = useState(false);

    const yourBenefitsList = [
        "It helps me feel relaxed.",
        "It makes me more happy.",
        "It makes me more creative.",
    ];

    const commonBenefitsList = [
        "It relaxes me.",
        "It helps me sleep.",
        "It helps me be more open socially.",
        "It helps me forget my problems.",
        "It helps me adjust my attitude.",
        "I feel more creative when I drink.",
        "It helps me feel sexier or have better sex.",
        "I like the high."
    ];

    const handleInfoClick = () => {
        setShowCommon((prev) => !prev);
    };

    return (
        <ScreenWrapper currentScreenId={2} title="Pros of Drinking">
            <ListDisplay title="Your Benefits" items={yourBenefitsList} top='200px' left='200px' />
            {showCommon && (
                <ListDisplay title="Common Benefits" items={commonBenefitsList} top='260px' right='165px' />
            )}
            <InfoButton
                onClick={handleInfoClick}
                title={showCommon ? "Hide Common Benefits" : "View Common Benefits"}
            />
            <NextButton onClick={onNext} />
        </ScreenWrapper>
    );
};

export const Screen3 = ({ onNext }) => {
    const [showCommon, setShowCommon] = useState(false);

    const yourDrawbacksList = [
        "I lose focus the next day.",
        "I feel emotionally off the next day.",
        "It makes me question my decisions."
    ]

    const commonDrawbacksList = [
        "It affects my relationships with others.",
        "DWI/DUIs",
        "Other legal problems",
        "Money problems",
        "Memory blackouts",
        "Make poor decisions",
        "Feel guilty or ashamed",
        "Miss class or work the next day",
        "Shamed or embarassed someone",
        "Neglecting responsibilities",
        "Being a poor role model for my kids when I drink",
        "Feeling dependent on alcohol",
        "Passing out or fainting suddenly",
        "Health symptoms or problems"
    ]

    const handleInfoClick = () => {
        setShowCommon((prev) => !prev);
    };

    return (
        <ScreenWrapper currentScreenId={3} title="Cons of Drinking">
            <ListDisplay title="Your Drawbacks" items={yourDrawbacksList} top='200px' left='200px' />
            {showCommon && (
                <ListDisplay title="Common Drawbacks" items={commonDrawbacksList} top='260px' right='165px' />
            )}
            <InfoButton
                onClick={handleInfoClick}
                title={showCommon ? "Hide Common Drawbacks" : "View Common Drawbacks"}
            />
            <NextButton onClick={onNext} />
        </ScreenWrapper>
    );
};

export const Screen4 = ({ onNext }) => {
    const [rankedItems, setRankedItems] = useState([]);

    const yourBenefitsList = [
        "It helps me feel relaxed.",
        "It makes me more happy.",
        "It makes me more creative.",
    ];

    const yourDrawbacksList = [
        "I lose focus the next day.",
        "I feel emotionally off the next day.",
        "It makes me question my decisions."
    ]

    const handleRankChange = (newOrder) => {
        setRankedItems(newOrder);
        console.log("Ranked order updated:", newOrder);
    };

    return (
        <ScreenWrapper currentScreenId={4} title="Prioritization of Drinking">
            <RankableListDisplay
                title="Drag and drop to rank your most important benefits to drinking"
                items={yourBenefitsList}
                onRankChange={handleRankChange}
                top='200px'
                left='150px'
                listId='0'
            />

            <RankableListDisplay
                title="Drag and drop to rank your most important drawbacks to drinking"
                items={yourDrawbacksList}
                onRankChange={handleRankChange}
                top='200px'
                right='150px'
                listId='1'
            />
            <NextButton onClick={onNext} />
        </ScreenWrapper>
    );
};

export const Screen5 = ({ onNext }) => {
    const yourBenefitsList = [
        "It helps me feel relaxed.",
        "It makes me more happy.",
        "It makes me more creative.",
    ];

    const yourDrawbacksList = [
        "I lose focus the next day.",
        "I feel emotionally off the next day.",
        "It makes me question my decisions."
    ]

    return (
        <ScreenWrapper currentScreenId={5} title="Personalized Insights">
            <ListDisplay title="Your Benefits" items={yourBenefitsList} top='200px' left='200px' />
            <ListDisplay title="Your Drawbacks" items={yourDrawbacksList} top='200px' right='200px' />
            <NextButton onClick={onNext} />
        </ScreenWrapper>
    );
};

export const Screen6 = ({ onNext }) => {
    const [showCommon, setShowCommon] = useState(false);

    const yourChoicesList = [
        "It helps me feel relaxed.",
        "It makes me feel \"present in the moment\"",
        "It makes me more creative."
    ]

    const suggestionsList = [
        "To reduce my stress levels.",
        "To be more relaxed in social situations.",
        "To have fun",
        "To fit in",
        "To feel accepted",
        "To adjust my attitude",
        "To be more sociable",
        "To enjoy sex more",
        "To be more assertive",
        "To get high",
        "To be a better lover",
        "To be braver or more daring",
        "To sleep",
        "To forget"
    ]

    const handleInfoClick = () => {
        setShowCommon((prev) => !prev);
    };

    return (
        <ScreenWrapper currentScreenId={6} title="Alternatives (Getting What You Want)">
            <ListDisplay title="Your Choices" items={yourChoicesList} top='200px' left='200px' />
            {showCommon && (
                <ListDisplay title="Suggestions" items={suggestionsList} top='260px' right='165px' />
            )}
            <InfoButton
                onClick={handleInfoClick}
                title={showCommon ? "Hide Suggestions" : "View Suggestions"}
            />
            <NextButton onClick={onNext} />
        </ScreenWrapper>
    );
};

export const Screen7 = ({ onNext }) => {
    const [showCommon, setShowCommon] = useState(false);

    const yourChoicesList = [
        "Go work out",
        "Listen to/play music",
        "Journaling",
        "Spend time with friends"
    ]

    const suggestionsList = [
        "Meditate",
        "Call a friend",
        "Go work out",
        "Go dancing",
        "Catch a movie",
        "Go out to eat",
        "Play video games",
        "Go to the mall/shopping",
        "Listen to/play music",
        "Play sports",
        "Attend a sporting event",
        "Spend time with friends"
    ]

    const handleInfoClick = () => {
        setShowCommon((prev) => !prev);
    };

    return (
        <ScreenWrapper currentScreenId={7} title="Alternatives (Get Where You Want To Go)">
            <ListDisplay title="Your Choices" items={yourChoicesList} top='200px' left='200px' />
            {showCommon && (
                <ListDisplay title="Suggestions" items={suggestionsList} top='260px' right='210px' />
            )}
            <InfoButton
                onClick={handleInfoClick}
                title={showCommon ? "Hide Suggestions" : "View Suggestions"}
            />
            <NextButton onClick={onNext} />
        </ScreenWrapper>
    );
};

export const Screen8 = ({ onNext }) => {
    const yourDesiredEffectsList = [
        "It helps me feel relaxed",
        "It makes me feel \"present in the moment\"",
        "It makes me more creative"
    ];

    const yourPossibleAlternativesList = [
        "Go work out",
        "Listen to/play music",
        "Journaling",
        "Spend time with friends"
    ]

    return (
        <ScreenWrapper currentScreenId={8} title="Alternatives (Feedback)">
            <ListDisplay title="Your Desired Effects" items={yourDesiredEffectsList} top='200px' left='200px' />
            <ListDisplay title="Possible Alternatives" items={yourPossibleAlternativesList} top='200px' right='200px' />
            <NextButton onClick={onNext} />
        </ScreenWrapper>
    );
};

export const Screen9 = ({ onFinish }) => {
    return (
        <ScreenWrapper currentScreenId={9} title="Conclusion">
            <NextButton onClick={onFinish} text="Finish" />
        </ScreenWrapper>
    );
};

export default { Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9 };