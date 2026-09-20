import { AppGate } from '@/components/AppGate';
import { AppHeader } from '@/components/AppHeader';
import { SiteFooter } from '@/components/SiteFooter';

export default function DashboardLayout({children}:{children:React.ReactNode}) {
  return (
    <AppGate>
      <div className="appShell">
        <AppHeader />
        <div className="appContent">{children}</div>
        <SiteFooter />
      </div>
    </AppGate>
  );
}
