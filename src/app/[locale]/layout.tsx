import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import SosButton from '@/components/layout/sos-button';
import { AuthProvider } from '@/hooks/use-auth';

export default function LocaleLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {

  return (
    <AuthProvider>
        <div className="relative flex min-h-dvh flex-col bg-background">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
        <SosButton />
        <Toaster />
    </AuthProvider>
  );
}
