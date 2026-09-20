import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'AgentEscrow',
  description: 'Trustless payments for autonomous work.',
  icons: { icon: '/icon.svg' }
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
