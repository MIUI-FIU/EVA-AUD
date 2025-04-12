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
import React, { useState } from 'react';
import { NextButton } from './NextButton'; // Import as a named import instead of default
import HamburgerMenu from './HamburgerMenu'; // Import the hamburger menu

const styles = {
    screen: {
        position: 'relative', // Important for absolute positioning of the NextButton
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
    },
    subtitle: {
        position: 'absolute',
        top: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '5px 20px',
        fontFamily: '"Georgia", serif',
        fontSize: '18px',
        color: '#666',
        fontStyle: 'italic',
        textAlign: 'center',
        width: '90%'
    }
};

// Common wrapper for all screens to include menu
const ScreenWrapper = ({ children, currentScreenId, title, subtitle }) => {
    const handleScreenChange = (screenNum) => {
        if (window.goToScreen) {
            window.goToScreen(screenNum);
        } else {
            console.warn('goToScreen function not available');
        }
    };

    return (
        <div style={styles.screen}>
            <HamburgerMenu 
                currentScreen={currentScreenId}
                onScreenChange={handleScreenChange}
            />
            <h2 style={styles.title}>{title}</h2>
            {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
            {children}
        </div>
    );
};

export const Screen1 = ({ onNext }) => {
    return (
        <ScreenWrapper 
            currentScreenId={1} 
            title="Introduction" 
            // subtitle="DBE Start"
        >
            <NextButton onClick={onNext} />
        </ScreenWrapper>
    );
};

export const Screen2 = ({ onNext }) => {
    return (
        <ScreenWrapper 
            currentScreenId={2} 
            title="Pros of Drinking" 
            // subtitle="Evaluate the benefits of drinking"
        >
            <NextButton onClick={onNext} />
        </ScreenWrapper>
    );
};

export const Screen3 = ({ onNext }) => {
    return (
        <ScreenWrapper 
            currentScreenId={3} 
            title="Cons of Drinking" 
            // subtitle="Evaluate the drawbacks of drinking"
        >
            <NextButton onClick={onNext} />
        </ScreenWrapper>
    );
};

export const Screen4 = ({ onNext }) => {
    return (
        <ScreenWrapper 
            currentScreenId={4} 
            title="Prioritization of Drinking" 
            // subtitle="Ranking your benefits and drawbacks"
        >
            <NextButton onClick={onNext} />
        </ScreenWrapper>
    );
};

export const Screen5 = ({ onNext }) => {
    return (
        <ScreenWrapper 
            currentScreenId={5} 
            title="Personalized Insights" 
            // subtitle="Analyze Drinking Habits"
        >
            <NextButton onClick={onNext} />
        </ScreenWrapper>
    );
};

export const Screen6 = ({ onNext }) => {
    return (
        <ScreenWrapper 
            currentScreenId={6} 
            title="Alternatives (Getting What You Want)" 
            // subtitle="Desired effects of Drinking"
        >
            <NextButton onClick={onNext} />
        </ScreenWrapper>
    );
};

export const Screen7 = ({ onNext }) => {
    return (
        <ScreenWrapper 
            currentScreenId={7} 
            title="Alternatives (Get Where You Want To Go)" 
            // subtitle="Other ways to achieve desired effects"
        >
            <NextButton onClick={onNext} />
        </ScreenWrapper>
    );
};

export const Screen8 = ({ onNext }) => {
    return (
        <ScreenWrapper 
            currentScreenId={8} 
            title="Alternatives (Feedback)" 
            // subtitle="Strategies as alternatives"
        >
            <NextButton onClick={onNext} />
        </ScreenWrapper>
    );
};

export const Screen9 = ({ onFinish }) => {
    return (
        <ScreenWrapper 
            currentScreenId={9} 
            title="Conclusion" 
            // subtitle="DBE End"
        >
            <NextButton onClick={onFinish} text="Finish" />
        </ScreenWrapper>
    );
};

// Main App component to manage screen navigation
const App = () => {
    const [currentScreen, setCurrentScreen] = useState(1);
    
    // Define functions for navigation
    const goToNextScreen = () => {
        setCurrentScreen(prevScreen => Math.min(prevScreen + 1, 9));
    };
    
    const goToScreen = (screenNum) => {
        setCurrentScreen(screenNum);
    };
    
    // Make goToScreen available globally for the HamburgerMenu
    window.goToScreen = goToScreen;
    
    // Render the current screen
    const renderScreen = () => {
        switch (currentScreen) {
            case 1:
                return <Screen1 onNext={goToNextScreen} />;
            case 2:
                return <Screen2 onNext={goToNextScreen} />;
            case 3:
                return <Screen3 onNext={goToNextScreen} />;
            case 4:
                return <Screen4 onNext={goToNextScreen} />;
            case 5:
                return <Screen5 onNext={goToNextScreen} />;
            case 6:
                return <Screen6 onNext={goToNextScreen} />;
            case 7:
                return <Screen7 onNext={goToNextScreen} />;
            case 8:
                return <Screen8 onNext={goToNextScreen} />;
            case 9:
                return <Screen9 onFinish={() => alert('Assessment completed!')} />;
            default:
                return <Screen1 onNext={goToNextScreen} />;
        }
    };
    
    return (
        <div style={{ height: '100vh', width: '100vw' }}>
            {renderScreen()}
        </div>
    );
};

export default App;