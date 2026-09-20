import { HistoryTable } from '@/components/HistoryTable';

export default function HistoryPage(){
  return (
    <>
      <div className="pageTop"><div><h1>History</h1><p className="muted">Live AgentEscrow events from BOT Chain.</p></div></div>
      <HistoryTable />
    </>
  );
}
