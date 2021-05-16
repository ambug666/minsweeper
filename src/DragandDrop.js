import React from 'react';

const DragAndDrop = props => {
    let { children, onDrop } = props;
  const handleDragEnter = e => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragLeave = e => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragOver = e => {
    e.preventDefault();
    e.stopPropagation();
  };
    const handleDrop = e => {
        let data = e.dataTransfer.getData("data");
        let obj;
        if (data) {
            obj = JSON.parse(data);
        }
        onDrop && onDrop(obj);
        e.preventDefault();
        e.stopPropagation();
    };
    return (
        <div className={'drag-drop-zone'}
            onDrop={e => handleDrop(e)}
            onDragOver={e => handleDragOver(e)}
            onDragEnter={e => handleDragEnter(e)}
            onDragLeave={e => handleDragLeave(e)}
        >
            {children}
        </div>
    );
};
export default DragAndDrop;
