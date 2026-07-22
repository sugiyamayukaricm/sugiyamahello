import { createContext, type ReactNode, useContext, useState } from 'react';
import {
  formatDateTime,
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
};

const AppDataContext = createContext<AppData | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [insights, setInsights] = useState<InsightRecord[]>(initialInsights);
  const [knowledge, setKnowledge] =
    useState<KnowledgeRecord[]>(initialKnowledge);

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
