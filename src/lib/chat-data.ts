import type { InsightRecord } from '@/lib/insight-data';
import type { KnowledgeRecord } from '@/lib/knowledge-data';

export type ChatReference =
  | { kind: 'knowledge'; id: string; label: string }
  | { kind: 'insight'; id: string; label: string }
  | 'not-found';

export type ChatBubble =
  | { id: string; role: 'user'; text: string }
  | {
      id: string;
      role: 'ai';
      lead?: string;
      text: string;
      reference?: ChatReference;
      choices?: { label: string; next: string }[];
      action?: { label: string };
    };

export type ChatSessionStatus = 'active' | 'resolved' | 'unresolved';

export type ChatSession = {
  id: string;
  title: string;
  status: ChatSessionStatus;
  messages: ChatBubble[];
  createdAt: string;
  /** 最初の診断ステップで見つかった参照元。以降のステップ生成に使う内部用の値。 */
  pendingReference?: ChatReference;
};

// 症状文に含まれるキーワードから、関連する気付き/ナレッジを探す（デモ用の簡易マッチング）
const REFERENCE_KEYWORDS = [
  '音',
  '振動',
  '止まっ',
  '動かな',
  'シール',
  'ズレ',
  '匂い',
  '重さ',
];

export function findChatReference(
  symptom: string,
  knowledge: KnowledgeRecord[],
  insights: InsightRecord[]
): { reference: ChatReference; hint: string } {
  const hit = REFERENCE_KEYWORDS.find((keyword) => symptom.includes(keyword));
  if (hit) {
    const knowledgeMatch = knowledge.find(
      (item) => item.symptom.includes(hit) || item.title.includes(hit)
    );
    if (knowledgeMatch) {
      return {
        reference: {
          kind: 'knowledge',
          id: knowledgeMatch.id,
          label: knowledgeMatch.title,
        },
        hint: knowledgeMatch.symptom,
      };
    }
    const insightMatch = insights.find((item) => item.problem.includes(hit));
    if (insightMatch) {
      return {
        reference: {
          kind: 'insight',
          id: insightMatch.id,
          label: insightMatch.problem || insightMatch.category || '気付き',
        },
        hint: '同様の気付きが過去に記録されています。無理な自己判断はせず慎重に確認してください。',
      };
    }
  }
  return {
    reference: 'not-found',
    hint: '似た記録は見つかりませんでした。基本的な点検（電源・接続・可動部）から確認しましょう。',
  };
}

function findCauseHint(
  reference: ChatReference,
  knowledge: KnowledgeRecord[]
): string {
  if (reference !== 'not-found' && reference.kind === 'knowledge') {
    const record = knowledge.find((item) => item.id === reference.id);
    if (record?.cause) {
      return record.cause;
    }
  }
  return '原因の特定が難しいようです。無理に自分で分解せず、状況を班長に共有してください。';
}

/** 症状の自由入力を受けた直後の最初のAI応答（確認ポイント＋参照元）。 */
export function buildInitialStep(
  hint: string,
  reference: ChatReference
): Omit<ChatBubble & { role: 'ai' }, 'id'> {
  return {
    role: 'ai',
    lead: 'まず確認してみてください',
    text: hint,
    reference,
    choices: [
      { label: 'はい、当てはまる', next: 'confirm-yes' },
      { label: 'いいえ、当てはまらない', next: 'confirm-no' },
    ],
  };
}

/** 「当てはまる」を選んだ場合の原因説明ステップ。 */
export function buildConfirmYesStep(
  reference: ChatReference,
  knowledge: KnowledgeRecord[]
): Omit<ChatBubble & { role: 'ai' }, 'id'> {
  return {
    role: 'ai',
    text: findCauseHint(reference, knowledge),
    reference,
    choices: [
      { label: '解決した', next: 'ask-log' },
      { label: 'まだ解決しない', next: 'unresolved' },
    ],
  };
}

/** 「当てはまらない」を選んだ場合のフォローアップステップ。 */
export function buildConfirmNoStep(): Omit<ChatBubble & { role: 'ai' }, 'id'> {
  return {
    role: 'ai',
    text: '念のため他の可能性も確認しましょう。電源・接続・可動部に異常はありませんか？',
    choices: [
      { label: '解決した', next: 'ask-log' },
      { label: 'まだ解決しない', next: 'unresolved' },
    ],
  };
}

/** 「解決した」を選んだ直後、気付きとして記録するか確認するステップ。 */
export function buildAskLogStep(): Omit<ChatBubble & { role: 'ai' }, 'id'> {
  return {
    role: 'ai',
    text: '解決してよかったです。この対応を気付きとして記録しますか？',
    choices: [
      { label: 'はい', next: 'log-yes' },
      { label: 'いいえ', next: 'log-no' },
    ],
  };
}

/** 記録に同意した場合の最終ステップ。新規に記録された気付きを参照元として示す。 */
export function buildLoggedStep(
  insightId: string,
  insightLabel: string
): Omit<ChatBubble & { role: 'ai' }, 'id'> {
  return {
    role: 'ai',
    text: 'この対応を気付きとして記録しました。',
    reference: { kind: 'insight', id: insightId, label: insightLabel },
  };
}

/** 記録を見送った場合の最終ステップ。 */
export function buildNotLoggedStep(): Omit<ChatBubble & { role: 'ai' }, 'id'> {
  return {
    role: 'ai',
    text: '承知しました。記録は行いません。',
  };
}

