import type { ReactNode } from 'react'

interface LexicalTextNode {
  type: 'text'
  text: string
  format?: number
  detail?: number
  mode?: string
  style?: string
}

interface LexicalElementNode {
  type: string
  children?: LexicalNode[]
  direction?: string | null
  format?: string
  indent?: number
  [key: string]: unknown
}

interface LexicalRootNode {
  root: {
    children: LexicalNode[]
    direction?: string | null
    format?: string
    indent?: number
    type: string
    version: number
  }
}

type LexicalNode = LexicalTextNode | LexicalElementNode

const BLOCK_TAGS: Record<string, string> = {
  paragraph: 'p',
  heading: 'h2',
  quote: 'blockquote',
  code: 'pre',
  list: 'ul',
  listitem: 'li',
  linebreak: 'br',
}

let nodeCounter = 0

function renderNode(node: LexicalNode): ReactNode {
  nodeCounter += 1
  const key = `lx-${nodeCounter}`

  if (node.type === 'text') {
    const textNode = node as LexicalTextNode
    let content: ReactNode = textNode.text
    const fmt = textNode.format ?? 0

    if (fmt & 1) content = <strong key={`${key}-b`}>{content}</strong>
    if (fmt & 2) content = <em key={`${key}-i`}>{content}</em>
    if (fmt & 4) content = <s key={`${key}-s`}>{content}</s>
    if (fmt & 8) content = <u key={`${key}-u`}>{content}</u>

    return content
  }

  const el = node as LexicalElementNode
  const children = (el.children ?? []).map((child, i) => (
    <span key={`${key}-c${i}`}>{renderNode(child)}</span>
  ))

  const tag = BLOCK_TAGS[el.type] ?? 'div'

  if (el.type === 'linebreak') return <br key={key} />

  const Tag = tag as keyof JSX.IntrinsicElements
  return <Tag key={key}>{children}</Tag>
}

/**
 * Convert Payload CMS Lexical rich-text JSON to React elements.
 * Returns null if input is empty or invalid.
 */
export function renderLexical(data: unknown): ReactNode {
  nodeCounter = 0

  if (!data || typeof data !== 'object') return null

  const root = data as LexicalRootNode
  if (!root.root?.children) return null

  return (
    <div className="lexical-content space-y-4">
      {root.root.children.map((node, i) => (
        <span key={`root-${i}`}>{renderNode(node)}</span>
      ))}
    </div>
  )
}
