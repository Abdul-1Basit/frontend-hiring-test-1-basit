import React from "react";

export default function Header(props: any) {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				paddingTop: 15,
				paddingBottom: 15,
				paddingLeft: 45,
				paddingRight: 45,
				backgroundColor: "#fefefe",
				borderBottom: "1px solid gray",
			}}
		>
			<div>
				<img
					src={"/TT Logo.png"}
					alt="turing tech logo"
					style={{ height: 30 }}
				/>
			</div>
			<div>{props.children}</div>
		</div>
	);
}
