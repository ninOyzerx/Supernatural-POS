import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />

        {/* Load jQuery before DataTables */}
        <Script
          src="https://code.jquery.com/jquery-3.6.0.min.js"
          strategy="beforeInteractive"
        />

        {/* Load DataTables after jQuery */}
        <Script
          src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.min.js"
          strategy="afterInteractive"
        />

        {/* DataTables Bootstrap integration */}
        <Script
          src="https://cdn.datatables.net/1.11.5/js/dataTables.bootstrap5.min.js"
          strategy="afterInteractive"
        />
      </body>
    </Html>
  );
}
