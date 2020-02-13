import React from 'react';
import { token$, updateToken } from '../store.js';
import { Link } from 'react-router-dom';
import jwt from 'jsonwebtoken';

class Header extends React.Component {
  constructor(props){
    super(props);

    this.state = { email: '', token: token$.value };

    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    this.subscription = token$.subscribe((token) => {
      if (token) {
        const decoded = jwt.decode(token);
        this.setState({ email: decoded.email, token: token });
      }
    });
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  logout() {
    updateToken(null)
    this.setState({ token: null });
  }

  render() {
    return (
      <header>
        <h1>{ this.state.token ? this.state.email :
          this.props.isReg ? 'Register Page': 'Login Page' }</h1>
        { this.state.token ? <button onClick={ this.logout }>Logout</button>:
          this.props.isReg ? <Link to='/login'><button onClick={ this.props.onClick }>Login</button></Link>:
          <Link to='/register'><button onClick={ this.props.onClick }>Register</button></Link>}

      </header>
    );
  }
}

export default Header;
