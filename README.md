# AutoCard - electronics

## AI-powered flashcards with gamification for smarter learning.
Upload PDFs or PowerPoints, auto-generate flashcards with AI, and share them in a global library.

## Tech stack
- **Frontend**: React, Bootstrap
- **Storage**: Firebase firestore
- **Authentication** Firebase authentication
- **AI**: Firebase AI Logic

## Setup

When setting up the project, ensure you have Node.js and npm installed. Then, follow these steps:
1. Clone the repository:
   ```bash
   git clone
   
2. Set up the environment variables. Create a `.env` file in the root directory and add the necessary Firebase configuration details.
The file should be formatted like the provided `.env.example` file.

How to obtain values for the environment variables:
1. Go to the [Firebase Console](https://console.firebase.google.com/) and login with our credentials.
2. Select the AutoCard project.
2. Click the gear icon next to "Project Overview" and select "Project settings".
3. Scroll down to the "Your apps" section and select AutoCard app.
4. In the "Firebase SDK snippet" section, select "npm" to see your configuration details.
5. Copy the configuration details and paste them into your `.env` file, replacing the placeholder values.

## Branching strategy

**Feature branches:** ***feature/<JIRA-TAG>***

When starting a ticket from JIRA, create a feature branch with the JIRA tag.\
**Example:** ***feature/MNI-123***


**Bugfix** branches: bugfix/<JIRA-TAG>

When fixing a bug from JIRA, create a bugfix branch with the JIRA tag.\
**Example:** ***bug/MNI-456***

**Merging to master:**
- Create a pull request (PR) from your feature or bugfix branch to the master branch.
- Ensure that at least one team member reviews and approves the PR.
- After approval, merge the PR into the master branch.