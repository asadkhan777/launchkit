
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const ImportSchema = z.object({ url: z.string().url() })
const GenerateSchema = z.object({ title: z.string().min(3), body: z.string().min(40) })

export default function MarketingPage() {
  const [importResult, setImportResult] = useState<{ title: string; text: string } | null>(null)
  const [draft, setDraft] = useState<any | null>(null)

  const {
    register: registerImport,
    handleSubmit: handleSubmitImport,
    formState: { errors: errorsImport },
  } = useForm<z.infer<typeof ImportSchema>>({ resolver: zodResolver(ImportSchema) })

  const {
    register: registerGenerate,
    handleSubmit: handleSubmitGenerate,
    formState: { errors: errorsGenerate },
  } = useForm<z.infer<typeof GenerateSchema>>({ resolver: zodResolver(GenerateSchema) })

  async function onImport(data: z.infer<typeof ImportSchema>) {
    setDraft(null)
    const r = await fetch(`/api/import?url=${encodeURIComponent(data.url)}`)
    const json = await r.json()
    setImportResult(json)
  }

  async function onGenerate(data: z.infer<typeof GenerateSchema>) {
    const r = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await r.json()
    setDraft(json)
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold">LaunchKit AI</h1>
        <p className="mt-2 text-lg text-neutral-700">
          Turn your long-form content into a sellable micro-course in minutes.
        </p>
      </header>

      {/* Import form */}
      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold">Import Content</h2>
        <form onSubmit={handleSubmitImport(onImport)} className="flex flex-col gap-4">
          <input
            className="rounded-lg border p-3"
            placeholder="Paste URL (Notion, blog, etc.)"
            {...registerImport('url')}
          />
          {errorsImport.url && <p className="text-red-500">Invalid URL</p>}
          <button
            type="submit"
            className="rounded-lg bg-black px-4 py-2 text-white hover:bg-neutral-800"
          >
            Import
          </button>
        </form>
        {importResult && (
          <div className="mt-4 rounded-lg bg-neutral-100 p-4">
            <h3 className="font-semibold">{importResult.title}</h3>
            <p className="mt-2 text-sm text-neutral-700 line-clamp-5">{importResult.text}</p>
          </div>
        )}
      </section>

      {/* Generate form */}
      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold">Generate Draft</h2>
        <form onSubmit={handleSubmitGenerate(onGenerate)} className="flex flex-col gap-4">
          <input
            className="rounded-lg border p-3"
            placeholder="Course Title"
            {...registerGenerate('title')}
          />
          {errorsGenerate.title && <p className="text-red-500">Course title required</p>}
          <textarea
            className="rounded-lg border p-3"
            rows={6}
            placeholder="Paste or edit content..."
            {...registerGenerate('body')}
          />
          {errorsGenerate.body && <p className="text-red-500">Content too short</p>}
          <button
            type="submit"
            className="rounded-lg bg-black px-4 py-2 text-white hover:bg-neutral-800"
          >
            Generate
          </button>
        </form>
        {draft && (
          <div className="mt-6 space-y-6">
            <h3 className="text-xl font-semibold">Draft Outline</h3>
            <ul className="list-disc space-y-2 pl-6">
              {draft.lessons.map((lesson: any, i: number) => (
                <li key={i} className="font-medium">{lesson.title}</li>
              ))}
            </ul>
            <p className="italic text-neutral-600">Landing tagline: {draft.landing.hero.sub}</p>
          </div>
        )}
      </section>

      {/* Publish CTA stub (explanation) */}
      {draft && (
        <section className="border-t pt-6">
          <h2 className="mb-4 text-2xl font-semibold">Next: Publish & Sell</h2>
          <p className="mb-2 text-neutral-700">
            This starter shows how to import and generate a draft. To publish,
            wire a slug and store the course in the database (e.g., using
            a server action or API route). Then create a Stripe price and
            call the checkout endpoint. A template for that flow is in
            the README.
          </p>
          <button
            disabled
            className="cursor-not-allowed rounded-lg bg-neutral-300 px-4 py-2 text-neutral-600"
          >
            Publish (coming soon)
          </button>
        </section>
      )}
    </main>
  )
}
