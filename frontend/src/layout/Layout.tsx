import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { Link, Navigate, Outlet } from 'react-router-dom'

type Props = {}

export const Layout = (props: Props) => {
	return (
		<div className="app-layout">
			<header className="app-header">
				<div className="header-content">
					<h1>Code Challenge Generator</h1>
					<nav>
						<SignedIn>
							<Link to="/">Generate Challenge</Link>
							<Link to="/history">History</Link>
							<UserButton />
						</SignedIn>
					</nav>
				</div>
			</header>

			<main className="app-main">
				<SignedOut>
					{/* si no esta logeado lo redirige a sign-in, replace: lo hace en la misma pagina */}
					<Navigate to="/sign-in" replace />
				</SignedOut>
				<SignedIn>
					<Outlet /> {/* Render the child routes */}
				</SignedIn>
			</main>
		</div>
	)
}
