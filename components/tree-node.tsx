"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Plus } from "lucide-react"
import type { TreeNode } from "@/types/tree"
import { cn } from "@/lib/utils"

interface TreeNodeComponentProps {
  node: TreeNode
  selectedId: string | null
  onSelect: (nodeId: string) => void
  onAddChild: (parentId: string) => void
  searchQuery?: string
  level?: number
}

export function TreeNodeComponent({
  node,
  selectedId,
  onSelect,
  onAddChild,
  searchQuery = "",
  level = 0,
}: TreeNodeComponentProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const isSelected = selectedId === node.id

  // Filter children based on search
  const visibleChildren = searchQuery
    ? node.children.filter((child) => child.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : node.children

  const hasVisibleChildren = visibleChildren.length > 0

  return (
    <div className="space-y-1">
      <div
        className={cn(
          "flex items-center gap-1 px-3 py-2 rounded-md group transition-colors",
          isSelected
            ? "bg-primary/15 text-primary dark:bg-primary/25 dark:text-primary"
            : "hover:bg-muted dark:hover:bg-muted",
        )}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
      >
        {hasVisibleChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-0.5 hover:bg-muted rounded opacity-60 hover:opacity-100"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        )}
        {!hasVisibleChildren && <div className="w-5" />}

        <button
          onClick={() => onSelect(node.id)}
          className="flex-1 text-left font-medium text-sm truncate hover:underline"
        >
          {node.title}
        </button>

        <button
          onClick={() => onAddChild(node.id)}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-accent/20 rounded transition-opacity"
          title="Add child node"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      {isExpanded && hasVisibleChildren && (
        <div className="branch-expand">
          {visibleChildren.map((child) => (
            <TreeNodeComponent
              key={child.id}
              node={child}
              selectedId={selectedId}
              onSelect={onSelect}
              onAddChild={onAddChild}
              searchQuery={searchQuery}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export { TreeNodeComponent as TreeNode }
