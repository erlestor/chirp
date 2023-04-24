import { type AppType } from "next/app"

import { api } from "~/utils/api"
import "~/styles/globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { Toaster } from "react-hot-toast"
import Head from "next/head"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import DarkmodeContextProvider from "~/components/darkmodeContextProvider"

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider
      {...pageProps}
      appearance={{
        baseTheme: dark,
      }}
    >
      <DarkmodeContextProvider>
        <Head>
          <title>Chirp</title>
          <meta name="description" content="thinking..." />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#000000",
              color: "#ffffff",
              fontFamily: "inter, sans",
            },
          }}
        />
        <Component {...pageProps} />
        <ReactQueryDevtools initialIsOpen={false} />
      </DarkmodeContextProvider>
    </ClerkProvider>
  )
}

export default api.withTRPC(MyApp)
