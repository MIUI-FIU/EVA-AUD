// import React, { useState, useRef, useEffect } from 'react';

// const DialogueInputComponent = ({ initialDialogue = [], placeholder = "Type your response here..." }) => {
//   // State for storing all dialogue entries (predefined + user input)
//   const [dialogueEntries, setDialogueEntries] = useState(initialDialogue);
//   // State for the current user input
//   const [userInput, setUserInput] = useState('');
//   // Ref for the dialogue container to allow scrolling
//   const dialogueContainerRef = useRef(null);
//   // Animation state for new messages
//   const [lastEntryIndex, setLastEntryIndex] = useState(-1);

//   // Auto-scroll to bottom when dialogue changes
//   useEffect(() => {
//     if (dialogueContainerRef.current) {
//       dialogueContainerRef.current.scrollTop = dialogueContainerRef.current.scrollHeight;
//     }
//     if (dialogueEntries.length > 0) {
//       setLastEntryIndex(dialogueEntries.length - 1);
//     }
//   }, [dialogueEntries]);

//   // Handle input change
//   const handleInputChange = (e) => {
//     setUserInput(e.target.value);
//   };

//   // Handle input submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (userInput.trim() === '') return;
    
//     // Add user input to dialogue with "You:" prefix
//     const newEntry = {
//       speaker: 'You',
//       text: userInput.trim()
//     };
    
//     setDialogueEntries([...dialogueEntries, newEntry]);
//     setUserInput(''); // Clear input field after submission
//   };

//   // Auto-resize input field as user types
//   const textareaRef = useRef(null);
  
//   useEffect(() => {
//     if (textareaRef.current) {
//       // Reset height to auto to get the correct scrollHeight
//       textareaRef.current.style.height = 'auto';
//       // Set the height to scrollHeight to fit content
//       textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
//     }
//   }, [userInput]);

//   const styles = {
//     container: {
//       position: 'fixed',
//       bottom: '20px',
//       left: '50%',
//       transform: 'translateX(-50%)',
//       width: '94%',
//       maxWidth: '950px', 
//       margin: '0 auto',
//       fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
//       zIndex: 50,
//       backgroundColor: 'rgba(255, 255, 255, 0.2)',
//       boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
//       border: 'none',
//       borderRadius: '16px',
//       overflow: 'hidden',
//       backdropFilter: 'blur(5px)',
//       WebkitBackdropFilter: 'blur(5px)',
//       maxHeight: '280px',
//     },
//     dialogueContainer: {
//       maxHeight: '150px',
//       overflowY: 'auto',
//       padding: '16px 24px',
//       marginBottom: '0',
//       scrollBehavior: 'smooth',
//       backgroundColor: 'transparent',
//     },
//     dialogueEntry: (isLast) => ({
//       marginBottom: '12px',
//       padding: '0',
//       lineHeight: '1.6',
//       color: '#333',
//       opacity: isLast ? 0 : 1,
//       transform: isLast ? 'translateY(10px)' : 'translateY(0)',
//       animation: isLast ? 'fadeIn 0.3s forwards ease-out' : 'none',
//       animationDelay: '0.1s',
//     }),
//     evaEntry: {
//       display: 'flex',
//       marginBottom: '12px',
//       padding: '10px 14px',
//       backgroundColor: 'rgba(240, 240, 250, 0.95)',
//       borderRadius: '16px 16px 16px 4px',
//       maxWidth: '85%',
//       boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
//       color: '#333',
//     },
//     userEntry: {
//       display: 'flex',
//       marginBottom: '12px',
//       padding: '10px 14px',
//       backgroundColor: 'rgba(230, 240, 255, 0.95)',
//       borderRadius: '16px 16px 4px 16px',
//       maxWidth: '85%',
//       marginLeft: 'auto',
//       boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
//       color: '#2c5282',
//     },
//     speaker: {
//       fontWeight: '600',
//       fontSize: '14px',
//       marginBottom: '4px',
//       color: '#555',
//     },
//     text: {
//       fontSize: '15px',
//       whiteSpace: 'pre-wrap',
//       color: '#333',
//     },
//     inputForm: {
//       display: 'flex',
//       width: '100%',
//       backgroundColor: 'transparent',
//       padding: '8px 12px',
//       alignItems: 'center',
//     },
//     inputField: {
//       flex: 1,
//       padding: '12px 18px',
//       fontSize: '15px',
//       border: 'none',
//       borderRadius: '24px',
//       backgroundColor: 'rgba(255, 255, 255, 0.9)',
//       color: '#333',
//       fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
//       resize: 'none',
//       minHeight: '38px',
//       outline: 'none',
//       boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
//       transition: 'box-shadow 0.2s ease, background-color 0.2s ease',
//       width: '100%',
//     },
//     submitButton: {
//       backgroundColor: '#4285F4',
//       color: 'white',
//       border: 'none',
//       borderRadius: '50%',
//       width: '40px',
//       height: '40px',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       marginLeft: '10px',
//       cursor: 'pointer',
//       boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
//       transition: 'transform 0.2s ease, background-color 0.2s ease',
//     },
//     buttonHover: {
//       transform: 'scale(1.05)',
//       backgroundColor: '#3367D6',
//     },
//     '@keyframes fadeIn': {
//       from: {
//         opacity: 0,
//         transform: 'translateY(10px)',
//       },
//       to: {
//         opacity: 1,
//         transform: 'translateY(0)',
//       },
//     },
//   };

