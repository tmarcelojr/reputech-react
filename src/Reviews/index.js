import React, { Component } from 'react'
import EditReviewForm from '../EditReviewForm'
import StarRatings from 'react-star-ratings'
import { GoThreeBars } from 'react-icons/go'
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
		review: {}
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
			const ratingRes = await fetch(process.env.REACT_APP_API_URL + '/api/v1/collected_reviews')
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
			const dataRes = await fetch(process.env.REACT_APP_API_URL + '/api/v1/companies')
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
			const reviewsRes = await fetch(process.env.REACT_APP_API_URL + '/api/v1/reviews')
			const reviewsJson = await reviewsRes.json()
			this.setState({
				userReviews: reviewsJson.data
			})
		} catch(err) {
			console.log(err);
		}
	}

	editReview = (review) => {
		console.log('we made it in edit review');
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
      const updateReviewRes = await fetch(process.env.REACT_APP_API_URL + "/api/v1/reviews/" + newInfo.id, {
        credentials: 'include',
        method: 'PUT',
        body: JSON.stringify(newInfo),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const updateReviewJson = await updateReviewRes.json()
      console.log('update json', updateReviewJson);
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
		console.log('this is my company ratings', companyRatings);
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
				<div key={i} className='card mb-3'>
				  <div className='row no-gutters'>
				    <div className='col-md-1'>
				      <img src={company.website_logo} style={{ height: '70px', width: '70px'}} className='card-img' alt='company logo' />
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
				        <p className='card-text'>This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
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
					  		<GoThreeBars />
					  	</button>
					  	
					  	<div className='collapse' id={'a' + company.id}>
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
									    />

									


									    <label htmlFor='stars'>Rating:</label>
									    <input 
									    	type='text' 
									    	className='form-control' 
									    	id='stars' 
									    	name='stars'
									    	placeholder='Insert Rating'
									    	value={this.state.review.stars}
									    	onChange={this.handleChange} 
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
									    />
									  </div>


									  <div id='submit_area'>
									  	<button className='btn btn-danger'
									  		onClick={(e) => {
									  		e.preventDefault()
									  		this.props.createReview(this.state.review, company.id)

									  	}}>
									  		Post Review
									  	</button>
									  </div>
									</form>
					  		</div>

					 		{
					 			this.state.organizedReviews[i].map((review, j) =>
					 				<div key={j} >
										<div id='review-card' className="card border-dark mb-3" style={{maxWidth: "100%"}}>
										  <div className="card-header">
										  	<StarRatings 
								        	rating={review.stars}
								        	starRatedColor='crimson'
								        	numberOfStars={5}
								        	starDimension='20px'
								        	name='rating'
								        />
								        <div>
									        {
									        	this.props.currentUserId === review.creator.id
									        	?
									        	<div>
										        	<button 
										        		onClick={() => this.props.deleteReview(review.id)}>
										        			Delete
										        	</button>
										        	<div
										        		id='edit-button'
										        		data-toggle='modal' 
	                							data-target='#editModal'
	                							onClick={() => this.editReview(review)}
										        	>
										        			Edit
										        	</div>
									        	</div>
									        	: null
									        }
								        </div>
										  </div>
										  <div className="card-body text-dark">
										    <span>
										    	<h5 className="card-title">{review.title}</h5>
										    	<small><i>by: {review.creator.username}</i></small>
										    </span>
										    <p className="card-text">{review.content}</p>
										  </div>
										</div>		
					 				</div>
					 			)
					 		}

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
		console.log('this is our user state ratings', this.state.companyUserRatings);
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