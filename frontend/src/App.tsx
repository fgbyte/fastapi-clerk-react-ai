import './App.css'
import { Route, Routes } from 'react-router-dom'
import { AuthenticationPage } from './auth/AuthenticationPage'
import { ClerkProviderWithRoutes } from './auth/ClerkProviderWithRoutes'
import { ChallengeGenerator } from './challenge/ChallengeGenerator'
import { HistoryPanel } from './history/HistoryPanel'
import { Layout } from './layout/Layout'

function App() {
	return (
		<ClerkProviderWithRoutes>
			{/* here add all the routes of the app */}
			<Routes>
				<Route path="/sign-in/*" element={<AuthenticationPage />} />
				<Route path="/sign-up" element={<AuthenticationPage />} />
				<Route element={<Layout />}>
					<Route path="/" element={<ChallengeGenerator />} />
					<Route path="/history" element={<HistoryPanel />} />
				</Route>
			</Routes>
		</ClerkProviderWithRoutes>
	)
}

export default App
