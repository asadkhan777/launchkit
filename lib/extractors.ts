
import { JSDOM } from 'jsdom'
import { Readability } from '@mozilla/readability'

export async function extractFromUrl(url: string) {
  const res = await fetch(url, { headers: { 'user-agent': 'LaunchKitAI/1.0' } })
  const html = await res.text()
  const dom = new JSDOM(html, { url })
  const reader = new Readability(dom.window.document)
  const article = reader.parse()
  return {
    title: article?.title || url,
    text: article?.textContent?.trim() || '',
  }
}
