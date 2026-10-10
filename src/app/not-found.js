import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h2>Page not found</h2>
      <p>We couldn't find the page you were looking for.</p>
      <Link href="/">Back To Home</Link>
    </div>
  );
}
