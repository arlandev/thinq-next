"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
    className?: string;
    onChange?: (files: File[]) => void;
    onRemove?: () => void;
    value?: File[];
    multiple?: boolean;
  }

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  (
    { className, onChange, onRemove, value: _value, multiple = true, ...props },
    ref,
  ) => {
    const [files, setFiles] = React.useState<File[]>([]);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newlySelectedFiles = Array.from(e.target.files ?? []);
      const updatedFiles = [...files, ...newlySelectedFiles];

      const uniqueFiles = updatedFiles.reduce<File[]>((acc, current) => {
        const isDuplicate = acc.some(
          (file) =>
            file.name === current.name &&
            file.size === current.size &&
            file.lastModified === current.lastModified,
        );

        if (!isDuplicate) {
          acc.push(current);
        }
        return acc;
      }, []);

      setFiles(uniqueFiles);

      if (onChange) {
        onChange(uniqueFiles);
      }

      // Reset the input value so the same file can be selected again if needed
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    };

    const handleRemove = () => {
      setFiles([]);

      // Reset the input value
      if (inputRef.current) {
        inputRef.current.value = "";
      }

      if (onRemove) {
        onRemove();
      }
    };

    const handleRemoveSingleFile = (indexToRemove: number) => {
      const updatedFiles = files.filter((_, index) => index !== indexToRemove);
      setFiles(updatedFiles);

      if (onChange) {
        onChange(updatedFiles);
      }
    };

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            type="file"
            multiple={multiple}
            onChange={handleChange}
            className={className}
            {...props}
          />
          {files.length > 0 && (
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={handleRemove}
              aria-label="Remove all files"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {files.length > 0 && (
          <div className="text-sm text-muted-foreground">
            <p>{files.length} file(s) selected</p>
            <ul className="mt-1 max-h-32 overflow-y-auto pr-2">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between py-1"
                >
                  <span className="truncate max-w-[80%]">
                    {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </span>
                  <span
                    className="h-5 w-10 min-w-5 flex-shrink-0 ml-2 cursor-pointer"
                    onClick={() => handleRemoveSingleFile(index)}
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="h-4 w-4 hover:outline hover:outline-zinc-500" />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  },
);

FileInput.displayName = "FileInput";

export { FileInput };