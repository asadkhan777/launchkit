# Interview Automation Setup

## Purpose
Streamline user feedback collection during development to ensure rapid iteration and alignment with user needs.

## Tools
1. **In-App Feedback**: Collect real-time user insights directly within the product.
2. **Calendly**: Allow users to schedule feedback sessions at their convenience.
3. **Local hosted N8N**: Automate workflows (e.g., send reminders, track responses).
4. **Otter.ai**: Automatically transcribe feedback sessions for analysis.
5. **Notion or Airtable**: Track and analyze feedback.

## Setup Guide

### Step 1: Enable In-App Feedback
- **Tool**: Intercom, Drift, or custom feedback widget
- **Workflow**:
  1. Prompt users to share feedback after using new features.
  2. Categorize feedback into themes (e.g., bugs, feature requests, usability).

### Step 2: Set Up Calendly or free/freemium alternative
- **Event Name**: "LaunchKit Feedback Session"
- **Duration**: 15-30 minutes
- **Availability**: Sync with your calendar to show open slots.
- **Confirmation Email**: Include Google Meet/Zoom link and session details.

### Step 3: Automate with Local hosted N8N
- **Trigger**: New feedback submission or Calendly booking
- **Actions**:
  1. Send confirmation email with session details.
  2. Add feedback to Notion or Airtable for tracking.
  3. Schedule follow-up reminders.

### Step 4: Analyze Feedback
- **Tool**: Otter.ai or Descript
- **Workflow**:
  1. Transcribe feedback sessions automatically.
  2. Highlight key insights and patterns.

## Next Steps
1. Enable in-app feedback collection.
2. Set up Calendly for scheduled feedback sessions.
3. Test the automation workflow to ensure smooth operation.
4. Regularly review and act on user feedback to refine the product.