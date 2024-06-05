"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Navbar = () => {
	const pathName = usePathname().slice(1);

	return (
		<div className="navbar">
			<ul className="navbar-content">
				<li>
					<Link
						className={`navlinks ${
							pathName === "" && "active"
						}`}
						href="/">
						Drivers
					</Link>
				</li>

				<li>
					<Link
						className={`navlinks ${
							pathName === "vehicles" && "active"
						}`}
						href="/vehicles">
						Vehicles
					</Link>
				</li>

				<li>
					<Link
						className={`navlinks ${
							pathName === "transfers" && "active"
						}`}
						href="/transfers">
						Transfers
					</Link>
				</li>
			</ul>
		</div>
	);
};

export default Navbar;
