import React from "react";

export default function ErrorMessage({ message }: { message: string | null }) {
  return (
    message && (
      <div className="flex p-2 rounded-md bg-gray-100 border border-gray-300">
        <p className="text-sm text-destructive">{message}*</p>
      </div>
    )
  );
}
