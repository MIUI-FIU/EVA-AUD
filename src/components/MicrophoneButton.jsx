import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Mic, MicOff } from "lucide-react";

const MicrophoneButton = () => {
  const [listening, setListening] = useState(false);

  const toggleMic = () => {
    setListening((prev) => !prev);
  };

  // Button with inline styles ensuring it's always visible
  const button = (
    <button
      onClick={toggleMic}
      style={{
        position: "fixed",
        bottom: "20px",  // Adjust this to move it closer or further
        left: "25%",   // Adjust this for horizontal positioning
        width: "70px",   // Adjust size of the button
        height: "70px",  // Adjust size of the button
        backgroundColor: listening ? "red" : "#ccc", // Background change on click
        color: "black",  // Text color
        zIndex: 9999,    // Ensure it appears on top of other elements
        borderRadius: "50%",  // Make it circular
        border: "3px solid black", // Border to make it stand out
        display: "flex",
        justifyContent: "center",  // Center icon inside button
        alignItems: "center",      // Center icon inside button
        fontSize: "18px",          // Icon size
      }}
      aria-label="Toggle Microphone"
    >
      {listening ? <MicOff size={40} /> : <Mic size={40} />}
    </button>
  );

  // Debugging the mount process
  useEffect(() => {
    console.log("MicrophoneButton mounted");
  }, []);

  return createPortal(button, document.body); // Renders button at document body
};

export default MicrophoneButton;
