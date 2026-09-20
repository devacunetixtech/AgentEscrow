import Link from 'next/link';
import { JobsList } from '@/components/JobsList';

export default function JobsPage(){
  return (
    <>
      <div className="pageTop">
        <div><h1>Open Jobs</h1><p className="muted">Live funded jobs on BOT Chain.</p></div>
        <Link className="btn btnSecondary" href="/app/create-job">Create Job</Link>
      </div>
      <JobsList mode="open" />
    </>
  );
}
