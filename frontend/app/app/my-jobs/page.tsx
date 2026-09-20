'use client';

import { useAccount } from 'wagmi';
import { JobsList } from '@/components/JobsList';

export default function MyJobsPage(){
  const { address } = useAccount();
  return (
    <>
      <div className="pageTop"><div><h1>My Jobs</h1><p className="muted">Jobs created or accepted by this wallet.</p></div></div>
      <JobsList mode="mine" address={address} />
    </>
  );
}
