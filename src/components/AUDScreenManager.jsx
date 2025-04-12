// import React, { useState, forwardRef, useImperativeHandle } from 'react';
// import { Screen1, Screen2, Screen3 } from './AUDScreens';  // Import named exports

// const ScreenManager = forwardRef((props, ref) => {
//     const [currentScreen, setCurrentScreen] = useState(1); // Track which screen is being shown

//     // Expose setScreen function to the parent via ref
//     useImperativeHandle(ref, () => ({
//         setScreen: (screenNumber) => {
//             setCurrentScreen(screenNumber);
//         }
//     }));

//     const goToNextScreen = () => {
//         setCurrentScreen(prev => prev + 1); // Move to the next screen
//     };

//     const finishFlow = () => {
//         alert('Flow finished!');
//         setCurrentScreen(0); // Reset or hide all screens
//     };

//     // Determine which screen to show based on the current state
//     const renderCurrentScreen = () => {
//         switch (currentScreen) {
//             case 1:
//                 return <Screen1 onNext={goToNextScreen} />;
//             case 2:
//                 return <Screen2 onNext={goToNextScreen} />;
//             case 3:
//                 return <Screen3 onFinish={finishFlow} />;
//             default:
//                 return <div>Flow Finished</div>; // Final message when all screens are done
//         }
//     };

//     return <div>{renderCurrentScreen()}</div>;
// });

// export default ScreenManager;
// import React, { useState, forwardRef, useImperativeHandle } from 'react';
// import { Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9 } from './AUDScreens';  // Import all screens

// const ScreenManager = forwardRef((props, ref) => {
//     const [currentScreen, setCurrentScreen] = useState(1); // Track which screen is being shown

//     // Expose setScreen function to the parent via ref
//     useImperativeHandle(ref, () => ({
//         setScreen: (screenNumber) => {
//             console.log('ScreenManager: Setting screen to', screenNumber);
//             setCurrentScreen(screenNumber);
//         }
//     }));

//     const goToNextScreen = () => {
//         setCurrentScreen(prev => prev + 1); // Move to the next screen
//     };

//     const finishFlow = () => {
//         console.log('Flow finished!');
//         // Call window.finishScreens if available
//         if (window.finishScreens) {
//             window.finishScreens();
//         } else {
//             alert('Flow finished!');
//         }
//         setCurrentScreen(0); // Reset or hide all screens
//     };

//     // Determine which screen to show based on the current state
//     const renderCurrentScreen = () => {
//         console.log('Rendering screen:', currentScreen);
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
//                 return <Screen9 onFinish={finishFlow} />;
//             default:
//                 return <div>Flow Finished</div>; // Final message when all screens are done
//         }
//     };

//     return <div>{renderCurrentScreen()}</div>;
// });

// export default ScreenManager;
import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9 } from './AUDScreens';  // Import all screens

const ScreenManager = forwardRef((props, ref) => {
    const [currentScreen, setCurrentScreen] = useState(1); // Track which screen is being shown

    // Connect the global goToScreen function to our local state
    useEffect(() => {
        // Create or update the global goToScreen function
        window.goToScreen = (screenNum) => {
            console.log('ScreenManager goToScreen called with screen:', screenNum);
            setCurrentScreen(parseInt(screenNum, 10));
            return true;
        };
        
        // Cleanup when component unmounts
        return () => {
            // Only remove if this component set it
            if (window.goToScreen && window.goToScreen.toString().includes('ScreenManager')) {
                delete window.goToScreen;
            }
        };
    }, []);

    // Expose setScreen function to the parent via ref
    useImperativeHandle(ref, () => ({
        setScreen: (screenNumber) => {
            console.log('ScreenManager: Setting screen to', screenNumber);
            const screenNum = parseInt(screenNumber, 10);
            setCurrentScreen(screenNum);
            
            // Update any existing global goToScreen to point to this function
            if (typeof window.goToScreen !== 'function' || 
                !window.goToScreen.toString().includes('ScreenManager')) {
                window.goToScreen = (num) => {
                    console.log('ScreenManager ref goToScreen called with:', num);
                    setCurrentScreen(parseInt(num, 10));
                    return true;
                };
            }
        }
    }));
    

    const goToNextScreen = () => {
        setCurrentScreen(prev => prev + 1); // Move to the next screen
    };

    const finishFlow = () => {
        console.log('Flow finished!');
        // Call window.finishScreens if available
        if (window.finishScreens) {
            window.finishScreens();
        } else {
            alert('Flow finished!');
        }
        setCurrentScreen(0); // Reset or hide all screens
    };

    // Log whenever the screen changes
    useEffect(() => {
        console.log('Current screen changed to:', currentScreen);
    }, [currentScreen]);

    // Determine which screen to show based on the current state
    const renderCurrentScreen = () => {
        console.log('Rendering screen:', currentScreen);
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
                return <Screen9 onFinish={finishFlow} />;
            default:
                return <div>Flow Finished</div>; // Final message when all screens are done
        }
    };

    return <div>{renderCurrentScreen()}</div>;
});

export default ScreenManager;