import { Inter } from "next/font/google";
import Navbar from "./_components/Navbar";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Vehicle Transfer App",
	description: "Generated by create next app",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Toaster />
				<Navbar />
				<main className="content">{children}</main>
			</body>
		</html>
	);
}
