import React from 'react';

const listStyles = {
    container: ({ top = '200px', left, right }) => ({
        position: 'absolute',
        top,
        ...(left ? { left } : {}),
        ...(right ? { right } : {}),
        padding: '10px 20px',
        maxWidth: '600px',
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    }),
    title: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '10px',
        fontFamily: '"Georgia", serif',
        color: '#222',
        textAlign: 'center'
    },
    list: {
        textAlign: 'left',
        paddingLeft: '20px',
        fontFamily: '"Georgia", serif',
        fontSize: '16px',
        color: '#333',
    }
};

const ListDisplay = ({ items, title, top, left, right }) => {
    return (
        <div style={listStyles.container({ top, left, right })}>
            {title && <div style={listStyles.title}>{title}</div>}
            <ul style={listStyles.list}>
                {items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
};

export default ListDisplay;
