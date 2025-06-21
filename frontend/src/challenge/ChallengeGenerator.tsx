import { useEffect, useId, useState } from 'react'

import { MCQChallenge } from './MCQChallenge'

type Props = {}

export const ChallengeGenerator = (props: Props) => {
	//States
	const [challenge, setChallenge] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState(null)
	const [difficulty, setDifficulty] = useState('easy')
	const [quota, setQueota] = useState(null)

	//Effects
	const fetchQuota = async () => {}

	const generateChallenge = async () => {}

	const getNextResetTime = () => {}

	return (
		<div className="challenge-container">
			<h2>Coding Challenge Generator</h2>

			<div className="quota-display">
				{/* quota_remaining is a value from the db, if it is 0, the user can't generate more challenges */}
				<p>Challenges remaining today: {quota?.quota_remaining || 0}</p>

				{quota?.quota_remaining === 0 && <p>Next reset: {0}</p>}
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
