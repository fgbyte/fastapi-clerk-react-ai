// Reusable component to render one individual question

/*
the questions comes in json format like this:
 {
 	"title":
 	"options": [1, 2, 3, 4],
 	"correctAnswer: 0",
 		"explanation": ""
 }
 */

import { useState } from 'react'

export interface Challenge {
	id: string
	difficulty: string
	title: string
	options: string[]
	correctAnswer: number
	explanation: string
	correct_answer_id: number
}

type Props = {
	challenge: Challenge
	showExplanation?: boolean
}

export const MCQChallenge = ({ challenge, showExplanation = false }: Props) => {
	//States
	const [selectedOption, setSelectedOption] = useState<number | null>(null)
	const [shouldShowExplanation, setShouldShowExplanation] =
		useState(showExplanation)

	// Extract the options from the challenge.
	const options =
		typeof challenge.options === 'string'
			? JSON.parse(challenge.options) // If the options are a string, parse them as JSON.
			: challenge.options // Otherwise, use the options directly.

	// Function to handle the selection of an option.
	const handleOptionSelect = (index: number) => {
		if (selectedOption !== null) return
		setSelectedOption(index)
		setShouldShowExplanation(true)
	}

	// Function to determine the class name for each option based on the selected option and the correct answer.
	const getOptionClass = (index: number) => {
		if (selectedOption === null) return 'option'

		if (index === challenge.correct_answer_id) {
			return 'option correct'
		}

		if (selectedOption === index && index !== challenge.correct_answer_id) {
			return 'option incorrect'
		}
		return 'option'
	}

	return (
		<div className="challenge-display">
			<p>
				<strong>Difficulty</strong>: {challenge.difficulty}
			</p>
			<p className="challenge-title">{challenge.title}</p>
			<div className="options">
				{/* Render each option as a label with a hidden radio input */}
				{options.map((option: string, index: number) => (
					<label key={index} className={getOptionClass(index)}>
						<input
							type="radio"
							name="mcq-option" // Use a common name for all options in the same question
							value={index} // Or a unique ID for the option
							checked={selectedOption === index} // Assuming 'selectedOption' state from your component
							onChange={() => handleOptionSelect(index)}
							// You might visually hide this input and style the label to look like your current div
							style={{ display: 'none' }}
							className="option-input" // Add a class for styling if needed
						/>
						{option}
					</label>
				))}
			</div>
			{shouldShowExplanation && selectedOption !== null && (
				<div className="explanation">
					<h4>Explanation</h4>
					<p>{challenge.explanation}</p>
				</div>
			)}
		</div>
	)
}
