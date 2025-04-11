import React from 'react';

const styles = {
    screen: {
        padding: '20px',
        margin: '20px',
        border: '2px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        textAlign: 'center',
    }
};

export const Screen1 = ({ onNext }) => {
    return (
        <div style={styles.screen}>
            <h2>Welcome to Screen 1</h2>
            <button onClick={onNext}>Go to Screen 2</button>
        </div>
    );
};

export const Screen2 = ({ onNext }) => {
    return (
        <div style={styles.screen}>
            <h2>Welcome to Screen 2</h2>
            <button onClick={onNext}>Go to Screen 3</button>
        </div>
    );
};

export const Screen3 = ({ onFinish }) => {
    return (
        <div style={styles.screen}>
            <h2>Welcome to Screen 3</h2>
            <button onClick={onFinish}>Finish</button>
        </div>
    );
};