# need generate a challenge based in the format required

import os
import json
from typing import Any, Dict
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
# Import the Google Gemini Chat Model
from langchain_google_genai import ChatGoogleGenerativeAI


load_dotenv()

llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash-lite")

mock = {
    "title": "What is the output of the following Python code?\n\n```python\nprint(5 + 3 * 2)\n```",
    "options": [
        "16",
        "11",
        "13",
        "20"
    ],
    "correct_answer_id": 1,
    "explanation": "Python follows the order of operations (PEMDAS/BODMAS). Multiplication (3 * 2) is performed before addition (5 + 6), resulting in 11."
}

# AI stuffs
system_prompt = """You are an expert coding challenge creator.
    Your task is to generate a coding question with multiple choice answers.
    The question should be appropriate for the specified difficulty level.

    For easy questions: Focus on basic syntax, simple operations, or common programming concepts.
    For medium questions: Cover intermediate concepts like data structures, algorithms, or language features.
    For hard questions: Include advanced topics, design patterns, optimization techniques, or complex algorithms.

    Return the challenge in the following JSON structure:
    {
        "title": "The question title",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correct_answer_id": 0, // Index of the correct answer (0-3)
        "explanation": "Detailed explanation of why the correct answer is right"
    }

    Make sure the options are plausible but with only one clearly correct answer.
    """

prompt_template = ChatPromptTemplate([
    ("system", "{system_prompt}"),
    ("user", "Generate a {difficulty} difficulty coding challenge.")
])

# Create a chain
chain = prompt_template | llm  # `|` pipeline langchain operator


# Generate challenge function
def generate_challenge_with_ai(difficulty: str) -> Dict[str, Any]:
    try:
        # response = chain.invoke(
        #     {"system_prompt": system_prompt, "difficulty": {difficulty}})

        # content = response.content

        # challenge_data = json.loads(content)  # type: ignore

        # required_fields = ["title", "options",
        #                    "correct_answer_id", "explanation"]
        # for field in required_fields:
        #     if field not in challenge_data:
        #         raise ValueError(f"Missing required field: {field}")

        return mock
        # TODO: use langchain gemini correctly (temperature, response format: "type": "json_object" etc) to:
        #   return challenge_data

    except Exception as e:
        print(e)
        return {
            "title": "Basic Python List Operation",
            "options": [
                "my_list.append(5)",
                "my_list.add(5)",
                "my_list.push(5)",
                "my_list.insert(5)",
            ],
            "correct_answer_id": 0,
            "explanation": "In Python, append() is the correct method to add an element to the end of a list."
        }


generate_challenge_with_ai("easy")
