"use client";
import React from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

interface BlogTextProps {
  blogText: string;
  setBlogText: (value: string) => void;
}

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function Blog_Text({ blogText, setBlogText }: BlogTextProps) {
  var toolbarOptions = [
    [{ size: ["small", false, "large", "huge"] }], // custom dropdown

    ["bold", "italic", "underline"], // toggled buttons

    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript

    [{ align: [] }],
    ["link"],
  ];
  return (
    <div>
      <ReactQuill
        modules={{ toolbar: toolbarOptions }}
        theme="snow"
        value={blogText}
        onChange={setBlogText}
      />
    </div>
  );
}
