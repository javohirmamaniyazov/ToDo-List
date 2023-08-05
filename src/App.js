import React, { useEffect, useState } from 'react';
import { Amplify, API, graphqlOperation } from 'aws-amplify';
import { createTodo } from './graphql/mutations';
import { listTodos } from './graphql/queries';
import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const initialState = { name: '', description: '', city: '' };

const App = ({ signOut, user }) => {
  const [formState, setFormState] = useState(initialState);
  const [todos, setTodos] = useState([
    { id: 1, name: 'Plow Center', description: 'Our restaurant sell uzbek national foods', city: 'Tashkent' },
    { id: 2, name: 'Somsamisan Somsa', description: 'In our restuaran have more than 10 types of somsa', city: 'Jizzakx' },
    { id: 3, name: 'National Foods', description: 'National Foods center', city: 'Tashkent' },
    { id: 4, name: 'City Grill restaurant', description: 'Our foods best of the best', city: 'Tashkent' },
    { id: 5, name: 'Afsona Restaurant', description: 'Modest restaurant with a terrace serving soups, salads and grilled meats.', city: 'Tashkent' },
  ]);
  const [showCreateRestaurant, setShowCreateRestaurant] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Fetch todos from local storage on component mount
    const storedTodos = JSON.parse(localStorage.getItem('todos'));
    if (storedTodos && Array.isArray(storedTodos)) {
      setTodos(storedTodos);
    } else {
      fetchTodos(); // If no todos in local storage, fetch from backend API
    }
  }, []);

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos));
      const todos = todoData.data.listTodos.items;
      setTodos(todos);
    } catch (err) {
      console.log('error fetching todos');
    }
  }

  async function addTodo() {
    try {
      if (!formState.name || !formState.description || !formState.city) return;
      const todo = { ...formState };
      const updatedTodos = [...todos, todo];
      setTodos(updatedTodos);
      setFormState(initialState);
      await API.graphql(graphqlOperation(createTodo, { input: todo }));
      // Update the todos in local storage after adding a new todo
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
      setShowCreateRestaurant(false); // Close the create restaurant form
    } catch (err) {
      console.log('error creating todo:', err);
    }
  }

  const toggleDropdown = () => {
    setShowDropdown((prevState) => !prevState);
  };


  return (
    <div>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navbarItems}>
          <span style={styles.projectName}>
            <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Yelp_Logo.svg/930px-Yelp_Logo.svg.png?20210803213252' width="150px" height="65px" style={{ marginLeft: '35px'}}/>
          </span>
          <Button onClick={() => setShowCreateRestaurant(true)} style={styles.createRestaurantButton}>
            Create Restaurant
          </Button>
          <div style={styles.userProfileDropdown}>
            <Button onClick={toggleDropdown} style={styles.userNameButton}>
              {user.username} ▼
            </Button>
            {showDropdown && (
              <div style={styles.dropdownContent}>
                <div style={styles.dropdownItem} onClick={signOut}>
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Create Restaurant Form */}
      {showCreateRestaurant && (
        <div style={styles.createRestaurantFormOverlay}>
          <div style={styles.createRestaurantForm}>
            <button style={styles.closeButton} onClick={() => setShowCreateRestaurant(false)}>
              X
            </button>
            <h2>Create Restaurant</h2>
            <input
              onChange={(event) => setInput('name', event.target.value)}
              style={styles.input}
              value={formState.name}
              placeholder="Name"
            />
            <input
              onChange={(event) => setInput('description', event.target.value)}
              style={styles.input}
              value={formState.description}
              placeholder="Description"
            />
            <input
              onChange={(event) => setInput('city', event.target.value)}
              style={styles.input}
              value={formState.city}
              placeholder="City"
            />
            <Button onClick={addTodo} style={styles.createRestaurantFormButton}>
              Create Restaurant
            </Button>
          </div>
        </div>
      )}

      {/* Header Section */}
      <header style={styles.header}>
        <h2>Nice Restaurants List</h2>
        <table style={styles.restaurantTable}>
          <thead>
            <tr style={{backgroundColor: "#DCDCDC",}}>
              <th style={styles.tableHeader}>Restaurant Name</th>
              <th style={styles.tableHeader}>Description</th>
              <th style={styles.tableHeader}>Location City</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
              <tr key={todo.id} style={styles.restaurantRow}>
                <td style={styles.tableData}>{todo.name}</td>
                <td style={styles.tableData}>{todo.description}</td>
                <td style={styles.tableData}>{todo.city}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </header>
    </div>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#333',
    color: '#fff',
    padding: '3px 20px',
  },
  navbarItems: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  projectName: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  createRestaurantButton: {
    backgroundColor: 'black',
    color: 'white',
    fontSize: '18px',
    padding: '8px 16px',
    borderRadius: '4px',
  },
  userProfileDropdown: {
    position: 'relative',
    display: 'inline-block',
  },
  userName: {
    cursor: 'pointer',
    fontSize: '18px',
  },
  dropdownContent: {
    display: 'none',
    position: 'absolute',
    backgroundColor: '#f9f9f9',
    minWidth: '160px',
    boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
    zIndex: '1',
    right: '0',
  },
  dropdownItem: {
    cursor: 'pointer',
    padding: '12px 16px',
    textDecoration: 'none',
    display: 'block',
    color: 'black',
    ':hover': {
      backgroundColor: '#f1f1f1',
    },
  },
  createRestaurantFormOverlay: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createRestaurantForm: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
  },
  input: {
    border: 'none',
    backgroundColor: '#ddd',
    marginBottom: '10px',
    padding: '8px',
    fontSize: '18px',
    width: '100%',
  },
  createRestaurantFormButton: {
    backgroundColor: 'black',
    color: 'white',
    fontSize: '18px',
    padding: '12px 24px',
    borderRadius: '4px',
    cursor: 'pointer',
    float: 'right',
  },
  header: {
    padding: '20px',
  },
  restaurantCard: {
    marginBottom: '15px',
    border: '1px solid #ccc',
    padding: '10px',
    borderRadius: '8px',
  },
  restaurantName: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  restaurantDescription: {
    marginBottom: '5px',
  },
  restaurantCity: {
    color: '#666',
  },

  restaurantTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '15px',
  },
  restaurantRow: {
    borderBottom: '1px solid #ccc',
  },
  header: {
    padding: '20px',
  },
  restaurantCard: {
    marginBottom: '15px',
    border: '1px solid #ccc',
    padding: '10px',
    borderRadius: '8px',
  },
  restaurantName: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  restaurantDescription: {
    marginBottom: '5px',
  },
  restaurantCity: {
    color: '#666',
  },

  restaurantTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '15px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  tableHeader: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    padding: '10px',
    borderBottom: '1px solid #ccc',
  },
  restaurantRow: {
    borderBottom: '1px solid #ccc',
  },
  tableData: {
    padding: '10px',
    textAlign: 'center',
    fontSize: '16px',
  },

  restaurantTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '15px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  tableHeader: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    padding: '10px',
    border: '1px solid #ccc',
  },
  restaurantRow: {
    borderBottom: '1px solid #ccc',
  },
  tableData: {
    padding: '10px',
    textAlign: 'center',
    fontSize: '16px',
    border: '1px solid #ccc',
  },
  userProfileDropdown: {
    position: 'relative',
    display: 'inline-block',
    marginLeft: '10px',
  },
  userNameButton: {
    backgroundColor: 'transparent',
    color: '#eee',
    fontSize: '16px',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
    outline: 'none',
  },
  dropdownContent: {
    marginTop: '21px',
    position: 'absolute',
    top: '100%',
    right: '0',
    backgroundColor: '#333',
    borderRadius: '8px 0 8px 8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    zIndex: '1',
    display: 'flex',
    flexDirection: 'column',
  },
  dropdownItem: {
    padding: '10px 15px',
    cursor: 'pointer',
    color: '#eee',
    fontWeight: 'bold',
    marginRight: '55px'
  },

  closeButton: {
    border: 'none',
    backgroundColor: "#fff"
  }
};

export default withAuthenticator(App);
