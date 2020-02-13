import React from 'react';
import './App.css';
import { Route, BrowserRouter as Router, Redirect } from 'react-router-dom';
import { token$ } from './store.js';

import Reg from './components/Reg.js';
import Login from './components/Login.js';
import Todo from './components/Todo.js';
import Header from './components/Header.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { token: token$.value, isReg: false };

    this.onClickHeader = this.onClickHeader.bind(this);
  }

  componentDidMount() {

    this.subscription = token$.subscribe((token) => {
      this.setState({ token });
    });
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  onClickHeader(){
    if(this.state.isReg){
      this.setState({ isReg: false });
    }else {
      this.setState({ isReg: true });
    }
  }

  render() {
    return (
      <div className="App">
        <Router>
          <Route path="/" render={(props) => {
            const isReg = props.location.pathname === '/register' ? true : false;
            if(["/register", "/login", "/todos"].includes(props.location.pathname)) {
              return <Header isReg={ isReg } onClick={ this.onClickHeader }/>;
            } else {
              return <Redirect to="/" />;
            }
          }} />
          <Route exact path='/' render={() => <Redirect to="/login" />} />
          <Route path='/login' render={ () => <Login onClick={ this.onClickHeader }/> }/>
          <Route path='/register' render={ () => <Reg onClick={ this.onClickHeader }/> }/>
          <Route path='/todos' render={ () => <Todo/> }/>
        </Router>
      </div>
    );
  }
}

export default App;
