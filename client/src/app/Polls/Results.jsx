/** PRIVATE ROUTE */
import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Place from "./Place";

class Results extends Component {
	static propTypes = {};

	constructor(props) {
		super(props);

		this.state = {
			results: [],
		};

		this.pollName = this.props.match.params.pollName;
	}

	componentDidMount() {
		this.fetchResultsData();
	}

	fetchResultsData = async () => {
		try {
			const { data } = await axios.get(`/api/poll/${this.pollName}/true`);
			const results = data.teams;
			this.setState({ results: results });
		} catch (e) {
			console.log(e);
		}
	};

	render() {
		const results = this.state.results.map((result, index) => (
			<Place result={result} key={index} />
		));

		return (
			<>
				<div className="results">
					{/* TODO endVoting, refreshResults buttons #TODO */}
					<div className="container">{results}</div>
				</div>
			</>
		);
	}
}

export default Results;
