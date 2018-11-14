import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import uuidv1 from "uuid/v1";
import isEmpty from "../../utils/isEmpty";

const SelectListGroup = ({ name, value, errors, info, onChange, options }) => {
	const selectOptions = options.map((opt) => <option key={uuidv1()}>{opt.label}</option>);

	const styledErrors = errors.map(({ message }, index) => (
		<div key={index} className="invalid-feedback">
			{message}
		</div>
	));

	return (
		<div className="form-group" style={{ width: "80%", margin: "auto" }}>
			{info && <small className="form-text text-muted">{info}</small>}
			<select
				className={classnames("form-control form-control-lg", {
					"is-invalid": !isEmpty(errors),
				})}
				name={name}
				value={value}
				onChange={onChange}
			>
				{selectOptions}
			</select>

			{styledErrors}
		</div>
	);
};

SelectListGroup.propTypes = {
	name: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	errors: PropTypes.array.isRequired,
	info: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	options: PropTypes.array.isRequired,
};

export default SelectListGroup;
