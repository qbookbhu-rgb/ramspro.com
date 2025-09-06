
import type { Metadata } from 'next';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import '../globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import SosButton from '@/components/layout/sos-button';
import { AuthProvider } from '@/hooks/use-auth';

export const metadata: Metadata = {
  title: 'RAMS.com | Your Health Companion',
  description: 'Find doctors, check symptoms with AI, and book appointments online or in-clinic.',
};

export default async function LocaleLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased')}>
        <NextIntlClientProvider locale={locale} messages={messages}>
            <AuthProvider>
            <div className="relative flex min-h-dvh flex-col bg-background">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
            </div>
            <SosButton />
            <Toaster />
            <div id="recaptcha-container"></div>
            </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
