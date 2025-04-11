import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Screen1, Screen2, Screen3 } from './AUDScreens';  // Import named exports

const ScreenManager = forwardRef((props, ref) => {
    const [currentScreen, setCurrentScreen] = useState(1); // Track which screen is being shown

    // Expose setScreen function to the parent via ref
    useImperativeHandle(ref, () => ({
        setScreen: (screenNumber) => {
            setCurrentScreen(screenNumber);
        }
    }));

    const goToNextScreen = () => {
        setCurrentScreen(prev => prev + 1); // Move to the next screen
    };

    const finishFlow = () => {
        alert('Flow finished!');
        setCurrentScreen(0); // Reset or hide all screens
    };

    // Determine which screen to show based on the current state
    const renderCurrentScreen = () => {
        switch (currentScreen) {
            case 1:
                return <Screen1 onNext={goToNextScreen} />;
            case 2:
                return <Screen2 onNext={goToNextScreen} />;
            case 3:
                return <Screen3 onFinish={finishFlow} />;
            default:
                return <div>Flow Finished</div>; // Final message when all screens are done
        }
    };

    return <div>{renderCurrentScreen()}</div>;
});

export default ScreenManager;
