import React, { useState } from 'react';

const InfoButton = ({ onClick, title = "More info" }) => {
    const [isHovered, setIsHovered] = useState(false);

    const buttonStyle = {
        position: 'fixed',
        top: '8%',
        right: '50%',
        transform: 'translateX(650%)',
        background: isHovered ? '#0056b3' : '#007bff', // darker blue on hover
        border: 'none',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        color: 'white',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '30px',
        transition: 'background 0.2s ease-in-out',
    };

    return (
        <button 
            onClick={onClick} 
            title={title}
            style={buttonStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            i
        </button>
    );
};

export default InfoButton;
