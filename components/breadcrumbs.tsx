"use client"

import { ChevronRight } from "lucide-react"
import type { TreeNode } from "@/types/tree"

interface BreadcrumbsProps {
  path: TreeNode[]
  onNavigate: (nodeId: string) => void
}

export function Breadcrumbs({ path, onNavigate }: BreadcrumbsProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto">
      {path.map((node, index) => (
        <div key={node.id} className="flex items-center gap-1 whitespace-nowrap">
          {index > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
          <button onClick={() => onNavigate(node.id)} className="text-sm text-primary hover:underline font-medium">
            {node.title}
          </button>
        </div>
      ))}
    </div>
  )
}
