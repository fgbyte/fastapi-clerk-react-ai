import { useEffect, useState } from 'react'
import { type Challenge, MCQChallenge } from '../challenge/MCQChallenge'

type Props = {}

export const HistoryPanel = (props: Props) => {
	//States
	const [history, setHistory] = useState<Challenge[]>([]) // Specify the type of history
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null) // Specify the type of error

	//Effects
	useEffect(() => {
		fetchHistory()
	}, []) //cuando cargue la pagina se haga fetch de las history

	const fetchHistory = async () => {}

	//Conditions
	if (isLoading) {
		return <div className="loading">Loading History...</div>
	}

	if (error) {
		return (
			<div className="error-message">
				<p>{error}</p>
				<button onClick={fetchHistory}>Retry</button>
			</div>
		)
	}

	return (
		<div className="history-panel">
			<h2>History</h2>
			{history.length === 0 ? (
				<p>No challenge history</p>
			) : (
				<div className="history-list">
					{history.map((challenge) => {
						return (
							<MCQChallenge
								challenge={challenge}
								key={challenge.id}
								showExplanation
							/>
						)
					})}
				</div>
			)}
		</div>
	)
}
