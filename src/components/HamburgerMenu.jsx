// import React, { useState } from 'react';

// const HamburgerMenu = ({ currentScreen, onScreenChange }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleMenu = () => {
//     console.log('Menu toggled!'); // Add logging
//     setIsOpen(!isOpen);
//   };

//   const menuItems = [
//     { id: 1, title: "Introduction", subtitle: "DBE Start" },
//     { id: 2, title: "Pros of Drinking", subtitle: "Evaluate the benefits of drinking" },
//     { id: 3, title: "Cons of Drinking", subtitle: "Evaluate the drawbacks of drinking" },
//     { id: 4, title: "Prioritization of Drinking", subtitle: "Ranking your benefits and drawbacks" },
//     { id: 5, title: "Personalized Insights", subtitle: "Analyze Drinking Habits" },
//     { id: 6, title: "Alternatives (Getting What You Want)", subtitle: "Desired effects of Drinking" },
//     { id: 7, title: "Alternatives (Get Where You Want To Go)", subtitle: "Other ways to achieve desired effects" },
//     { id: 8, title: "Alternatives (Feedback)", subtitle: "Strategies as alternatives" },
//     { id: 9, title: "Conclusion", subtitle: "DBE End" }
//   ];

//   // Make sure these styles have high z-index and visible colors
//   const styles = {
//     menuButton: {
//       position: 'fixed', // Changed to fixed
//       top: '20px',
//       left: '20px',
//       zIndex: 2000, // Increased z-index
//       backgroundColor: 'white', // Added background
//       border: '1px solid black', // Added border
//       borderRadius: '5px',
//       cursor: 'pointer',
//       padding: '10px',
//       width: '40px',
//       height: '40px',
//       display: 'flex',
//       flexDirection: 'column',
//       justifyContent: 'center',
//       alignItems: 'center'
//     },
//     hamburgerIcon: {
//       display: 'block',
//       width: '25px',
//       height: '3px',
//       backgroundColor: 'black', // Darker color
//       marginBottom: '5px'
//     },
//     menuContainer: {
//       position: 'fixed',
//       top: 0,
//       left: isOpen ? 0 : '-320px', // Uses state
//       width: '320px',
//       height: '100%',
//       backgroundColor: 'white',
//       boxShadow: '2px 0 5px rgba(0,0,0,0.2)',
//       transition: 'left 0.3s ease',
//       overflowY: 'auto',
//       zIndex: 1999
//     },
//     menuHeader: {
//       padding: '20px',
//       borderBottom: '1px solid #eee'
//     },
//     menuTitle: {
//       margin: 0,
//       fontSize: '18px',
//       color: '#555',
//       fontWeight: 'normal'
//     },
//     sectionTitle: {
//       margin: '10px 0',
//       fontSize: '20px',
//       fontWeight: 'bold'
//     },
//     menuList: {
//       listStyle: 'none',
//       padding: 0,
//       margin: 0
//     },
//     menuItem: {
//       padding: '15px 20px',
//       borderBottom: '1px solid #eee',
//       cursor: 'pointer',
//       display: 'flex',
//       alignItems: 'center'
//     },
//     itemIcon: {
//       marginRight: '15px',
//       color: '#555'
//     },
//     itemContent: {
//       flex: 1
//     },
//     itemTitle: (isActive) => ({
//       margin: 0,
//       fontSize: '16px',
//       fontWeight: isActive ? 'bold' : 'normal',
//       color: isActive ? '#007bff' : '#333'
//     }),
//     itemSubtitle: {
//       margin: '5px 0 0 0',
//       fontSize: '14px',
//       color: '#777'
//     }
//   };

//   // Output current screen to help with debugging
//   console.log('Current screen in menu:', currentScreen);

//   return (
//     <>
//       <button style={styles.menuButton} onClick={toggleMenu}>
//         <span style={styles.hamburgerIcon}></span>
//         <span style={styles.hamburgerIcon}></span>
//         <span style={styles.hamburgerIcon}></span>
//       </button>

//       <div style={styles.menuContainer}>
//         <div style={styles.menuHeader}>
//           <h3 style={styles.menuTitle}>Decision Balance Exercise (DBE)</h3>
//           <h2 style={styles.sectionTitle}>Section Navigation</h2>
//         </div>

