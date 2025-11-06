import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/png" href="/Smart_win_logo-transparent.png" />
        <link rel="shortcut icon" type="image/png" href="/Smart_win_logo-transparent.png" />
        <link rel="apple-touch-icon" href="/Smart_win_logo-transparent.png" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
