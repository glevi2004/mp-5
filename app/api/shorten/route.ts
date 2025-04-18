import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import dns from "dns";
import { promisify } from "util";

// Promisify dns.lookup for async/await usage
const dnsLookup = promisify(dns.lookup);

/**
 * Handles POST requests to create a shortened URL alias.
 * Expects a JSON body with { alias, url }.
 */
export async function POST(req: Request) {
  try {
    // Parse the JSON body
    const { alias, url } = await req.json();
    // Validate fields, if any is undefined return 400 status
    // 400 status (Bad Request): client sent something invalid,
    // and the server is rejecting the request because of the client's mistake
    if (!alias || !url) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    // Check if URL is empty after trimming
    if (url.trim() === "") {
      return NextResponse.json(
        { message: "URL cannot be empty" },
        { status: 400 }
      );
    }

    // Validate the URL
    try {
      new URL(url); // Throws an error if any
    } catch {
      return NextResponse.json({ message: "Invalid URL." }, { status: 400 });
    }

    // Validate URL format
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { message: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Validate that the domain exists using DNS lookup
    try {
      const hostname = parsedUrl.hostname;
      await dnsLookup(hostname);
    } catch (dnsError) {
      console.error("DNS lookup failed:", dnsError);
      return NextResponse.json(
        { message: "Domain does not exist or is not reachable" },
        { status: 400 }
      );
    }

    // Connect to the database
    const db = await connectToDB();

    // Ensure alias is unique, adds tule at the database level that prevents duplicates (will be handled by MongoDB)
    await db.collection("alias").createIndex({ alias: 1 }, { unique: true });

    // Check if alias already exists (manual check before inserting), message before MongoDB has an error
    const existing = await db.collection("alias").findOne({ alias });
    if (existing) {
      return NextResponse.json(
        { message: "Alias already exists" },
        { status: 400 }
      );
    }

    // Insert new alias
    await db.collection("alias").insertOne({
      alias,
      url,
      createdAt: new Date(),
      clicks: 0,
    });

    // 201 status (Created): new resource was successfully created
    return NextResponse.json(
      { message: "URL shortened successfully!" },
      { status: 201 }
    );
  } catch (error: unknown) {
    // 500 status: something went wrong in the server
    // Narrow down error type (before was using any and had deployment issues
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    // Handle unexpected error types
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
