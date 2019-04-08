import React, { Component } from "react";
// import PropTypes from "prop-types";

class ThanksForVoting extends Component {
	// static propTypes = {};

	componentDidMount() {
		window.scrollTo(0, 0);
	}

	render() {
		// const { pollName } = this.props.match.params;

		return (
			<>
				<h1 className="display-4 mb-4 text-xblue">Dėkojame už balsavimą!</h1>
				<h3 className="text-xlight">
					Tavo balsas sėkmingai įrašytas. Gali ramiai laukti rezultatų!
				</h3>
			</>
		);
	}
}

export default ThanksForVoting;
