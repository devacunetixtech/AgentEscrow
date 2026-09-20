import Link from 'next/link';
import { EscrowTimeline } from '@/components/EscrowTimeline';

export default async function EscrowStatusPage({params}:{params:Promise<{id:string}>}){
  const { id } = await params;
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
      <EscrowTimeline id={BigInt(id)} />
    </>
  );
}
