'use client';

import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { assetUrl } from '@/lib/assetUrl';

const TABS = [
  {
    id: 'generative',
    title: 'Generative Functions',
    description:
      'Write a typed Python function, get structured LLM output. Docstrings are prompts, type hints are schemas — no parsers, no chains.',
    learnMoreUrl: siteConfig.docsGenerativeFunctionsUrl,
    code: `<code><span class="code-kw">from</span> typing <span class="code-kw">import</span> Literal
<span class="code-kw">from</span> pydantic <span class="code-kw">import</span> BaseModel
<span class="code-kw">from</span> mellea <span class="code-kw">import</span> generative, start_session

<span class="code-kw">class</span> <span class="code-type">ReviewAnalysis</span>(BaseModel):
    sentiment: Literal[<span class="code-str">"positive"</span>, <span class="code-str">"negative"</span>, <span class="code-str">"neutral"</span>]
    score: <span class="code-type">int</span>    <span class="code-cmt"># 1-5</span>
    summary: <span class="code-type">str</span>  <span class="code-cmt"># one sentence</span>

<span class="code-fn">@generative</span>
<span class="code-kw">def</span> <span class="code-fn">analyze_review</span>(text: <span class="code-type">str</span>) -&gt; ReviewAnalysis:
    <span class="code-str">"""Extract sentiment, a 1-5 score, and a one-sentence summary."""</span>
    ...

m = start_session()
result = analyze_review(m, text=<span class="code-str">"Battery life is great but the screen is dim"</span>)

<span class="code-builtin">print</span>(result.sentiment)  <span class="code-cmt"># "positive", "negative", or "neutral" — always</span>
<span class="code-builtin">print</span>(result.score)      <span class="code-cmt"># an int, 1-5 — always</span>
<span class="code-builtin">print</span>(result.summary)    <span class="code-cmt"># a str — always</span></code>`,
  },
  {
    id: 'instruct',
    title: 'Instruct, Validate, Repair',
    description:
      'Add requirements to any LLM call. Mellea validates outputs and retries automatically — swap between rejection sampling, majority voting, and more with one parameter.',
    learnMoreUrl: siteConfig.docsRequirementsUrl,
    code: `<code><span class="code-kw">import</span> mellea
<span class="code-kw">from</span> mellea.stdlib.sampling <span class="code-kw">import</span> RejectionSamplingStrategy

<span class="code-kw">def</span> <span class="code-fn">write_email_with_strategy</span>(m: mellea.MelleaSession, name: <span class="code-type">str</span>, notes: <span class="code-type">str</span>) -&gt; <span class="code-type">str</span>:
    email_candidate = m.instruct(
        <span class="code-str">f"Write an email to {name} using the notes following: {notes}."</span>,
        requirements=[
            <span class="code-str">"The email should have a salutation."</span>,
            <span class="code-str">"Use a formal tone."</span>,
        ],
        strategy=RejectionSamplingStrategy(loop_budget=3),
        return_sampling_results=<span class="code-kw">True</span>,
    )

    <span class="code-kw">if</span> email_candidate.success:
        <span class="code-kw">return</span> <span class="code-type">str</span>(email_candidate.result)

    <span class="code-cmt"># If sampling fails, use the first generation</span>
    <span class="code-builtin">print</span>(<span class="code-str">"Expect sub-par result."</span>)
    <span class="code-kw">return</span> email_candidate.sample_generations[<span class="code-num">0</span>].value</code>`,
  },
  {
    id: 'safety',
    title: 'Safety and Guardrails',
    description:
      'Detect harmful outputs, social bias, and jailbreak attempts before they reach your users — using built-in Granite Guardian integration, with no external service required.',
    learnMoreUrl: siteConfig.docsSafetyUrl,
    code: `<code><span class="code-kw">import</span> mellea
<span class="code-kw">from</span> mellea.stdlib.requirements.safety.guardian <span class="code-kw">import</span> (
    GuardianCheck, GuardianRisk,
)

m = mellea.start_session()

response = m.instruct(
    <span class="code-str">"Write a helpful customer support response to: "</span>
    <span class="code-str">"How do I reset my password?"</span>,
    requirements=[
        <span class="code-str">"Be concise and professional."</span>,
        GuardianCheck(GuardianRisk.HARM),
        GuardianCheck(GuardianRisk.SOCIAL_BIAS),
    ],
)

<span class="code-builtin">print</span>(response)  <span class="code-cmt"># validated — or retried until it passes</span></code>`,
  },
] as const;

export default function FutureSoftwareSection() {
  return (
    <section id="future-software-section" className="future-software" aria-labelledby="future-software-heading">
      <div className="future-software__inner">
        <h2 id="future-software-heading" className="future-software__title">
          Here&rsquo;s the future of software
        </h2>

        <div className="future-panel" data-future-panel>
          <div className="future-panel__nav" role="tablist" aria-label="Code examples">
            {TABS.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                className={`future-panel__tab${index === 0 ? ' is-active' : ''}`}
                role="tab"
                id={`future-tab-${tab.id}`}
                aria-selected={index === 0}
                aria-controls={`future-code-${tab.id}`}
                data-panel={tab.id}
                tabIndex={index === 0 ? 0 : -1}
              >
                <span className="future-panel__tab-title">{tab.title}</span>
                <span className="future-panel__tab-body">
                  <span className="future-panel__tab-desc">{tab.description}</span>
                  <Link
                    href={tab.learnMoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="future-panel__learn-more"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Learn more
                    <span className="btn__icon-mask btn__icon-mask--arrow-up-right" aria-hidden="true" />
                  </Link>
                </span>
              </button>
            ))}
          </div>

          <div className="future-panel__stage">
            <div className="future-panel__code-header">
              <span className="future-panel__code-label">Python</span>
              <button
                type="button"
                className="future-panel__copy"
                data-future-copy="#future-code-generative"
                aria-label="Copy code to clipboard"
              >
                <span className="future-panel__copy-label" hidden>Copied!</span>
                <img className="future-panel__copy-icon" src={assetUrl('/assets/copy.svg')} alt="" width={20} height={20} />
              </button>
            </div>

            <div className="future-panel__code-viewport">
              {TABS.map((tab, index) => (
                <pre
                  key={tab.id}
                  id={`future-code-${tab.id}`}
                  className={`future-panel__code${index === 0 ? ' is-active' : ''}`}
                  role="tabpanel"
                  aria-labelledby={`future-tab-${tab.id}`}
                  tabIndex={0}
                  hidden={index !== 0}
                  dangerouslySetInnerHTML={{ __html: tab.code }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
