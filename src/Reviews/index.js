import React, { Component } from 'react'
import StarRatings from 'react-star-ratings'
import './custom.css'

export default class Reviews extends Component {
	state = {
		average_ratings: [],
		website_data: [],
		showReviews: false
	}

	componentDidMount = async () => {
		await this.getRatings()
		await this.getWebsiteData()
		await this.showReviews()
	}

	getRatings = async () => {
		try{
			const ratingRes = await fetch(process.env.REACT_APP_API_URL + '/api/v1/collected_reviews')
			const ratingJson = await ratingRes.json()
			this.setState({
				average_ratings: ratingJson.data
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
				website_data: dataJson.data
			})
		} catch(err) {
			console.log(err);
		}
	}
	showReviews = ()=>{
		
		const reviews = this.state.website_data.map((company, i) => {
				return(
					<div key={i} className='card mb-3'>
					  <div className='row no-gutters'>
					    <div className='col-md-1'>
					      <img src={company.website_logo} style={{ height: '70px', width: '70px'}} className='card-img' alt='company logo' />
					    </div>
					    <div className='col-md-8'>
					      <div className='card-body'>
					        <h5 className='card-title'><strong>{company.name}</strong></h5>
					        <div id='star_container'>
						        <StarRatings 
						        	rating={Math.round((this.state.average_ratings[i][1]) * 2)/2} 
						        	starRatedColor='orange'
						        	numberOfStars={5}
						        	starDimension='20px'
						        	name='rating'
						        />
						        <h6 id='company_rating'>{Math.round((this.state.average_ratings[i][1]) * 2)/2}</h6>
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
					  </div>
					</div>
				)
			})

		this.setState({
			showReviews: true,
			reviews:reviews
		})

	}

	render () {
		return(
			<div className='reviews_container'>
				{this.state.showReviews ? this.state.reviews : null}
			</div>
		)
	}
}