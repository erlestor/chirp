import { type AppType } from "next/app"

import { api } from "~/utils/api"
import "~/styles/globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { Toaster } from "react-hot-toast"
import Head from "next/head"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider
      {...pageProps}
      appearance={{
        baseTheme: dark,
      }}
    >
      <Head>
        <title>Chirp</title>
        <meta name="description" content="thinking..." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster position="bottom-center" />
      <Component {...pageProps} />
      <ReactQueryDevtools initialIsOpen={false} />
    </ClerkProvider>
  )
}

export default api.withTRPC(MyApp)
