import React from 'react';

const listStyles = {
  container: ({ top = '200px', left, right, translateX, translateY }) => ({
    position: 'absolute',
    top,
    ...(left ? { left } : {}),
    ...(right ? { right } : {}),
    padding: '10px 20px',
    maxWidth: '400px',
    minWidth: '400px',
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transform: `translateX(${translateX || '0'}) translateY(${translateY || '0'})`,
  }),
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
    fontFamily: '"Georgia", serif',
    color: '#222',
    textAlign: 'center',
  },
  list: {
    textAlign: 'left',
    paddingLeft: '20px',
    fontFamily: '"Georgia", serif',
    fontSize: '16px',
    color: '#333',
  },
  item: {
    cursor: 'default',
    marginBottom: '6px',
  },
  clickableItem: {
    cursor: 'pointer',
    textDecoration: 'underline',
    color: '#007bff',
  },
};

const ListDisplay = ({ items, title, top, left, right, translateX, translateY, onItemClick }) => {
  return (
    <div style={listStyles.container({ top, left, right, translateX, translateY })}>
      {title && <div style={listStyles.title}>{title}</div>}
      <ul style={listStyles.list}>
        {items.map((item, index) => (
          <li
            key={index}
            style={onItemClick ? { ...listStyles.item, ...listStyles.clickableItem } : listStyles.item}
            onClick={() => onItemClick && onItemClick(item)}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListDisplay;
