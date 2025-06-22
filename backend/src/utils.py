# https://clerk.com/docs/backend-requests/overview
# function to allow auth using Clerk

# frontend
#     clerk authenticate
#     issue jwt token
#     send to the backend

# backend
#     connect to clerk
#     ask clerk if the token is valid
#     if valid, allow access to the route
#     if not, deny access


from fastapi import HTTPException
from clerk_backend_api import Clerk, AuthenticateRequestOptions
import os
from dotenv import load_dotenv

load_dotenv()

# secret key for secure communication with Clerk's backend API
clerk_sdk = Clerk(bearer_auth=os.getenv("CLERK_SECRET_KEY"))

# authenticate_and_get_user_details is a Helper Function to validate if the request to the backend is valid


def authenticate_and_get_user_details(request):
    try:
        request_state = clerk_sdk.authenticate_request(
            request,
            AuthenticateRequestOptions(
                # urls authorized to access the backend
                authorized_parties=['http://localhost:5173'],
                # public key of the token that need have the request
                jwt_key=os.getenv('JWT_KEY')
            )
        )

        # Check if the user is signed in
        if not request_state.is_signed_in:
            raise HTTPException(status_code=401, detail="Invalid token")

        # Defensive check: Ensure payload is not None before accessing it.
        if request_state.payload is None:
            raise HTTPException(
                status_code=500, detail="Internal authentication error: User payload not found.")

        # Get the user id from the 'subject' field in the payload of the token
        user_id = request_state.payload.get('sub')

        return {"user_id": user_id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
