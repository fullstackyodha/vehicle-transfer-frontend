"use client";

import AddIcon from "@mui/icons-material/Add";
import { Box, Button, TextField } from "@mui/material";
import Modal from "@mui/material/Modal";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 300,
	height: 250,
	bgcolor: "background.paper",
	borderRadius: "10px",
	boxShadow: 24,
	display: "flex",
	flexDirection: "column",
	gap: "1rem",
	p: 2,
};

export default function Drivers() {
	const [name, setFullname] = useState("");
	const [phone_number, setPhone] = useState("");
	const [profile_photo, setProfilePhoto] = useState("");

	const [selectedFile, setSelectedFile] = useState(null);

	const [searchValue, setSearchValue] = useState("");

	let [driverList, setDriverList] = useState([]);

	useEffect(() => {
		const fetchDrivers = async () => {
			try {
				const response = await fetch(
					"http://localhost:5000/api/v1/driver/allDrivers",
					{
						method: "GET",
					}
				);

				const data = await response.json();

				setDriverList(data.data.drivers.reverse());
			} catch (error) {
				console.error("Error fetching drivers:", error);
			}
		};

		fetchDrivers();
	}, [driverList]);

	if (driverList.length && searchValue) {
		driverList = driverList.filter((driver) => {
			return (
				driver.name
					.toLowerCase()
					.includes(searchValue.toLowerCase()) ||
				driver.phone_number
					.toLowerCase()
					.includes(searchValue.toLowerCase())
			);
		});
	}

	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleFileChange = (e) => {
		const file = e.target.files[0];

		if (
			file &&
			(file.type === "image/png" ||
				file.type === "image/jpeg")
		) {
			setSelectedFile(file);

			// Reads the contents of files stored on the user's computer
			const reader = new FileReader();
			reader.onload = (e) => {
				setProfilePhoto(e.target.result);
			};
			reader.readAsDataURL(file);
		} else {
			alert("Please select a PNG or JPEG image file.");
		}
	};

	const handleSubmit = async (e) => {
		try {
			e.preventDefault();

			const response = await fetch(
				"http://localhost:5000/api/v1/driver/create",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						name,
						phone_number,
						profile_photo,
					}),
				}
			);

			if (!response.ok) {
				toast.error("Error Creating Driver!!", {
					duration: 4000,
					position: "top-center",
				});
			} else {
				setFullname("");
				setPhone("");
				setProfilePhoto("");

				toast.success("Driver Created Successfully.", {
					duration: 4000,
					position: "top-center",
				});

				handleClose();
			}
		} catch (err) {}
	};

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
			}}>
			{/* Search & Add */}
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					gap: "1rem",
				}}>
				<TextField
					label="Search Drivers"
					variant="outlined"
					size="small"
					autoFocus
					value={searchValue}
					onChange={(e) => setSearchValue(e.target.value)}
					sx={{ width: "20rem" }}
				/>

				{/* MODAL */}
				<div>
					<Modal
						open={open}
						onClose={handleClose}
						aria-labelledby="modal-modal-title">
						<Box sx={style}>
							<Box
								sx={{ fontSize: "1.2rem" }}
								id="modal-modal-title">
								Add New Driver
							</Box>

							<form onSubmit={(e) => handleSubmit(e)}>
								<Box
									sx={{
										display: "flex",
										flexDirection: "column",
										justifyContent: "space-between",
										gap: "1rem",
									}}>
									<TextField
										id="fullname"
										label="Full Name"
										variant="outlined"
										size="small"
										sx={{ width: "100%" }}
										value={name}
										onChange={(e) =>
											setFullname(e.target.value)
										}
										required
									/>

									<TextField
										id="number"
										label="Phone"
										variant="outlined"
										size="small"
										sx={{ width: "100%" }}
										value={phone_number}
										onChange={(e) =>
											setPhone(e.target.value)
										}
										required
									/>

									<TextField
										type="file"
										id="photo"
										variant="outlined"
										size="small"
										sx={{ width: "100%" }}
										onChange={(e) => handleFileChange(e)}
										required
									/>

									<Button
										type="submit"
										color="success"
										variant="contained">
										Create
									</Button>
								</Box>
							</form>
						</Box>
					</Modal>
				</div>

				<Button
					variant="contained"
					size="small"
					color="success"
					onClick={handleOpen}>
					<AddIcon />
					Add Driver
				</Button>
			</Box>

			{/* DRIVER LIST */}
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					gap: "1rem",
					marginTop: "1rem",
				}}>
				{driverList.map((driver, index) => (
					<DriverCard key={index} driver={driver} />
				))}
			</Box>
		</Box>
	);
}

const DriverCard = ({ driver }) => {
	return (
		<>
			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					width: "50%",
					padding: "1rem",
					backgroundColor: "#dcdee0",
					borderRadius: "10px",
				}}>
				<Box sx={{ borderRadius: "10px" }}>
					<Image
						src={driver.profile_photo}
						width={75}
						height={55}
						alt={driver.name}
					/>
				</Box>

				<Box
					sx={{
						width: "100%",
						padding: "0 2rem",
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
					}}>
					<Box
						sx={{ fontSize: "1rem", fontWeight: "bold" }}>
						{driver.name}
					</Box>

					<Box
						sx={{
							backgroundColor: "#eda909",
							fontWeight: "bold",
							fontSize: "0.9rem",
							padding: "0.3rem 0.4rem",
							borderRadius: "10px",
						}}>
						{driver.phone_number}
					</Box>
				</Box>
			</Box>
		</>
	);
};
