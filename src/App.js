import './App.css';
import { Auth } from 'aws-amplify';
import { TodoWrapper } from './components/TodoWrapper';
import { Authenticator } from '@aws-amplify/ui-react'; 
import '@aws-amplify/ui-react/styles.css';
import { useState } from 'react';

function App() {

  const [userName, setUserName] = useState('');

  Auth.currentAuthenticatedUser()
    .then(user => setUserName(user.username))
    console.log(userName);
 
  
  return (
    
    <div className="App">
      <Authenticator>
        {({ signOut, user }) => (
          user && 
          <>
            <h1>Hello {user.attributes.email}</h1>
            <TodoWrapper  />
            <button className="todo-btn" onClick={signOut}>Sign out</button>
          </>
        )}
      </Authenticator>
    </div>
  );
}

export default (App);
