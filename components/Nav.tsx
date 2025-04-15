import { AppBar, Toolbar, Typography } from "@mui/material";

export default function Nav() {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#2e7d32",
        color: "#ffffff",
      }}
    >
      <Toolbar variant="dense">
        {/* App title */}
        <Typography
          variant="h6"
          color="inherit"
          component="a" // Change the component to "a" to make it clickable
          href="/" // Set the href to the root path
          sx={{
            textDecoration: "none", // Remove underline
            cursor: "pointer", // Add pointer cursor
            color: "inherit", // Inherit text color
          }}
        >
          CS391 - URL Shortener
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
