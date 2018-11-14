import React, { Component } from "react";
import PropTypes from "prop-types";
import SelectListGroup from "../common/SelectListGroup";

// const VotingButton = ({ id }) => {
// 	return (
// 		<>
// 			<button className="btn">{id}</button>
// 		</>
// 	);
// };

class VotingOption extends Component {
	static propTypes = {
		voption: PropTypes.object.isRequired,
		handleSelect: PropTypes.func.isRequired,
		totalVotingOptions: PropTypes.number.isRequired,
		errors: PropTypes.array.isRequired,
	};

	// generateVotingButtons = async () => {};

	render() {
		const {
			voption,
			voption: { name, info },
			handleSelect,
			totalVotingOptions,
			errors,
		} = this.props;

		const generateSelectListOptions = () => {
			let options = [];
			options.push({ label: "Vieta" });

			for (let i = 0; i < totalVotingOptions; ++i) {
				options.push({ label: `${i + 1}` });
			}
			return options;
		};

		return (
			<>
				<div className="card voting-option py-2 my-4">
					{/* <img src="https://i.imgur.com/V75bErI.jpg" alt="" className="card-img-top" /> */}
					<div className="card-body p-0">
						{/* <div className="row">
							<div className="col-9"> */}
						{/** #TODO */}
						<h2 className="card-title">{name}</h2>
						<p className="card-text">{info}</p>
						{/* <div className="col-3"> */}
						{/* {generateVotingButtons()} */}
						<SelectListGroup
							name={name}
							value={voption.rank}
							options={generateSelectListOptions()}
							onChange={(e) => handleSelect(voption, e)}
							errors={errors.filter((e) => e.names.includes(name))}
						/>
					</div>

					{/* </div> */}
					{/* </div> */}
					{/* </div> */}
				</div>
			</>
		);
	}
}

export default VotingOption;
