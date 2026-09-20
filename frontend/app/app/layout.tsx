import AppGate from '@/components/AppGate';
import AppHeader from '@/components/AppHeader';

export default function DashboardLayout({children}:{children:React.ReactNode}) {
  return (
    <AppGate>
      <div className="appShell">
        <AppHeader />
        {children}
      </div>
    </AppGate>
  );
}
