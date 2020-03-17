import React, { Component } from 'react'
import EditReviewForm from '../EditReviewForm'
import StarRatings from 'react-star-ratings'
import { FaCaretDown, FaCaretUp } from 'react-icons/fa'
import './custom.css'

export default class Reviews extends Component {
	state = {
		averageRatings: [],
		websiteData: [],
		showReviews: false,
		toShowPage: false,
		userReviews: [],
		organizedReviews: [],
		companyUserRatings: [],
		review: {
			stars: [1, 2, 3, 4, 5]
		}
	}

	componentDidMount = async () => {
		await this.getRatings()
		await this.getWebsiteData()
		await this.getCompanyReviews()
		await this.organizeReviews()
		await this.findUserAverageRatings()
		await this.showReviews()
	}

	getRatings = async () => {
		try{
			const ratingRes = await fetch(process.env.REACT_APP_API_URL + '/api/v1/collected_reviews', {
				credentials: 'include',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
			})
			const ratingJson = await ratingRes.json()
			this.setState({
				averageRatings: ratingJson.data
			})
		} catch(err) {
			console.log(err);
		}
	}

	getWebsiteData = async () => {
		try{
			const dataRes = await fetch(process.env.REACT_APP_API_URL + '/api/v1/companies', {
				credentials: 'include',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
			})
			const dataJson = await dataRes.json()

			this.setState({
				websiteData: dataJson.data
			})
		} catch(err) {
			console.log(err);
		}
	}

	getCompanyReviews = async () => {
		try{
			const reviewsRes = await fetch(process.env.REACT_APP_API_URL + '/api/v1/reviews', {
				credentials: 'include',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
			})
			const reviewsJson = await reviewsRes.json()
			this.setState({
				userReviews: reviewsJson.data
			})
		} catch(err) {
			console.log(err);
		}
	}

	editReview = (review) => {
		this.setState({
			review: {
				stars: review.stars,
				title: review.title,
				content: review.content,
				id: review.id
			}
		})
	}

