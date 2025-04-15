import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import LinkIcon from "@mui/icons-material/Link"; // Import LinkIcon
import styles from "./page.module.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "URL Shortner",
  description:
    "Input a link and an alias. Then when someone visits YOUR-APP.COM/alias, they will be redirected to the input link",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={styles.appBackground}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppBar
          position="static"
          sx={{
            backgroundColor: "#2e7d32",
            color: "#ffffff",
          }}
        >
          <Toolbar variant="dense">
            {/* App title */}
            <Typography variant="h6" color="inherit" component="div">
              CS391 - URL Shortener
            </Typography>
          </Toolbar>
        </AppBar>
        {children}
      </body>
    </html>
  );
}
