// IntroBox.js
import React from 'react';

const IntroBox = ({ onContinue }) => (
    <div style={{
        padding: '1rem',
        margin: '1rem auto',
        maxWidth: '600px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        fontSize: '1.1rem',
        lineHeight: '1.5'
    }}>
        <strong>Welcome!</strong>
        <p>This app demonstrates dynamic facial expressions using Unity. Once the setup is complete, you can interact with the interface to control Action Units and Visemes.</p>
        
        <button 
            onClick={onContinue}
            style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                fontSize: '1rem',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
            }}
        >
            Continue
        </button>
    </div>
);

export default IntroBox;