	updateReview = async (newInfo) => {
    try {
      const updateReviewRes = await fetch(process.env.REACT_APP_API_URL + '/api/v1/reviews/' + newInfo.id, {
        credentials: 'include',
        method: 'PUT',
        body: JSON.stringify(newInfo),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const updateReviewJson = await updateReviewRes.json()
      console.log('updateReviewJson', updateReviewJson);
      if(updateReviewRes.status === 200) {
        const reviews = this.state.reviews
        this.setState({
          reviews: reviews
        })
      }
      window.$('#editModal').modal('toggle')
      window.location.reload()
    } catch(err) {
      console.log(err);
    }
  }


	handleChange = (e) => {
		let newReviewState = this.state.review
		newReviewState[e.target.name] = e.target.value
		this.setState(newReviewState)
	}

	organizeReviews = () => {
		let companyReviews = []
		for(let i = 0; i < this.state.websiteData.length; i++) {
			let reviewsForThisCo = []
			// loop through userReviews array
			for(let j=0; j<this.state.userReviews.length; j++) {
				// if the user review id matches the company id
				if(this.state.userReviews[j].company.id===this.state.websiteData[i].id) {
					reviewsForThisCo.push(this.state.userReviews[j])
				}
			}
				companyReviews.push(reviewsForThisCo)
		}
		this.setState({ organizedReviews: companyReviews })
	}

	createReview = async (review, id) => {
		await this.props.createReview(review, id)
		await window.location.reload()
	}

	deleteReview = async (id) => {
		console.log(id);
		await this.props.deleteReview(id)
		await window.location.reload()
	}

	findUserAverageRatings = () => {
		let companyRatings = []
		let averages = []
		for(let i = 0; i < this.state.organizedReviews.length; i++) {
			let ratingsForCo = []
			for(let j = 0; j < this.state.organizedReviews[i].length; j++) {
				ratingsForCo.push(this.state.organizedReviews[i][j].stars)
			}
		companyRatings.push(ratingsForCo)
		}
		for(let k = 0; k < companyRatings.length; k++) {
			// Grabbing each array of ratings and using reduce() to sum the totals from left to right. If there are no user ratings we set it to 0 with 'or' condition
			const sum = companyRatings[k].reduce((a, b) => a + b, 0);
			const avg = (sum / companyRatings[k].length) || 0;
			averages.push(avg)
		}
		this.setState({
			companyUserRatings: averages
		})
	}

	showReviews = ()=> {
		const reviewsContainer = this.state.websiteData.map((company, i) => {
			return(
				<div key={i} className='card mb-5'>
				  <div className='row no-gutters'>
				    <div id='img-container' className='col-md-2'>
				      <img src={company.website_logo} style={{ height: '100px', width: '100px'}} className='card-img' alt='company logo' />
				    </div>
				    <div className='col-md-8'>
				      <div className='card-body'>
				        <button className='card-title' onClick={() => this.handleClick(company.id)}>
				        	<strong>{company.name}</strong>
				        </button>
				        <div id='star_container'>
				        	<div className='star-line'>
				        		<div>
							        <h6 className='company_rating'>{Math.round((this.state.averageRatings[i][1]) * 2)/2}</h6>
						        </div>
						        <div>
							        <StarRatings 
							        	rating={Math.round((this.state.averageRatings[i][1]) * 2)/2} 
							        	starRatedColor='orange'
							        	numberOfStars={5}
							        	starDimension='20px'
							        	name='rating'
							        />
						        </div>
					        </div>
					        <small><i>Reputech rating:</i></small>
					        <div className='star-line'>
					        	<div>
							        <h6 className='company_rating'>{Math.round(this.state.companyUserRatings[i] * 2)/2}</h6>
						        </div>
						        <div>
							        <StarRatings 
							        	rating={Math.round(this.state.companyUserRatings[i] * 2)/2}
							        	starRatedColor='crimson'
							        	numberOfStars={5}
							        	starDimension='20px'
							        	name='rating'
							        />
						        </div>
					        </div>
				        </div>
				        <p className='card-text'>Company information here.</p>
				        <p className='card-text'>
				        <small className='text-muted'>
				        	<a 
				        		target='_blank'
				        		href={'http://' + company.website}
				        		rel='noopener noreferrer'
				        	>
				        	{company.website}
				        	</a>
				        </small>
				        </p>
				      </div>
				    </div>


				  	{/* User Reviews Container*/}
					  <div className='review_box'>
					  	<button
					  		id='collapse_button'
					  		className='btn btn-primary' 
					  		type='button' 
					  		data-toggle='collapse' 
					  		data-target={'#a' + company.id} 
					  		aria-expanded='false' 
					  		aria-controls={'a' + company.id}
					  	>
					  		<FaCaretDown />
					  	</button>

					  	<div className='collapse' id={'a' + company.id}>
					  	{/* Add a review */}
					  	{
					  		this.props.loggedIn === true
					  		?
					  		<div className='well'>
					  			<form className='review_form'>
									  <div className='form-group'>
									    <label htmlFor='title'>Title:</label>
									    <input 
									    	type='text' 
									    	className='form-control' 
									    	id='title' 
									    	name='title'
									    	placeholder='Review titles'
									    	value={this.state.review.title}
									    	onChange={this.handleChange}
									    	required
									    />
									  </div>
									  <div className='form-group'>
									    <label htmlFor='textarea'>Review:</label>
									    <input 
									    	className='form-control'
									    	type='text'
									    	id='content' 
									    	name='content'
									    	rows='3'
									    	value={this.state.review.content}
									    	onChange={this.handleChange}
									    	required
									    />
									  </div>


									  <div id='submit_area'>
											<div id='submit-button'>
										  	<button className='btn btn-danger'
										  		onClick={(e) => {
										  			e.preventDefault()
										  			this.createReview(this.state.review, company.id)
										  		}}>
										  		Post Review
										  	</button>
									  	</div>

									  	<div className='form-group'>
										    <div className='rating'>
											    <input type='radio' id='star5' name='stars' value={this.state.review.stars[4]} onChange={this.handleChange} />
											    <label htmlFor='star5' title='Rocks!'>5 stars</label>
											    <input type='radio' id='star4' name='stars' value={this.state.review.stars[3]} onChange={this.handleChange} />
											    <label htmlFor='star4' title='Pretty good'>4 stars</label>
											    <input type='radio' id='star3' name='stars' value={this.state.review.stars[2]} onChange={this.handleChange} />
											    <label htmlFor='star3' title='Meh'>3 stars</label>
											    <input type='radio' id='star2' name='stars' value={this.state.review.stars[1]} onChange={this.handleChange} />
											    <label htmlFor='star2' title='Kinda bad'>2 stars</label>
											    <input type='radio' id='star1' name='stars' value={this.state.review.stars[0]} onChange={this.handleChange} />
											    <label htmlFor='star1' title='Sucks big time'>1 star</label>
												</div>	  
											</div>
									  </div>
									</form>
					  		</div>
					  		: null
					  	}

					 		{
					 			this.state.organizedReviews[i].map((review, j) =>
					 				<div key={j} id='review-container'>
										<div id='review-card-container' className='card border-dark mb-3' style={{maxWidth: '100%'}}>
										  <div className='card-header'>
										  	<StarRatings 
								        	rating={review.stars}
								        	starRatedColor='crimson'
								        	numberOfStars={5}
								        	starDimension='20px'
								        	name='rating'
								        />
								        <div id='review-card'>
									        {
									        	this.props.currentUserId === review.creator.id
									        	?
									        	<div id='user-review-options'>
										        	<button
										        		id='edit-button'
										        		data-toggle='modal' 
	                							data-target='#editModal'
	                							onClick={() => this.editReview(review)}
										        	>
										        			Edit |
										        	</button>
										        	<button
										        		onClick={() => this.deleteReview(review.id)}
										        		id='delete-button'
										        	>
										        		Delete
										        	</button>
									        	</div>
									        	: null
									        }
								        </div>
										  </div>
										  <div className='card-body text-dark'>
										    <span>
										    	<h5 className='card-title'>{review.title}</h5>
										    	<small><i>by: {review.creator.username}</i></small>
										    </span>
										    <p className='card-text'>{review.content}</p>
										  </div>
										</div>		
					 				</div>
					 			)
					 		}

					 		<button
					  		id='collapse_button'
					  		className='btn btn-primary' 
					  		type='button' 
					  		data-toggle='collapse' 
					  		data-target={'#a' + company.id} 
					  		aria-expanded='false' 
					  		aria-controls={'a' + company.id}
					  	>
					  		<FaCaretUp />
					  	</button>

					  	</div>
					  </div>
				  </div>
				</div> /* className='card mb-3' */
			)
		})
		this.setState({
			showReviews: true,
			reviewsContainer:reviewsContainer
		})
	}

	render () {
		return(
			<div className='reviews_container'>
				<div 
					className='modal fade' 
	        id='editModal'
	        tabIndex='-1' 
	        role='dialog' 
	        aria-labelledby='editModalLabel' 
	        aria-hidden='true'
				>
					<div 
            id='edit_container' 
            className='modal-dialog d-flex justify-content-center' 
            role='document'
            data-backdrop='true'
        	>
        		<div className='modal-content user_card'>
							<EditReviewForm
								stars={this.state.review.stars}
								title={this.state.review.title}
								content={this.state.review.content}
								id={this.state.review.id}
								updateReview={this.updateReview}
							/>
        		</div>
					</div>
				</div>
				{this.state.showReviews ? this.state.reviewsContainer : null}
			</div>
		)
	}
}