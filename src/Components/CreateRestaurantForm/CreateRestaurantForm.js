import React, { useState } from 'react';
import { Button } from '@aws-amplify/ui-react';
import './CreateRestaurantForm.css';

const CreateRestaurantForm = ({ formState, setInput, addTodo }) => {
  const [showCreateRestaurant, setShowCreateRestaurant] = useState(false);

  const handleToggleForm = () => {
    setShowCreateRestaurant(prevState => !prevState);
  };

  const handleAddTodo = async () => {
    if (!formState.name || !formState.description || !formState.city) return;

    const todo = { ...formState };
    await addTodo(todo); // Assuming addTodo handles API call or mutation

    // Close the form after adding the restaurant
    setShowCreateRestaurant(false);
  };

  return (
    <div>
      <Button className="createRestaurantButton" onClick={handleToggleForm}>
        {showCreateRestaurant ? 'Create Restaurant' : 'Create Restaurant'}
      </Button>

      {showCreateRestaurant && (
        <div className="createRestaurantFormOverlay">
          <div className="createRestaurantForm">
            <button className="closeButton" onClick={handleToggleForm}>
              X
            </button>
            <h2>Create Restaurant</h2>
            <input
              onChange={event => setInput('name', event.target.value)}
              className="input"
              value={formState.name}
              placeholder="Name"
            />
            <input
              onChange={event => setInput('description', event.target.value)}
              className="input"
              value={formState.description}
              placeholder="Description"
            />
            <input
              onChange={event => setInput('city', event.target.value)}
              className="input"
              value={formState.city}
              placeholder="City"
            />
            <Button onClick={handleAddTodo} className="createRestaurantFormButton">
              Create Restaurant
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateRestaurantForm;
