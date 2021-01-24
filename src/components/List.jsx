import React, {useRef, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import './List.css';

function List(props) {
    const [currentText, setCurrentText] = useState(props.item.text);
    const serverText = useRef(props.item.text);
    const [shouldDisplayCheckbox, setShouldDisplayCheckbox] = useState(false);

    const handleBlur = () => {
        let timeout = setTimeout(() => {
            clearTimeout(timeout);
           setShouldDisplayCheckbox(false);
        }, 300);
        if (serverText.current === currentText) return;
        if (!currentText || currentText.trim().length === 0 || currentText.trim().length > 35) {
            alert('Please enter a valid text!');
            setCurrentText(serverText.current);  
            return;
        }
        serverText.current = currentText.trim();
        setCurrentText(serverText.current);
        props.updateItem(currentText.trim(), props.item._id);
    }
    return (
        <div className='list'>
            <p className='in-flex-container'>
                <input type='text' 
                    value={currentText} 
                    onChange={event => setCurrentText(event.target.value)}
                    onFocus={() => setShouldDisplayCheckbox(true)}
                    onBlur={handleBlur}/>
                    <FontAwesomeIcon 
                        className={shouldDisplayCheckbox ? 'check-icon': 'check-icon-hidden'}
                        icon='check' onClick={() => props.updateItem(currentText, props.item._id)}/>
                    <FontAwesomeIcon 
                        className='delete-icon' icon='trash' 
                        onClick={() => props.deleteItem(props.item._id)}/>
            </p>
        </div>
    );
}

export default List;