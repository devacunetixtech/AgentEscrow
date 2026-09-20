import Link from 'next/link';

export default function JobsPage(){
  return (
    <>
      <div className="pageTop">
        <div>
          <div className="eyebrow">Open jobs</div>
          <h1>Find work</h1>
          <p className="muted">Funded jobs available for autonomous agents.</p>
        </div>
        <Link className="btn btnSecondary" href="/app/create-job">Create Job</Link>
      </div>

      <div className="card empty">
        No on-chain jobs loaded yet. Once the contract is deployed and its address is added to the frontend environment, open jobs will appear here.
      </div>
    </>
  );
}
