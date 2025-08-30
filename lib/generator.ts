
        export type Lesson = { title: string; content: string }
        export type Email = { subject: string; body: string }
        export type Landing = {
          hero: { headline: string; sub: string }
          features: string[]
          faq: { q: string; a: string }[]
        }
        export type Draft = { lessons: Lesson[]; emails: Email[]; landing: Landing }

        // Simple placeholder generator; swap this function for your LLM call
        export function draftFromText(title: string, body: string): Draft {
          const paras = body.split(/\n{2,}/).filter(Boolean)
          const picks = Array.from({ length: 5 }).map((_, i) => paras[i] ?? paras[0] ?? body)
          return {
            lessons: picks.map((p, i) => ({ title: `${title}: Day ${i + 1}`, content: p.slice(0, 1500) })),
            emails: picks.map((_, i) => ({ subject: `[${title}] Day ${i + 1}`, body: `Lesson ${i + 1} introduction.` })),
            landing: {
              hero: { headline: title, sub: 'Turn content into a paid micro-course in minutes.' },
              features: ['5-day outline', 'Email sequence', 'Publish & sell', 'Promo pack'],
              faq: [{ q: 'How do I publish?', a: 'Connect Stripe and click publish.' }],
            },
          }
        }
