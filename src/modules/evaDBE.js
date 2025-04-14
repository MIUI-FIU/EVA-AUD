// async function start(animationManager, settings, container, toast, ui) {
//     console.log('Calling evaDBE start!');

//     if (ui && typeof ui.setScreen === 'function') {
//         let current = 1; // Start at screen 1
//         const maxScreen = 5; // Set your actual number of screens here

//         // Directly set the first screen
//         ui.setScreen(current);

//         // Use a recursive function to progress screens
//         const progressScreens = () => {
//             console.log('In progress screens!')
//             current += 1;
//             if (current > maxScreen) {
//                 return;
//             }
//             ui.setScreen(current); // Move to the next screen
//             setTimeout(progressScreens, 10000); // Recursively call the function after 3 seconds
//         };

//         // Start the screen progression
//         setTimeout(progressScreens, 10000); // Start after 3 seconds
//     }
// }

// function stop() {
//     console.log('Calling evaDBE stop!');
// }

// export { start, stop };
//Updating to work with just button instead of timing 
// async function start(animationManager, settings, container, toast, ui) {
//     console.log('Calling evaDBE start!');

//     if (ui && typeof ui.setScreen === 'function') {
//         let current = 1; // Start at screen 1
//         const maxScreen = 5; // Set your actual number of screens here

//         // Directly set the first screen
//         ui.setScreen(current);
        
//         // Set up a function that can be called when the Next button is clicked
//         window.nextScreen = () => {
//             current += 1;
//             if (current <= maxScreen) {
//                 console.log('Moving to screen', current);
//                 ui.setScreen(current);
//             } else {
//                 console.log('Reached the last screen');
//                 // Optionally handle end of screens
//             }
//         };
        
//         // Make this function available to your NextButton component
//         // You'll need to call this from your NextButton click handler
//         window.finishScreens = () => {
//             console.log('Screens finished');
//             // Handle any cleanup or final actions here
//         };
//     }
// }

// function stop() {
//     console.log('Calling evaDBE stop!');
//     // Clean up global functions
//     if (window.nextScreen) delete window.nextScreen;
//     if (window.finishScreens) delete window.finishScreens;
// }

// export { start, stop };

//updating for Hamburger Menu: