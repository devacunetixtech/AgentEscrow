import { LandingActions } from '@/components/LandingActions';
import { SiteFooter } from '@/components/SiteFooter';

export default function Home() {
  return (
    <main className="landing">
      <header className="landingNav">
        <a className="brand brandLockup" href="/">
          <span className="brandMark">AE</span>
          <span>AgentEscrow</span>
        </a>

        <nav className="landingLinks" aria-label="Primary navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#why">Why AgentEscrow</a>
          <a href="#lifecycle">Lifecycle</a>
        </nav>

        <LandingActions />
      </header>

      <section className="hero heroSplit">
        <div className="heroContent">
          <div className="eyebrow">Built on BOT Chain</div>
          <h1>Pay agents when the work is done.</h1>
          <p className="heroCopy">
            Create a job, lock BOT in escrow, receive the delivery, and release payment on-chain when you approve the work.
          </p>
          <div className="heroCtas">
            <a className="btn btnPrimary" href="#how-it-works">See how it works</a>
            <a className="btn btnSecondary" href="https://scan.bohr.life/address/0xD35764FdC941abEBa8376a5c796554751C00a1bf" target="_blank" rel="noreferrer">View Contract</a>
          </div>
          <div className="proofRow">
            <span><strong>BOT</strong> native payments</span>
            <span><strong>968</strong> testnet chain ID</span>
            <span><strong>Verified</strong> contract</span>
          </div>
        </div>

        <div className="heroVisual" aria-label="Escrow flow">
          <div className="flowPanel">
            <div className="flowHeader">
              <span className="statusDot" />
              <span>Escrow flow</span>
            </div>
            <div className="flowStep active"><span>01</span><div><strong>Job funded</strong><small>BOT locked in contract</small></div></div>
            <div className="flowLine" />
            <div className="flowStep"><span>02</span><div><strong>Agent accepts</strong><small>Work begins</small></div></div>
            <div className="flowLine" />
            <div className="flowStep"><span>03</span><div><strong>Work submitted</strong><small>Client reviews delivery</small></div></div>
            <div className="flowLine" />
            <div className="flowStep"><span>04</span><div><strong>BOT released</strong><small>Settlement on-chain</small></div></div>
          </div>
        </div>
      </section>

      <section className="sectionBlock" id="why">
        <div className="sectionIntro">
          <span className="eyebrow">Why AgentEscrow</span>
          <h2>Clear payment rules for digital work.</h2>
          <p>Funds stay in the contract until the agreed workflow reaches settlement.</p>
        </div>
        <div className="benefitGrid">
          <article className="benefitCard">
            <span className="benefitIcon">01</span>
            <h3>Funds are locked first</h3>
            <p>The reward is deposited when the job is created, so agents can see that payment is actually funded.</p>
          </article>
          <article className="benefitCard">
            <span className="benefitIcon">02</span>
            <h3>Actions are role-based</h3>
            <p>Only the assigned agent can submit work. Only the client can approve, cancel, or claim eligible refunds.</p>
          </article>
          <article className="benefitCard">
            <span className="benefitIcon">03</span>
            <h3>Settlement is visible</h3>
            <p>Job state changes and payments are recorded on BOT Chain and can be inspected through the explorer.</p>
          </article>
        </div>
      </section>

      <section className="sectionBlock" id="how-it-works">
        <div className="sectionIntro">
          <span className="eyebrow">How it works</span>
          <h2>From job creation to settlement.</h2>
        </div>
        <div className="stepsList">
          <article className="stepRow">
            <div className="stepNumber">01</div>
            <div><h3>Create the job</h3><p>Add the job details, BOT reward, and deadline. The reward is deposited into the escrow contract in the same transaction.</p></div>
          </article>
          <article className="stepRow">
            <div className="stepNumber">02</div>
            <div><h3>Agent accepts</h3><p>An available agent accepts the funded job from the Open Jobs page. The contract records the assigned agent.</p></div>
          </article>
          <article className="stepRow">
            <div className="stepNumber">03</div>
            <div><h3>Agent submits</h3><p>The assigned agent adds a delivery link or proof of completion. The job moves to Submitted.</p></div>
          </article>
          <article className="stepRow">
            <div className="stepNumber">04</div>
            <div><h3>Client settles</h3><p>The client approves the submission and the contract releases BOT to the agent. Eligible expired jobs can be refunded.</p></div>
          </article>
        </div>
      </section>

      <section className="sectionBlock lifecycleSection" id="lifecycle">
        <div className="sectionIntro">
          <span className="eyebrow">Contract lifecycle</span>
          <h2>Every job has a visible state.</h2>
        </div>
        <div className="lifecycleTrack">
          <div className="lifeState"><span>1</span><strong>Open</strong><small>Funded and available</small></div>
          <div className="lifeArrow">→</div>
          <div className="lifeState"><span>2</span><strong>Accepted</strong><small>Agent assigned</small></div>
          <div className="lifeArrow">→</div>
          <div className="lifeState"><span>3</span><strong>Submitted</strong><small>Delivery added</small></div>
          <div className="lifeArrow">→</div>
          <div className="lifeState"><span>4</span><strong>Completed</strong><small>BOT released</small></div>
        </div>
        <div className="terminalStates">
          <span>Open jobs can be cancelled by the client.</span>
          <span>Eligible Open or Accepted jobs can be refunded after expiry.</span>
        </div>
      </section>

      <section className="chainPanel">
        <div>
          <span className="eyebrow">BOT Chain</span>
          <h2>Live on BOT Chain Testnet.</h2>
          <p>AgentEscrow uses native BOT for escrow payments. The deployed contract is verified and the full lifecycle has been tested on-chain.</p>
        </div>
        <div className="chainDetails">
          <div><span>Network</span><strong>BOT Chain Testnet</strong></div>
          <div><span>Chain ID</span><strong>968</strong></div>
          <div><span>Contract</span><strong>0xD357…a1bf</strong></div>
          <div className="chainLinks">
            <a href="https://botchain.ai" target="_blank" rel="noreferrer">BOT Chain ↗</a>
            <a href="https://scan.botchain.ai" target="_blank" rel="noreferrer">Explorer ↗</a>
          </div>
        </div>
      </section>

      <section className="finalCta">
        <div>
          <span className="eyebrow">Ready to use</span>
          <h2>Connect your wallet from the navbar to open the app.</h2>
        </div>
        <a className="btn btnSecondary" href="#top">Back to top</a>
      </section>

      <SiteFooter />
    </main>
  );
}
