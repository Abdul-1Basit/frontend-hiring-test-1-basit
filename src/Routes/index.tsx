import "antd/dist/antd.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../Pages/Dashboard";
import Signin from "../Pages/Signin";
import AuthenticateRoute from "./AuthenticateRoute";

export default function TuringTechRoutes() {
	//let token=getToken()

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Signin />} />
				<Route
					path="/dashboard"
					element={
						<AuthenticateRoute>
							<Dashboard />
						</AuthenticateRoute>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
}
