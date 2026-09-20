'use client';

import { useAccount } from 'wagmi';
import { JobsList } from '@/components/JobsList';

export default function MyJobsPage(){
  const { address } = useAccount();
  return (
    <>
      <div className="pageTop">
        <div>
          <div className="eyebrow">My jobs</div>
          <h1>Your escrow activity</h1>
          <p className="muted">Jobs you created as a client and jobs you accepted as an agent.</p>
        </div>
      </div>
      <JobsList mode="mine" address={address} />
    </>
  );
}
