import { HistoryTable } from '@/components/HistoryTable';

export default function HistoryPage(){
  return (
    <>
      <div className="pageTop">
        <div>
          <div className="eyebrow">Transaction history</div>
          <h1>Escrow events</h1>
          <p className="muted">A readable timeline of AgentEscrow contract events on BOT Chain testnet.</p>
        </div>
      </div>
      <HistoryTable />
    </>
  );
}
