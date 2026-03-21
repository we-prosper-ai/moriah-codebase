---
name: modal-deployment
description: Instructs the agent on how to deploy Python scripts, scrapers, and cron jobs to Modal.com for serverless cloud execution. Use this when the user wants a task to run automatically even when their computer is off.
---

# ☁️ Modal Deployment Skill

The definitive workflow for taking local Python scripts and deploying them to Modal.com's serverless infrastructure. This ensures background tasks (like scrapers or scheduled automations) run independently of the user's local machine state.

## When to use this skill

- The user declares they want a script to run automatically in the background or on a schedule (e.g., "Run this scraper every morning at 6 AM").
- The user mentions "Deploy to Modal", "Serverless", or wants to offload computation.

## The Deployment Protocol

### Phase 1: Authentication & Setup

1. **Verify Installation**: Ensure the `modal` package is installed in the current environment (`pip install modal`).
2. **Authenticate**: Instruct the user to run `modal setup`. This will open a browser window for authentication if they haven't done it yet.
3. **Wait for Confirmation**: Do not proceed until the user confirms the authentication was successful.

### Phase 2: Refactoring for Modal

Local Python scripts must be adapted to use the Modal SDK.

1. **Import Modal**: Bring in the necessary dependencies.
   ```python
   import modal
   ```
2. **Define the App**: Scaffold the Modal App container.
   ```python
   app = modal.App("project-name-here")
   ```
3. **Define the Image**: Specify the environment container, including any required `pip` packages.
   ```python
   image = modal.Image.debian_slim().pip_install("requests", "beautifulsoup4")
   ```
4. **Decorate the Target Function**: Wrap the core execution function with `@app.function` and attach the image. If it needs a schedule, use the `schedule` parameter (e.g., cron syntax).
   ```python
   # Example: Run daily at 6 AM UTC
   @app.function(image=image, schedule=modal.Cron("0 6 * * *"))
   def my_core_function():
       print("Task is running in the cloud!")
   ```

### Phase 3: Deployment

Once the script has been refactored and tested locally (using `modal run script_name.py`), deploy it permanently to the cloud.

1. Tell the user to execute the deployment command:
   ```bash
   modal deploy script_name.py
   ```
2. **Verification**: Direct the user to their Modal Dashboard to verify the App is listed and the scheduled tasks are active.

## Crucial Reminders

- Modal runs in a completely isolated cloud container. It _cannot_ read files from the user's local hard drive or directly access local databases without specific tunneling/secrets setup. All data inputs/outputs must happen through external APIs, cloud storage, or Modal Volumes.
- All secure keys must be managed through Modal Secrets, not local `.env` files. Provide the user instructions on how to create a Secret in the Modal dashboard and attach it to the function:
  ```python
  @app.function(image=image, secrets=[modal.Secret.from_name("my-api-key")])
  ```
