# LaunchKit AI - User Stories & Scope

## Must-Ship User Stories (MVP)

### 1. Content Input & Course Generation

**As a solo creator, I can paste a Notion URL or raw text and see a course outline generated so that I can decide whether to proceed.**

**Acceptance criteria:**

- Support Notion URL input with automatic content extraction
- Support direct text/markdown paste (up to 50k characters)
- Generate course outline with 3-8 lessons in under 30 seconds
- Show estimated course length and difficulty level
- Provide option to regenerate outline with different focus

### 2. Course Content Review & Editing

**As a creator, I can review and edit the auto-generated lessons and emails before publishing, so that the course reflects my voice.**

**Acceptance criteria:**

- Display generated lessons in editable interface
- Show email sequence draft (welcome, lesson delivery, completion)
- Allow rich text editing with markdown support
- Preview functionality for each lesson
- Save drafts automatically every 30 seconds

### 3. One-Click Publishing & Payment Setup

**As a creator, I can publish a landing page with Stripe checkout and receive payments so that I can start earning.**

**Acceptance criteria:**

- Generate professional landing page with course description
- Integrate Stripe payment processing (one-time purchase)
- Set custom pricing ($10-$500 range)
- Provide unique course URL (e.g., launchkit.ai/courses/your-course-slug)
- Email confirmation system for purchases

### 4. Student Course Access

**As a buyer, I can purchase the course and immediately access the content.**

**Acceptance criteria:**

- Secure course access after payment confirmation
- Progressive lesson unlocking (one per day or all at once - creator's choice)
- Mobile-responsive course interface
- Email delivery of lessons (if creator enables)
- Course completion tracking and certificate

### 5. Creator Dashboard

**As a creator, I can track my course performance and student progress so that I can optimize my content.**

**Acceptance criteria:**

- Dashboard showing total sales, revenue, and student count
- Individual student progress tracking
- Basic analytics (conversion rate, completion rate)
- Export student email list for marketing
- Course management (edit, pause, delete)

## Non-Goals (V1)

Features explicitly deferred to later versions:

- **Advanced analytics** - Detailed funnel analysis, A/B testing, cohort analysis
- **Custom domains** - Creators use LaunchKit subdomains initially
- **Referral programs** - Affiliate/partner functionality
- **Multi-creator courses** - Collaboration features
- **Advanced integrations** - Zapier, complex CRM connections
- **Video hosting** - Focus on text-based courses initially
- **Subscription courses** - One-time purchase model only
- **White-label options** - LaunchKit branding remains visible

## Day-1 Scope (Absolute Minimum)

The smallest viable feature set that delivers immediate value:

1. **Content input** - Paste text, get course outline
2. **Basic editing** - Modify generated lessons
3. **Simple publishing** - Create landing page + Stripe checkout
4. **Student access** - Purchase and view course content
5. **Payment processing** - Receive money via Stripe

**Success criteria for Day-1:** A creator can go from raw content to earning their first dollar in under 2 hours.

## User Journey (Happy Path)

1. **Discovery** → Creator learns about LaunchKit via content marketing
2. **Signup** → Quick registration with email (no credit card required)
3. **Content input** → Paste Notion doc or text content
4. **Review** → Edit generated course outline and lessons (15-30 minutes)
5. **Publish** → Set price, connect Stripe, publish landing page
6. **Promote** → Share course URL with existing audience
7. **First sale** → Student purchases, accesses content immediately
8. **Optimization** → Creator reviews analytics, iterates on content

**Target time from signup to first sale opportunity: 2 hours**
**Target time from first promotion to first sale: 24-48 hours**

## Technical Constraints

- **AI processing time** - Course generation must complete within 60 seconds
- **Content limits** - Support up to 50k characters of input content
- **Course size** - Maximum 20 lessons per course for MVP
- **File uploads** - Text-only for Day-1 (no images/videos initially)
- **Payment processing** - USD only for initial launch

## Definition of Done

A user story is complete when:

- All acceptance criteria are met
- Code passes all tests and linting
- Feature works end-to-end in staging environment
- User can complete the workflow without documentation
- Performance meets stated constraints (load times, processing speed)
