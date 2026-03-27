'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import 'highlight.js/styles/github-dark.css';

hljs.registerLanguage('python', python);

const ITEMS = [
  {
    title: 'Generative Functions',
    description:
      'Write a typed Python function, get structured LLM output. Docstrings are prompts, type hints are schemas — no parsers, no chains.',
    learnMore: 'https://docs.mellea.ai/concepts/generative-functions',
    code: `from typing import Literal
from pydantic import BaseModel
from mellea import generative

class ReviewAnalysis(BaseModel):
    sentiment: Literal["positive", "negative", "neutral"]
    score: int    # 1-5
    summary: str  # one sentence

@generative
def analyze_review(text: str) -> ReviewAnalysis:
    """Extract sentiment, a 1-5 score, and a one-sentence summary."""
    ...

result = analyze_review(m, text="Battery life is great but the screen is dim")

print(result.sentiment)  # "positive", "negative", or "neutral" — always
print(result.score)      # an int, 1-5 — always
print(result.summary)    # a str — always`,
  },
  {
    title: 'Instruct, Validate, Repair',
    description:
      'Add requirements to any LLM call. Mellea validates outputs and retries automatically — swap between rejection sampling, majority voting, and more with one parameter.',
    learnMore: 'https://docs.mellea.ai/concepts/instruct-validate-repair',
    code: `import mellea
from mellea.stdlib.sampling import RejectionSamplingStrategy


def write_email_with_strategy(m: mellea.MelleaSession, name: str, notes: str) -> str:
    email_candidate = m.instruct(
        f"Write an email to {name} using the notes following: {notes}.",
        requirements=[
            "The email should have a salutation.",
            "Use a formal tone.",
        ],
        strategy=RejectionSamplingStrategy(loop_budget=3),
        return_sampling_results=True,
    )

    if email_candidate.success:
        return str(email_candidate.result)

    # If sampling fails, use the first generation
    print("Expect sub-par result.")
    return email_candidate.sample_generations[0].value`,
  },
  {
    title: 'MObjects',
    description:
      'Add LLM query capabilities to any existing Python class with a single decorator. No rewrites, no wrappers.',
    learnMore: 'https://docs.mellea.ai/concepts/mobjects-and-mify',
    code: `from mellea.stdlib.components.mify import mify

@mify
class Customer:
    def __init__(self, name: str, last_purchase: str) -> None:
        self.name = name
        self.last_purchase = last_purchase

customer = Customer("Alice", "noise-cancelling headphones")
answer = m.query(customer, "What would Alice enjoy as a follow-up gift?")
print(str(answer))`,
  },
];

export default function CodeShowcase() {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      delete (codeRef.current as HTMLElement & { dataset: DOMStringMap }).dataset.highlighted;
      hljs.highlightElement(codeRef.current);
    }
  }, [active]);

  function copy() {
    navigator.clipboard.writeText(ITEMS[active].code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <div className="showcase">
      {/* Left: accordion */}
      <div className="showcase-accordion">
        {ITEMS.map((item, i) => (
          <div
            key={i}
            className={`showcase-item${active === i ? ' showcase-item--active' : ''}`}
            onClick={() => setActive(i)}
          >
            <div className="showcase-item-header">
              <span className="showcase-item-indicator" />
              <h3 className="showcase-item-title">{item.title}</h3>
            </div>
            {active === i && (
              <div className="showcase-item-body">
                <p className="showcase-item-desc">{item.description}</p>
                <Link
                  href={item.learnMore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="showcase-item-link"
                >
                  Learn more →
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Right: code block */}
      <div className="showcase-code-wrap">
        <div className="showcase-code-header">
          <span className="showcase-code-lang">python</span>
          <button className="showcase-code-copy" onClick={copy} aria-label="Copy code">
            {copied ? (
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="1" width="9" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M11 12v2a1.5 1.5 0 0 1-1.5 1.5H2.5A1.5 1.5 0 0 1 1 14V5.5A1.5 1.5 0 0 1 2.5 4H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
        <pre className="showcase-pre"><code ref={codeRef} className="language-python">{ITEMS[active].code}</code></pre>
      </div>
    </div>
  );
}
