export default function HistoryPage(){
  return (
    <>
      <div className="pageTop">
        <div>
          <div className="eyebrow">Transaction history</div>
          <h1>Escrow events</h1>
          <p className="muted">A readable timeline of contract events for your connected wallet.</p>
        </div>
      </div>

      <div className="card tableWrap">
        <table className="table">
          <thead><tr><th>Event</th><th>Job</th><th>Amount</th><th>Status</th><th>Transaction</th></tr></thead>
          <tbody><tr><td colSpan={5} className="muted">No contract events loaded yet.</td></tr></tbody>
        </table>
      </div>
    </>
  );
}
