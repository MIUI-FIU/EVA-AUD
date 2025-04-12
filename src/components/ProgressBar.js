import React from 'react';

const ProgressBar = ({ currentScreen, totalScreens = 9 }) => {
  // Calculate percentage
  const percentage = Math.round((currentScreen / totalScreens) * 100);
  
  const styles = {
    container: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      display: 'flex',
      alignItems: 'center',
      zIndex: 100,
    },
    progressOuter: {
      width: '150px',
      height: '8px',
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: '4px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    progressInner: {
      height: '100%',
      width: `${percentage}%`,
      backgroundColor: '#4285F4', // Google blue, you can change this
      borderRadius: '4px',
      transition: 'width 0.3s ease-in-out',
    },
    text: {
      fontSize: '14px',
      color: 'white',
      marginLeft: '10px',
      fontWeight: '500',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.progressOuter}>
        <div style={styles.progressInner}></div>
      </div>
      <div style={styles.text}>{percentage}%</div>
    </div>
  );
};

export default ProgressBar;