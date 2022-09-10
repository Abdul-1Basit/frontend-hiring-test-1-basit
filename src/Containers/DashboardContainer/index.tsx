import React from "react";
import Header from "../../Components/Header";
import { apiGetRequest, apiPutRequest } from "../../Helpers/axiosRequests";
import { endpoints } from "../../Helpers/dbConfig";
import { Table, Button, message, Menu, Dropdown } from "antd";
import { DataType } from "../Interfaces";

import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { FilterValue } from "antd/es/table/interface";
import { TableParams } from "./TableSettings";
import AddNoteModal from "./AddNoteModal";
import ViewDetails from "./ViewDetails";
import { DownOutlined } from "@ant-design/icons";
import { getToken, setToken } from "../../Helpers/tokenManagement";

const DashboardContainer: React.FC = () => {
	const [callsData, setCallsData] = React.useState([]);
	const [loading, setLoading] = React.useState<boolean>(false);
	const [callStatus, setCallStatus] = React.useState<boolean>(false);
	const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
	const [filterItem, setFilterItem] = React.useState<string>("Voice Mail");
	const [isViewModalOpen, setIsViewModalOpen] = React.useState<boolean>(false);
	const [viewModalCallId, setViewModalCallId] = React.useState<string | null>(
		null
	);
	const [activeCallId, setActiveCallId] = React.useState<string | null>(null);
	const [activeCallStatusId, setActiveCallStatusId] = React.useState<
		string | null
	>(null);
	const [tableParams, setTableParams] = React.useState<TableParams>({
		pagination: {
			current: 1,
			pageSize: 10,
		},
	});
	const columns: ColumnsType<DataType> = [
		{
			title: "CALL TYPE",
			dataIndex: "call_type",
			key: "call_type",
			render: (text, record: DataType) => (
				<div
					style={{
						cursor: "pointer",
					}}
					onClick={() => {
						setViewModalCallId(record.id);
						setIsViewModalOpen(true);
					}}
				>
					{" "}
					<p
						style={{
							color:
								text === "voicemail"
									? "#4f46f8"
									: text === "answered"
									? "green"
									: "#ff4a90",
						}}
					>
						{text === "voicemail"
							? "Voice Mail"
							: text.charAt(0).toUpperCase() + text.slice(1)}
					</p>
				</div>
			),
		},
		{
			title: "DIRECTION",
			dataIndex: "direction",
			key: "direction",
			render: (text, record: DataType) => (
				<div
					style={{
						cursor: "pointer",
					}}
					onClick={() => {
						setViewModalCallId(record.id);
						setIsViewModalOpen(true);
					}}
				>
					<p style={{ color: text === "outbound" ? "#4f46f8" : "#ff4a90" }}>
						{text.charAt(0).toUpperCase() + text.slice(1)}
					</p>
				</div>
			),
		},

		{
			title: "DURATION",
			dataIndex: "duration",
			key: "duration",
			render: (text, record: DataType) => (
				<div
					style={{
						cursor: "pointer",
					}}
					onClick={() => {
						setViewModalCallId(record.id);
						setIsViewModalOpen(true);
					}}
				>
					<p>
						{parseInt(text) / 60 >= 1
							? (parseInt(text) / 60).toFixed(0) + " minutes "
							: ""}
						{Math.floor((parseInt(text) % 3600) % 60) >= 1
							? Math.floor((parseInt(text) % 3600) % 60) + " seconds"
							: ""}
						<span style={{ color: "#4f46f8" }}>({text} seconds)</span>
					</p>
				</div>
			),
		},

		{
			title: "FROM",
			dataIndex: "from",
			key: "from",
			render: (text, record: DataType) => (
				<div
					style={{
						cursor: "pointer",
					}}
					onClick={() => {
						setViewModalCallId(record.id);
						setIsViewModalOpen(true);
					}}
				>
					{" "}
					<p>{text}</p>
				</div>
			),
		},

		{
			title: "TO",
			dataIndex: "to",
			key: "to",
			render: (text, record: DataType) => (
				<div
					style={{
						cursor: "pointer",
					}}
					onClick={() => {
						setViewModalCallId(record.id);
						setIsViewModalOpen(true);
					}}
				>
					{" "}
					<p>{text}</p>
				</div>
			),
		},

		{
			title: "VIA",
			dataIndex: "via",
			key: "via",
			render: (text, record: DataType) => (
				<div
					style={{
						cursor: "pointer",
					}}
					onClick={() => {
						setViewModalCallId(record.id);
						setIsViewModalOpen(true);
					}}
				>
					{" "}
					<p>{text}</p>
				</div>
			),
		},

		{
			title: "CREATED AT",
			dataIndex: "created_at",
			key: "created_at",
			render: (text, record: DataType) => (
				<div
					style={{
						cursor: "pointer",
					}}
					onClick={() => {
						setViewModalCallId(record.id);
						setIsViewModalOpen(true);
					}}
				>
					{" "}
					<p>{text}</p>
				</div>
			),
		},

		{
			title: "STATUS",
			dataIndex: "is_archived",
			key: "is_archived",
			render: (is_archived, record: DataType) => (
				<Button
					style={{
						backgroundColor: is_archived ? "#edfbfa" : "#eeeeee",
						paddingLeft: 5,
						paddingRight: 5,
						color: is_archived ? "#85e2d8" : "#a7a7a7",
						textAlign: "center",
						borderRadius: 4,
						cursor: "pointer",
						border: 0,
					}}
					onClick={() => {
						setActiveCallStatusId(record.id);
						archiveCall(record.id, is_archived);
					}}
					loading={record.id === activeCallStatusId ? callStatus : false}
				>
					{is_archived ? "Archived" : "Unarchived"}
				</Button>
			),
		},
		{
			title: "Action",
			key: "action",
			dataIndex: "id",

			render: (id: string) => {
				return (
					<button
						style={{
							paddingLeft: 15,
							paddingRight: 15,
							paddingTop: 4,
							paddingBottom: 4,
							backgroundColor: "#4f46f8",
							border: 0,
							color: "#fff",
							cursor: "pointer",
						}}
						onClick={() => {
							setActiveCallId(id);
							setIsModalOpen(true);
							console.log("called");
						}}
					>
						Add Note
					</button>
				);
			},
		},
	];

	React.useEffect(() => {
		getData();
	}, [tableParams.pagination?.current, tableParams.pagination?.pageSize]);
	React.useEffect(() => {
		setTimeout(() => {
			refresh();
		}, 8 * 60 * 1000);
	});

	const refresh = () => {
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
				console.log("refreshed api", resp);
				setToken(resp.access_token);
			})
			.catch((err) => {
				console.log(err);
			});
	};
	const getData = async () => {
		try {
			setLoading(true);
			const result = await apiGetRequest(
				`/calls?offset=${tableParams.pagination?.current}&limit=${tableParams.pagination?.pageSize}`
			);
			const { nodes } = result.data;
			setCallsData(nodes);

			setLoading(false);
			setTableParams({
				...tableParams,
				pagination: {
					...tableParams.pagination,
					total: result.data.totalCount,
					// 200 is mock data, you should read it from server
					// total: data.totalCount,
				},
			});
		} catch (err) {
			setLoading(false);
			console.log(err);
		}
	};
	const archiveCall = async (id: string, is_archived: boolean) => {
		setCallStatus(true);
		try {
			await apiPutRequest(endpoints.archive(id), null);
			//	console.log("resp", resp);
			message.success("Successfully updated call status", 2);
			getData();
		} catch (err: any) {
			if (err.response.data.statusCode === 404) {
				message.error("Error! Call not found", 2);
			} else {
				message.warning("Failed to update call status", 2);
			}
		} finally {
			setCallStatus(false);
			setActiveCallStatusId(null);
		}
	};
	const handleTableChange = (
		pagination: TablePaginationConfig,
		filters: Record<string, FilterValue | null>
		//sorter: SorterResult<DataType>
	) => {
		setTableParams({
			pagination,
			filters,
		});
	};

	const menu = (
		<Menu
			items={[
				{
					key: "1",
					label: (
						<div
							onClick={() => {
								setFilterItem("voicemail");
							}}
						>
							Voice Mail
						</div>
					),
				},
				{
					key: "2",
					label: (
						<div
							onClick={() => {
								setFilterItem("missed");
							}}
						>
							Missed
						</div>
					),
				},
				{
					key: "3",
					label: (
						<div
							onClick={() => {
								setFilterItem("answered");
							}}
						>
							Answered
						</div>
					),
				},
			]}
		/>
	);

	return (
		<div style={{ backgroundColor: "#fefefe" }}>
			<Header>
				<button
					style={{
						backgroundColor: "#4f46f8",
						paddingTop: 7,
						paddingBottom: 7,
						width: 120,
						outline: "none",
						color: "#fff",
						border: 0,
					}}
				>
					Log out
				</button>
			</Header>

			<div
				style={{
					display: "flex",
					height: "100%",
					minHeight: "90vh",
					backgroundColor: "#fefefe",
					padding: 40,
					flexDirection: "column",
				}}
			>
				<AddNoteModal
					id={activeCallId ?? ""}
					isModalOpen={isModalOpen}
					setIsModalOpen={setIsModalOpen}
				/>
				<ViewDetails
					id={viewModalCallId ?? ""}
					isModalOpen={isViewModalOpen}
					setIsModalOpen={setIsViewModalOpen}
				/>
				<p style={{ fontSize: 25 }}>Turing Technologies Frontend Test</p>
				<Dropdown
					overlay={menu}
					onOpenChange={(e) => {
						console.log(e);
					}}
				>
					<p style={{ color: "#9c9c9c" }}>
						Filter by:{" "}
						<span style={{ color: "blue" }}>
							{filterItem === "voicemail"
								? "Voice Mail"
								: filterItem === "answered"
								? "Answered"
								: "Missed"}{" "}
							<DownOutlined style={{ marginLeft: 10 }} />
						</span>
					</p>
				</Dropdown>
				<Table
					columns={columns}
					// rowSelection={rowSelection}
					// onRow={(record, rowIndex) => {
					// 	return {
					// 		onClick: () => {
					// 			setViewModalCallId(record.id);
					// 			setIsViewModalOpen(true);
					// 		},
					// 	};
					// }}
					rowKey={(record) => record.id}
					bordered={true}
					pagination={tableParams.pagination}
					dataSource={
						// filterItem != ""
						// 	? callsData.filter((item: DataType) =>
						// 			item.call_type.includes(filterItem)
						// 	  )
						// 	: callsData
						callsData
					}
					loading={loading}
					onChange={handleTableChange}
				/>
			</div>
		</div>
	);
};
export default DashboardContainer;
