import './App.css';
import { TodoWrapper } from './components/TodoWrapper';
import { Authenticator } from '@aws-amplify/ui-react'; 
import '@aws-amplify/ui-react/styles.css';

function App() {
  
  return (
    
    <div className="App">
      <Authenticator>
        {({ signOut, user }) => (
          user && 
          <>
            <h1>Hello {user.username}</h1>
            <TodoWrapper  />
            <button className="todo-btn" onClick={signOut}>Sign out</button>
          </>
        )}
      </Authenticator>
    </div>
  );
}

export default (App);
