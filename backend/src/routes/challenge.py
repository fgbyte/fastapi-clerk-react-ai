from clerk_backend_api import User
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..database.db import (
    get_challenge_quota,
    create_challenge,
    create_challenge_quota,
    reset_quota_if_needed,
    get_user_challenges
)
from ..utils import authenticate_and_get_user_details
from ..database.models import get_db
import json
from datetime import datetime

router = APIRouter()

# Schemas


class ChallengeRequest(BaseModel):
    difficulty: str

    class Config:
        json_schema_extra = {'example': {'difficulty': 'easy'}}


# Routes
@router.post('/generate-challenge')
async def generate_challenge(request: ChallengeRequest, db: Session = Depends(get_db)):
    try:
        user_details = authenticate_and_get_user_details(request)
        user_id = user_details.get('user_id')

        quota = get_challenge_quota(db, user_id)  # type: ignore
        if not quota:
            create_challenge_quota(db, user_id)  # type: ignore

        quota = reset_quota_if_needed(db, quota)

        if quota.remaining_quota <= 0:
            raise HTTPException(
                status_code=4293, detail="Quota exhausted.")

        challenge_data = None

        # Todo: Generate Challenge -> AI

        quota.remaining_quota -= 1
        db.commit()

        return challenge_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get('/my-history')
async def my_history(request: Request, db: Session = Depends(get_db)):
    user_details = authenticate_and_get_user_details(request)
    user_id = user_details.get('user_id')

    challenges = get_user_challenges(db, user_id)  # type: ignore
    return {'challenges': challenges}


@router.get('/quota')
async def get_quota(request: Request, db: Session = Depends(get_db)):
    user_details = authenticate_and_get_user_details(request)
    user_id = user_details.get('user_id')

    quota = get_challenge_quota(db, user_id)  # type: ignore
    if not quota:
        return {
            'user_id': user_id,
            'quota_remaining': 0,
            'last_reset_date': datetime.now()
        }
    quota = reset_quota_if_needed(db, quota)
