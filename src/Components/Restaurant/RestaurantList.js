// RestaurantList.js
import React from 'react';
import './RestaurantList.css';

const RestaurantList = ({ todos }) => {
  return (
    <table className="restaurantTable">
      <thead>
        <tr style={{ backgroundColor: "#DCDCDC", }}>
          <th className="tableHeader">Restaurant Name</th>
          <th className="tableHeader">Description</th>
          <th className="tableHeader">Location City</th>
        </tr>
      </thead>
      <tbody>
        {todos.map((todo) => (
          <tr key={todo.id} className="restaurantRow">
            <td className="tableData">{todo.name}</td>
            <td className="tableData">{todo.description}</td>
            <td className="tableData">{todo.city}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};


export default RestaurantList;
