import React, { Component } from 'react'
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
		review: {}
	}

	componentDidMount = async () => {
		console.log("CDM >>>>>");
		await this.getRatings()
		await this.getWebsiteData()
		await this.getCompanyReviews()
		await this.organizeReviews()
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

	handleChange = (e) => {
		let newReviewState = this.state.review
		newReviewState[e.target.name] = e.target.value
		this.setState(newReviewState)
	}

	organizeReviews = () => {
		console.log('!!!!!!!!');
		console.log('!!!!!!!!');
		console.log('!!!!!!!!');
		console.log('!!!!!!!!');
		// console.log("this.state.userReviews >>> ", this.state.userReviews);
		// console.log("this.state.userReviews id>>> ", this.state.userReviews[0].id);
		for(let i = 0; i < this.state.websiteData.length; i++) {
			let companyReviews = this.state.userReviews.filter(review => review.id === this.state.websiteData[i].id)

			// console.log('this is our review company id', review.company.id);
			// console.log('this is our website data id', this.state.websiteData[i].id);
			console.log('this is what is being pushed', companyReviews);
			this.state.organizedReviews.push(companyReviews)
	// console.log("companyReviews >>> ", companyReviews);
	console.log('this is happening inside organizeReviews', this.state.organizedReviews);
		}
	}

	showReviews = ()=> {
		const reviews = this.state.websiteData.map((company, i) => {
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
					        <StarRatings 
					        	rating={Math.round((this.state.averageRatings[i][1]) * 2)/2} 
					        	starRatedColor='orange'
					        	numberOfStars={5}
					        	starDimension='20px'
					        	name='rating'
					        />
					        <h6 id='company_rating'>{Math.round((this.state.averageRatings[i][1]) * 2)/2}</h6>
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
					  	{/* Added 'a' since it doesn't allow value to start with int/company.id*/}
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
									  		console.log("this state.review: (from reviews component", this.state.review)
									  		this.props.createReview(this.state.review, company.id)
									  	}}

									  	>Post Review</button>
									  </div>
									</form>
					  		</div>


					  	{/* THIS IS WHERE WE WANT TO DISPLAY THE USER RATINGS*/}
	
					  	</div>
					  </div> {/* review_box */}
				  </div>
				</div> /* className='card mb-3' */
			)
		})
		this.setState({
			showReviews: true,
			reviewstest:reviews
		})
	}

	render () {
		// console.log("RENDER in Reviews component STATE", this.state);
		// console.log('this is our user reviews', this.state.userReviews);
		// console.log('this is our website data', this.state.websiteData);
		// console.log('this is our organized reviews', this.state.organizedReviews[0]);
		// console.log('this is our organized reviews length', this.state.organizedReviews.length);
		// console.log('this is our organized reviews first company array', this.state.organizedReviews[0]);
		// console.log('this is our organized reviews first company array and its content', JSON.stringify(this.state.organizedReviews[0]));
		// console.log('this is our organized reviews first company array and its content', Object.keys(this.state.organizedReviews[0]));

		return(
			<div className='reviews_container'>
				{this.state.showReviews ? this.state.reviewstest : null}
				<button onClick={this.props.getReviews}>click here to get reviews</button>
				<button onClick={() => this.organizeReviews()}></button>
			</div>
		)
	}
}