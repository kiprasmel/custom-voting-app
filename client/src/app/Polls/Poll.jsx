import React, { Component } from "react";
import { votingCodeIdInLS, userVotedInCurrentPollIdInLS, voteIdIdInLS } from "../../config";
import axios from "axios";
import isEmpty from "../../utils/isEmpty";
import VotingOption from "./VotingOption";
import { ReactComponent as Spinner } from "../../assets/spinner2.svg";
import history from "../../utils/history";

class Poll extends Component {
	// static propTypes = {};

	constructor(props) {
		super(props);

		this.state = {
			name: "",
			description: "",
			pollType: "",
			votingOptions: [],
			isLoadingPoll: true,
			isPollEmpty: false,
			hasUserAlreadyVoted: false,
			errors: [],
		};

		this.votingCode = localStorage.getItem(votingCodeIdInLS);
		this.isVotingCodeValid = true;
		this.pollName = this.props.match.params.pollName;
	}

	componentDidMount() {
		if (isEmpty(this.votingCode)) {
			history.push("/");
		}

		if (localStorage.getItem(userVotedInCurrentPollIdInLS + this.pollName)) {
			this.setState({ hasUserAlreadyVoted: true });
			// return;
		}

		this.fetchData();
	}

	fetchData = async () => {
		try {
			this.setState({ isLoadingPoll: true });

			const { data: poll } = await axios.get(`/api/poll/${this.pollName}/false`);

			await this.generateDataAndFillState(poll);
		} catch (e) {
			if (e.response.status === 404) {
				this.setState({ isPollEmpty: true });
			}
			console.log(e);
		}
	};

	generateDataAndFillState = async (poll) => {
		const { votingCodes, votingOptions, name, description, pollType } = poll;

		// check if voting code is valid:
		if (votingCodes.includes(this.votingCode) === false) {
			this.isVotingCodeValid = false;
		}

		// find what votingOptions are available while using the current votingCode:
		let relativeVotingOptions = [];

		for (const voption of votingOptions) {
			const { disableVotesFrom } = voption;
			// if NOT black-listed:
			if (disableVotesFrom.includes(this.votingCode) === false) {
				voption.selected = false;
				// // voption.selectedBy = null;
				voption.rank = "";
				relativeVotingOptions.push(voption);
			}
		}

		this.setState({
			votingOptions: relativeVotingOptions,
			name,
			description,
			pollType,
			isLoadingPoll: false,
		});
	};

	handleSelect = (votingOptionToModify, e) => {
		let { votingOptions } = this.state;
		votingOptionToModify.rank = e.target.value;
		votingOptionToModify.selected = true;
		// // votingOptionToModify.selectedBy = votingOptionToModify.name;

		// update voting option (only the one that was changed)
		let updatedVotingOptions = votingOptions.map((voption) =>
			voption.name === votingOptionToModify.name ? votingOptionToModify : voption
		);

		// update errors. Delete error if there was one previously.
		let updatedErrors = this.state.errors;
		for (const err in updatedErrors) {
			if (updatedErrors[err].name === votingOptionToModify.name) updatedErrors.splice(err, 1);
			if (updatedErrors[err].names.includes(votingOptionToModify.name))
				updatedErrors.splice(err, 1);
		}

		this.setState({
			votingOptions: [...updatedVotingOptions],
			errors: [...updatedErrors],
		});
	};

	handleVoteSubmit = async (e) => {
		try {
			e.preventDefault();
			const { votingOptions } = this.state;

			// scan if all voting options are valid:
			let nameErrors = [];

			for (const { rank, name } of votingOptions) {
				if ((rank >= 1 && rank <= votingOptions.length) === false) {
					nameErrors.push({ message: "Pasirinkite dalyvio vietą", names: [name] });
				}
			}

			// check for duplicate ranks:
			let rankings = [];

			for (let i = 0; i < votingOptions.length; ++i) {
				const voption = votingOptions[i];
				let duplicatesExist = false;

				for (const ranking of rankings) {
					if (ranking.rank === voption.rank && !isEmpty(voption.rank)) {
						duplicatesExist = true;
						nameErrors.push({
							message: `Vietos kartojasi! (${ranking.name} ir ${voption.name})`,
							names: [ranking.name, voption.name],
						});
					}
				}

				if (duplicatesExist === false) {
					rankings.push({ name: voption.name, rank: voption.rank });
				}
			}

			// check if any nameErrors exist, if so - fill state with nameErrors & stop submission:
			if (isEmpty(nameErrors) === false) {
				this.setState({ errors: [...nameErrors] });
				return;
			} else {
				let vote = { rankings: rankings, pollName: this.pollName, votingCode: this.votingCode };

				const { data: createdVote } = await axios.post(`/api/vote`, vote);
				console.log("Created vote!", createdVote);

				localStorage.setItem(userVotedInCurrentPollIdInLS + this.pollName, true);
				localStorage.setItem(voteIdIdInLS + this.pollName, createdVote._id);

				// history.push(`${this.props.location.pathname}/thanksForVoting`);
				history.push(`/thanksForVoting/${this.pollName}`);
			}
		} catch (e) {
			console.log(e);
		}
	};

	render() {
		const { isLoadingPoll, isPollEmpty, hasUserAlreadyVoted } = this.state;

		const goBackBtn = (
			<button className="btn btn-lg btn-xpink " onClick={(e) => history.push("/")}>
				Grįžti į pradinį puslapį
			</button>
		);

		if (hasUserAlreadyVoted) {
			return (
				<>
					<h1 className="display-4 text-xlight">Tu jau balsavai :)</h1>
					{goBackBtn}
				</>
			);
		}

		if (this.isVotingCodeValid === false) {
			return (
				<>
					<h1 className="display-4 text-xlight">Balsavimo kodas netinka!</h1>
					<h3 className="text-xlight">Bandyk kitą kodą arba pranešk organizatoriui!</h3>
					{goBackBtn}
				</>
			);
		}

		if (isPollEmpty) {
			return (
				<>
					<h1 className="display-4 text-xlight">Balsavimas neegzistuoja!</h1>
					{goBackBtn}
				</>
			);
		}

		if (isLoadingPoll) {
			return <Spinner />;
		}

		const votingCode = localStorage.getItem(votingCodeIdInLS);
		const { votingCodes, votingOptions, errors } = this.state;

		const styledVotingOptions = votingOptions.map((voption, index) => (
			<VotingOption
				voption={voption}
				totalVotingOptions={votingOptions.length}
				handleSelect={this.handleSelect}
				key={index}
				errors={errors}
			/>
		));

		const title = (
			<h1 className="text-xblue">Įvertink dalyvius nuo 1 iki {votingOptions.length} vietos!</h1>
		);

		return (
			<div className="poll mt-4">
				<div className="container">
					{title}
					<p>Hey! Vietos negali kartotis ir negalima balsuoti už save!</p>
					<form onSubmit={this.handleVoteSubmit} className="mb-4">
						<div className="styled-voting-options">{styledVotingOptions}</div>

						<input type="submit" value="Balsuoti!" className="btn btn-lg btn-xpink" />
					</form>
				</div>
			</div>
		);
	}
}

export default Poll;
