import { Button, Modal, message } from "antd";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Input } from "antd";
import { DataType } from "../Interfaces";
import { apiGetRequest, apiPostRequest } from "../../Helpers/axiosRequests";
import { endpoints } from "../../Helpers/dbConfig";
const { TextArea } = Input;

function AddNoteModal({
	id,
	isModalOpen,
	setIsModalOpen,
}: {
	id: string;
	isModalOpen: boolean;
	setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
	const [loading, setLoading] = useState(false);
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
	const [noteValue, setNoteValue] = React.useState<string>("");

	React.useEffect(() => {
		getActiveCallData(id);
		console.log("isModalOpen changed" + isModalOpen);
		setOpen(isModalOpen);
		setNoteValue("");
	}, [id, isModalOpen]);

	const getActiveCallData = async (id: string) => {
		if (id) {
			try {
				const resp = await apiGetRequest(endpoints.getSingleCall(id));
				if (resp.status === 200) {
					setActiveCall(resp.data);
					console.log(resp.data);
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
		setLoading(true);
		try {
			const resp = await apiPostRequest(endpoints.addNote(activeCall.id), {
				content: noteValue,
			});
			console.log("resp", resp);
			message.success("Successfully added note", 2, handleCancel);
		} catch (err: any) {
			if (err.response.data.statusCode === 404) {
				message.error("Error! Call not found", 2, handleCancel);
			} else {
				message.warning("Failed to add note", 2, handleCancel);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		setOpen(false);
	};

	return (
		<>
			<Modal
				open={open}
				title={"Add Notes Call ID " + activeCall.id}
				onOk={handleOk}
				onCancel={handleCancel}
				footer={[
					<Button
						key="submit"
						type="primary"
						loading={loading}
						onClick={handleOk}
					>
						Save
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

					{activeCall.duration / 60 >= 1
						? (activeCall.duration / 60).toFixed(0) + " minutes "
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
					<TextArea
						rows={4}
						placeholder="Add Notes"
						style={{ padding: 5 }}
						//maxLength={6}
						value={noteValue}
						onChange={(e) => {
							setNoteValue(e.target.value);
						}}
					/>
				</div>
			</Modal>
		</>
	);
}

export default AddNoteModal;
