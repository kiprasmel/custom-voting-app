import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Place extends Component {
	static propTypes = {
		result: PropTypes.object.isRequired,
	};

	constructor(props) {
		super(props);

		this.state = {
			reveal: false,
		};
	}

	handleReveal = () => {
		this.setState((prevState, props) => ({
			reveal: !prevState.reveal,
		}));
	};

	render() {
		const { name, points, place, votesPerRank } = this.props.result;

		const beforeReveal = (
			<>
				<div className="" style={{ alignItems: "center" }}>
					<h1 className="text-xblue">{place} vieta</h1>
					<h5 className="text-xdark">Paspausk, kad pamatytum rezultatą!</h5>
				</div>
			</>
		);

		const afterReveal = (
			<>
				<div>
					<h1 className="card-title text-xblue">{name}!!!</h1>
					<h3 className="">
						Taškai: <span className="text-xpink"> {points}</span>
					</h3>
					<div>
						{Object.entries(votesPerRank).map(([key, value]) => (
							<h4 className="mx-2" style={{ display: "inline-block" }}>
								<span key={key} className="badge badge-secondary badge-pill">
									{parseInt(key) + 1} vietos įvertinimai:{" "}
									<span className="text-xpink" style={{ fontSize: "1.2rem" }}>
										{value}
									</span>
								</span>
							</h4>
						))}
					</div>
				</div>
			</>
		);

		return (
			<>
				<div
					className="place card text-xdark py-0 my-4"
					// style={{ minHeight: "15vh" }}
				>
					<button
						onClick={this.handleReveal}
						className="revealBtn"
						// styles are moved to Results.scss file
					>
						<span className="card-body p-0">{this.state.reveal ? afterReveal : beforeReveal}</span>
					</button>
				</div>
			</>
		);
	}
}
