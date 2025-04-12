import React, { useState, useEffect } from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';

const containerBaseStyle = {
    position: 'absolute',
    background: 'rgba(255,255,255,0.9)',
    padding: '10px 20px',
    borderRadius: '8px',
    maxWidth: '600px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    fontFamily: '"Georgia", serif',
};

const titleStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '12px',
    textAlign: 'center',
    color: '#222',
};

const baseItemStyle = {
    userSelect: 'none',
    padding: '12px 20px',
    margin: '0 0 8px 0',
    borderRadius: '6px',
    background: '#ffffff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    cursor: 'grab',
    transition: 'all 0.2s ease',
};

const draggingItemStyle = {
    opacity: 0.7,
    transform: 'scale(1.05)',
    backgroundColor: '#e0f7fa',
    cursor: 'grabbing',
};

const RankableListDisplay = ({ title, items, onRankChange, top, left, right, listId }) => {
    const [listItems, setListItems] = useState(items);
    const [draggingIndex, setDraggingIndex] = useState(null);

    useEffect(() => {
        const cleanupFns = listItems.map((item, index) => {
            const elementId = `${listId}-draggable-${index}`;
            const element = document.getElementById(elementId);
            if (!element) return () => {};

            const cleanupDraggable = draggable({
                element,
                getInitialData: () => ({ index, listId }),
                onDragStart: () => setDraggingIndex(index),
                onDragEnd: () => setTimeout(() => setDraggingIndex(null), 50),
            });

            const cleanupDropTarget = dropTargetForElements({
                element,
                canDrop: ({ source }) => source.data.listId === listId,
                onDrop: ({ source }) => {
                    const fromIndex = source.data.index;
                    const toIndex = index;
                    if (fromIndex !== toIndex) {
                        const updatedItems = Array.from(listItems);
                        const [movedItem] = updatedItems.splice(fromIndex, 1);
                        updatedItems.splice(toIndex, 0, movedItem);
                        setListItems(updatedItems);
                        if (onRankChange) onRankChange(updatedItems);
                    }
                    setTimeout(() => setDraggingIndex(null), 50);
                },
            });

            return combine(cleanupDraggable, cleanupDropTarget);
        });

        return () => {
            cleanupFns.forEach((cleanup) => cleanup());
        };
    }, [listItems, onRankChange, listId]);

    const containerStyle = {
        ...containerBaseStyle,
        top: top || 'auto',
        left: left || 'auto',
        right: right || 'auto',
    };

    return (
        <div style={containerStyle}>
            {title && <div style={titleStyle}>{title}</div>}
            <div>
                {listItems.map((item, index) => (
                    <div
                        key={index}
                        id={`${listId}-draggable-${index}`}
                        style={{
                            ...baseItemStyle,
                            ...(index === draggingIndex ? draggingItemStyle : {}),
                        }}
                    >
                        {index + 1}. {item}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RankableListDisplay;
