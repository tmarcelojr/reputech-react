import React, { Component } from 'react'

export default class EditReviewForm extends Component {
	state = {
		title: '',
		stars: '',
		content: '',
		id: 0
	}

	handleChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value,
			id: this.props.id
		})
	}

	handleSubmit = (e) => {
		e.preventDefault()
		this.props.updateReview(this.state)
		this.setState({
			title: '',
			stars: '',
			content: ''
		})
	}

	render() {
		console.log(this.props);
		return(
			<div>
				<h2>Edit Review</h2>
				<form className='edit_review_form' onSubmit={this.handleSubmit}>
				  <div className='form-group'>
				    <label htmlFor='title'>Title:</label>
				    <input 
				    	type='text' 
				    	className='form-control' 
				    	id='title' 
				    	name='title'
				    	placeholder={JSON.stringify(this.props.title)}
				    	value={this.state.title}
				    	onChange={this.handleChange} 
				    />
				    <label htmlFor='stars'>Rating:</label>
				    <input 
				    	type='text' 
				    	className='form-control' 
				    	id='stars' 
				    	name='stars'
				    	placeholder={JSON.stringify(this.props.stars)}
				    	value={this.state.stars}
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
				    	rows='4'
				    	placeholder={JSON.stringify(this.props.content)}
				    	value={this.state.value}
				    	onChange={this.handleChange}
				    />
				  </div>
				  	<button 
				  		type='submit' 
				  		className='btn btn-danger'
				  	>
				  		Edit Review
				  	</button>
				</form>
			</div>
		)
	}
}