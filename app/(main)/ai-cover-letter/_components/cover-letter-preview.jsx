"use client";

import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

const CoverLetterPreview = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Cover letter copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-4 space-y-2">
      <div className="flex justify-end">
        <div
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-600 cursor-pointer hover:bg-gray-800 text-sm"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy
            </>
          )}
        </div>
      </div>
      <MDEditor value={content} preview="preview" height={700} />
    </div>
  );
};

export default CoverLetterPreview;