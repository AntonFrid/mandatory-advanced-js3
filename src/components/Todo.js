import React from 'react';
import axios from 'axios';
import { token$ } from '../store.js';
import { Redirect } from 'react-router-dom';

class Todo extends React.Component {
  constructor(props) {
    super(props);

    this.state = { list: [], input: '', token: token$.value, todoError: false };

    this.array = [];

    this.remove = this.remove.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    let url = 'http://3.120.96.16:3002/';

    this.subscription = token$.subscribe((token) => this.setState({ token }));

    if(!this.state.token){
      return;
    }else{
      axios.get(url + 'todos', {
        headers: {
          Authorization: 'bearer ' + this.state.token
        }
      })
      .then(response => {
        this.setState({ list: response.data.todos })
      })
      .catch(error => {
        console.log('Unauthorized at todo');
        localStorage.clear();
        this.setState({ token: token$.value });
      })
    }
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  onSubmit(e) {
    let url = 'http://3.120.96.16:3002/';

    e.preventDefault();

    if(this.state.input.replace(/\s/g, '').length === 0){
      this.setState({ input: '', todoError: true });
      return;
    }

    axios.post(url + 'todos', {
      content: this.state.input
    },
    {
      headers: {
        Authorization: 'bearer ' + this.state.token
      }
    })
    .then(() => {
      this.setState({ input: '' })

      axios.get(url + 'todos', {
        headers: {
          Authorization: 'bearer ' + this.state.token
        }
      })
      .then(response => {
        this.setState({ list: response.data.todos })
      })
      .catch(err => {
        console.log(err);
      })
    })
    .catch(err => {
      console.log(err.response.status);
      this.setState({ todoError: true });
    })
  }

  remove (e) {
    let url = 'http://3.120.96.16:3002/';

    axios.delete(url + 'todos/' + e.target.id, {
      headers: {
        Authorization: 'bearer ' + this.state.token
      }
    })
    .then(() => {
      axios.get(url + 'todos', {
        headers: {
          Authorization: 'bearer ' + this.state.token
        }
      })
      .then(response => {
        this.setState({ list: response.data.todos })
      })
      .catch(err => {
        console.log(err);
      })
    })
    .catch(err => {
      console.log(err);
    })
  }

  render() {
    if(!this.state.token){
      return <Redirect to='/login'/>
    }

    return (
      <div className='todo-box'>
        <h2>Todo List</h2>
        <form onSubmit={ this.onSubmit }>
          <input className='todo-input' type="text" value={ this.state.input } onChange={ (e) => {
            this.setState({ input: e.target.value, todoError: false })
          }}/>
          <input className='check-button' type='submit' value='✓'/>
        </form>
        <p style={{ color: this.state.todoError ? '#ed493e': '#36393e' }}>Todo must be 1-100 characters*</p>
          <ul>
          {this.state.list.map((value, index) => {
            return (
              <li key={value.id}>
              {value.content}
              <button id={value.id} onClick={this.remove}>✘</button>
              </li>
            )
          })}
        </ul>
      </div>
    );
  }
}

export default Todo
