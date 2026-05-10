import subprocess
import os
import tempfile
import json

async def deploy_to_firebase(project_id, site_id, token, html_content):
    """
    Deploys a single index.html file to Firebase Hosting using the Firebase CLI.
    """
    if not site_id:
        site_id = project_id

    # Use a temporary directory for the deployment
    with tempfile.TemporaryDirectory() as tmpdir:
        # 1. Create a public folder and index.html
        public_dir = os.path.join(tmpdir, "public")
        os.makedirs(public_dir)
        with open(os.path.join(public_dir, "index.html"), "w") as f:
            f.write(html_content)
            
        # 2. Create a firebase.json
        firebase_json = {
            "hosting": {
                "public": "public",
                "ignore": ["firebase.json", "**/.*", "**/node_modules/**"]
            }
        }
        with open(os.path.join(tmpdir, "firebase.json"), "w") as f:
            json.dump(firebase_json, f)
            
        # 3. Run the deployment command
        # firebase deploy --only hosting:<site> --project <project> --token <token>
        cmd = [
            "firebase", "deploy",
            "--only", f"hosting:{site_id}",
            "--project", project_id,
            "--token", token,
            "--non-interactive"
        ]
        
        process = subprocess.run(
            cmd,
            cwd=tmpdir,
            capture_output=True,
            text=True
        )
        
        if process.returncode != 0:
            raise Exception(f"Firebase deployment failed: {process.stderr}")
            
        return {"output": process.stdout}
