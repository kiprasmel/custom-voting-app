import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";

export default class Admin extends Component {
	static propTypes = {};

	constructor(props) {
		super(props);

		this.state = {
			password: "",
		};

		this.pollName = this.props.match.params.pollName;
	}

	handleChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value,
		});
	};

	handleSubmit = async () => {
		const { data: poll } = await axios.post(`/api/poll/${this.pollName}/stop`, {
			password: this.state.password,
		});
		console.log(poll);
	};

	render() {
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					<input
						type="password"
						name="password"
						value={this.state.password}
						className=""
						placeholder="slaptažodis"
						onChange={this.handleChange}
					/>
					<input type="submit" value="Stabdyti balsavimą" className="btn btn-xpink" />
				</form>
			</div>
		);
	}
}
