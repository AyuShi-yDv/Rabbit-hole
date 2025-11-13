"use client"

import { useState, useEffect } from "react"
import { TreeNode as TreeNodeComponent } from "@/components/tree-node"
import { SidePanel } from "@/components/side-panel"
import { SearchBar } from "@/components/search-bar"
import { Breadcrumbs } from "@/components/breadcrumbs"
import type { TreeNode } from "@/types/tree"

export default function Home() {
  const [tree, setTree] = useState<TreeNode | null>(null)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [nodePath, setNodePath] = useState<TreeNode[]>([])

  // Initialize tree from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("rabbit-hole-tree")
    if (saved) {
      try {
        setTree(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load tree:", e)
        initializeDefaultTree()
      }
    } else {
      initializeDefaultTree()
    }
  }, [])

  const initializeDefaultTree = () => {
    const root: TreeNode = {
      id: "1",
      title: "Root Node",
      children: [],
      content: {
        type: "text",
        value: "Welcome to Rabbit Hole! Click to add notes.",
      },
    }
    setTree(root)
    localStorage.setItem("rabbit-hole-tree", JSON.stringify(root))
  }

  // Save tree to localStorage whenever it changes
  useEffect(() => {
    if (tree) {
      localStorage.setItem("rabbit-hole-tree", JSON.stringify(tree))
    }
  }, [tree])

  const findNodeById = (node: TreeNode | null, id: string): TreeNode | null => {
    if (!node) return null
    if (node.id === id) return node
    for (const child of node.children) {
      const found = findNodeById(child, id)
      if (found) return found
    }
    return null
  }

  const getNodePath = (node: TreeNode | null, id: string, path: TreeNode[] = []): TreeNode[] => {
    if (!node) return []
    const newPath = [...path, node]
    if (node.id === id) return newPath
    for (const child of node.children) {
      const result = getNodePath(child, id, newPath)
      if (result.length > 0) return result
    }
    return []
  }

  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId)
    if (tree) {
      setNodePath(getNodePath(tree, nodeId))
    }
  }

  const handleAddChild = (parentId: string) => {
    if (!tree) return

    const newNode: TreeNode = {
      id: Math.random().toString(36).substr(2, 9),
      title: "New Note",
      children: [],
      content: { type: "text", value: "" },
    }

    const updateTree = (node: TreeNode): TreeNode => {
      if (node.id === parentId) {
        return {
          ...node,
          children: [...node.children, newNode],
        }
      }
      return {
        ...node,
        children: node.children.map(updateTree),
      }
    }

    setTree(updateTree(tree))
    setSelectedNodeId(newNode.id)
  }

  const handleUpdateNode = (nodeId: string, updates: Partial<TreeNode>) => {
    if (!tree) return

    const updateTree = (node: TreeNode): TreeNode => {
      if (node.id === nodeId) {
        return { ...node, ...updates }
      }
      return {
        ...node,
        children: node.children.map(updateTree),
      }
    }

    setTree(updateTree(tree))
  }

  const handleDeleteNode = (nodeId: string) => {
    if (!tree || tree.id === nodeId) return // Can't delete root

    const deleteNode = (node: TreeNode): TreeNode => {
      return {
        ...node,
        children: node.children.filter((child) => child.id !== nodeId).map(deleteNode),
      }
    }

    setTree(deleteNode(tree))
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null)
    }
  }

  const selectedNode = selectedNodeId ? findNodeById(tree, selectedNodeId) : null

  return (
    <div className="flex h-screen bg-background text-foreground dark:bg-background dark:text-foreground">
      {/* Left Panel - Tree Visualization */}
      <div className="w-80 border-r border-border overflow-y-auto p-6 bg-card dark:bg-card">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary dark:text-primary">🐰 Rabbit Hole</h1>
          <p className="text-sm text-muted-foreground mt-1">Tree-based notes</p>
        </div>

        <SearchBar query={searchQuery} onQueryChange={setSearchQuery} />

        <div className="mt-6">
          {tree && (
            <TreeNodeComponent
              node={tree}
              selectedId={selectedNodeId}
              onSelect={handleNodeSelect}
              onAddChild={handleAddChild}
              searchQuery={searchQuery}
            />
          )}
        </div>
      </div>

      {/* Right Panel - Content & Details */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedNode && (
          <>
            <div className="border-b border-border p-4 bg-card dark:bg-card">
              <Breadcrumbs path={nodePath} onNavigate={handleNodeSelect} />
            </div>
            <SidePanel
              node={selectedNode}
              onUpdateNode={handleUpdateNode}
              onAddChild={handleAddChild}
              onDeleteNode={handleDeleteNode}
            />
          </>
        )}
        {!selectedNode && (
          <div className="flex items-center justify-center flex-1 text-center">
            <div>
              <p className="text-muted-foreground text-lg">Select a node to view or edit</p>
              <p className="text-sm text-muted-foreground mt-2">Click a node on the left or add a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
