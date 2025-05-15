"use client"

import React, { useState } from "react";
import { ChatInput } from "@/components/ui/chat-input";
import { Button } from "@/components/ui/button";
import { Paperclip, CornerDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";

function ChatInputDemo() {
  const [value, setValue] = useState("");

  return (
    <div className="max-w-3xl min-w-[400px] p-4 w-full">
      <form 
        className="relative rounded-lg border border-black bg-white p-1 shadow-[3px_3px_0px_0px_#18181B]"
        onSubmit={(e) => {
          e.preventDefault();
          console.log("Submitted:", value);
        }}
      >
        <ChatInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type your message here..."
          className="min-h-[48px] resize-none bg-white border-0 p-3 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center p-3 pt-0">
          <Button 
            variant="outline"
            size="icon" 
            type="button" 
            className="text-black bg-white border-2 border-black shadow-[3px_3px_0px_0px_#18181B] transition-all duration-300 hover:shadow-[5px_5px_0px_0px_#18181B] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:bg-gray-100"
          >
            <Paperclip className="size-4" />
            <span className="sr-only">Attach file</span>
          </Button>

          <Button
            type="submit"
            size="default"
            className="ml-auto gap-1.5 bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] text-white shadow-[3px_3px_0px_0px_#18181B] transition-all duration-300 hover:shadow-[5px_5px_0px_0px_#18181B] hover:translate-x-[-2px] px-3 py-2 hover:translate-y-[-2px] border-2 border-black"
          >
            Send Message
            <CornerDownLeft className="size-3.5" />
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background relative grainy-background dashboard-backdrop-circle-container flex items-center justify-center px-4">
      <ChatInputDemo />
    </div>
  );
} 