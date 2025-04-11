async function start(animationManager, settings, container, toast, ui) {
    console.log('Calling evaDBE start!');

    if (ui && typeof ui.setScreen === 'function') {
        let current = 1; // Start at screen 1
        const maxScreen = 5; // Set your actual number of screens here

        // Directly set the first screen
        ui.setScreen(current);

        // Use a recursive function to progress screens
        const progressScreens = () => {
            console.log('In progress screens!')
            current += 1;
            if (current > maxScreen) {
                return;
            }
            ui.setScreen(current); // Move to the next screen
            setTimeout(progressScreens, 3000); // Recursively call the function after 3 seconds
        };

        // Start the screen progression
        setTimeout(progressScreens, 3000); // Start after 3 seconds
    }
}

function stop() {
    console.log('Calling evaDBE stop!');
}

export { start, stop };
