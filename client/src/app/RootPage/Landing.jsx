import React, { Component } from "react";
import history from "../../utils/history";
import axios from "axios";
import classnames from "classnames";
import { votingCodeIdInLS } from "../../config";
import isEmpty from "../../utils/isEmpty";

class Landing extends Component {
	static propTypes = {};
	constructor(props) {
		super(props);

		this.state = {
			code: "",
			errors: {},
		};
	}

	handleChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value.toLowerCase(),
		});
	};

	handleOnKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
			e.preventDefault();
			try {
				this.handleClick(e);
			} catch (e) {
				console.log(e);
			}
		}
	};

	handleClick = async (e) => {
		try {
			// store voting code to local storage:
			localStorage.setItem(votingCodeIdInLS, this.state.code);

			// redirect to the specific poll
			const { data: poll } = await axios.get(`/api/poll/${this.state.code}/false`);

			if (poll.status === "ended") {
				this.setState({
					errors: {
						code: "Deja, balsavimas jau sustabdytas!",
					},
				});
			} else history.push(`/poll/${poll.name}`);
		} catch (e) {
			console.log(e);
			if (e.response.status === 404) {
				this.setState({ errors: { code: "Balsavimas nerastas, pasitikrink kodą!" } });
			}
		}
	};

	render() {
		const { errors } = this.state;

		/* THIS IS BUGGY - #TODO #FIXME */
		return (
			<div className="landing-page d-flex justify-content-center">
				<div className="container">
					<div className="row ">
						<div className="col-12" id="error-col">
							{!isEmpty(errors) && errors.code && (
								<div className="text-lg text-xpink" style={{ fontSize: "1rem" }}>
									<h3>{errors.code}</h3>
								</div>
							)}
						</div>
						<div className="col-12 d-flex" id="main-col">
							<div className="input-group">
								<div className="input-group-prepend">
									<span className="input-group-text input" id="input-left">
										<i className="fas fa-hashtag fa-lg" />
									</span>
								</div>
								<input
									type="text"
									name="code"
									value={this.state.code}
									onChange={this.handleChange}
									onKeyDown={this.handleOnKeyDown}
									className="form-control form-control-lg input"
									id="input-middle"
									placeholder="Tavo balsavimo kodas"
									autoFocus={
										true // })} // 	"is-invalid": !isEmpty(errors), // className={classnames("form-control form-control-lg input", {
									}
								/>
								<div className="input-group-append">
									<button
										type="submit"
										className="btn btn-xpink input"
										id="input-right"
										onClick={this.handleClick}
									>
										<i className="fas fa-arrow-right fa-lg" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Landing;
