// import React, { useState } from "react";
// import { Todo } from "./Todo";
// import { TodoForm } from "./TodoForm";
// import { EditTodoForm } from "./EditTodoForm";
// import { API } from "aws-amplify";
// import { listTodos } from "../graphql/queries"; 
// import {createTodo, updateTodo, deleteTodo} from '../graphql/mutations';
// const generateRandomId = require('./idGen');



// export const TodoWrapper = () => {
//   const [todos, setTodos] = useState([]);

//   const addTodo = (todo) => {
//     setTodos([
//       ...todos,
//       { id: generateRandomId(10), task: todo, completed: false, isEditing: false },
//     ]);
//   }

//   const deleteTodo = (id) => setTodos(todos.filter((todo) => todo.id !== id));

//   const toggleComplete = (id) => {
//     setTodos(
//       todos.map((todo) =>
//         todo.id === id ? { ...todo, completed: !todo.completed } : todo
//       )
//     );
//   }

//   const editTodo = (id) => {
//     setTodos(
//       todos.map((todo) =>
//         todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
//       )
//     );
//   }

//   const editTask = (task, id) => {
//     setTodos(
//       todos.map((todo) =>
//         todo.id === id ? { ...todo, task, isEditing: !todo.isEditing } : todo
//       )
//     );
//   };

//   return (
//     <div className="TodoWrapper">
//       <h1>Get Things Done !</h1>
//       <TodoForm addTodo={addTodo} />
//       {/* display todos */}
//       {todos.map((todo) =>
//         todo.isEditing ? (
//           <EditTodoForm editTodo={editTask} task={todo} />
//         ) : (
//           <Todo
//             key={todo.id}
//             task={todo}
//             deleteTodo={deleteTodo}
//             editTodo={editTodo}
//             toggleComplete={toggleComplete}
//           />
//         )
//       )}
//     </div>
//   );
// };

import React, { useState, useEffect } from 'react';
import { listTodos } from '../graphql/queries';
import { createTodo, deleteTodo, updateTodo } from '../graphql/mutations';
import { Auth, API, graphqlOperation } from 'aws-amplify'; 
import { Todo } from "./Todo";
import { TodoForm } from "./TodoForm";
import { EditTodoForm } from "./EditTodoForm";




export const TodoWrapper = () => {
  const [userName, setUserName] = useState('');
  const [todos, setTodos] = useState([]);
  const [editTodoId, setEditTodoId] = useState(null);
  
  useEffect(() => {
    
    Auth.currentAuthenticatedUser()
      .then(user => {
        setUserName(user.username);
        
        console.log(userName);
        fetchTodos(user.username);
      })
      .catch(error => {
        console.error('Error fetching authenticated user', error);
      });
  }, [userName]);

  const fetchTodos = async (userName) => {
    try {
      const todoData = await API.graphql(
        graphqlOperation(listTodos, {
          filter: {
            name: { eq: userName },
          },
        })
      );
      console.log('Todo Data:', todoData);
      setTodos(todoData.data.listTodos.items);
    } catch (error) {
      console.error('Error fetching todos', error);
    }
  };

  const addTodo = async (todo) => {
    try {
      const newTodo = {
        task: todo,
        completed: false,
        isEditing: false,
        name: userName,
      };
      await API.graphql(graphqlOperation(createTodo, { input: newTodo }));
      console.log('Todo created!');
      fetchTodos(userName);
    } catch (error) {
      console.error('Error creating todo', error);
    }
  };

  const deleteTodoItem = async (id) => {
    try {
      await API.graphql(graphqlOperation(deleteTodo, { input: { id } }));
      fetchTodos(userName);
    } catch (error) {
      console.error('Error deleting todo', error);
    }
  };

  const toggleComplete = async (id) => {
    try {
      const todo = todos.find((todo) => todo.id === id);
      const updatedTodo = { ...todo, completed: !todo.completed };
      await API.graphql(graphqlOperation(updateTodo, { input: updatedTodo }));
      fetchTodos(userName);
    } catch (error) {
      console.error('Error updating todo', error);
    }
  };

  const startEditing = (id) => {
    setEditTodoId(id);
    console.log(editTodoId);
  };

  const saveEdit = async (task, id) => {
    try {
      const todo = todos.find((todo) => todo.id === id);
      const updatedTodo = { ...todo, task, isEditing: false };
      await API.graphql(graphqlOperation(updateTodo, { input: updatedTodo }));
      setEditTodoId(null);
      fetchTodos(userName);
    } catch (error) {
      console.error('Error updating todo', error);
    }
  };

  const cancelEdit = () => {
    setEditTodoId(null);
  };

  return (
    <div className="TodoWrapper">
      <h1>Get Things Done!</h1>
      <TodoForm addTodo={addTodo} />
      {/* Display todos */}
      {todos.map((todo) =>
        todo.isEditing ? (
          <EditTodoForm editTodo={saveEdit} task={todo} cancelEdit={cancelEdit} />
        ) : (
          <Todo
            key={todo.id}
            task={todo}
            deleteTodo={deleteTodoItem}
            editTodo={startEditing}
            toggleComplete={toggleComplete}
          />
        )
      )}
    </div>
  );
};
