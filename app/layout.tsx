import { Poppins } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/query-provider";
import ThemeProvider from "@/providers/theme-provider";
import { createMetadata } from "@/lib/metadata";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Toast from "@/components/ui/toast";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = createMetadata({
  title: "Real Estate",
  description: "Find properties for sale and rent across India.",
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <QueryProvider>
            <Header />
            {children}
            <Footer />

            <Toast />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
