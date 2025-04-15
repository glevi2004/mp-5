"use client";
import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import styles from "./page.module.css";

export default function Home() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [shortLink, setShortLink] = useState("");

  console.log("MONGODB_URI:", process.env.MONGODB_URI);

  const handleShorten = async () => {
    setMessage("");
    setError("");
    setShortLink("");

    if (!url || !alias) {
      setError("Please fill out both fields.");
      return;
    }

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, alias }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setMessage("URL shortened successfully!");
      setShortLink(`https://mp-5-nu.vercel.app/${alias}`);
    } catch (error: unknown) {
      // Narrow down the error type
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <Box
      className={styles.appBackground}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: 2,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 4,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ color: "#2e7d32" }}
        >
          URL Shortener
        </Typography>
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ color: "#666" }} //
        >
          Shorten your long URLs into compact, shareable links
        </Typography>
      </Box>

      {/* Form Container */}
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          borderRadius: 2,
          // maxWidth: 500,
          width: { sx: "70%", md: "50%" },
          textAlign: "center",
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          Shorten a URL
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          gutterBottom
          sx={{ marginBottom: 2 }}
        >
          Enter a long URL to create a shorter, shareable link
        </Typography>

        {/* URL Input */}
        <TextField
          label="URL"
          placeholder="https://example.com/very/long/url"
          variant="outlined"
          fullWidth
          margin="normal"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "white",
            },
          }}
        />

        {/* Alias Input */}
        <TextField
          label="Custom Alias"
          placeholder="your-custom-alias"
          variant="outlined"
          fullWidth
          margin="normal"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "white",
            },
          }}
          InputProps={{
            startAdornment: (
              <Typography
                variant="body2"
                sx={{ marginRight: 1, color: "text.secondary" }}
              >
                mp-5-nu.vercel.app
              </Typography>
            ),
          }}
        />

        {/* Feedback Message */}
        {message && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {/* Shorten Button */}
        <Button
          variant="contained"
          color="success"
          fullWidth
          sx={{ marginTop: 2 }}
          onClick={handleShorten}
        >
          Shorten
        </Button>

        {/* Shortened Link Output */}
        {shortLink && (
          <Box
            sx={{
              marginTop: 3,
              backgroundColor: "white",
              borderRadius: 1,
              padding: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                wordBreak: "break-all",
                "&:hover": {
                  textDecoration: "underline", // Add underline on hover
                  textDecorationColor: "#2e7d32", // Set underline color to green
                },
              }}
            >
              {/* wordBreak: "break-all" --> long words break onto the next line at any character */}
              <a href={shortLink} target="_blank" rel="noopener noreferrer">
                {shortLink}
              </a>
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => navigator.clipboard.writeText(shortLink)}
            >
              Copy
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
