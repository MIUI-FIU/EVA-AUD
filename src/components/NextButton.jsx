// import React from 'react';

// // Define the NextButton component inline
// export const NextButton = ({ onClick, text = "Next" }) => {
//   return (
//     <button
//       onClick={onClick}
//       style={{
//         position: 'absolute',
//         top: '10px',
//         right: '10px',
//         backgroundColor: '#FF8C00', // Orange color
//         color: 'white',
//         border: 'none',
//         borderRadius: '4px',
//         padding: '8px 16px',
//         fontSize: '14px',
//         fontWeight: 'bold',
//         cursor: 'pointer',
//         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
//         fontFamily: '"Times New Roman", Times, serif'
//       }}
//     >
//       {text}
//     </button>
//   );
// };

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

// // Add a default export of the NextButton component
// export default NextButton;

//Trigger using the pressing next button
// import React from 'react';

// // Define the NextButton component inline
// export const NextButton = ({ onClick, text = "Next" }) => {
//   // Combine any passed onClick with the global nextScreen function
//   const handleClick = () => {
//     if (onClick) onClick();
//     if (window.nextScreen && text === "Next") window.nextScreen();
//     if (window.finishScreens && text === "Finish") window.finishScreens();
//   };

//   return (
//     <button
//       onClick={handleClick}
//       style={{
//         position: 'absolute',
//         bottom: '30px',  // Changed from top to bottom
//         right: '30px',   // Increased right margin
//         backgroundColor: '#FF8C00', // Orange color
//         color: 'white',
//         border: 'none',
//         borderRadius: '4px',
//         padding: '10px 20px', // Slightly larger padding
//         fontSize: '16px',     // Slightly larger font
//         fontWeight: 'bold',
//         cursor: 'pointer',
//         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
//         fontFamily: '"Times New Roman", Times, serif',
//         zIndex: 10 // Ensure button appears above other elements
//       }}
//     >
//       {text}
//     </button>
//   );
// };

// export default NextButton;
// import React from 'react';

// export const NextButton = ({ onClick, text = 'Next' }) => {
//   const styles = {
//     button: {
//       position: 'absolute',
//       bottom: '30px',
//       right: '30px',
//       padding: '12px 25px',
//       backgroundColor: '#4a90e2',
//       color: 'white',
//       border: 'none',
//       borderRadius: '25px',
//       fontSize: '16px',
//       fontWeight: 'bold',
//       cursor: 'pointer',
//       boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
//       transition: 'all 0.3s ease'
//     },
//     hoverStyle: {
//       backgroundColor: '#3a80d2',
//       boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
//     }
//   };

//   const [hover, setHover] = React.useState(false);

//   return (
//     <button
//       style={{
//         ...styles.button,
//         ...(hover ? styles.hoverStyle : {})
//       }}
//       onClick={onClick}
//       onMouseEnter={() => setHover(true)}
//       onMouseLeave={() => setHover(false)}
//     >
//       {text}
//     </button>
//   );
// };

// export default NextButton;

import React from 'react';

export const NextButton = ({ onClick, text = 'Next' }) => {
  const styles = {
    button: {
      position: 'absolute',
      bottom: '30px',
      right: '30px',
      padding: '12px 25px',
      backgroundColor: '#FF8C00', // Changed to orange (Dark Orange)
      color: 'white',
      border: 'none',
      borderRadius: '25px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      transition: 'all 0.3s ease',
      fontFamily: '"Times New Roman", Times, serif' // Added Times New Roman font
    },
    hoverStyle: {
      backgroundColor: '#E67300', // Darker orange for hover state
      boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
    }
  };

  const [hover, setHover] = React.useState(false);

  // Handle the button click
  const handleClick = () => {
    // Call the provided onClick function if provided
    if (onClick) {
      onClick();
    } 
    // If this is the "Finish" button, call the finishScreens function
    else if (text === 'Finish' && window.finishScreens) {
      window.finishScreens();
    }
    // Otherwise use the nextScreen function
    else if (window.nextScreen) {
      window.nextScreen();
    }
    else {
      console.warn('No click handler or global nextScreen function available');
    }
  };

  return (
    <button
      style={{
        ...styles.button,
        ...(hover ? styles.hoverStyle : {})
      }}
      onClick={handleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {text}
    </button>
  );
};

export default NextButton;