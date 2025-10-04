import Link from "next/link";

export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">Welcome to ContentGen</h1>
      <p className="mt-4">
        <Link
          href="/content"
          className="text-blue-600 hover:underline"
        >
          Go to your Content
        </Link>
      </p>
    </main>
  );
}
