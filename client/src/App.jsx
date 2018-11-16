import React, { Component } from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from "./utils/history";
import "./App.scss";
import Landing from "./app/RootPage/Landing";
// import Footer from "./app/RootPage/Footer";
import Poll from "./app/Polls/Poll";
import ThanksForVoting from "./app/Polls/ThanksForVoting";
import Results from "./app/Polls/Results";
import Admin from "./app/Polls/Admin";

class App extends Component {
	render() {
		return (
			<Router history={history}>
				<>
					<div className="App" style={{ minHeight: "100vh" }}>
						{/* #todo - navbar */}
						<Switch>
							<Route exact path="/" component={Landing} />
							<Route exact path="/poll/:pollName" component={Poll} />
							<Route exact path="/thanksForVoting/:pollName" component={ThanksForVoting} />
							<Route exact path="/results/:pollName" component={Results} />
							<Route exact path="/stop/:pollName" component={Admin} />
						</Switch>
						{/* #todo - footer */}
					</div>
					{/** Footer is broken in some pages! (Especially those who's height is > 100vh) */}
					{/* <Footer /> */}
				</>
			</Router>
		);
	}
}

export default App;
