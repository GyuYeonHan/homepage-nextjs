import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const name = "Gyu Yeon";
export const siteTitle = "It's Gyulog";

export default function Layout({
  children,
  home,
}: {
  children: React.ReactNode;
  home?: boolean;
}) {
  return (
    <div className="max-w-xl px-0 py-4 mt-3 mb-6 mx-auto ">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      {/* <header className={styles.header}> */}
      <header className="flex flex-col items-center mb-3">
        {home ? (
          <>
            <div className="h-144 w-144">
              <Image
                priority
                src="/images/profile.jpg"
                className="rounded-full"
                height={144}
                width={144}
                alt={name}
              />
            </div>
            <h1 className="text-5xl font-bold tracking-tight mx-4 my-1">
              {name}
            </h1>
          </>
        ) : (
          <>
            <Link href="/">
              <a>
                <Image
                  priority
                  src="/images/profile.jpg"
                  className="rounded-full"
                  height={108}
                  width={108}
                  alt={name}
                />
              </a>
            </Link>
            <h2 className="text-4xl font-bold tracking-tight mx-4 my-1">
              <Link href="/">
                <a className="text-inherit">{name}</a>
              </Link>
            </h2>
          </>
        )}
      </header>
      <main>{children}</main>
      {!home && (
        <div className="mt-5 mx-0 mb-0">
          <Link href="/">
            <a>← Back to home</a>
          </Link>
        </div>
      )}
    </div>
  );
}
