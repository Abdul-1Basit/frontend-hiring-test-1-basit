import React from "react";

import { getToken, setToken } from "../../Helpers/tokenManagement";
export default function Refresher(props: any) {
	React.useEffect(() => {
		setTimeout(() => {
			refresh();
		}, 100);
		console.log("infinte");
	});
	setTimeout(() => {
		console.log("aaaa");
	}, 100);
	const refresh = () => {
		console.log("token", getToken());
		fetch("https://frontend-test-api.aircall.io/auth/refresh-token", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${getToken()}`,
			},
		})
			.then((resp) => resp.json())
			.then((resp: any) => {
				//  console.log("resp is", resp);
				setToken(resp.access_token);
			})
			.catch((err) => {
				console.log(err);
			});
	};
	return <div>{props.children}</div>;
}
