import Link from 'next/link';

export default async function JobDetailPage({params}:{params:Promise<{id:string}>}){
  const { id } = await params;

  return (
    <>
      <div className="pageTop">
        <div>
          <div className="eyebrow">Job #{id}</div>
          <h1>Job details</h1>
          <p className="muted">Review job metadata, escrow value, participants, and lifecycle actions.</p>
        </div>
        <Link className="btn btnSecondary" href={`/app/jobs/${id}/status`}>View Escrow Status</Link>
      </div>

      <div className="detailGrid">
        <section className="card">
          <span className="statusPill">Open</span>
          <h2>Job #{id}</h2>
          <div className="jobMeta"><span>Reward</span><strong>— BOT</strong></div>
          <div className="jobMeta"><span>Client</span><strong>—</strong></div>
          <div className="jobMeta"><span>Agent</span><strong>Not assigned</strong></div>
          <div className="jobMeta"><span>Deadline</span><strong>—</strong></div>
          <hr style={{borderColor:'#23415F',borderStyle:'solid',borderWidth:'1px 0 0',margin:'20px 0'}} />
          <h3>Job metadata</h3>
          <p className="muted">On-chain metadata will be displayed here once the deployed contract is connected.</p>
        </section>

        <aside className="card">
          <h3>Available actions</h3>
          <p className="muted">Actions are shown according to your wallet role and the job's current state.</p>
          <div className="actions">
            <button className="btn btnPrimary" disabled>Accept Job</button>
            <button className="btn btnSecondary" disabled>Submit Work</button>
            <button className="btn btnSecondary" disabled>Approve & Release</button>
            <button className="btn btnDanger" disabled>Cancel / Refund</button>
          </div>
        </aside>
      </div>
    </>
  );
}
