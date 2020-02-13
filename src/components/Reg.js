import React from 'react';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
import { token$ } from '../store.js';

class Reg extends React.Component {
  constructor(props) {
    super(props);

    this.state = { email: '', password: '', isReg: false, token: token$.value, regError: false };

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
    this.props.onClick();

    axios.post(url + 'register', {
      email: this.state.email,
      password: this.state.password
    })
    .then(response => {
      this.setState({ isReg: true})
    })
    .catch(err => {
      console.log(err);
      this.setState({ regError: true });
    })
  }

  render() {
    if(this.state.isReg){
      return <Redirect to='/login'/>
    }
    else if(this.state.token){
      return <Redirect to='/todos'/>
    }

    return (
      <div className='login'>
        <form onSubmit={ this.onSubmit }>
          <label><b>Email</b></label>
          <input value={ this.state.email } className='em-pass-input' onChange={ (e) => {
            this.setState({ email: e.target.value, regError: false });
          } } type='email'/>
          <p style={{ color: this.state.regError ? '#ed493e': '#36393e' }}>Please enter valid email*</p>
          <label><b>Password</b></label>
          <input value={ this.state.password } className='em-pass-input' onChange={ (e) => {
            this.setState({ password: e.target.value, regError: false });
          } } type='password'/>
          <p style={{ color: this.state.regError ? '#ed493e': '#36393e' }}>Password must contain 1-40 characters*</p>
          <div className='login-buttons'>
            <input type='submit' value='Register'/>
            <Link onClick={ this.props.onClick } className='link' to='/login'>Already a user? Click here!</Link>
          </div>
        </form>
      </div>
    );
  }
}

export default Reg;
