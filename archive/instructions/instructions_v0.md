# instructions_v0.md

## Role

You are an autonomous **CLI coding agent** working within the **LaunchKit AI** project. Your goal in this version is to set up the initial product documentation that will steer development. You will operate directly inside the repository, creating files and committing changes.

## Task

1. **Create documentation directory**
   - At the root of the repository, ensure there is a directory named `docs`. If it does not exist, create it.

2. **Product framing** (`docs/01-product-brief.md`)
   - Inside `docs`, create a file named `01-product-brief.md`.
   - Include the following sections:
     - **Problem:** Concisely describe the pain points that LaunchKit AI addresses (solo creators have content but no repeatable system to package and sell it).
     - **Who:** Identify the target users (solo creators, indie SaaS founders, consultants/coaches, micro‑agencies with existing audiences or content back‑catalogs).
     - **Why now:** Explain why this product is timely (rise of the creator economy, AI/LLM advances that make auto‑packaging possible, and increasing demand for micro‑courses).
     - **Prior art:** Summarise existing solutions such as Gumroad, Teachable, ConvertKit Commerce, and note their shortcomings (great hosting but weak auto‑productisation or heavier setup).
     - **Differentiation (Wedge):** Describe the product’s unique advantage—automatic “content → course → funnel” generation with minimal setup and strong defaults.
     - **Success metrics (KPI):** Define the single most important metric: **Activation‑to‑First‑Revenue rate (A2R)** – percentage of new users who make at least one sale within 14 days.
     - **Risks & mitigations:** List potential risks (e.g. AI quality issues, third‑party API failures, platform dependency) and briefly mention mitigation strategies (quality checks, retries/webhooks, extensible architecture).
   - Ensure the document can be read and understood in under a minute; a reviewer should be able to explain the product in 30 seconds and state the KPI.

3. **User stories & scope** (`docs/02-user-stories.md`)
   - Inside `docs`, create a file named `02-user-stories.md`.
   - Outline a series of **must‑ship user stories** that describe the minimum viable product (MVP). Each story should be written from the perspective of a user and include acceptance criteria. Examples:
     1. _As a solo creator, I can paste a Notion URL or text and see a course outline generated so that I can decide whether to proceed._
     2. _As a creator, I can review and edit the auto‑generated lessons and emails before publishing, so that the course reflects my voice._
     3. _As a creator, I can publish a landing page with a Stripe checkout and receive payments so that I can start earning._
     4. _As a buyer, I can purchase the course and immediately access the content._
   - Clearly state any **non‑goals** or features deferred to later versions (e.g. advanced analytics, custom domains, referral programs).
   - Define the **“day‑1 scope”**—the absolute minimum feature set required to deliver value quickly. Keep this list short.

4. **Commit your work**
   - Save both documents and stage them with Git.
   - Commit with a descriptive message such as `docs: add product brief and user stories (v0)`.

5. **Postmortem** (`instructions_postmortem_v0.md`)
   - After committing, create a file at the repository root named `instructions_postmortem_v0.md`.
   - Summarise what you accomplished in this version. Include:
     - A brief overview of the files created and their purpose.
     - How these documents should guide future development.
     - Any open questions or assumptions that need clarification in later phases.

## Format

- Write all documentation in clear and concise **Markdown**.
- Use headings (`#`, `##`, `###`) to organise sections logically.
- Use numbered or bulleted lists for lists of stories or risks.
- Keep paragraphs short (2–4 sentences) to aid readability.
- Do not leave placeholder text; fill every section with meaningful content.
