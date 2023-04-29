import React, { useEffect, useState } from 'react';
import { Amplify, API, graphqlOperation } from 'aws-amplify';
import { createTodo, deleteTodo } from '../../graphql/mutations';
import { listTodos } from '../../graphql/queries';
import { withAuthenticator } from '@aws-amplify/ui-react';
import './Yelp.css';
import awsExports from '../../aws-exports';
import Navbar from '../Navbar/Navbar';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';

Amplify.configure(awsExports);

const initialState = { name: '', description: '' };

const Yelp = ({ signOut, user }) => {
  const [formState, setFormState] = useState(initialState);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
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
      if (!formState.name || !formState.description) return;
      const todo = { ...formState };
      setTodos([...todos, todo]);
      setFormState(initialState);
      await API.graphql(graphqlOperation(createTodo, { input: todo }));
    } catch (err) {
      console.log('error creating todo:', err);
    }
  }

  async function removeTodo(todoId) {
    try {
      const newTodosArray = todos.filter((todo) => todo.id !== todoId);
      setTodos(newTodosArray);
      await API.graphql(graphqlOperation(deleteTodo, { input: { id: todoId } }));
    } catch (err) {
      console.log('error deleting todo:', err);
    }
  }

  return (
    <>
      <Navbar user={user} signOut={signOut} />
      
      <div className="containerr ">
        <Row>
          <div class="sidebar">
            <Col style={{ marginLeft: "20px" }} md={3} className=''>
              <h2 className='mb-4 d-flex justify-content-center'>Creating Restaurant</h2>
              <Card className="">
                <Card.Body>
                  <Form>
                    <Form.Group controlId="formName">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter name"
                        onChange={(event) => setInput('name', event.target.value)}
                        value={formState.name}
                      />
                    </Form.Group>
                    <Form.Group controlId="formDescription">
                      <Form.Label className='mt-2'>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter description"
                        onChange={(event) => setInput('description', event.target.value)}
                        value={formState.description}
                      />
                    </Form.Group>
                    <Button className='mt-2 w-100' variant="primary" type="button" onClick={addTodo}>
                      Add Restaurant
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </div>
          <div class="main-content">
            <Col md={8}>
              <div className="todoList patrul" >
                {todos.map((todo, index) => (
                  <Card className="" key={index}>
                    <Card.Body>
                      <div className="todoItem">
                        <div className="todoName">{todo.name}</div>
                        <div className="todoDescription">{todo.description}</div>
                        <div className="todoActions">
                          <Button variant="danger" onClick={() => removeTodo(todo.id)}>Delete</Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Col>
          </div>
        </Row>
      </div>
    </>
  );
};

export default withAuthenticator(Yelp);