//   // Add keyframes to document
//   useEffect(() => {
//     const style = document.createElement('style');
//     style.innerHTML = `
//       @keyframes fadeIn {
//         from {
//           opacity: 0;
//           transform: translateY(10px);
//         }
//         to {
//           opacity: 1;
//           transform: translateY(0);
//         }
//       }
//     `;
//     document.head.appendChild(style);
//     return () => {
//       document.head.removeChild(style);
//     };
//   }, []);

//   const [buttonHover, setButtonHover] = useState(false);

//   return (
//     <div style={styles.container}>
//       {/* Dialogue Display Box */}
//       <div 
//         ref={dialogueContainerRef} 
//         style={styles.dialogueContainer}
//       >
//         {dialogueEntries.map((entry, index) => (
//           <div 
//             key={index} 
//             style={entry.speaker === 'EVA' ? styles.evaEntry : styles.userEntry}
//           >
//             <div style={{width: '100%'}}>
//               <div style={styles.speaker}>{entry.speaker}</div>
//               <div style={styles.text}>{entry.text}</div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* User Input Box - without send button */}
//       <form onSubmit={handleSubmit} style={styles.inputForm}>
//         <textarea
//           ref={textareaRef}
//           value={userInput}
//           onChange={handleInputChange}
//           placeholder={placeholder}
//           style={styles.inputField}
//           rows={1}
//           onKeyDown={(e) => {
//             if (e.key === 'Enter' && !e.shiftKey) {
//               e.preventDefault();
//               handleSubmit(e);
//             }
//           }}
//         />
//       </form>
//     </div>
//   );
// };

// export default DialogueInputComponent;

import React, { useState, useRef, useEffect } from 'react';

