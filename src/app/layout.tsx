import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { MantineProvider, createTheme } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { MenuProvider } from '@/contexts/MenuContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { DialogProvider } from '@/contexts/DialogContext';
import { HelpMessagesProvider } from '@/contexts/HelpMessagesContext';
import GlobalMenu from '@/components/layout/GlobalMenu';
import "./globals.css";
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const theme = createTheme({
  fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  headings: {
    fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  },
});

export const metadata: Metadata = {
  title: "Bike Kitchen UvA",
  description: "Community bike repair workshop app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased font-inter`}
        style={{ '--mantine-font-family': 'var(--font-inter), -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif' } as React.CSSProperties}
      >
        <AuthProvider>
          <HelpMessagesProvider>
            <MenuProvider>
              <DialogProvider>
                <MantineProvider theme={theme}>
                  <ModalsProvider>
                    <Notifications />
                    <GlobalMenu />
                    {children}
                  </ModalsProvider>
                </MantineProvider>
              </DialogProvider>
            </MenuProvider>
          </HelpMessagesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
