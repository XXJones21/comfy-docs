---
name: docs-style-guide
description: >-
  Utilize this skill when drafting, editing or reviewing any Comfy documentation. Covers writing style, formatting, and best practices for Comfy docs contributors.
---

# Comfy Docs Style Guide

The Comfy Documentation is built on [Mintlify](https://www.mintlify.com/docs) utilizing the same MDX syntax. This style guide is designed to help you write clear, concise, and consistent documentation for Comfy products. It covers writing style, formatting, and best practices for any docs contributors.

## Writing Style

Listed below are the key principles for writing documentation for Comfy products. These principles are designed to ensure that our documentation is clear, concise, and accessible to a wide audience.

 - **Write short, simple sentences**: If a sentence is too long or complex, consider rewriting it or breaking it into multiple sentences.
 - **Replace complex sentences and paragraphs with lists and tables**.
 - **Utilize sentence-style capitalization**: Capitalize proper nouns only, including trademarks and the names of products.
 - **Avoid modifiers when possible**: Long chains of modifying words are confusing even to native English speakers. 
 - **Match UI terminology**: Use the same terminology as the ComfyUI interface. For example, use "node" instead of "block" or "module". Use "workflow" instead of "pipeline" or "process".
 - **Don't use profanity or violent language**
 - **Don't reference inappropriate topics**: references to drinking, drugs, gambling, and explicit content
 - **Avoid stereotypes**: stereotypes can be hurtful and should be avoided whenever possible
 - **Avoid referencing current events**: Documentation should be timeless and many real-world events can affect many people in different ways

### Present Tense and Active Voice

All Comfy documentation needs to be written in present tense. This is because documentation serves as a reference for users, and the information should be applicable at the time of reading. Avoid using past tense when describing features, functionality, or instructions. 

Content should be written in active voice, which is more direct and engaging for readers.

Example of present tense and active voice:
- ✅ "Left-click the button to submit the form."
- ❌ "The button was clicked by the user to submit the form."

### Inclusivity

Everyone who interacts with docs should feel *welcome*, *respected*, and *represented*. This means that we need to strive to help everyone feel like they were considered in the creation of our content and that they can identify with its message.

Avoid idioms, colloquial expressions, and culture-specific references. They can be confusing for non-native English speakers and hard to localize. 

## Writing Step-by-Step Instructions

When writing step-by-step instructions, make sure that developers begin in the right place by providing a brief phrase at the beginning of the step. The rest of the time, start each sentence with an imperative verb. Use a complete sentence with a capital letter at the beginning and use a period at the end.

Utilize the following guidelines for writing multiple-step and single-step procedures:

### Multiple-step procedures

Most instructional content requires multiple steps. When writing multiple-step procedures, use the following guidelines:

- Utilize a numbered list.
- If there's a chance of confusion, provide an introductory step that tells readers where to perform the action (for example, application, tool, or location in the UI).
- Use a separate step for each instruction. It's OK to combine short steps that occur in the same place in the UI.
  - **Example**: Left-click the **File** menu, and then select **Open**.  
- Most of the time, include actions that complete a procedure, such as selecting an **OK** or **Apply** button.
- Don't overwhelm readers with too many steps in a single procedure. Identify natural break points and split the procedure into multiple procedures if necessary.
  - **Example** To Add a new Node:
    1. In an empty space in the workspace, right-click to open the context menu and select **Add Node**.
    2. In the new context menu drop-down, select the type of node you want to add.

### Single-step procedures

A single step does not required order list formatting. Utilize a bullet instead of a number in order to stay consistent with step-by-step instructions in the same documentation
  - **Example** To Export a workflow:
    - Right-click on the Workflow title, and select **Export (API)**.

### Scannability

When structuring documentation, consider how readers and agents will scan the content to find the information they need. Use headings, subheadings, and lists to break up long blocks of text and make it easier for readers to find what they're looking for.

- Consider using headings to help readers find instructions quickly. The headings should concisely describe what the instructions help readers do.
- Use parallel structure in headings. That is, use a consistent phrasing style with action verbs
  - **Example** Create a profile, Build a workflow, Add a node
- If you use a sentence to introduce a procedure, make sure that the information is necessary. An introductory sentence shouldn't just repeat what the heading says.

## Tutorial Workflow Standard

When creating, updating or reviewing a tutorial workflow page, follow the [Tutorial Workflow Standard](../tutorial-workflow-standard/SPEC.md) for formatting and content. This ensures that all tutorial workflow pages are consistent and easy to read.

## Callouts

Utilize callouts to highlight important information, warnings, or tips. Callouts should be used sparingly and only when necessary to draw attention to critical information.

<Note>This adds a note in the content</Note>
- Used to highlight important information, tips, or best practices.

<Warning>This raises a warning to watch out for</Warning>
- Used to alert readers to potential issues, risks, or important considerations.

<Danger>This is a danger callout</Danger>
- Used to warn readers about serious risks, hazards, or critical information that could lead to data loss, critical issues or other severe consequences.

## Cards

Use cards to provide additional information, links, or resources related to the content. Cards can be used to highlight related documentation, tutorials, or external resources. Cards should have a title, an icon, and a link to the relevant resource. Cards should be used as a call to action to encourage readers to explore related content, but note that cards will take readers away from the current page, so use them sparingly and only when necessary.

<Card title="Join the waitlist" icon="list" href="https://links.comfy.org/agentalpha">
  Get notified when Comfy Agent is available for Comfy Desktop.
</Card>

## Tables

Tables follow modern markdown syntax and should be used to present structured data in a clear and organized manner. Use tables to compare features, list specifications, or present any information that benefits from a tabular format. The following is an example of a table using left-aligned columns and headers:

| Model | ID | Input | Output |
| --- | --- | --- | --- |

