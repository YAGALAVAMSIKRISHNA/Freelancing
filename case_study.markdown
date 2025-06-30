# Case Study: Sarah the Freelancer

## Scenario
Sarah is a freelance web developer who joins SB Works to find new projects. This case study validates the workflow of the platform from registration to project completion.

### Step 1: Registration
- Sarah visits `/register` and signs up as a freelancer with her email, password, and skills (e.g., HTML, CSS, JavaScript).
- Admin approves her account via the Admin Dashboard.

### Step 2: Profile Setup
- Sarah logs in at `/login` and updates her profile at `/profile/:userId`, adding portfolio items (e.g., a website she built).

### Step 3: Finding and Bidding on a Project
- A client posts a project titled "E-commerce Website" under Web Development with a $2000 budget.
- Sarah browses projects on her Freelancer Dashboard, finds the project, and submits a bid of $1800 with a 3-week timeline at `/project/:id/bid`.
- She receives a notification that her bid is accepted.

### Step 4: Collaboration
- Sarah uses the chat system at `/chat/:projectId` to discuss requirements with the client.
- She submits deliverables (e.g., website code) via the Project Submission module.

### Step 5: Completion and Feedback
- The client reviews the submission, approves it, and leaves a 5-star rating with a positive comment on Sarah’s profile.
- Sarah receives payment and leaves a review for the client.

### Validation
- **Registration/Login**: Sarah’s account creation and approval work seamlessly.
- **Project Posting/Bidding**: Client posts project; Sarah’s bid is processed correctly.
- **Chat**: Real-time communication is functional.
- **Notifications**: Sarah receives timely updates on bid acceptance.
- **Submission/Feedback**: Deliverables are submitted, and reviews are reflected on profiles.

This workflow confirms SB Works supports end-to-end freelancing activities efficiently.