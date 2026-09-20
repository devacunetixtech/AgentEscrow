import { LiveJob } from '@/components/LiveJob';

export default async function JobDetailPage({params}:{params:Promise<{id:string}>}){
  const { id } = await params;
  return (
    <>
      <div className="pageTop">
        <div>
          <div className="eyebrow">Job #{id}</div>
          <h1>Job details</h1>
          <p className="muted">Review metadata, escrow value, participants, and available lifecycle actions.</p>
        </div>
      </div>
      <LiveJob id={BigInt(id)} />
    </>
  );
}
