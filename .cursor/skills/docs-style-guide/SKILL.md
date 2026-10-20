---
name: docs-style-guide
description: >-
  Use this skill when drafting, editing, or reviewing any Comfy documentation page (English MDX).
  Single source of truth for voice and tone. Covers writing style, step-by-step instructions, formatting conventions, terminology, and
  Mintlify components (callouts, cards, tabs, steps, code groups, accordions, images).
  Use when writing a new docs page, editing an existing page, reviewing a docs PR, or checking
  MDX syntax and component usage.
---

# Comfy Docs Style Guide

The Comfy Documentation is built on [Mintlify](https://www.mintlify.com/docs) and uses its MDX syntax. This style guide helps you write clear, concise, and consistent documentation for Comfy products. It covers voice and tone, writing style, formatting, Mintlify components, and best practices for any docs contributor.

This guide is the single source of truth for style and tone. Existing pages vary widely and many don't follow it. Don't copy the style of an existing page. When a page and this guide disagree, this guide wins.

## How to use this skill

### Related standards

Apply these alongside this guide. They are not repeated here.

| Standard | Covers |
| --- | --- |
| [docs-frontmatter.mdc](../../rules/docs-frontmatter.mdc) | Page `title` and `description` requirements |
| [Tutorial Workflow Standard](../tutorial-workflow-standard/SPEC.md) | Structure of tutorial workflow pages |

These standards cover structure and frontmatter. This guide covers voice, tone, and formatting. If they conflict on structure or frontmatter, the standard wins. If they conflict on voice or tone, this guide wins.

English is the source of truth. Edits to English pages are later translated to ja/zh/ko by a separate pipeline (skill `docs-i18n-translate`).

**Caution:** Don't edit translated pages as part of a style pass.

### When drafting a new page

1. Confirm the page type. If it is a tutorial workflow page, follow the [Tutorial Workflow Standard](../tutorial-workflow-standard/SPEC.md) for structure.
2. Write `title` and `description` frontmatter that follows [docs-frontmatter.mdc](../../rules/docs-frontmatter.mdc).
3. Write the content using the [Voice and tone](#voice-and-tone) and [Writing style](#writing-style) rules. Use existing pages for technical facts only, not for style.
4. Reuse existing snippets instead of retyping shared content. See [Snippets](#snippets).
5. Add the page to the navigation in `docs.json`.
6. Run the [Review checklist](#review-checklist) against your output before you finish.

### When editing an existing page

Every edit brings the whole page in line with this guide, not only the section you were asked to change.

1. Make the requested change first.
2. Rewrite the rest of the page to match this guide: voice, tone, terminology, formatting, and component usage.
3. Preserve technical meaning. Don't change code, parameter names, values, model file names, link targets, or the order of steps unless they are wrong.
4. Don't rewrite frontmatter that already follows [docs-frontmatter.mdc](../../rules/docs-frontmatter.mdc).
5. If a fix needs information you don't have, such as a missing alt text description or an unclear step, leave the original text and list it as an open question in your summary.
6. Run the [Review checklist](#review-checklist) against the full page before you finish.
7. Summarize what you changed, grouped by checklist section, so the reviewer can check the style changes separately from the requested change.

### When reviewing a page

1. Read the whole page before commenting.
2. Check it against the [Review checklist](#review-checklist).
3. Draft a summary document in a markdown file that lists each violation, the line number, and a suggested fix. Report each violation in this format:

```text
[severity] line <N>: <rule broken>
  Found: <quoted text>
  Fix:   <suggested replacement>
```

Severity levels:

- **high**: Broken MDX, wrong or misleading instructions, missing alt text, broken links.
- **medium**: Formatting convention violations, wrong component choice, passive voice in instructions.
- **low**: Wording, minor consistency issues.

End the review with a count of findings per severity. If the page has no findings, say so. The review document is the deliverable, not comments on the PR.

## Voice and tone

Comfy docs sound like a knowledgeable colleague explaining a tool: direct, technical, and helpful. They are reference material, not a marketing blog.

| Do | Don't |
| --- | --- |
| Address the reader as "you" | Use "the user" to mean the reader |
| Use "we" only for statements from the Comfy team, such as support or roadmap notes | Use "we" or "let's" to walk through steps ("Let's add a node") |
| State facts plainly | Use superlatives or hype ("powerful", "amazing", "seamless", "cutting-edge") |
| Give the instruction directly | Soften it with "simply", "just", "easily", "please", or "feel free to" |
| Use common contractions ("don't", "it's", "you're") | Use exclamation points |
| Explain what something does and why it matters | Describe how the reader will feel about it |

### Punctuation and sentence shape

- **Don't use em dashes (—).** They read as generic AI copy. Use periods, commas, colons, parentheses, or a second sentence instead.
- Prefer short, direct sentences over stacked clauses.
- Use a colon, not a dash, after a bolded label in a list.

**Instead of:** `Comfy Cloud MCP is in public beta — APIs may change.`
**Use:** `Comfy Cloud MCP is in public beta. APIs may change.`

**Instead of:** `**Discord** — #channel for questions.`
**Use:** `**Discord**: #channel for questions.`

**Instead of:** `Let's simply drag in the amazing new Flux node!`
**Use:** `Drag the Flux node into the workspace.`

## Writing style

These principles keep our documentation clear, concise, and accessible to a wide audience.

 - **Write short, simple sentences**: If a sentence is too long or complex, rewrite it or break it into multiple sentences.
 - **Replace complex sentences and paragraphs with lists and tables**.
 - **Use sentence-style capitalization**: Capitalize proper nouns only, including trademarks and the names of products. This applies to headings, card titles, and tab titles too.
 - **Avoid modifiers when possible**: Long chains of modifying words are confusing even to native English speakers.
 - **Match UI terminology**: Use the same terminology as the ComfyUI interface. For example, use "node" instead of "block" or "module". Use "workflow" instead of "pipeline" or "process". See [Terminology](#terminology).
 - **Don't use profanity or violent language**.
 - **Don't reference inappropriate topics**: This includes drinking, drugs, gambling, and explicit content.
 - **Avoid stereotypes**: Stereotypes can be hurtful and should be avoided.
 - **Avoid time-relative words**: Words like "currently", "new", "recently", "soon", and "now" go out of date. Describe what the product does, not when it changed. Don't reference current events.

### Present tense and active voice

Write all Comfy documentation in present tense. Documentation is a reference, and the information should apply at the time of reading. Avoid past tense when describing features, functionality, or instructions.

Write in active voice. It is more direct and easier to follow.

- **Example:** "Click **Queue** to run the workflow."

### Inclusivity

Everyone who reads the docs should feel *welcome*, *respected*, and *represented*. Write so that readers can see they were considered when the content was created.

Avoid idioms, colloquial expressions, and culture-specific references. They confuse non-native English speakers and are hard to localize.

## Terminology

Use the exact spelling and capitalization below. For translated terms, the i18n glossary at `.github/scripts/i18n/glossary` is the reference.

| Use | Don't use |
| --- | --- |
| ComfyUI | Comfy UI, comfyUI, Comfyui |
| Comfy Cloud | comfy cloud, ComfyCloud |
| Comfy Desktop | ComfyUI desktop app, Desktop app |
| ComfyUI Manager | the manager, Comfy Manager |
| node | block, module |
| custom node | plugin, extension (unless the product calls it that) |
| workflow | pipeline, graph (except when describing the graph itself) |
| Partner Nodes | partner nodes, API nodes |

Use the official spelling of model names, for example "Flux.1 Dev" or "Wan2.2". Copy the spelling from the model's official page.

## Formatting conventions

| Element | Format | Example |
| --- | --- | --- |
| UI labels (buttons, menus, tabs, settings) | Bold | Click **Queue**. |
| Node names | Inline code | Add a `Load Checkpoint` node. |
| Node inputs, outputs, and widget values | Inline code | Set `steps` to `20`. |
| File names, paths, commands, model files | Inline code | Place the file in `ComfyUI/models/checkpoints`. |
| Keyboard shortcuts | Inline code, no spaces around `+` | Press `Ctrl+Enter` (`Cmd+Enter` on macOS). |
| Emphasis | Use sparingly, italic only | This step is *required*. |

### UI action verbs

| Action | Verb |
| --- | --- |
| Primary mouse button | Click |
| Secondary mouse button | Right-click |
| Choose from a menu, list, or drop-down | Select |
| Move an element | Drag |
| Enter text | Enter or type |
| Keyboard key | Press |

Don't write "left-click". "Click" means the primary button.

### Headings

- The frontmatter `title` renders as the page H1. Start body headings at `##`.
- Don't skip levels. A `####` must sit under a `###`.
- Headings use sentence case.

### Links

- Link to other docs pages with root-relative paths and no file extension: `[queue requests](/development/comfy-router/queue)`.
- Use link text that describes the destination. Don't use "click here" or "this page".
- Link to external sites with full `https://` URLs.

## Writing step-by-step instructions

Begin each step with a brief phrase that tells readers where to start, if that isn't already clear. Otherwise, start each step with an imperative verb. Use a complete sentence with a capital letter at the beginning and a period at the end.

### Multiple-step procedures

Most instructional content requires multiple steps. When writing multiple-step procedures:

- Use a numbered list for short procedures. Use the [Steps component](#steps) for longer procedures, or when each step needs a code block, image, or more than a sentence of explanation.
- If there's a chance of confusion, provide an introductory step that tells readers where to perform the action (for example, application, tool, or location in the UI).
- Use a separate step for each instruction. It's OK to combine short steps that occur in the same place in the UI.
  - **Example**: Click the **File** menu, and then select **Open**.
- Include actions that complete a procedure, such as clicking **OK** or **Apply**.
- Don't overwhelm readers with too many steps in a single procedure. Identify natural break points and split the procedure into multiple procedures if necessary.
  - **Example**: To add a new node:
    1. In an empty space in the workspace, right-click to open the context menu and select **Add Node**.
    2. In the new context menu, select the type of node you want to add.

### Single-step procedures

A single step does not require an ordered list. Use a bullet instead of a number to stay consistent with other step-by-step instructions in the same documentation.

- **Example**: To export a workflow:
  - Right-click the workflow title, and select **Export (API)**.

### Scannability

Readers and agents scan content to find what they need. Use headings, subheadings, and lists to break up long blocks of text.

- Use headings to help readers find instructions quickly. Headings should concisely describe what the instructions help readers do.
- Use parallel structure in headings, with a consistent phrasing style that starts with an action verb.
  - **Example**: Create a profile, Build a workflow, Add a node
- If you use a sentence to introduce a procedure, make sure the information is necessary. An introductory sentence shouldn't repeat the heading.

## Tutorial workflow standard

When creating, updating, or reviewing a tutorial workflow page, follow the [Tutorial Workflow Standard](../tutorial-workflow-standard/SPEC.md) for formatting and content. This keeps all tutorial workflow pages consistent and easy to read.

## Mintlify components

Use components only when they make content easier to follow. Plain Markdown is the default. The examples below are the syntax to use in MDX files.

### Callouts

Use callouts to highlight important information, warnings, or tips. Use them sparingly. A page full of callouts trains readers to ignore them. Don't stack two callouts back to back.

| Component | Use for |
| --- | --- |
| `<Note>` | Important context the reader needs to know |
| `<Tip>` | Optional advice, shortcuts, or best practices |
| `<Info>` | Neutral background information, such as requirements or version details |
| `<Warning>` | Potential issues, risks, or things that commonly go wrong |
| `<Danger>` | Serious risks: data loss, security issues, or irreversible actions |

```mdx
<Note>
  This workflow requires ComfyUI version 0.3.40 or later.
</Note>

<Tip>
  Press `Ctrl+Enter` to queue the workflow.
</Tip>

<Warning>
  Large models can exceed 24 GB of VRAM. Check your GPU memory before downloading.
</Warning>
```

### Cards

Use cards to link to related documentation, tutorials, or external resources. Each card needs a `title`, an `icon`, and an `href`. Cards take readers away from the current page, so use them as a call to action at the end of a section or page, not in the middle of instructions.

Place cards inside a `<CardGroup>`. Use `cols={2}` by default. Use `cols={1}` for a single card, or `cols={3}` for short titles only.

```mdx
<CardGroup cols={2}>
  <Card title="Build custom nodes" icon="code" href="/custom-nodes/overview">
    Learn how to write your own nodes in Python.
  </Card>
  <Card title="Package and publish" icon="box" href="/registry/overview">
    Share your custom nodes on the Comfy Registry.
  </Card>
</CardGroup>
```

### Steps

Use `<Steps>` for procedures where each step needs more than one sentence, a code block, or an image. Step titles use sentence case and start with an imperative verb.

````mdx
<Steps>
  <Step title="Clone the repository">
    Clone the custom node into your `ComfyUI/custom_nodes` folder.
    ```bash
    git clone https://github.com/example/example-node.git
    ```
  </Step>
  <Step title="Install the dependencies">
    ```bash
    pip install -r requirements.txt
    ```
  </Step>
</Steps>
````

### Tabs

Use `<Tabs>` when the same task has different instructions for different platforms or products, such as Windows, macOS, and Linux, or Comfy Desktop and Comfy Cloud. Don't use tabs to hide content that every reader needs.

```mdx
<Tabs>
  <Tab title="Windows">
    Run `run_nvidia_gpu.bat`.
  </Tab>
  <Tab title="macOS/Linux">
    Run `python main.py`.
  </Tab>
</Tabs>
```

### Code blocks

- Always add a language tag to a code fence: `bash`, `python`, `json`, `typescript`, `text`.
- Use `text` for output or content with no language.
- When showing the same example in several languages, wrap the blocks in `<CodeGroup>` and add a title after the language tag. The title becomes the tab label.

````mdx
<CodeGroup>
```bash cURL
curl https://api.comfy.org/example
```

```python Python
import requests
requests.get("https://api.comfy.org/example")
```
</CodeGroup>
````

### Accordions

Use `<Accordion>` for FAQs, troubleshooting, and optional detail that most readers can skip. Group related accordions in an `<AccordionGroup>`. Accordion titles can be questions.

```mdx
<AccordionGroup>
  <Accordion title="How do I log in on a LAN?">
    Open ComfyUI with the `--listen` flag, then visit the host IP address.
  </Accordion>
</AccordionGroup>
```

### Parameter fields

Use `<ParamField>` to document API parameters. Include the location (`path`, `query`, `body`, or `header`), the `type`, and `required` when the parameter is required. Describe what the parameter does in the body.

```mdx
<ParamField query="limit" type="integer">
  Maximum number of results to return.
</ParamField>
```

### Images and video

- Store images under `/images/`, in a folder that matches the page's section.
- Every image needs `alt` text that describes what the image shows. Don't use placeholder text like "alt text" or "image".
- Use `<Frame>` with a `caption` when the image needs explanation.
- Use `<video>` with `controls` for screen recordings.

```mdx
<Frame caption="Export a workflow in API format">
  <img src="/images/development/export_workflow_api_format.png" alt="Workflow menu with Export (API) selected" />
</Frame>

<video controls loop muted>
  <source src="/images/interface/example.mp4" type="video/mp4" />
</video>
```

### Tables

Tables use standard Markdown syntax. Use them to compare features, list specifications, or present information that benefits from rows and columns. Include a header row. Keep cell content short.

```mdx
| Model | ID | Input | Output |
| --- | --- | --- | --- |
| Flux.1 Dev | `flux1-dev` | Text | Image |
| Wan2.2 | `wan2.2-t2v` | Text | Video |
```

### Snippets

Reuse shared snippets instead of retyping the same content. Import them at the top of the page, after the frontmatter.

| Snippet | Use on |
| --- | --- |
| `UpdateReminder` from `/snippets/tutorials/update-reminder.mdx` | Tutorial pages that need a recent ComfyUI version |
| `ReqHint` from `/snippets/tutorials/partner-nodes/req-hint.mdx` | Partner Nodes tutorial pages |

```mdx
import UpdateReminder from "/snippets/tutorials/update-reminder.mdx";

<UpdateReminder />
```

## Review checklist

Run this against every page you draft, edit, or review. When editing, check the full page, not only the changed section.

**Frontmatter and structure**

- [ ] `title` and `description` follow [docs-frontmatter.mdc](../../rules/docs-frontmatter.mdc).
- [ ] Body headings start at `##`, use sentence case, and don't skip levels.
- [ ] New pages are added to `docs.json`.

**Voice and tone**

- [ ] Reader is addressed as "you". No "let's" or "the user" for the reader.
- [ ] No superlatives, hype, or exclamation points.
- [ ] No softeners ("simply", "just", "easily", "please").
- [ ] No em dashes.
- [ ] Style follows this guide, not the style of surrounding pages.

**Writing**

- [ ] Present tense and active voice.
- [ ] No time-relative words ("currently", "new", "soon").
- [ ] No idioms or culture-specific references.
- [ ] Terminology matches the [Terminology](#terminology) table.

**Instructions**

- [ ] Multi-step procedures use a numbered list or `<Steps>`. Single steps use a bullet.
- [ ] Each step starts with an imperative verb and ends with a period.
- [ ] UI labels are bold. Node names, values, paths, and shortcuts are inline code.
- [ ] Action verbs follow the [UI action verbs](#ui-action-verbs) table.

**Components and media**

- [ ] Every code fence has a language tag.
- [ ] Cards sit inside a `<CardGroup>`.
- [ ] Callouts are used sparingly and match their purpose.
- [ ] Every image has descriptive `alt` text.
- [ ] Internal links are root-relative with no file extension, and link text describes the destination.
- [ ] Shared content uses an existing snippet.
