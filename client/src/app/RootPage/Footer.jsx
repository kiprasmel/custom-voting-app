import React from "react";

export default () => {
	return (
		<>
			<footer
				className="footer bg-xlightdark text-center text-xlight p-3"
				// style={{ borderTop: "1px solid #fff" }}
				style={{ fontSize: "0.95rem" }}
			>
				Copyright &copy; 2018-{new Date().getFullYear()} "Wannabe" programuotojas{" "}
				<a href="https://kipras.org/" target="_blank" rel="noopener noreferrer">
					Kipras Melnikovas
					<span role="img" aria-label="pin">
						📌
					</span>
				</a>{" "}
			</footer>
		</>
	);
};