//         <ul style={styles.menuList}>
//           {menuItems.map((item) => (
//             <li 
//               key={item.id} 
//               style={styles.menuItem}
//               onClick={() => {
//                 console.log('Menu item clicked:', item.id);
//                 if (onScreenChange) {
//                   onScreenChange(item.id);
//                 } else {
//                   console.log('onScreenChange not provided');
//                 }
//                 toggleMenu();
//               }}
//             >
//               <div style={styles.itemIcon}>
//                 ≡
//               </div>
//               <div style={styles.itemContent}>
//                 <h4 style={styles.itemTitle(currentScreen === item.id)}>{item.title}</h4>
//                 <p style={styles.itemSubtitle}>{item.subtitle}</p>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </>
//   );
// };

// export default HamburgerMenu;

// import React, { useState, useEffect } from 'react';

// const HamburgerMenu = ({ currentScreen, onScreenChange }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [availableScreens, setAvailableScreens] = useState([1, 2]);

//   // Update available screens whenever currentScreen changes
//   useEffect(() => {
//     // Available screens are current screen and next screen only
//     const nextAvailable = Math.min(currentScreen + 1, 9);
//     const newAvailableScreens = [];
    
//     // Add all screens up to and including current screen
//     for (let i = 1; i <= currentScreen; i++) {
//       newAvailableScreens.push(i);
//     }
    
//     // Add next screen if it's not already included
//     if (nextAvailable > currentScreen) {
//       newAvailableScreens.push(nextAvailable);
//     }
    
//     setAvailableScreens(newAvailableScreens);
//   }, [currentScreen]);

//   const toggleMenu = (e) => {
//     // Prevent event from bubbling up
//     if (e) {
//       e.stopPropagation();
//     }
//     setIsOpen(!isOpen);
//   };

//   const menuItems = [
//     { id: 1, title: "Introduction", subtitle: "DBE Start" },
//     { id: 2, title: "Pros of Drinking", subtitle: "Evaluate the benefits of drinking" },
//     { id: 3, title: "Cons of Drinking", subtitle: "Evaluate the drawbacks of drinking" },
//     { id: 4, title: "Prioritization of Drinking", subtitle: "Ranking your benefits and drawbacks" },
//     { id: 5, title: "Personalized Insights", subtitle: "Analyze Drinking Habits" },
//     { id: 6, title: "Alternatives (Getting What You Want)", subtitle: "Desired effects of Drinking" },
//     { id: 7, title: "Alternatives (Get Where You Want To Go)", subtitle: "Other ways to achieve desired effects" },
//     { id: 8, title: "Alternatives (Feedback)", subtitle: "Strategies as alternatives" },
//     { id: 9, title: "Conclusion", subtitle: "DBE End" }
//   ];

//   const styles = {
//     hamburger: {
//       position: 'absolute',
//       top: '20px',
//       left: '20px',
//       zIndex: 100,
//       background: 'white',
//       borderRadius: '5px',
//       padding: '10px',
//       cursor: 'pointer',
//       boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
//     },
//     hamburgerIcon: {
//       width: '30px',
//       height: '20px',
//       position: 'relative',
//       transform: 'rotate(0deg)',
//       transition: '.5s ease-in-out',
//       cursor: 'pointer'
//     },
//     line: {
//       display: 'block',
//       position: 'absolute',
//       height: '3px',
//       width: '100%',
//       background: '#333',
//       borderRadius: '9px',
//       opacity: '1',
//       left: '0',
//       transform: 'rotate(0deg)',
//       transition: '.25s ease-in-out'
//     },
//     menu: {
//       position: 'fixed', // Changed from 'absolute' to 'fixed' to ensure it stays in view
//       top: '0',
//       left: '0',
//       width: '85%',
//       maxWidth: '300px',
//       height: '100vh',
//       background: 'white',
//       boxShadow: '2px 0 5px rgba(0,0,0,0.2)',
//       transition: 'transform 0.3s ease-in-out',
//       transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
//       zIndex: 90,
//       overflowY: 'auto',
//       padding: '70px 0 20px 0',
//       fontFamily: '"Times New Roman", Times, serif'
//     },
//     menuItem: {
//       padding: '15px 20px',
//       borderBottom: '1px solid #f0f0f0',
//       display: 'flex',
//       alignItems: 'center',
//       cursor: 'pointer'
//     },
//     disabledMenuItem: {
//       padding: '15px 20px',
//       borderBottom: '1px solid #f0f0f0',
//       display: 'flex',
//       alignItems: 'center',
//       cursor: 'default',
//       opacity: 0.5,
//       backgroundColor: '#f9f9f9',
//       color: '#aaa'
//     },
//     activeMenuItem: {
//       backgroundColor: '#f0f0f0',
//       borderLeft: '4px solid #FF8C00'
//     },
//     menuTitle: {
//       margin: 0,
//       fontFamily: '"Times New Roman", Times, serif',
//       fontSize: '16px'
//     },
//     menuSubtitle: {
//       margin: '5px 0 0 0',
//       fontFamily: '"Times New Roman", Times, serif',
//       fontSize: '12px',
//       color: '#666',
//       fontStyle: 'italic'
//     },
//     expandIcon: {
//       marginRight: '10px',
//       fontSize: '20px'
//     },
//     overlay: {
//       display: isOpen ? 'block' : 'none',
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       width: '100vw',
//       height: '100vh',
//       background: 'rgba(0,0,0,0.4)',
//       zIndex: 80
//     },
//     menuHeader: {
//       padding: '15px 20px',
//       borderBottom: '2px solid #f0f0f0',
//       textAlign: 'center',
//       fontFamily: '"Times New Roman", Times, serif'
//     },
//     menuHeaderTitle: {
//       margin: 0,
//       fontSize: '18px',
//       fontWeight: 'bold',
//       color: '#333'
//     },
//     progressInfo: {
//       margin: '5px 0 0 0',
//       fontSize: '14px',
//       color: '#666'
//     }
//   };

