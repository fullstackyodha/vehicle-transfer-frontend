"use client";

import AddIcon from "@mui/icons-material/Add";
import { Box, Button, TextField } from "@mui/material";
import Modal from "@mui/material/Modal";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import vehicleImage from "./../../public/vehicleImage.jpg";
import PermMediaIcon from "@mui/icons-material/PermMedia";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 300,
	height: 380,
	bgcolor: "background.paper",
	borderRadius: "10px",
	boxShadow: 24,
	display: "flex",
	flexDirection: "column",
	gap: "1rem",
	p: 2,
};

const styleDoc = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 800,
	height: 500,
	bgcolor: "background.paper",
	borderRadius: "10px",
	boxShadow: 24,
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	gap: "1rem",
	p: 2,
};

export default function Vehicles() {
	const [vehicleNumber, setVehicleNumber] = useState("");
	const [vehicleType, setVehicleType] = useState("");
	const [PUC_certificate, setPUCCertificate] = useState("");
	const [insurance_certificate, setInsuranceCertificate] =
		useState("");

	const [puc_doc, setPUCDoc] = useState("");
	const [insurance_doc, setInsuranceDoc] = useState("");

	const [selectedFile, setSelectedFile] = useState(null);

	const [searchValue, setSearchValue] = useState("");

	let [vehicleList, setVehicleList] = useState([]);

	useEffect(() => {
		const fetchVehicles = async () => {
			try {
				const response = await fetch(
					"http://localhost:5000/api/v1/vehicle/allVehicles",
					{
						method: "GET",
					}
				);

				const data = await response.json();

				setVehicleList(data.data.vehicles.reverse());
			} catch (error) {
				console.error("Error fetching vehicles:", error);
			}
		};

		fetchVehicles();
	}, [vehicleList]);

	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const [openDocument, setOpenDocument] = useState(false);
	const handleOpenDocument = () => setOpenDocument(true);
	const handleCloseDocument = () => setOpenDocument(false);

	if (vehicleList.length && searchValue) {
		vehicleList = vehicleList.filter((vehicle) => {
			return (
				vehicle.vehicleNumber
					.toLowerCase()
					.includes(searchValue.toLowerCase()) ||
				vehicle.vehicleType
					.toLowerCase()
					.includes(searchValue.toLowerCase())
			);
		});
	}

	const handleFileChange = (e, setter) => {
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
				setter(e.target.result);
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
				"http://localhost:5000/api/v1/vehicle/create",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						vehicleNumber,
						vehicleType,
						PUC_certificate,
						insurance_certificate,
					}),
				}
			);

			if (!response.ok) {
				toast.error("Error Creating Vehicle!!", {
					duration: 4000,
					position: "top-center",
				});
			} else {
				setVehicleNumber("");
				setVehicleType("");
				setPUCCertificate("");
				setInsuranceCertificate("");

				toast.success("Vehicle Created Successfully.", {
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
					label="Search Vehciles"
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
								Add New Vehicle
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
										label="Number"
										variant="outlined"
										size="small"
										sx={{ width: "100%" }}
										value={vehicleNumber}
										onChange={(e) =>
											setVehicleNumber(e.target.value)
										}
										required
									/>

									<TextField
										id="number"
										label="Type"
										variant="outlined"
										size="small"
										sx={{ width: "100%" }}
										value={vehicleType}
										onChange={(e) =>
											setVehicleType(e.target.value)
										}
										required
									/>

									<label htmlFor="puc">
										PUC Certificate
									</label>

									<TextField
										type="file"
										id="puc"
										variant="outlined"
										size="small"
										sx={{ width: "100%" }}
										onChange={(e) =>
											handleFileChange(e, setPUCCertificate)
										}
										required
									/>

									<label htmlFor="insurance">
										Insurance Certificate
									</label>

									<TextField
										type="file"
										id="insurance"
										variant="outlined"
										size="small"
										sx={{ width: "100%" }}
										onChange={(e) =>
											handleFileChange(
												e,
												setInsuranceCertificate
											)
										}
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
				<div>
					<Modal
						open={openDocument}
						onClose={handleCloseDocument}
						aria-labelledby="modal-modal-doc">
						<Box sx={styleDoc}>
							<Image
								src={puc_doc}
								width={400}
								height={500}
								alt="puc"
							/>
							<Image
								src={insurance_doc}
								width={400}
								height={500}
								alt="insurance"
							/>
						</Box>
					</Modal>
				</div>

				{vehicleList.map((vehicle, index) => {
					return (
						<>
							<Box
								key={index}
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
										src={vehicleImage}
										width={75}
										height={55}
										alt={"vehicle"}
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
										sx={{
											fontSize: "1rem",
											fontWeight: "bold",
										}}>
										{vehicle.vehicleNumber}
									</Box>

									<Box
										sx={{
											backgroundColor: "#f54242",
											fontWeight: "bold",
											fontSize: "0.9rem",
											padding: "0.3rem 0.4rem",
											borderRadius: "10px",
										}}>
										{vehicle.vehicleType}
									</Box>

									<Box
										sx={{ cursor: "pointer" }}
										onClick={() => {
											setPUCDoc(vehicle.PUC_certificate);
											setInsuranceDoc(
												vehicle.insurance_certificate
											);

											handleOpenDocument();
										}}>
										<PermMediaIcon />
									</Box>
								</Box>
							</Box>
						</>
					);
				})}
			</Box>
		</Box>
	);
}
