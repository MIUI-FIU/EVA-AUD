import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Mic, MicOff } from "lucide-react";

const MicrophoneButton = () => {
  const [listening, setListening] = useState(false); // Initially OFF

  const toggleMic = () => {
    setListening((prev) => !prev);
  };

  const button = (
    <button
      onClick={toggleMic}
      style={{
        position: 'fixed',
        bottom: '260px',
        left: '50%',
        transform: 'translateX(-670%)',
        width: "70px",
        height: "70px",
        backgroundColor: listening ? "#ccc" : "red", // Grey when listening, Red when not
        color: "black",
        zIndex: 9999,
        borderRadius: "50%",
        border: "3px solid black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "18px",
        transition: 'background-color 0.3s ease',
      }}
      aria-label={listening ? "Turn off microphone" : "Turn on microphone"}
    >
      {listening ? <Mic size={40} /> : <MicOff size={40} />}
    </button>
  );

  useEffect(() => {
    console.log("MicrophoneButton mounted, mic is OFF by default");
  }, []);

  return createPortal(button, document.body);
};

export default MicrophoneButton;
