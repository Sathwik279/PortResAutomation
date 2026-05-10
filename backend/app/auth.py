import os
import firebase_admin
from firebase_admin import auth, credentials
from fastapi import Header, HTTPException, status

# Initialize Firebase Admin
# On Cloud Run, it uses default credentials if no service account key is provided.
try:
    firebase_admin.get_app()
except ValueError:
    # We explicitly set the project ID to the one where the users are logging in
    firebase_admin.initialize_app(options={
        'projectId': 'portresautomation-dashboard'
    })

async def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid token",
        )
    
    token = authorization.split("Bearer ")[1]
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
        )
