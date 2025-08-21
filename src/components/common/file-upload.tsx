"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload,Pencil } from "lucide-react"

interface UploadButtonProps {
  title?: string
  onFileSelect: (file: File) => void | Promise<void>
}

export default function UploadButton({ title = "", onFileSelect }: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  return (
    <div>
      {/* hidden file input */}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
      />

      {/* customizable button */}
      <Button variant={title=="Upload" ? "default" : "outline"} className="cursor-pointer w-full" onClick={handleClick}>
        {title}
        {title=="Upload" ? 
        <Upload color="#ffffff" />
        :
        <Pencil color="#000000" />
      }
      </Button>
    </div>
  )
}