//   // Function to handle menu item clicks with the global goToScreen function
//   const handleMenuItemClick = (screenId, e) => {
//     // Prevent event from bubbling up
//     if (e) {
//       e.stopPropagation();
//     }
    
//     if (!availableScreens.includes(screenId)) {
//       // This screen is not available yet
//       return;
//     }

//     // Use the global goToScreen function or the onScreenChange prop
//     if (typeof window.goToScreen === 'function') {
//       window.goToScreen(screenId);
//     } else if (typeof onScreenChange === 'function') {
//       onScreenChange(screenId);
//     } else {
//       console.warn('No navigation function available');
//     }
    
//     toggleMenu(); // Close the menu after selection
//   };

//   return (
//     <>
//       <div 
//         style={styles.hamburger} 
//         onClick={toggleMenu}
//         role="button"
//         aria-label="Toggle menu"
//         tabIndex={0}
//       >
//         <div style={styles.hamburgerIcon}>
//           <span style={{...styles.line, top: isOpen ? '9px' : '0', transform: isOpen ? 'rotate(45deg)' : 'none'}}></span>
//           <span style={{...styles.line, top: '9px', opacity: isOpen ? 0 : 1}}></span>
//           <span style={{...styles.line, top: isOpen ? '9px' : '18px', transform: isOpen ? 'rotate(-45deg)' : 'none'}}></span>
//         </div>
//       </div>
      
//       <div style={styles.overlay} onClick={toggleMenu}></div>
      
//       <nav style={styles.menu}>
//         <div style={styles.menuHeader}>
//           <h2 style={styles.menuHeaderTitle}>Decision Balance Exercise</h2>
//           <p style={styles.progressInfo}>
//             Screen {currentScreen} of 9
//           </p>
//         </div>
        
//         {menuItems.map(item => {
//           const isAvailable = availableScreens.includes(item.id);
//           const isActive = currentScreen === item.id;
          
//           return (
//             <div
//               key={item.id}
//               style={{
//                 ...(isAvailable ? styles.menuItem : styles.disabledMenuItem),
//                 ...(isActive ? styles.activeMenuItem : {})
//               }}
//               onClick={(e) => isAvailable && handleMenuItemClick(item.id, e)}
//               role={isAvailable ? "button" : ""}
//               tabIndex={isAvailable ? 0 : -1}
//             >
//               <div style={styles.expandIcon}>≡</div>
//               <div>
//                 <h3 style={styles.menuTitle}>{item.title}</h3>
//                 <p style={styles.menuSubtitle}>{item.subtitle}</p>
//               </div>
//               {isActive && (
//                 <div style={{ marginLeft: 'auto', color: '#FF8C00', fontSize: '14px' }}>
//                   Current
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </nav>
//     </>
//   );
// };

// export default HamburgerMenu;

import React, { useState, useEffect } from 'react';

