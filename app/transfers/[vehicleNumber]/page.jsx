"use client";

import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import SyncAltIcon from "@mui/icons-material/SyncAlt";

export default function TransferDetails({ params }) {
	const vehicleNumber = params.vehicleNumber;

	const [transferList, setTransferLsit] = useState([]);

	useEffect(() => {
		const fetchTransfers = async () => {
			try {
				const response = await fetch(
					`http://localhost:5000/api/v1/transfer/history/${vehicleNumber}`,
					{
						method: "GET",
					}
				);

				const data = await response.json();

				setTransferLsit(data.data.transfers);
			} catch (error) {
				console.error("Error fetching Transfers", error);
			}
		};

		fetchTransfers();
	}, [vehicleNumber, transferList]);

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
			}}>
			<Box
				sx={{
					textAlign: "center",
					fontWeight: "bold",
					fontSize: "1rem",
				}}>
				Transfer History: {vehicleNumber}
			</Box>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					gap: "1rem",
					marginTop: "1rem",
				}}>
				{transferList.map((transfer, index) => (
					<>
						<Box
							key={index}
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								width: "50%",
								padding: "1rem",
								backgroundColor: "#dcdee0",
								borderRadius: "10px",
							}}>
							<Box
								sx={{
									fontWeight: "bold",
									fontSize: "0.9rem",
									padding: "0.3rem 0.4rem",
									borderRadius: "10px",
								}}>
								{transfer.transferdate.split("T")[0]}
							</Box>

							<Box
								sx={{
									fontWeight: "bold",
									fontSize: "0.9rem",
									padding: "0.3rem 0.4rem",
									borderRadius: "10px",
									backgroundColor: "#898967",
								}}>
								{transfer.from_name}
							</Box>

							<Box>
								<SyncAltIcon />
							</Box>
							<Box
								sx={{
									fontWeight: "bold",
									fontSize: "0.9rem",
									padding: "0.3rem 0.4rem",
									borderRadius: "10px",
									backgroundColor: "#123459",
									color: "white",
								}}>
								{transfer.to_name}
							</Box>
						</Box>
					</>
				))}
			</Box>
		</Box>
	);
}