const DialogueInputComponent = ({ initialDialogue = [], placeholder = "Type your response here..." }) => {
  // State for storing all dialogue entries (predefined + user input)
  const [dialogueEntries, setDialogueEntries] = useState(initialDialogue);
  // State for the current user input
  const [userInput, setUserInput] = useState('');
  // Ref for the dialogue container to allow scrolling
  const dialogueContainerRef = useRef(null);
  // Animation state for new messages
  const [lastEntryIndex, setLastEntryIndex] = useState(-1);

  // Auto-scroll to bottom when dialogue changes
  useEffect(() => {
    // Only auto-scroll if the user adds a message, not on initial load or external updates
    if (dialogueEntries.length > 0 && dialogueEntries[dialogueEntries.length - 1].speaker === 'You') {
      if (dialogueContainerRef.current) {
        dialogueContainerRef.current.scrollTop = dialogueContainerRef.current.scrollHeight;
      }
      if (dialogueEntries.length > 0) {
        setLastEntryIndex(dialogueEntries.length - 1);
      }
    }
  }, [dialogueEntries]);

  // Handle input change
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  // Handle input submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (userInput.trim() === '') return;
    
    // Add user input to dialogue with "You:" prefix
    const newEntry = {
      speaker: 'You',
      text: userInput.trim()
    };
    
    setDialogueEntries([...dialogueEntries, newEntry]);
    setUserInput(''); // Clear input field after submission
  };

  // Auto-resize input field as user types
  const textareaRef = useRef(null);
  
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = 'auto';
      // Set the height to scrollHeight to fit content
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
    }
  }, [userInput]);

  const styles = {
    container: {
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '94%',
      maxWidth: '950px', 
      margin: '0 auto',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      zIndex: 50,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
      border: 'none',
      borderRadius: '16px',
      overflow: 'hidden',
      backdropFilter: 'blur(5px)',
      WebkitBackdropFilter: 'blur(5px)',
      maxHeight: '280px',
    },
    dialogueContainer: {
      maxHeight: '150px',
      overflowY: 'auto',
      padding: '16px 24px',
      marginBottom: '0',
      scrollBehavior: 'smooth',
      backgroundColor: 'transparent',
    },
    dialogueEntry: (isLast) => ({
      marginBottom: '12px',
      padding: '0',
      lineHeight: '1.6',
      color: '#333',
      opacity: isLast ? 0 : 1,
      transform: isLast ? 'translateY(10px)' : 'translateY(0)',
      animation: isLast ? 'fadeIn 0.3s forwards ease-out' : 'none',
      animationDelay: '0.1s',
    }),
    evaEntry: {
      display: 'flex',
      marginBottom: '12px',
      padding: '10px 14px',
      backgroundColor: 'rgba(240, 240, 250, 0.95)',
      borderRadius: '16px 16px 16px 4px',
      maxWidth: '85%',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
      color: '#333',
    },
    userEntry: {
      display: 'flex',
      marginBottom: '12px',
      padding: '10px 14px',
      backgroundColor: 'rgba(230, 240, 255, 0.95)',
      borderRadius: '16px 16px 4px 16px',
      maxWidth: '85%',
      marginLeft: 'auto',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
      color: '#2c5282',
    },
    speaker: {
      fontWeight: '600',
      fontSize: '14px',
      marginBottom: '4px',
      color: '#555',
    },
    text: {
      fontSize: '15px',
      whiteSpace: 'pre-wrap',
      color: '#333',
    },
    inputForm: {
      display: 'flex',
      width: '100%',
      backgroundColor: 'transparent',
      padding: '8px 12px',
      alignItems: 'center',
    },
    inputField: {
      flex: 1,
      padding: '12px 18px',
      fontSize: '15px',
      border: 'none',
      borderRadius: '24px',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      color: '#333',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      resize: 'none',
      minHeight: '38px',
      outline: 'none',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
      transition: 'box-shadow 0.2s ease, background-color 0.2s ease',
      width: '100%',
    },
    submitButton: {
      backgroundColor: '#4285F4',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: '10px',
      cursor: 'pointer',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s ease, background-color 0.2s ease',
    },
    buttonHover: {
      transform: 'scale(1.05)',
      backgroundColor: '#3367D6',
    },
    '@keyframes fadeIn': {
      from: {
        opacity: 0,
        transform: 'translateY(10px)',
      },
      to: {
        opacity: 1,
        transform: 'translateY(0)',
      },
    },
  };

  // Add keyframes to document
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const [buttonHover, setButtonHover] = useState(false);

  return (
    <div style={styles.container}>
      {/* Dialogue Display Box */}
      <div 
        ref={dialogueContainerRef} 
        style={styles.dialogueContainer}
      >
        {dialogueEntries.map((entry, index) => (
          <div 
            key={index} 
            style={entry.speaker === 'EVA' ? styles.evaEntry : styles.userEntry}
          >
            <div style={{width: '100%'}}>
              <div style={styles.speaker}>{entry.speaker}</div>
              <div style={styles.text}>{entry.text}</div>
            </div>
          </div>
        ))}
      </div>

      {/* User Input Box - without send button */}
      <form onSubmit={handleSubmit} style={styles.inputForm}>
        <textarea
          ref={textareaRef}
          value={userInput}
          onChange={handleInputChange}
          placeholder={placeholder}
          style={styles.inputField}
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
      </form>
    </div>
  );
};

export default DialogueInputComponent;