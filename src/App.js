import React, {useEffect, useState} from 'react';
import './App.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheck, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

library.add(faCheck, faSpinner, faTrash);
import List from './components/List';

const initialItem = {
  text: '',
  key: '',
};
const serverUrl = 'https://todoappserverjs.herokuapp.com';

function App() {
  const [currentItem, setCurrentItem] = useState(initialItem);
  const [itemsArray, setItemsArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingInProgress, setAddingInProgress] = useState(false);
  const handleInputChange = event => {
    setCurrentItem({
      text: event.target.value,
    });
  };

  const fetchItems = async () => {
    let todoItems = await fetch(serverUrl);
    todoItems = await todoItems.json();
    setItemsArray(todoItems);
    setLoading(false);
  }

  const postItem = data => {
    data.text = data.text.trim();
    setAddingInProgress(true);
    fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      let currentArray = itemsArray.slice();
      currentArray.push(data);
      setItemsArray(currentArray);
      setAddingInProgress(false);
    })
    .catch(error => console.error(error));
  }

  const addItem = event => {
    event.preventDefault();
    if (addingInProgress) return;
    if (!currentItem || currentItem.text.trim().length === 0 || currentItem.text.trim().length > 35) {
      alert('Please enter a valid text!');
      setCurrentItem(initialItem);  
      return;
    }
    postItem(currentItem);   
    setCurrentItem(initialItem);  
  };

  const deleteItem = key => {
    fetch(`${serverUrl}/${key}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(() => fetchItems());
  };

  const updateItem = (text, key) => {
    fetch(`${serverUrl}/${key}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({text})
    })
    .then(response => response.json())
    .then(() => fetchItems())
    .catch(error => console.error(error));                 
  };

  useEffect(() => {
    setLoading(true);
    fetchItems();
  }, []);
  
  if (loading) {
    return (<img className='loader' src='tail-spin.svg' />);
  }

  return (
    <div className='App'>
      <div className='center-div'>
        <h1>todos</h1>
        <form id='to-do-form' onSubmit={addItem}className='flex-container'>
            <input 
              type='text' 
              placeholder='Enter Todo Item'
              value={currentItem.text}
              onChange={handleInputChange} />
            <button type='submit' disabled={addingInProgress}>
              { addingInProgress ? <FontAwesomeIcon className='fa fa-spin' icon='spinner'/> : 'Add+'}
            </button>
        </form>
        <div className='item-container'>
          {itemsArray.map(item => <List 
            key={item._id} 
            item={item} 
            deleteItem={deleteItem}
            updateItem={updateItem}/>)}
        </div>
      </div>
    </div>  
  );
}

export default App;
