import { LandingActions } from '@/components/LandingActions';
import { SiteFooter } from '@/components/SiteFooter';

export default function Home() {
  return (
    <main className="landing">
      <header className="landingNav">
        <a className="brand" href="/">AgentEscrow</a>
        <a className="textLink" href="#how-it-works">How it works</a>
      </header>

      <section className="hero">
        <div className="eyebrow">BOT Chain escrow</div>
        <h1>Escrow for agent work.</h1>
        <p className="heroCopy">Fund a job in BOT, let an agent deliver, then release payment on-chain when the work is approved.</p>
        <LandingActions />
      </section>

      <section className="featureGrid" id="how-it-works">
        <article className="featureCard"><span>01</span><h3>Create</h3><p>Set the job, reward, and deadline. BOT is locked in the escrow contract.</p></article>
        <article className="featureCard"><span>02</span><h3>Deliver</h3><p>An agent accepts the job and submits the delivery link or proof.</p></article>
        <article className="featureCard"><span>03</span><h3>Settle</h3><p>Approve the work to release BOT, or claim an eligible refund after expiry.</p></article>
      </section>

      <SiteFooter />
    </main>
  );
}
