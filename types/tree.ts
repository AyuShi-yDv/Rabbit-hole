export interface ContentBlock {
  type: "text" | "image" | "youtube" | "link" | "code"
  value: string
  metadata?: {
    language?: string // for code blocks
    title?: string // for links
  }
}

export interface NodeContent {
  type: "text" | "image" | "youtube" | "link" | "code" | "mixed"
  value?: string
  blocks?: ContentBlock[]
}

export interface TreeNode {
  id: string
  title: string
  children: TreeNode[]
  content: NodeContent
}
