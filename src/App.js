import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'
import Home from './Home'
import Reviews from './Reviews'
// import CompanyShowPage from './CompanyShowPage'
import { FaUserCircle } from 'react-icons/fa'
import { FaUserCog } from 'react-icons/fa'
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
    loggedInUsername: null,
    // Reviews
    reviews: [],
    idOfReviewToEdit: -1
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
          loggedInUsername: loginJson.data.username
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
            loggedInUsername: registerJson.data.username
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
      COMPANY SHOW PAGE
=============================
*/

  showCompany = (id) => {
    console.log('we made it to showCompany funciton');
    console.log(id);
  }

/*
=============================
        USER REVIEWS
=============================
*/
  getReviews = async () => {
    console.log('we are in getReviews');
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
    // console.log('review to add', reviewToAdd);
    console.log('company id', company_id);
    console.log('type of company id', typeof(company_id));
    let id = company_id.toString()
    console.log('this is our id in string', id);
    console.log(typeof(id));

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
        // console.log("createReviewJson:", createReviewJson)
        let newReviewsState = this.state.reviews
        newReviewsState.push(createReviewJson.data)
        console.log('this is our reviews array', newReviewsState);
      // let newReviewsState = [...this.state.reviews, createReviewJson.data]
      // this.setState({
      //   reviews: newReviewsState
      // })
        // this.setState({
        //   reviews: [...this.state.reviews, createReviewJson.data]
        // })
      }
    } catch(err) {
      console.log(err);
    }
  }

  deleteReview = async (id) => {
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

  editReview = async (idOfReviewToEdit) => {
      this.setState({
        idOfReviewToEdit: idOfReviewToEdit
      })
    }

  updateReview = async (newInfo) => {
      try {
        const updateReviewRes = await fetch(process.env.REACT_APP_API_URL + "/api/v1/reviews/" + this.state.idOfReviewToEdit, {
          credentials: 'include',
          method: 'PUT',
          body: JSON.stringify(newInfo),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const updateReviewJson = await updateReviewRes.json()
        if(updateReviewRes.status === 200) {
          const reviews = this.state.reviews
          const indexOfReviewToUpdate = this.state.reviews.find(review => review.id === this.state.idOfReviewToEdit)
          reviews[indexOfReviewToUpdate] = updateReviewJson.data
          this.setState({
            reviews: reviews
          })
          const newReviewsArray = this.state.reviews.map((review) => {
            if(review.id === this.state.idOfReviewToEdit) {
              return updateReviewJson.data
            }
            else {
              return review
            }
          })
          this.setState({
            reviews: newReviewsArray
          })       
        }
        else {
          throw new Error("Could not edit review.")
        }
      } catch(err) {
        console.log(err);
      }
    } 


  render() {
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
              <li className='nav-item username'>
                <FaUserCog id='user_icon'/>
                  {this.state.loggedInUsername}
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
          />
        </Route>
        <Route path='/favorites'>
          <Favorites />
        </Route>
        <Route path='/'>
          <Home />
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
