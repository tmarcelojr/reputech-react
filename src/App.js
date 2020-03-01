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
            <li className='nav-item' data-toggle="modal" data-target="#exampleModal">
              <Link 
                className='nav-link'
                >
                Login
              </Link>
            </li>
            <li className='nav-item'>
              <Link 
              className='nav-link'
              onClick={this.openRegisterModal} 
              to='/register'>Register</Link>
            </li>
          </ul>
        </nav>

        {/* LOGIN MODAL */}
        <div className="modal fade container h-100" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div 
            id='login_container' 
            className="modal-dialog d-flex justify-content-center" 
            role="document"
            data-backdrop="static"
          >
            <div className="modal-content user_card">
              <div className="d-flex justify-content-center">
                <div className="brand_logo_container">
                  <img src="https://cdn.freebiesupply.com/logos/large/2x/pinterest-circle-logo-png-transparent.png" className="brand_logo" alt="Logo" />
                </div>
              </div>
              <div className="d-flex justify-content-center form_container">
                <form>
                  <div className="input-group mb-3">
                    <div className="input-group-append">
                      <span className="input-group-text"><i className="fas fa-user"></i></span>
                    </div>
                    <input type="text" name="" className="form-control input_user" value="" placeholder="username" />
                  </div>
                  <div className="input-group mb-2">
                    <div className="input-group-append">
                      <span className="input-group-text"><i className="fas fa-key"></i></span>
                    </div>
                    <input type="password" name="" className="form-control input_pass" value="" placeholder="password" />
                  </div>
                  <div className="form-group">
                    <div className="custom-control custom-checkbox">
                      <input type="checkbox" className="custom-control-input" id="customControlInline" />
                      <label className="custom-control-label" for="customControlInline">Remember me</label>
                    </div>
                  </div>
                    <div className="d-flex justify-content-center mt-3 login_container">
                <button type="button" name="button" className="btn login_btn">Login</button>
                 </div>
                </form>
              </div>
          
              <div className="mt-4">
                <div className="d-flex justify-content-center links">
                  Don't have an account? <a href="#" className="ml-2">Sign Up</a>
                </div>
                <div className="d-flex justify-content-center links">
                  <a href="#">Forgot your password?</a>
                </div>
              </div>
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
        <Route path='/login'>
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