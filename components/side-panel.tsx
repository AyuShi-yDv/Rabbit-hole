"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ContentEditor } from "@/components/content-editor"
import type { TreeNode } from "@/types/tree"

interface SidePanelProps {
  node: TreeNode
  onUpdateNode: (nodeId: string, updates: Partial<TreeNode>) => void
  onAddChild: (parentId: string) => void
  onDeleteNode: (nodeId: string) => void
}

export function SidePanel({ node, onUpdateNode, onAddChild, onDeleteNode }: SidePanelProps) {
  const [title, setTitle] = useState(node.title)

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    onUpdateNode(node.id, { title: newTitle })
  }

  const handleContentUpdate = (newContent: any) => {
    onUpdateNode(node.id, { content: newContent })
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header with Title */}
      <div className="border-b border-border p-4 bg-card dark:bg-card space-y-4">
        <div className="flex gap-2">
          <Input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="flex-1 font-semibold text-lg"
            placeholder="Node title"
          />
          <Button variant="outline" size="sm" onClick={() => onAddChild(node.id)} className="whitespace-nowrap">
            + Add Child
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDeleteNode(node.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content Editor */}
      <div className="flex-1 overflow-y-auto">
        <ContentEditor content={node.content} onContentUpdate={handleContentUpdate} />
      </div>
    </div>
  )
}
