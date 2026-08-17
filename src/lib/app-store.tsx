import { createContext, type ReactNode, useContext, useState } from 'react';
import {
  buildAskLogStep,
  buildConfirmNoStep,
  buildConfirmYesStep,
  buildInitialStep,
  buildLoggedStep,
  buildNotLoggedStep,
  buildUnresolvedStep,
  type ChatSession,
  type ChatSessionStatus,
  deriveChatTitle,
  findChatReference,
  initialChatSessions,
} from '@/lib/chat-data';
import {
  formatDateTime,
  formatTime,
  type InsightDraft,
  type InsightRecord,
  initialInsights,
} from '@/lib/insight-data';
import {
  initialKnowledge,
  type KnowledgeDraft,
  type KnowledgeRecord,
} from '@/lib/knowledge-data';

type AppData = {
  insights: InsightRecord[];
  addInsight: (draft: InsightDraft) => string;
  updateInsight: (id: string, draft: InsightDraft) => void;
  removeInsight: (id: string) => void;
  knowledge: KnowledgeRecord[];
  addKnowledge: (draft: KnowledgeDraft) => string;
  updateKnowledge: (id: string, draft: KnowledgeDraft) => void;
  removeKnowledge: (id: string) => void;
  chatSessions: ChatSession[];
  activeChatSessionId: string | null;
  setActiveChatSessionId: (id: string | null) => void;
  startChatSession: (symptom: string) => string;
  advanceChatSession: (sessionId: string, next: string) => void;
};

const AppDataContext = createContext<AppData | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [insights, setInsights] = useState<InsightRecord[]>(initialInsights);
  const [knowledge, setKnowledge] =
    useState<KnowledgeRecord[]>(initialKnowledge);
  const [chatSessions, setChatSessions] =
    useState<ChatSession[]>(initialChatSessions);
  const [activeChatSessionId, setActiveChatSessionId] = useState<string | null>(
    null
  );

  const addInsight = (draft: InsightDraft) => {
    const stamp = formatDateTime(new Date());
    const id = `insight-${Date.now()}`;
    setInsights((prev) => [
      ...prev,
      { id, ...draft, createdAt: stamp, updatedAt: stamp },
    ]);
    return id;
  };

  const updateInsight = (id: string, draft: InsightDraft) => {
    const stamp = formatDateTime(new Date());
    setInsights((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...draft, updatedAt: stamp } : item
      )
    );
  };

  const removeInsight = (id: string) => {
    setInsights((prev) => prev.filter((item) => item.id !== id));
  };

  const addKnowledge = (draft: KnowledgeDraft) => {
    const stamp = formatDateTime(new Date());
    const id = `knowledge-${Date.now()}`;
    setKnowledge((prev) => [
      { id, ...draft, createdAt: stamp, updatedAt: stamp },
      ...prev,
    ]);
    return id;
  };

  const updateKnowledge = (id: string, draft: KnowledgeDraft) => {
    const stamp = formatDateTime(new Date());
    setKnowledge((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...draft, updatedAt: stamp } : item
      )
    );
  };

  const removeKnowledge = (id: string) => {
    setKnowledge((prev) => prev.filter((item) => item.id !== id));
  };

  const startChatSession = (symptom: string) => {
    const id = `chat-${Date.now()}`;
    const stamp = formatDateTime(new Date());
    const { reference, hint } = findChatReference(symptom, knowledge, insights);
    setChatSessions((prev) => [
      {
        id,
        title: deriveChatTitle(symptom),
        status: 'active',
        createdAt: stamp,
        pendingReference: reference,
        messages: [
          { id: `${id}-msg-0`, role: 'user', text: symptom },
          { id: `${id}-msg-1`, ...buildInitialStep(hint, reference) },
        ],
      },
      ...prev,
    ]);
    setActiveChatSessionId(id);
    return id;
  };

  const advanceChatSession = (sessionId: string, next: string) => {
    const session = chatSessions.find((item) => item.id === sessionId);
    if (session?.status !== 'active') {
      return;
    }
    const lastMessage = session.messages.at(-1);
    const choiceLabel =
      lastMessage?.role === 'ai'
        ? lastMessage.choices?.find((choice) => choice.next === next)?.label
        : undefined;

    const messages = [...session.messages];
    if (choiceLabel) {
      messages.push({
        id: `${sessionId}-msg-${messages.length}`,
        role: 'user',
        text: choiceLabel,
      });
    }

    let status: ChatSessionStatus = session.status;
    let nextBubble: ReturnType<typeof buildConfirmYesStep> | null = null;

    if (next === 'confirm-yes') {
      nextBubble = buildConfirmYesStep(
        session.pendingReference ?? 'not-found',
        knowledge
      );
    } else if (next === 'confirm-no') {
      nextBubble = buildConfirmNoStep();
    } else if (next === 'ask-log') {
      nextBubble = buildAskLogStep();
    } else if (next === 'log-yes') {
      const insightId = addInsight({
        category: null,
        time: formatTime(new Date()),
        equipment: '',
        problem: session.title,
        photos: [],
        author: '',
      });
      nextBubble = buildLoggedStep(insightId, session.title);
      status = 'resolved';
    } else if (next === 'log-no') {
      nextBubble = buildNotLoggedStep();
      status = 'resolved';
    } else if (next === 'unresolved') {
      nextBubble = buildUnresolvedStep(session.pendingReference ?? 'not-found');
      status = 'unresolved';
    }

    if (nextBubble) {
      messages.push({
        id: `${sessionId}-msg-${messages.length}`,
        ...nextBubble,
      });
    }

    setChatSessions((prev) =>
      prev.map((item) =>
        item.id === sessionId ? { ...item, messages, status } : item
      )
    );
  };

  return (
    <AppDataContext.Provider
      value={{
        insights,
        addInsight,
        updateInsight,
        removeInsight,
        knowledge,
        addKnowledge,
        updateKnowledge,
        removeKnowledge,
        chatSessions,
        activeChatSessionId,
        setActiveChatSessionId,
        startChatSession,
        advanceChatSession,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData(): AppData {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error('useAppData は AppDataProvider の中で使ってください');
  }
  return ctx;
}
