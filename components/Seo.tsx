import Head from "next/head";

export default function Seo({ title }) {
  return (
    <Head>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <title>{title} | 용석의 아카데미 </title>
    </Head>
  );
}
