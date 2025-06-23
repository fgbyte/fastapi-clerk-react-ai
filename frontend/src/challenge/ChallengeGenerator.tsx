import { useEffect, useId, useState } from 'react'
import { MCQChallenge } from './MCQChallenge'
import { useAPI } from '../utils/api'
import { type Challenge } from './MCQChallenge'


// Define the Quota interface
interface Quota {
	user_id: string;
	quota_remaining: number;
	last_reset_data: string; // ISO date string
}



export const ChallengeGenerator = () => {
	//States
	const [challenge, setChallenge] = useState<Challenge | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [difficulty, setDifficulty] = useState('easy')
	const [quota, setQuota] = useState<Quota | null>(null) // Use the new Quota interface


	const {makeRequest} = useAPI()

	//Effects
	// biome-ignore lint/correctness/useExhaustiveDependencies: ok
		useEffect(() => {
		fetchQuota()
	}, [])


	const fetchQuota = async () => {
		try {
			const data = await makeRequest('quota')
			setQuota(data)
		} catch(err) {
			console.log(err)
		}
	}

	const generateChallenge = async () => {
		setIsLoading(true)
		setError(null)

		try {
			const data: Challenge = await makeRequest('generate-challenge', {
				method: "POST",
				body: JSON.stringify({difficulty})
			})
			setChallenge(data)
			fetchQuota()
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message)
			} else {
				setError("Failed to generate challenge")
			}
		} finally {
			setIsLoading(false)
		}
	}

	const getNextResetTime = () => {
		if (!quota?.last_reset_data) return null
		const resetDate = new Date(quota.last_reset_data)
		resetDate.setHours(resetDate.getHours() * 24)
		return resetDate
	}

	return (
		<div className="challenge-container">
			<h2>Coding Challenge Generator</h2>

			<div className="quota-display">
				{/* quota_remaining is a value from the db, if it is 0, the user can't generate more challenges */}
				<p>Challenges remaining today: {quota?.quota_remaining || 0}</p>

				{quota?.quota_remaining === 0 && <p>Next reset: {getNextResetTime()?.toLocaleString()}</p>}
			</div>

			<div className="difficulty-selector">
				<label htmlFor="difficulty">Select Difficulty</label>
				<select
					id={useId()}
					value={difficulty}
					onChange={(e) => setDifficulty(e.target.value)}
					disabled={isLoading}
				>
					<option value={'easy'}>Easy</option>
					<option value={'medium'}>Medium</option>
					<option value={'hard'}>Hard</option>
				</select>
			</div>

			<button
				className="generate-button"
				onClick={generateChallenge}
				// disabled={false} //debug
				disabled={isLoading || quota?.quota_remaining === 0}
			>
				{isLoading ? 'Generating...' : 'Generate Challenge'}
			</button>

			{error && (
				<div className="error-message">
					<p>{error}</p>
				</div>
			)}

			{challenge && <MCQChallenge challenge={challenge} />}
		</div>
	)
}
