// import React, { useState, useEffect, useRef} from 'react';
// import { useUnityState } from '../unityMiddleware';
// import AnimationManager from '../VISOS/action/visualizers/AnimationManager';
// import { ActionUnitsList, VisemesList } from '../unity/facs/shapeDict';
// import GameText from './GameText';
// import IntroBox from './IntroBox';
// import { useToast, Box } from '@chakra-ui/react';

// import ScreenManager from './AUDScreenManager';

// function AUDApp() {
//     const { isLoaded, engine, facslib } = useUnityState();
//     const [auStates, setAuStates] = useState(
//         ActionUnitsList.reduce((acc, au) => ({
//             ...acc, [au.id]: { intensity: 0, name: au.name, notes: "" },
//         }), {})
//     );
//     const [visemeStates, setVisemeStates] = useState(
//         VisemesList.reduce((acc, viseme) => ({
//             ...acc, [viseme.id]: { intensity: 0, name: viseme.name },
//         }), {})
//     );
//     const [animationManager, setAnimationManager] = useState(null);
//     const [setupComplete, setSetupComplete] = useState(false);
//     const [isRequestLoading, setRequestIsLoading] = useState(false);
//     const [showIntro, setShowIntro] = useState(true);
//     const toast = useToast();

//     const screenManagerRef = useRef()

//     useEffect(() => {
//         if (isLoaded && facslib && !animationManager) {
//             const manager = new AnimationManager(facslib, setAuStates, setVisemeStates);
//             window.animationManager = manager;
//             setAnimationManager(manager);
//             setSetupComplete(true);
//         }
//     }, [isLoaded, facslib]);

//     const startModuleDirectly = () => {
//         import('../modules/evaDBE')
//             .then(module => {
//                 const storedSettings = localStorage.getItem('EVA-DBE');
//                 const settings = storedSettings
//                     ? JSON.parse(storedSettings)
//                     : module.defaultSettings || {};

                

//                 const container = document.getElementById('module-container');

//                 const ui = {
//                     setScreen: (n) => {
//                         screenManagerRef.current?.setScreen(n);
//                     }
//                 };

//                 if (container) {
//                     module.start(animationManager, settings, { current: container }, toast, ui);
//                 } else {
//                     console.error("Module container not found");
//                 }
//             })
//             .catch(err => {
//                 console.error("Failed to load evaDBE module", err);
//             });
//     };

//     return (
//         <div className="AUDApp">
//             {isLoaded && setupComplete && animationManager && (
//                 <>
//                     {showIntro ? (
//                         <IntroBox
//                             onContinue={() => {
//                                 setShowIntro(false);
//                                 startModuleDirectly();
//                             }}
//                         />
//                     ) : (
//                         <>
//                             <Box id="module-container" />
//                             <ScreenManager ref={screenManagerRef} />
//                             {isRequestLoading && <GameText />}
//                         </>
//                     )}
//                 </>
//             )}
//         </div>
//     );
// }

// export default AUDApp;


import React, { useState, useEffect, useRef} from 'react';
import { useUnityState } from '../unityMiddleware';
import AnimationManager from '../VISOS/action/visualizers/AnimationManager';
import { ActionUnitsList, VisemesList } from '../unity/facs/shapeDict';
import GameText from './GameText';
import IntroBox from './IntroBox';
import { useToast, Box } from '@chakra-ui/react';

import ScreenManager from './AUDScreenManager';
import { blinking } from '../modules/blink';

function AUDApp() {
    const { isLoaded, engine, facslib } = useUnityState();
    const [auStates, setAuStates] = useState(
        ActionUnitsList.reduce((acc, au) => ({
            ...acc, [au.id]: { intensity: 0, name: au.name, notes: "" },
        }), {})
    );
    const [visemeStates, setVisemeStates] = useState(
        VisemesList.reduce((acc, viseme) => ({
            ...acc, [viseme.id]: { intensity: 0, name: viseme.name },
        }), {})
    );
    const [animationManager, setAnimationManager] = useState(null);
    const [setupComplete, setSetupComplete] = useState(false);
    const [isRequestLoading, setRequestIsLoading] = useState(false);
    const [showIntro, setShowIntro] = useState(true);
    const toast = useToast();

    const screenManagerRef = useRef();

    // Define the global goToScreen function as early as possible
    useEffect(() => {
        // Create a global navigation function that uses the ref
        window.goToScreen = (screenNum) => {
            console.log('Global goToScreen called with screen:', screenNum);
            if (screenManagerRef.current) {
                screenManagerRef.current.setScreen(screenNum);
                return true;
            } else {
                console.error('screenManagerRef.current is not available');
                return false;
            }
        };
        
        // Cleanup on unmount
        return () => {
            delete window.goToScreen;
        };
    }, []);

    useEffect(() => {
        if (isLoaded && facslib && !animationManager) {
            const manager = new AnimationManager(facslib, setAuStates, setVisemeStates);
            window.animationManager = manager;
            setAnimationManager(manager);
            setSetupComplete(true);

            blinking(window.animationManager);
            
            // Refresh the goToScreen function now that we've loaded
            if (typeof window.goToScreen !== 'function') {
                window.goToScreen = (screenNum) => {
                    console.log('Global goToScreen refreshed with screen:', screenNum);
                    if (screenManagerRef.current) {
                        screenManagerRef.current.setScreen(screenNum);
                        return true;
                    }
                    return false;
                };
            }
        }
    }, [isLoaded, facslib]);

    const startModuleDirectly = () => {
        import('../modules/evaDBE')
            .then(module => {
                const storedSettings = localStorage.getItem('EVA-DBE');
                const settings = storedSettings
                    ? JSON.parse(storedSettings)
                    : module.defaultSettings || {};

                const container = document.getElementById('module-container');

                const ui = {
                    setScreen: (n) => {
                        console.log('UI setScreen called with screen:', n);
                        screenManagerRef.current?.setScreen(n);
                        
                        // Also ensure window.goToScreen is defined and using the same function
                        if (typeof window.goToScreen !== 'function') {
                            window.goToScreen = (screenNum) => {
                                console.log('UI-defined goToScreen called with screen:', screenNum);
                                screenManagerRef.current?.setScreen(screenNum);
                                return true;
                            };
                        }
                    }
                };

                if (container) {
                    module.start(animationManager, settings, { current: container }, toast, ui);
                } else {
                    console.error("Module container not found");
                }
            })
            .catch(err => {
                console.error("Failed to load evaDBE module", err);
            });
    };

    return (
        <div className="AUDApp">
            {isLoaded && setupComplete && animationManager && (
                <>
                    {showIntro ? (
                        <IntroBox
                            onContinue={() => {
                                setShowIntro(false);
                                startModuleDirectly();
                            }}
                        />
                    ) : (
                        <>
                            <Box id="module-container" />
                            <ScreenManager ref={screenManagerRef} />
                            {isRequestLoading && <GameText />}
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default AUDApp;
