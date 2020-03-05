import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'
import Home from './Home'
import Reviews from './Reviews'
import { FaUserCircle } from 'react-icons/fa'
import reputech_logo from './images/reputech_logo.png'
import logo from './images/logo.png'
import './App.css'

export default class App extends Component {
  state = {
    // Auth
    username: '',
    password: '',
    email: '',
    aboutMe: '',
    action: 'login',
    loggedIn: false,
    currentUserId: null,
    // Reviews
    reviews: []
  }

  componentDidMount = () => {
    this.checkLoginStatus()
  }
  
/*
=============================
            AUTH
=============================
*/

  login = async (loginInfo) => {
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
        this.setState({ 
          loggedIn: true,
          loggedInUsername: loginJson.data.username,
          currentUserId: loginJson.data.id
        })
      }
      window.$('#loginModal').modal('toggle')
    } catch(err) {
      console.log(err);
    }
  }

  register = async (registerInfo) => {
      try {
        const registerRes = await fetch(process.env.REACT_APP_API_URL + '/api/v1/users/register', {
          credentials: 'include', // Required for cookies
          method: 'POST',
          body: JSON.stringify(registerInfo),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const registerJson = await registerRes.json()
        console.log('this is our answer', registerJson);
        if(registerJson.status === 401) {
          this.setState({
            registerMessage: registerJson.message
          })
        }
        if(registerRes.status === 201) {
          this.setState({
            loggedIn: true,
            loggedInUsername: registerJson.data.username,
            currentUserId: registerJson.data.id
          })
          window.$('#loginModal').modal('toggle')
        }
      } catch(err) {
        console.log(err);
      }
    }

    logout = async () => {
    try {
      const logoutRes = await fetch(process.env.REACT_APP_API_URL + '/api/v1/users/logout', {
          credentials: 'include',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
      })
      const logoutJson = await logoutRes.json()
      console.log(logoutJson);
      if(logoutRes.status === 200) {
        this.setState({
          loggedIn: false,
          loggedInUsername: null
        })
      }
    } catch(err) {
      console.log(err);
    }
  }

  checkLoginStatus = async () => {
    try{
      const checkLoginRes = await fetch(process.env.REACT_APP_API_URL + '/api/v1/users/logged_in', {
          credentials: 'include',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
      })
      const checkLoginJson = await checkLoginRes.json()
      if(checkLoginRes.status === 200 ) {
        this.setState({ 
          loggedIn: true,
          loggedInUsername: checkLoginJson.data.username,
          currentUserId: checkLoginJson.data.id
        })
      }
      else {
        console.log(checkLoginJson.message);
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
    if(this.state.action === 'register') {
      this.register(this.state)
    }
    else {
      this.login(this.state)
    }
  }


/*
=============================
        USER REVIEWS
=============================
*/
  getReviews = async () => {
    try{
      const getReviewsRes = await fetch(process.env.REACT_APP_API_URL + '/api/v1/reviews')
      const reviewsJson = getReviewsRes.json()
      console.log(reviewsJson);
      this.setState({
        reviews: reviewsJson.data
      })
    } catch(err) {
      console.log(err);
    }
  }

  createReview = async (reviewToAdd, company_id) => {
    let id = company_id.toString()
    try{
      // console.log("reviewToAdd", reviewToAdd)
      const reviewToAddJson = JSON.stringify(reviewToAdd)
      // console.log("reviewToAddJSON", reviewToAddJson)
      const createReviewRes = await fetch(process.env.REACT_APP_API_URL + '/api/v1/reviews/' + id, {
          credentials: 'include',
          method: 'POST',
          body: (reviewToAddJson),
          headers: {
            'Content-Type': 'application/json'
          }
      })
      const createReviewJson = await createReviewRes.json()
      if(createReviewRes.status === 201) {
        let newReviewsState = []
        newReviewsState.push(createReviewJson.data)
        this.setState({
          reviews: newReviewsState
        })
      }
    } catch(err) {
      console.log(err);
    }
  }

  deleteReview = async (id) => {
    console.log('we are in delete review');
      try {
        const deleteReviewRes = await fetch(process.env.REACT_APP_API_URL + "/api/v1/reviews/" + id, {
          credentials: 'include',
          method: 'DELETE'
        })
        const deleteReviewJson = await deleteReviewRes.json();
        if(deleteReviewJson.status === 200) {
          this.setState({
            reviews: this.state.reviews.filter(review => review.id !== id) 
          })        
        }

        else {
          throw new Error("Could not delete review.")
        }
      } catch(err) {
        console.error(err)
      }
    }

  render() {
    console.log(this.state.currentUserId);
    return (
      <Router>
        <nav className='navbar navbar-expand-sm navbar-dark fixed-top'>
          <ul className='navbar-nav mr-auto'>
            <li className='nav-item'>
              <img id='logo' src={reputech_logo} alt='logo'/>
            </li>
            <li className='nav-item'>
              <Link className='nav-link' to='/'>Home</Link>
            </li>
            <li className='nav-item'>
              <Link className='nav-link' to='/reviews'>Reviews</Link>
            </li>
            <li className='nav-item'>
              <Link className='nav-link' to='/favorites'>
                Favorites
              </Link>
            </li>
          </ul>
          <ul className='navbar-nav ml-auto'>
            {
              this.state.loggedIn === true
              ?
              <li id='user-menu' className='nav-item'>
                 <div className='dropdown'>
                   <button
                    type='button'
                    className='dropdown-toggle fake-button'  
                    data-toggle='dropdown'
                    aria-haspopup='true'
                    aria-expanded='false'
                    id='dropdownMenuButton'
                  >
                  </button>
                  <div 
                    className='dropdown-menu'
                    aria-labelledby='dropdownMenuButton'
                  >
                    <button className='dropdown-item'>Edit Profile</button>
                    <button className='dropdown-item' onClick={this.logout}>Logout</button>
                  </div>
                 </div>
                <i className='username' >{this.state.loggedInUsername} </i>
              </li>
              :
              <li 
                className='nav-item nav-link' 
                data-toggle='modal' 
                data-target='#loginModal'
              >
                <span className='login'><FaUserCircle id='login_icon'/> Login</span>
            </li>
            }
          </ul>
        </nav>

        {/* LOGIN MODAL */}
        <div 
          className='modal fade' 
          id='loginModal' 
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
                    src={logo} 
                    className='brand_logo' 
                    alt='Logo' 
                  />
                </div>
              </div>
              <div className='d-flex justify-content-center form_container modal-body'>
                <form onSubmit={this.handleSubmit}>
                  <div className='input-group mb-2'>
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

                  {/* Displays register input fields in modal */}
                  {
                    this.state.action === 'register'
                    ?
                    <div className='input-group mb-2'>
                      <div className='input-group-append'>
                        <span className='input-group-text'><i className='fas fa-key'></i></span>
                      </div>
                      <input 
                        type='text' 
                        name='email' 
                        className='form-control input_pass'
                        onChange={this.onChange}
                        value={this.state.email} 
                        placeholder='email'
                        required=''
                        data-verify='email' 
                      />
                      <input
                        type='hidden'
                        name='about_me'
                        value={this.state.about_me}
                      />
                    </div>
                    : null
                    }

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
                    <div className='d-flex justify-content-center mt-1 login_container'>
                <button 
                  type='Submit' 
                  name='button' 
                  className='btn login_btn'
                >
                  {
                    this.state.action === 'register' 
                    ? 'Register' 
                    : 'Login'
                  }
                </button>
                 </div>
                </form>
              </div>
    
              {
                this.state.action === 'register'
                ?
                <div className='mt-2'>
                  <div className='d-flex justify-content-center links'>
                    <small>
                      Don't have an account? 
                      <span className='fake_link'onClick={this.switchForm}> Sign Up
                      </span>
                    </small>
                  </div>
                  <div id='login_form' className='d-flex justify-content-center links'>
                    <small>
                      <span className='fake_link'>Forgot your password?</span>
                    </small>
                  </div>
                </div>
                :
                <div className='mt-1'>
                  <div id='login_form' className='d-flex justify-content-center links'>
                    <small>Already have an account? <span className='fake_link'onClick={this.switchForm}> Login</span></small>
                  </div>
                </div>
              }  
            </div>
          </div>
        </div>

      <Switch>
        <Route path='/reviews'>
          <Reviews
            createReview={this.createReview}
            reviews={this.state.reviews}
            getReviews={this.getReviews}
            deleteReview={this.deleteReview}
            editReview={this.editReview}
            currentUserId={this.state.currentUserId}
          />
        </Route>
        <Route path='/favorites'>
          <Favorites />
        </Route>
        <Route path='/'>
          <Home 
            currentUser={this.checkLoginStatus}
          />
        </Route>
      </Switch>
    </Router>

    )
  }
}

function Favorites() {
  return(
    <div>
    <h2>Favorites page</h2>
    <h2>Favorites page</h2>
    <h2>Favorites page</h2>
    <h2>Favorites page</h2>
    <h2>Favorites page</h2>
    <h2>Favorites page</h2>
    <h2>Favorites page</h2>
    <h2>Favorites page</h2>
    <h2>Favorites page</h2>
    <h2>Favorites page</h2>
    </div>
  )
}
