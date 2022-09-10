import { Button, Modal } from "antd";
import React, { Dispatch, SetStateAction, useState } from "react";
import { DataType, Note } from "../Interfaces";
import { apiGetRequest } from "../../Helpers/axiosRequests";
import { endpoints } from "../../Helpers/dbConfig";

function ViewDetails({
	id,
	isModalOpen,
	setIsModalOpen,
}: {
	id: string;
	isModalOpen: boolean;
	setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
	const [open, setOpen] = useState(isModalOpen ?? true);
	const [activeCall, setActiveCall] = React.useState<DataType>({
		id: "",
		direction: "",
		from: "",
		to: "",
		duration: 0,
		is_archived: false,
		call_type: "",
		via: "",
		created_at: "",
		notes: [],
	});

	React.useEffect(() => {
		setOpen(isModalOpen);
		setActiveCall({
			id: "",
			direction: "",
			from: "",
			to: "",
			duration: 0,
			is_archived: false,
			call_type: "",
			via: "",
			created_at: "",
			notes: [],
		});
		getActiveCallData(id);
	}, [id, isModalOpen]);

	const getActiveCallData = async (id: string) => {
		if (id) {
			try {
				const resp = await apiGetRequest(endpoints.getSingleCall(id));
				if (resp.status === 200) {
					setActiveCall(resp.data);
				}
			} catch (err) {
				console.log(
					"error occurred while getting active call data for modal",
					err
				);
				setOpen(false);
			}
		}
	};

	const handleOk = async () => {
		setOpen(false);
	};

	const handleCancel = () => {
		setOpen(false);
	};

	return (
		<>
			<Modal
				open={open}
				title={"Call Details"}
				onOk={handleOk}
				onCancel={handleCancel}
				footer={[
					<Button type="primary" onClick={handleOk}>
						Close
					</Button>,
				]}
			>
				<p>
					<span style={{ fontWeight: "bold", paddingRight: 5 }}>Call Type</span>
					{activeCall.call_type === ""
						? ""
						: activeCall.call_type === "voicemail"
						? "Voice Mail"
						: activeCall.call_type.charAt(0).toUpperCase() +
						  activeCall.call_type.slice(1)}
				</p>
				<p>
					<span style={{ fontWeight: "bold", paddingRight: 5 }}>Duration</span>

					{activeCall.duration / 3600 >= 1
						? (activeCall.duration / 3600).toFixed(0) + " hours "
						: ""}
					{(activeCall.duration % 3600) / 60 >= 1
						? ((activeCall.duration % 3600) / 60).toFixed(0) + " minutes "
						: ""}
					{Math.floor((activeCall.duration % 3600) % 60) >= 1
						? Math.floor((activeCall.duration % 3600) % 60) + " seconds"
						: ""}
					<span style={{ color: "#4f46f8" }}>
						({activeCall.duration} seconds)
					</span>
				</p>
				<p>
					<span style={{ fontWeight: "bold", paddingRight: 5 }}>From</span>
					{activeCall.from}
				</p>
				<p>
					<span style={{ fontWeight: "bold", paddingRight: 5 }}>To</span>
					{activeCall.to}
				</p>
				<p>
					<span style={{ fontWeight: "bold", paddingRight: 5 }}>Via</span>
					{activeCall.via}
				</p>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-start",
					}}
				>
					<span style={{ fontWeight: "bold", paddingRight: 5 }}>Notes</span>
					{activeCall.notes.map((item: Note, index) => {
						return <p key={index}>{item.content}</p>;
					})}
				</div>
			</Modal>
		</>
	);
}

export default ViewDetails;
