import Head from "next/head";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>Page Not Found | Setproduct</title>
        <meta content="The requested page does not exist." name="description" />
      </Head>
      <main
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <h1>404</h1>
        <p>This page does not exist.</p>
        <Link href="/">Go to homepage</Link>
      </main>
    </>
  );
}
