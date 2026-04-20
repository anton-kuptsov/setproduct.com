import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ContactModalProvider } from "../components/modals/ContactModalContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ContactModalProvider>
      <Component {...pageProps} />
    </ContactModalProvider>
  );
}
