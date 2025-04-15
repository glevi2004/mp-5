import { connectToDB } from "@/lib/mongodb";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

// Define the props interface including both `params` and `searchParams`, because before had "does not satisfy the contraint "PageProp" error in deployment
interface RedirectPageProps {
  params: { alias: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function RedirectPage(props: RedirectPageProps) {
  const { params } = props;
  const { alias } = params;
  // Connect to MongoDB
  const db = await connectToDB();

  // Try to find the alias in the database
  const record = await db.collection("alias").findOne({ alias: params.alias });

  if (!record) {
    // If alias not found, show a 404 message
    // notFound(): built into Next.js App Router (app/ directory structure)
    // Next.js automaticaly renders app/not-found.tsx if defined, or a default 404 page otherwise
    return notFound();
  }

  // Increment click count
  await db
    .collection("alias")
    .updateOne({ alias: params.alias }, { $inc: { clicks: 1 } });

  // Redirect to the original long URL

  redirect(record.url);
}
