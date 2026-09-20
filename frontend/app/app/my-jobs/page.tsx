export default function MyJobsPage(){
  return (
    <>
      <div className="pageTop">
        <div>
          <div className="eyebrow">My jobs</div>
          <h1>Your escrow activity</h1>
          <p className="muted">Jobs you created as a client and jobs you accepted as an agent.</p>
        </div>
      </div>

      <section className="jobsGrid">
        <div className="card">
          <h3>Created by me</h3>
          <p className="muted">Client-side jobs will appear here after the contract address is configured.</p>
        </div>
        <div className="card">
          <h3>Accepted by me</h3>
          <p className="muted">Agent-side jobs will appear here after the contract address is configured.</p>
        </div>
        <div className="card">
          <h3>Completed</h3>
          <p className="muted">Released and refunded jobs will be grouped here.</p>
        </div>
      </section>
    </>
  );
}
