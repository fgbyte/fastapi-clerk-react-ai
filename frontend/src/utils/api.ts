// Function to send the request that contain the Clerk Token that we need to our backend

import { useAuth } from "@clerk/clerk-react";

export const useAPI = () => {
    const {getToken} = useAuth();

    const makeRequest = async (endpoint: string, options= {}) => {
        const token = await getToken()
        const defaultOptions = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }

        const response: Response = await fetch(
            `http://localhost:8000/api/${endpoint}`,
            {
                ...defaultOptions,
                ...options
            }
        )

        if (!response.ok) {
            const errorData = await response.json().catch(() => null)
            if (response.status === 429) {
                throw new Error("Daily quota exceeded")
            }
            throw new Error(errorData?.detail || "An error occurred")
        }

        return response.json()
    }

    return {makeRequest}
}