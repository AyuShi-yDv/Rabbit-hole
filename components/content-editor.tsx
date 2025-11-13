"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Code, ImageIcon, Link, Music, Type } from "lucide-react"
import type { NodeContent, ContentBlock } from "@/types/tree"

interface ContentEditorProps {
  content: NodeContent
  onContentUpdate: (content: NodeContent) => void
}

export function ContentEditor({ content, onContentUpdate }: ContentEditorProps) {
  const [activeTab, setActiveTab] = useState<ContentBlock["type"]>((content.type as ContentBlock["type"]) || "text")
  const [blocks, setBlocks] = useState<ContentBlock[]>(
    content.blocks || (content.value ? [{ type: content.type as ContentBlock["type"], value: content.value }] : []),
  )

  const handleAddBlock = (type: ContentBlock["type"]) => {
    const newBlock: ContentBlock = {
      type,
      value: "",
      metadata: {},
    }
    const updatedBlocks = [...blocks, newBlock]
    setBlocks(updatedBlocks)
    onContentUpdate({ type: "mixed", blocks: updatedBlocks })
  }

  const handleUpdateBlock = (index: number, updates: Partial<ContentBlock>) => {
    const updatedBlocks = blocks.map((block, i) => (i === index ? { ...block, ...updates } : block))
    setBlocks(updatedBlocks)
    onContentUpdate({ type: "mixed", blocks: updatedBlocks })
  }

  const handleRemoveBlock = (index: number) => {
    const updatedBlocks = blocks.filter((_, i) => i !== index)
    setBlocks(updatedBlocks)
    onContentUpdate({ type: "mixed", blocks: updatedBlocks })
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Content Blocks</h3>
        <div className="space-y-4">
          {blocks.map((block, index) => (
            <ContentBlockEditor
              key={index}
              block={block}
              index={index}
              onUpdate={handleUpdateBlock}
              onRemove={handleRemoveBlock}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <p className="text-sm text-muted-foreground mb-3">Add content:</p>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" onClick={() => handleAddBlock("text")} className="gap-2">
            <Type className="w-4 h-4" /> Text
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleAddBlock("image")} className="gap-2">
            <ImageIcon className="w-4 h-4" /> Image
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleAddBlock("youtube")} className="gap-2">
            <Music className="w-4 h-4" /> YouTube
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleAddBlock("link")} className="gap-2">
            <Link className="w-4 h-4" /> Link
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleAddBlock("code")} className="gap-2 col-span-2">
            <Code className="w-4 h-4" /> Code
          </Button>
        </div>
      </div>
    </div>
  )
}

function ContentBlockEditor({
  block,
  index,
  onUpdate,
  onRemove,
}: {
  block: ContentBlock
  index: number
  onUpdate: (index: number, updates: Partial<ContentBlock>) => void
  onRemove: (index: number) => void
}) {
  return (
    <div className="border border-border rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-center">
        <p className="font-medium text-sm capitalize">{block.type}</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          className="text-destructive hover:text-destructive"
        >
          Remove
        </Button>
      </div>

      {block.type === "text" && (
        <Textarea
          value={block.value}
          onChange={(e) => onUpdate(index, { value: e.target.value })}
          placeholder="Enter text..."
          className="min-h-24"
        />
      )}

      {block.type === "image" && (
        <Input
          value={block.value}
          onChange={(e) => onUpdate(index, { value: e.target.value })}
          placeholder="Image URL"
          type="url"
        />
      )}

      {block.type === "youtube" && (
        <Input
          value={block.value}
          onChange={(e) => onUpdate(index, { value: e.target.value })}
          placeholder="YouTube video ID or URL"
        />
      )}

      {block.type === "link" && (
        <>
          <Input
            value={block.value}
            onChange={(e) => onUpdate(index, { value: e.target.value })}
            placeholder="URL"
            type="url"
          />
          <Input
            value={block.metadata?.title || ""}
            onChange={(e) =>
              onUpdate(index, {
                metadata: { ...block.metadata, title: e.target.value },
              })
            }
            placeholder="Link title (optional)"
          />
        </>
      )}

      {block.type === "code" && (
        <>
          <Select
            value={block.metadata?.language || "javascript"}
            onValueChange={(lang) =>
              onUpdate(index, {
                metadata: { ...block.metadata, language: lang },
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="html">HTML</SelectItem>
              <SelectItem value="css">CSS</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
            </SelectContent>
          </Select>
          <Textarea
            value={block.value}
            onChange={(e) => onUpdate(index, { value: e.target.value })}
            placeholder="Paste code here..."
            className="font-mono text-sm min-h-32"
          />
        </>
      )}
    </div>
  )
}
