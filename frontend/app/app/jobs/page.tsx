import Link from 'next/link';
import { JobsList } from '@/components/JobsList';

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
      <JobsList mode="open" />
    </>
  );
}
