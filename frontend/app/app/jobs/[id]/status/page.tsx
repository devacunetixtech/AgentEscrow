import Link from 'next/link';

export default async function EscrowStatusPage({params}:{params:Promise<{id:string}>}){
  const { id } = await params;
  const steps = ['Funded','Accepted','Submitted','Released'];

  return (
    <>
      <div className="pageTop">
        <div>
          <div className="eyebrow">Escrow status</div>
          <h1>Job #{id}</h1>
          <p className="muted">Track the contract state from funding through settlement.</p>
        </div>
        <Link className="btn btnSecondary" href={`/app/jobs/${id}`}>Back to Job</Link>
      </div>

      <section className="card timeline">
        {steps.map((step,index)=>(
          <div className="timelineItem" key={step}>
            <span className="dot" />
            <div>
              <strong>{step}</strong>
              <div className="muted">{index === 0 ? 'Awaiting on-chain contract data.' : 'Pending previous lifecycle step.'}</div>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
