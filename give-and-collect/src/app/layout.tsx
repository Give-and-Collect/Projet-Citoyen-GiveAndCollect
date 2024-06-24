import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import ResponsiveAppBar from "@/components/NavBar/NavBar";
import Footer from "@/components/Footer/Footer";
import theme from "@/utils/theme";
import { Box, ThemeProvider } from "@mui/material";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Give & Collect",
  description: "Transformez des vies en faisant don de vos vêtements. Notre plateforme simplifie la collecte et la redistribution pour aider ceux dans le besoin. Ensemble, nous pouvons faire une différence significative. Faites un geste aujourd'hui.",
};

export default async function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {

  return (
      <html lang="en">
        <body className={inter.className}>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <Providers>
                <ResponsiveAppBar />
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  minHeight={"100vh"}
                >
                  <Box flexGrow={1}>
                    {children}
                  </Box>
                  <Footer />
                </Box>
              </Providers>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </body>
      </html>
  );
}