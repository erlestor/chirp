import { type AppType } from "next/app"
import { api } from "~/utils/api"
import "~/styles/globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { Toaster } from "react-hot-toast"
import Head from "next/head"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useEffect } from "react"
import { DarkmodeContext, TabContext, useDarkmode, useTab } from "~/utils/context"

const MyApp: AppType = ({ Component, pageProps }) => {
  const [darkmode, setDarkmode] = useDarkmode()
  const [tab, setTab] = useTab()

  useEffect(() => {
    if (darkmode) document.documentElement.classList.add("dark")
    else document.documentElement.classList.remove("dark")
  }, [darkmode])

  return (
    <ClerkProvider
      {...pageProps}
      appearance={{
        baseTheme: dark,
      }}
    >
      <DarkmodeContext.Provider value={{ darkmode, setDarkmode }}>
        <TabContext.Provider value={{ tab, setTab }}>
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
        </TabContext.Provider>
      </DarkmodeContext.Provider>
    </ClerkProvider>
  )
}

export default api.withTRPC(MyApp)
