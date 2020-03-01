import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'
import './App.css'

export default class App extends Component {
  state = {
    username: '',
    password: '',
    action: 'login',
    loggedIn: false
  }

/*
=============================
            AUTH
=============================
*/

login = async (loginInfo) => {
  console.log('we are in login', loginInfo);
  try{
    const loginRes = await fetch(process.env.REACT_APP_API_URL + '/api/v1/users/login', {
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify(loginInfo),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const loginJson = await loginRes.json()
    console.log('this is our loginJson', loginJson);
    if(loginRes.status === 200) {
      this.setState({ loggedIn: true })
    }
  } catch(err) {
    console.log(err);
  }
}

/*
=============================
     LOGIN/REGISTER FORM
=============================
*/

  switchForm = () => {
    this.setState({
      action: this.state.action === 'register' ? 'login' : 'register'
    })
  }

  onChange = (e) => {
    e.preventDefault()
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.login(this.state)
  }

  render() {
    return (
      <Router>
        <nav className='navbar navbar-expand-sm navbar-dark fixed-top'>
          <ul className='navbar-nav mr-auto'>
            <li className='nav-item'>
              <Link className='nav-link' to='/'>Home</Link>
            </li>
            <li className='nav-item'>
              <Link className='nav-link' to='/reviews'>Reviews</Link>
            </li>
            <li className='nav-item'>
              <Link className='nav-link' to='/favorites'>Favorites</Link>
            </li>
          </ul>
          <ul className='navbar-nav ml-auto'>
            <li 
              className='nav-item nav-link' 
              data-toggle='modal' 
              data-target='#exampleModal'
            >
              Login
            </li>
            <li className='nav-item'>
              <Link 
                className='nav-link'
                onClick={this.openRegisterModal} 
                to='/register'>Register
              </Link>
            </li>
          </ul>
        </nav>

        {/* LOGIN MODAL */}
        <div 
          className='modal fade' 
          id='exampleModal' 
          tabIndex='-1' 
          role='dialog' 
          aria-labelledby='exampleModalLabel' 
          aria-hidden='true'
        >
          <div 
            id='login_container' 
            className='modal-dialog d-flex justify-content-center' 
            role='document'
            data-backdrop='true'
          >
            <div className='modal-content user_card'>
              <div className='d-flex justify-content-center'>
                <div className='brand_logo_container'>
                  <img 
                    src='https://cdn.freebiesupply.com/logos/large/2x/pinterest-circle-logo-png-transparent.png' 
                    className='brand_logo' 
                    alt='Logo' 
                  />
                </div>
              </div>
              <div className='d-flex justify-content-center form_container modal-body'>
                <form onSubmit={this.handleSubmit}>
                  <div className='input-group mb-3'>
                    <div className='input-group-append'>
                      <span className='input-group-text'><i className='fas fa-user'></i></span>
                    </div>
                    <input 
                      type='text' 
                      name='username' 
                      className='form-control input_user' 
                      onChange={this.onChange}
                      value={this.state.username}
                      placeholder='username' 
                    />
                  </div>
                  <div className='input-group mb-2'>
                    <div className='input-group-append'>
                      <span className='input-group-text'><i className='fas fa-key'></i></span>
                    </div>
                    <input 
                      type='password' 
                      name='password' 
                      className='form-control input_pass'
                      onChange={this.onChange}
                      value={this.state.password} 
                      placeholder='password' 
                    />
                  </div>
                  <div className='form-group'>
                    <div className='custom-control custom-checkbox'>
                      <input 
                        type='checkbox' 
                        className='custom-control-input' 
                        id='customControlInline' 
                      />
                      <label 
                        className='custom-control-label' 
                        htmlFor='customControlInline'
                      >
                        Remember me
                      </label>
                    </div>
                  </div>
                    <div className='d-flex justify-content-center mt-3 login_container'>
                <button type='Submit' name='button' className='btn login_btn'>
                  {this.state.action === 'register' ? 'Register' : 'Login'}
                </button>
                 </div>
                </form>
              </div>
    
              {
                this.state.action === 'register'
                ?
                <div className='mt-4'>
                  <div className='d-flex justify-content-center links'>
                    <small>Don't have an account? <span className='fake_link'onClick={this.switchForm}> Sign Up</span></small>
                  </div>
                  <div className='d-flex justify-content-center links'>
                    <small>
                      <span className='fake_link'>Forgot your password?</span>
                    </small>
                  </div>
                </div>
                :
                <div className='mt-4'>
                  <div className='d-flex justify-content-center links'>
                    <small>Already have an account? <span className='fake_link'onClick={this.switchForm}> Login</span></small>
                  </div>
                </div>
              }  
            </div>
          </div>
        </div>

      <Switch>
        <Route path='/reviews'>
          <Reviews />
        </Route>
        <Route path='/favorites'>
          <Favorites />
        </Route>
        <Route path='/register'>
          <Register />
        </Route>
        <Route path='/'>
          <Home />
        </Route>
      </Switch>
    </Router>

    )
  }
}

function Reviews() {
  return <h2>Reviews page</h2>
}

function Favorites() {
  return <h2>Favorites page</h2>
}

function Register() {
  return <h2>Register page</h2>
}

function Home() {
  return <h2>Home page</h2>
}