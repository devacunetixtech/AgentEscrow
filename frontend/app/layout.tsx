import './globals.css';
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><main className="shell"><nav className="nav"><a className="brand" href="/">AgentEscrow</a><a href="/jobs">Open Jobs</a><a href="/my-jobs">My Jobs</a><a href="/history">History</a></nav>{children}</main></body></html>}
