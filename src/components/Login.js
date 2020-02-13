import React from 'react';
import axios from 'axios';
import { Link ,Redirect } from 'react-router-dom';
import { updateToken, token$ } from '../store.js';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = { email: '', password: '', loggedIn: false, token: token$.value, loginError: false }

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.subscription = token$.subscribe((token) => this.setState({ token }));
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  onSubmit(e) {
    let url = 'http://3.120.96.16:3002/';

    e.preventDefault();

    axios.post(url + 'auth', {
      email: this.state.email,
      password: this.state.password
    })
    .then((response) => {
      updateToken(response.data.token);
    })
    .then((token) => {
      if (this.state.token === null) return;
      axios.get(url + 'todos', {
        headers: {
          Authorization: 'Bearer ' + this.state.token,
        },
      })
      .catch((err) => {
        console.log(err);
      });
    })
    .catch((err) => {
      this.setState({ loginError: true });
    });
  }

  render() {
    if(this.state.token){
      return <Redirect to='/todos'/>
    }

    return (
      <div className='login'>
        <form onSubmit={ this.onSubmit }>
          <label><b>Email</b></label>
          <input value={ this.state.email } className='em-pass-input' onChange={ (e) => {
            this.setState({ email: e.target.value, loginError: false });
          } } type='email'/>
          <p style={{ color: this.state.loginError ? '#ed493e': '#36393e' }}>Please enter valid email*</p>
          <label><b>Password</b></label>
          <input value={ this.state.password } className='em-pass-input' onChange={ (e) => {
            this.setState({ password: e.target.value, loginError: false  });
          } } type='password'/>
          <p style={{ color: this.state.loginError ? '#ed493e': '#36393e' }}>Please enter valid password*</p>
          <div className='login-buttons'>
            <input type='submit' value='Login'/>
            <Link onClick={ this.props.onClick } className='link' to='/register'>Register here now!</Link>
          </div>
        </form>
      </div>
    );
  }
}

export default Login;
