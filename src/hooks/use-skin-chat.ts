/**
 * Hook: useSkinChat
 * Manages AI Skin Therapist chat state and API calls.
 */
"use client";

import { useState, useCallback } from "react";
import { useSimulationStore } from "@/store/simulation-store";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function useSkinChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { analysisResult } = useSimulationStore();

  const sendMessage = useCallback(
    async (content: string) => {
      const userMessage: ChatMessage = {
        id: `user_${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: content,
            context: analysisResult
              ? {
                  age: analysisResult.age,
                  wrinkleScore: analysisResult.wrinkleScore,
                  wrinkleLevel: analysisResult.wrinkleLevel,
                  gender: analysisResult.gender,
                }
              : null,
            history: messages.map((m) => ({ role: m.role, content: m.content })),
          }),
        });

        const data = await res.json();

        const assistantMessage: ChatMessage = {
          id: `asst_${Date.now()}`,
          role: "assistant",
          content: data.content || data.error || "Sorry, I could not generate a response.",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch {
        const errorMessage: ChatMessage = {
          id: `error_${Date.now()}`,
          role: "assistant",
          content: "Maaf, terjadi kesalahan. Silakan coba lagi.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [analysisResult, messages]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, isLoading, sendMessage, clearChat };
}