const HamburgerMenu = ({ currentScreen = 1, onScreenChange }) => {
  // Log component initialization for debugging
  console.log('HamburgerMenu initialized with currentScreen:', currentScreen);
  
  const [isOpen, setIsOpen] = useState(false);
  const [availableScreens, setAvailableScreens] = useState([1, 2]);

  // Update available screens whenever currentScreen changes
  useEffect(() => {
    // Available screens are current screen and next screen only
    const nextAvailable = Math.min(currentScreen + 1, 9);
    const newAvailableScreens = [];
    
    // Add all screens up to and including current screen
    for (let i = 1; i <= currentScreen; i++) {
      newAvailableScreens.push(i);
    }
    
    // Add next screen if it's not already included
    if (nextAvailable > currentScreen) {
      newAvailableScreens.push(nextAvailable);
    }
    
    setAvailableScreens(newAvailableScreens);
    console.log('Available screens updated:', newAvailableScreens, 'Current screen:', currentScreen);
  }, [currentScreen]);

  const toggleMenu = (e) => {
    // Prevent event from bubbling up
    if (e) {
      e.stopPropagation();
    }
    setIsOpen(!isOpen);
    console.log('Menu toggled, new state:', !isOpen);
  };

  const menuItems = [
    { id: 1, title: "Introduction", subtitle: "DBE Start" },
    { id: 2, title: "Pros of Drinking", subtitle: "Evaluate the benefits of drinking" },
    { id: 3, title: "Cons of Drinking", subtitle: "Evaluate the drawbacks of drinking" },
    { id: 4, title: "Prioritization of Drinking", subtitle: "Ranking your benefits and drawbacks" },
    { id: 5, title: "Personalized Insights", subtitle: "Analyze Drinking Habits" },
    { id: 6, title: "Alternatives (Getting What You Want)", subtitle: "Desired effects of Drinking" },
    { id: 7, title: "Alternatives (Get Where You Want To Go)", subtitle: "Other ways to achieve desired effects" },
    { id: 8, title: "Alternatives (Feedback)", subtitle: "Strategies as alternatives" },
    { id: 9, title: "Conclusion", subtitle: "DBE End" }
  ];

  // Event handler for direct navigation - implements a direct method if global methods aren't available
  const navigateToScreen = (screenId) => {
    // Try direct approach if other approaches don't work
    try {
      // Find an element with id matching section-{screenId} pattern
      const targetElement = document.getElementById(`section-${screenId}`);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
        console.log('Direct navigation to section-' + screenId);
        return true;
      }
      
      // Try alternative id patterns
      const alternativePatterns = [
        `screen-${screenId}`,
        `page-${screenId}`,
        `step-${screenId}`,
        `dbe-section-${screenId}`,
        `dbe-screen-${screenId}`,
        `screen${screenId}`,
        `section${screenId}`
      ];
      
      for (const pattern of alternativePatterns) {
        const element = document.getElementById(pattern);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          console.log('Direct navigation to ' + pattern);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error in direct navigation:', error);
      return false;
    }
  };

  // Function to handle menu item clicks with multiple fallback methods
  const handleMenuItemClick = (screenId, e) => {
    // Prevent event from bubbling up
    if (e) {
      e.stopPropagation();
    }
    
    if (!availableScreens.includes(screenId)) {
      // This screen is not available yet
      console.log('Screen not available yet:', screenId);
      return;
    }

    console.log('Attempting to navigate to screen:', screenId);
    
    let navigationSuccessful = false;
    
    // First try: Use the global goToScreen function
    if (typeof window.goToScreen === 'function') {
      try {
        window.goToScreen(screenId);
        console.log('Used window.goToScreen to navigate');
        navigationSuccessful = true;
      } catch (error) {
        console.error('Error using window.goToScreen:', error);
      }
    }
    
    // Second try: Use the onScreenChange prop
    if (!navigationSuccessful && typeof onScreenChange === 'function') {
      try {
        onScreenChange(screenId);
        console.log('Used onScreenChange prop to navigate');
        navigationSuccessful = true;
      } catch (error) {
        console.error('Error using onScreenChange:', error);
      }
    }
    
    // Third try: Use direct DOM navigation as fallback
    if (!navigationSuccessful) {
      navigationSuccessful = navigateToScreen(screenId);
    }
    
    if (!navigationSuccessful) {
      console.warn('All navigation methods failed for screen:', screenId);
    }
    
    toggleMenu(); // Close the menu after selection
  };

  const styles = {
    hamburger: {
      position: 'absolute',
      top: '20px',
      left: '20px',
      zIndex: 100,
      background: 'white',
      borderRadius: '5px',
      padding: '10px',
      cursor: 'pointer',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    },
    hamburgerIcon: {
      width: '30px',
      height: '20px',
      position: 'relative',
      transform: 'rotate(0deg)',
      transition: '.5s ease-in-out',
      cursor: 'pointer'
    },
    line: {
      display: 'block',
      position: 'absolute',
      height: '3px',
      width: '100%',
      background: '#333',
      borderRadius: '9px',
      opacity: '1',
      left: '0',
      transform: 'rotate(0deg)',
      transition: '.25s ease-in-out'
    },
    menu: {
      position: 'fixed', // Changed from 'absolute' to 'fixed' to ensure it stays in view
      top: '0',
      left: '0',
      width: '85%',
      maxWidth: '300px',
      height: '100vh',
      background: 'white',
      boxShadow: '2px 0 5px rgba(0,0,0,0.2)',
      transition: 'transform 0.3s ease-in-out',
      transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
      zIndex: 90,
      overflowY: 'auto',
      padding: '70px 0 20px 0',
      fontFamily: '"Times New Roman", Times, serif'
    },
    menuItem: {
      padding: '15px 20px',
      borderBottom: '1px solid #f0f0f0',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer'
    },
    disabledMenuItem: {
      padding: '15px 20px',
      borderBottom: '1px solid #f0f0f0',
      display: 'flex',
      alignItems: 'center',
      cursor: 'default',
      opacity: 0.5,
      backgroundColor: '#f9f9f9',
      color: '#aaa'
    },
    activeMenuItem: {
      backgroundColor: '#f0f0f0',
      borderLeft: '4px solid #FF8C00'
    },
    menuTitle: {
      margin: 0,
      fontFamily: '"Times New Roman", Times, serif',
      fontSize: '16px'
    },
    menuSubtitle: {
      margin: '5px 0 0 0',
      fontFamily: '"Times New Roman", Times, serif',
      fontSize: '12px',
      color: '#666',
      fontStyle: 'italic'
    },
    expandIcon: {
      marginRight: '10px',
      fontSize: '20px'
    },
    overlay: {
      display: isOpen ? 'block' : 'none',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.4)',
      zIndex: 80
    },
    menuHeader: {
      padding: '15px 20px',
      borderBottom: '2px solid #f0f0f0',
      textAlign: 'center',
      fontFamily: '"Times New Roman", Times, serif'
    },
    menuHeaderTitle: {
      margin: 0,
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#333'
    },
    progressInfo: {
      margin: '5px 0 0 0',
      fontSize: '14px',
      color: '#666'
    }
  };

  return (
    <>
      <div 
        style={styles.hamburger} 
        onClick={toggleMenu}
        role="button"
        aria-label="Toggle menu"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            toggleMenu(e);
          }
        }}
      >
        <div style={styles.hamburgerIcon}>
          <span style={{...styles.line, top: isOpen ? '9px' : '0', transform: isOpen ? 'rotate(45deg)' : 'none'}}></span>
          <span style={{...styles.line, top: '9px', opacity: isOpen ? 0 : 1}}></span>
          <span style={{...styles.line, top: isOpen ? '9px' : '18px', transform: isOpen ? 'rotate(-45deg)' : 'none'}}></span>
        </div>
      </div>
      
      <div style={styles.overlay} onClick={toggleMenu}></div>
      
      <nav style={styles.menu}>
        <div style={styles.menuHeader}>
          <h2 style={styles.menuHeaderTitle}>Decision Balance Exercise</h2>
          <p style={styles.progressInfo}>
            Screen {currentScreen} of 9
          </p>
        </div>
        
        {menuItems.map(item => {
          const isAvailable = availableScreens.includes(item.id);
          const isActive = currentScreen === item.id;
          
          return (
            <div
              key={item.id}
              style={{
                ...(isAvailable ? styles.menuItem : styles.disabledMenuItem),
                ...(isActive ? styles.activeMenuItem : {})
              }}
              onClick={(e) => isAvailable && handleMenuItemClick(item.id, e)}
              role={isAvailable ? "button" : ""}
              tabIndex={isAvailable ? 0 : -1}
              onKeyDown={(e) => {
                if (isAvailable && (e.key === 'Enter' || e.key === ' ')) {
                  handleMenuItemClick(item.id, e);
                }
              }}
            >
              <div style={styles.expandIcon}>≡</div>
              <div>
                <h3 style={styles.menuTitle}>{item.title}</h3>
                <p style={styles.menuSubtitle}>{item.subtitle}</p>
              </div>
              {isActive && (
                <div style={{ marginLeft: 'auto', color: '#FF8C00', fontSize: '14px' }}>
                  Current
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </>
  );
};

export default HamburgerMenu;