/** 解決に至らなかった場合の最終ステップ。班長への連絡を促す。 */
export function buildUnresolvedStep(
  reference: ChatReference
): Omit<ChatBubble & { role: 'ai' }, 'id'> {
  return {
    role: 'ai',
    text: '確認いただいた内容では解決が難しいようです。無理に分解せず、状況を班長に共有してください。',
    reference,
    action: { label: '班長に電話する' },
  };
}

export function deriveChatTitle(symptom: string): string {
  const first = symptom.split(/[。\n]/)[0]?.trim() ?? '';
  if (!first) {
    return '新しい相談';
  }
  return first.length > 20 ? `${first.slice(0, 20)}…` : first;
}

// 履歴一覧の初期表示用デモデータ（完結済みの過去の相談）
export const initialChatSessions: ChatSession[] = [
  {
    id: 'chat-seed-1',
    title: 'コンベアのあたりからキーキーした音がする',
    status: 'unresolved',
    createdAt: '2024/8/9 9:40',
    messages: [
      {
        id: 'chat-seed-1-1',
        role: 'user',
        text: 'コンベアのあたりからキーキーした音がする。製品も少し振られてる気がする',
      },
      {
        id: 'chat-seed-1-2',
        role: 'ai',
        lead: 'まず確認してみてください',
        text: 'モーター下部に切り粉（金属の削りカス）が落ちていませんか？振動は大きくないですか？',
        reference: {
          kind: 'knowledge',
          id: 'knowledge-seed-1',
          label: 'ガリンガリンという異音・製品の振れ',
        },
        choices: [
          { label: '金属の粉が落ちている', next: 'confirm-yes' },
          { label: '特に異常はない', next: 'confirm-no' },
        ],
      },
      { id: 'chat-seed-1-3', role: 'user', text: '金属の粉が落ちている' },
      {
        id: 'chat-seed-1-4',
        role: 'ai',
        text: 'インクラ部分（リフティング機構）のカム、およびカムフォロワーの劣化・摩耗が考えられます。無理に自分で分解せず、状況を班長にも共有してください。',
        reference: {
          kind: 'knowledge',
          id: 'knowledge-seed-1',
          label: 'ガリンガリンという異音・製品の振れ',
        },
        action: { label: '班長に電話する' },
      },
    ],
  },
  {
    id: 'chat-seed-2',
    title: '変な音がする',
    status: 'resolved',
    createdAt: '2024/8/8 14:12',
    messages: [
      { id: 'chat-seed-2-1', role: 'user', text: '変な音がする' },
      {
        id: 'chat-seed-2-2',
        role: 'ai',
        lead: 'まず確認してみてください',
        text: '似た記録は見つかりませんでした。基本的な点検（電源・接続・可動部）から確認しましょう。',
        reference: 'not-found',
        choices: [
          { label: '解決した', next: 'resolved' },
          { label: 'まだ解決しない', next: 'unresolved' },
        ],
      },
      { id: 'chat-seed-2-3', role: 'user', text: '解決した' },
      {
        id: 'chat-seed-2-4',
        role: 'ai',
        text: '解決してよかったです。この対応を気付きとして記録しますか？',
        choices: [
          { label: 'はい', next: 'log-yes' },
          { label: 'いいえ', next: 'log-no' },
        ],
      },
      { id: 'chat-seed-2-5', role: 'user', text: 'はい' },
      {
        id: 'chat-seed-2-6',
        role: 'ai',
        text: 'この対応を気付きとして記録しました。',
        reference: {
          kind: 'insight',
          id: 'insight-seed-5',
          label: '変な音がする',
        },
      },
    ],
  },
  {
    id: 'chat-seed-3',
    title: '機械が止まって動かなくなった',
    status: 'resolved',
    createdAt: '2024/8/7 16:05',
    messages: [
      {
        id: 'chat-seed-3-1',
        role: 'user',
        text: '機械が止まって動かなくなった',
      },
      {
        id: 'chat-seed-3-2',
        role: 'ai',
        text: 'まず動力源を確認しましょう。この機構はどちらですか？',
        reference: 'not-found',
        choices: [
          { label: 'エア駆動', next: 'air' },
          { label: '電気駆動', next: 'electric' },
        ],
      },
      { id: 'chat-seed-3-3', role: 'user', text: 'エア駆動' },
      {
        id: 'chat-seed-3-4',
        role: 'ai',
        text: 'エアは来ていますか？（圧力計・配管を確認してください）',
        choices: [
          { label: 'はい', next: 'yes' },
          { label: 'いいえ', next: 'no' },
        ],
      },
      { id: 'chat-seed-3-5', role: 'user', text: 'いいえ' },
      {
        id: 'chat-seed-3-6',
        role: 'ai',
        text: 'エア供給元のバルブが閉じている可能性があります。バルブを開けて、再度動くか確認してください。\nこれで解決しましたか？',
        choices: [
          { label: '解決した', next: 'resolved' },
          { label: 'まだ動かない', next: 'unresolved' },
        ],
      },
      { id: 'chat-seed-3-7', role: 'user', text: '解決した' },
      {
        id: 'chat-seed-3-8',
        role: 'ai',
        text: '解決してよかったです。この対応を気付きとして記録しますか？',
        choices: [
          { label: 'はい', next: 'log-yes' },
          { label: 'いいえ', next: 'log-no' },
        ],
      },
      { id: 'chat-seed-3-9', role: 'user', text: 'はい' },
      {
        id: 'chat-seed-3-10',
        role: 'ai',
        text: 'この対応を気付きとして記録しました。',
        reference: {
          kind: 'insight',
          id: 'insight-seed-4',
          label: '機械が止まって動かなくなった',
        },
      },
    ],
  },
];
