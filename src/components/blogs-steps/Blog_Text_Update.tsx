"use client";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface BlogTextProps {
  blogText: string;
  setBlogText: (value: string) => void;
  initialValue: string;
}

export default function Blog_Text_Update({
  blogText,
  setBlogText,
  initialValue,
}: BlogTextProps) {
  var toolbarOptions = [
    [{ size: ["small", false, "large", "huge"] }], // custom dropdown

    ["bold", "italic", "underline"], // toggled buttons

    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript

    [{ align: [] }],
    ["link"],
  ];
  useEffect(() => {
    if (!blogText) {
      setBlogText(initialValue);
    }
  }, []);
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
