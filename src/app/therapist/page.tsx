/**
 * Page 5: AI Skin Therapist Chat
 * Conversational skin advisor with analysis-aware responses in Bahasa Indonesia.
 */
"use client";

import { useState, useRef, useEffect } from "react";
import { FeatureHeader } from "@/components/feature-header";
import { useSimulationStore } from "@/store/simulation-store";
import { useSkinChat, type ChatMessage } from "@/hooks/use-skin-chat";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Bot,
  User,
  Trash2,
  Sparkles,
  Activity,
} from "lucide-react";

const QUICK_PROMPTS = [
  "Halo, analisis kulit saya",
  "Rekomendasi produk",
  "Cara mengatasi kerutan",
  "Tips sunscreen",
  "Jelaskan hasil analisis",
  "Tips hidrasi kulit",
];

export default function TherapistPage() {
  const { analysisResult } = useSimulationStore();
  const { messages, isLoading, sendMessage, clearChat } = useSkinChat();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-black p-4">
      <FeatureHeader
        title="AI Skin Therapist"
        subtitle="Konsultasi kulit interaktif"
        badge="Chat"
      />

      <main className="flex flex-col max-w-3xl mx-auto w-full flex-1 gap-4">
        {/* Analysis context banner */}
        {analysisResult && (
          <Card className="border-none shadow-md rounded-2xl bg-primary/5">
            <CardContent className="p-3 flex items-center gap-3 flex-wrap">
              <Activity className="w-4 h-4 text-primary shrink-0" />
              <span className="text-sm font-medium">Context loaded:</span>
              <Badge variant="outline" className="text-xs">Age: {analysisResult.age}</Badge>
              <Badge variant="outline" className="text-xs">Wrinkle: {analysisResult.wrinkleScore}%</Badge>
              <Badge variant="outline" className="text-xs">{analysisResult.gender}</Badge>
            </CardContent>
          </Card>
        )}

        {/* Chat Messages */}
        <Card className="flex-1 border-none shadow-xl rounded-3xl overflow-hidden flex flex-col min-h-[60vh]">
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Welcome message */}
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Bot className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">AI Skin Therapist</h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-8 leading-relaxed">
                  Halo! Saya adalah AI konsultan kulit dari Skinlytics. 
                  {analysisResult
                    ? " Saya sudah memiliki data analisis kulit Anda. Silakan tanyakan apa saja!"
                    : " Lakukan scan wajah terlebih dahulu untuk hasil yang personalized."
                  }
                </p>

                {/* Quick prompts */}
                <div className="flex flex-wrap gap-2 justify-center max-w-md">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      className="px-4 py-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary text-sm font-medium transition-colors border border-border hover:border-primary/30"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input area */}
          <div className="border-t border-border/40 p-4 bg-background">
            {messages.length > 0 && (
              <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                {QUICK_PROMPTS.slice(0, 4).map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    disabled={isLoading}
                    className="px-3 py-1.5 rounded-full bg-muted text-xs font-medium whitespace-nowrap hover:bg-primary/10 hover:text-primary transition-colors shrink-0 disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ketik pertanyaan tentang kulit Anda..."
                disabled={isLoading}
                className="flex-1 bg-muted rounded-xl px-4 py-3 text-sm border-none outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="rounded-xl px-4"
                size="lg"
              >
                <Send className="w-5 h-5" />
              </Button>
              {messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="lg"
                  className="rounded-xl px-3"
                  onClick={clearChat}
                  title="Clear chat"
                >
                  <Trash2 className="w-5 h-5 text-muted-foreground" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          isUser ? "bg-secondary/10" : "bg-primary/10"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-secondary" />
        ) : (
          <Sparkles className="w-4 h-4 text-primary" />
        )}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-secondary text-secondary-foreground rounded-tr-md"
            : "bg-muted rounded-tl-md"
        }`}
      >
        {/* Render markdown-like formatting */}
        {message.content.split("\n").map((line, i) => {
          if (line.startsWith("**") && line.endsWith("**")) {
            return <p key={i} className="font-bold mt-2 first:mt-0">{line.replace(/\*\*/g, "")}</p>;
          }
          if (line.startsWith("• ") || line.startsWith("- ")) {
            return <p key={i} className="ml-2">{line}</p>;
          }
          if (line.startsWith("> ")) {
            return <p key={i} className="ml-2 pl-2 border-l-2 border-primary/30 text-muted-foreground italic">{line.slice(2)}</p>;
          }
          if (line.trim() === "") {
            return <br key={i} />;
          }
          return <p key={i}>{line}</p>;
        })}
      </div>
    </div>
  );
}
