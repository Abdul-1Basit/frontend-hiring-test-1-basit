import { Button, Form, Input } from "antd";
import React from "react";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Header from "../../Components/Header";
import { apiPostRequest } from "../../Helpers/axiosRequests";
import { endpoints } from "../../Helpers/dbConfig";
import { setToken } from "../../Helpers/tokenManagement";
import { useNavigate } from "react-router-dom";
const SigninContainer: React.FC = () => {
	const navigate = useNavigate();
	const loginUser = async (values: any) => {
		apiPostRequest(endpoints.signinUrl, values, null)
			.then((resp: any) => {
				const { access_token } = resp.data;
				//	console.log("rsp", resp);
				setToken(access_token);
				navigate("/dashboard");
			})
			.catch((err) => {
				console.log(err);
			});
	};
	const onFinish = (values: any) => {
		loginUser(values);
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};

	return (
		<div style={{ backgroundColor: "#f3eded" }}>
			<Header />
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					height: "100%",
					minHeight: "90vh",
				}}
			>
				<div
					style={{
						backgroundColor: "#fefefe",
						paddingLeft: 20,
						paddingRight: 20,
						paddingTop: 30,
						paddingBottom: 25,
						borderRadius: 2,
						width: "100%",
						maxWidth: 530,
					}}
				>
					<Form
						name="basic"
						// labelCol={{ span: 8 }}
						// wrapperCol={{ span: 16 }}
						initialValues={{ remember: true }}
						onFinish={onFinish}
						onFinishFailed={onFinishFailed}
						layout={"vertical"}
						autoComplete="off"
					>
						<Form.Item
							label="Username"
							name="username"
							rules={[
								{ required: true, message: "Please input your username!" },
							]}
						>
							<Input
								prefix={<UserOutlined />}
								style={{ width: "100%", height: 40 }}
								placeholder="Email"
							/>
						</Form.Item>

						<Form.Item
							label="Password"
							name="password"
							rules={[
								{ required: true, message: "Please input your password!" },
							]}
						>
							<Input.Password
								prefix={<LockOutlined />}
								style={{ width: "100%", height: 40 }}
								placeholder="Password"
							/>
						</Form.Item>

						<Form.Item>
							<Button type="primary" htmlType="submit">
								Log in
							</Button>
						</Form.Item>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default SigninContainer;
