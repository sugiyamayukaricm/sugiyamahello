import appearanceImg from '@/assets/insight/appearance.png';
import factoryImg from '@/assets/insight/factory.png';
import otherImg from '@/assets/insight/other.png';
import smellImg from '@/assets/insight/smell.png';
import soundImg from '@/assets/insight/sound.png';
import vibrationImg from '@/assets/insight/vibration.png';
import weightImg from '@/assets/insight/weight.png';

export type InsightCategory =
  | '振動'
  | '匂い'
  | '量・重さ'
  | '見た目'
  | '音'
  | 'その他';

export const insightCategories: { key: InsightCategory; image: string }[] = [
  { key: '振動', image: vibrationImg },
  { key: '匂い', image: smellImg },
  { key: '量・重さ', image: weightImg },
  { key: '見た目', image: appearanceImg },
  { key: '音', image: soundImg },
  { key: 'その他', image: otherImg },
];

export const equipmentOptions = [
  '包餡機',
  'シール機',
  'ウェイトチェッカー',
  '金属探知機',
  'コンベア',
  '印字装置',
];

export type InsightPhoto = { id: string; url: string };

export type InsightRecord = {
  id: string;
  category: InsightCategory | null;
  time: string; // "HH:mm"
  equipment: string;
  problem: string;
  photos: InsightPhoto[];
  author: string;
  createdAt: string; // 表示用文字列
  updatedAt: string; // 表示用文字列
};

export type InsightDraft = {
  category: InsightCategory | null;
  time: string;
  equipment: string;
  problem: string;
  photos: InsightPhoto[];
  author: string;
};

export function createEmptyDraft(time: string): InsightDraft {
  return {
    category: null,
    time,
    equipment: '',
    problem: '',
    photos: [],
    author: '',
  };
}

// 一覧・タイムラインの初期表示用デモデータ
export const initialInsights: InsightRecord[] = [
  {
    id: 'insight-seed-1',
    category: '音',
    time: '15:51',
    equipment: '包餡機',
    problem:
      'コンベアのあたりからキーキーした音がする。製品も少し振られてる気がする。',
    photos: [
      { id: 'ip-1', url: factoryImg },
      { id: 'ip-2', url: factoryImg },
    ],
    author: '露手川',
    createdAt: '2024/8/9 1:21',
    updatedAt: '2024/8/9 1:21',
  },
  {
    id: 'insight-seed-2',
    category: '見た目',
    time: '10:20',
    equipment: 'シール機',
    problem: 'シール部分に若干のズレが見える場合がある。',
    photos: [{ id: 'ip-3', url: factoryImg }],
    author: '露手川',
    createdAt: '2024/8/9 10:25',
    updatedAt: '2024/8/9 10:25',
  },
  {
    id: 'insight-seed-3',
    category: '振動',
    time: '8:05',
    equipment: 'コンベア',
    problem: '始業点検時、コンベアの一部に細かい振動を感じた。',
    photos: [],
    author: '田中',
    createdAt: '2024/8/9 8:10',
    updatedAt: '2024/8/9 8:10',
  },
];

// 記録完了モーダルで見せるデモ用のレコメンド（静的）
export const knowledgeSuggestion = {
  knowledge: 'ガリンガリンという異音・製品の触れ',
  checkTitle: '確認してみてください',
  checkBody:
    'モーター下部に切り粉（金属の削りカス）が落ちていませんか？振動は大きくないですか？',
};

export const relatedInsights = [
  'コンベアのあたりからキーキーした音がする',
  '機械から高い音が聞こえた',
];

const weekdayLabels = ['日', '月', '火', '水', '木', '金', '土'];

export function formatDateLabel(date: Date): string {
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}（${weekdayLabels[date.getDay()]}）`;
}

export function formatShortDate(date: Date): string {
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
}

export function formatTime(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export function formatDateTime(date: Date): string {
  return `${formatShortDate(date)} ${formatTime(date)}`;
}
