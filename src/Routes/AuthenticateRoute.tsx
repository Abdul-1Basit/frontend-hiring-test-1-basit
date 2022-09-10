import { Navigate } from "react-router-dom";
//import Refresher from "../Components/Refresher";
import { getToken } from "../Helpers/tokenManagement";
export default function AuthenticateRoute(props: any) {
	const authorized = getToken();

	return authorized ? props.children : <Navigate to="/Signin" replace />;
}
