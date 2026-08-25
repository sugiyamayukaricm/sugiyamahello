import factoryImg from '@/assets/insight/factory.png';
import { equipmentOptions, type InsightPhoto } from '@/lib/insight-data';
import type { PlcCandidate } from '@/lib/plc-data';

export { equipmentOptions };

export const authorOptions = ['六手山', '露手川', '田中', '班長'];

export type KnowledgeRecord = {
  id: string;
  title: string; // 症状名（例: ガリンガリンという異音・製品の振れ）
  equipment: string;
  symptom: string; // 症状・確認ポイント
  cause: string; // 原因と対応
  duration: string; // かかった時間
  pastCases: string; // 過去の実績例
  photos: InsightPhoto[];
  author: string;
  createdAt: string;
  updatedAt: string;
  // PLC連携（設備異常履歴関連付け）
  plcCandidates: PlcCandidate[]; // 取得済みの候補一覧（選択中も含む）
  selectedPlcId: string | null; // 関連付けた候補のid（未選択はnull）
  /** 気付き〜ナレッジのタイムラインの起点（気付き記録の日時）。気付き由来でなければ null。 */
  insightAt: Date | null;
};

export type KnowledgeDraft = {
  title: string;
  equipment: string;
  symptom: string;
  cause: string;
  duration: string;
  pastCases: string;
  photos: InsightPhoto[];
  author: string;
  plcCandidates: PlcCandidate[];
  selectedPlcId: string | null;
  insightAt: Date | null;
};

export function createEmptyKnowledgeDraft(): KnowledgeDraft {
  return {
    title: '',
    equipment: '',
    symptom: '',
    cause: '',
    duration: '',
    pastCases: '',
    photos: [],
    author: '',
    plcCandidates: [],
    selectedPlcId: null,
    insightAt: null,
  };
}

export const initialKnowledge: KnowledgeRecord[] = [
  {
    id: 'knowledge-seed-1',
    title: 'ガリンガリンという異音・製品の振れ',
    equipment: '包餡機',
    symptom:
      'ガリンガリンという異音・製品の振れが起こった際の対処。ベアリングが擦れるような異音がする。製品（雪見だいふく）が振られてまっすぐ進まない。\n確認ポイント：駆動モーター下部に切り粉（金属の削りカス）が落ちていないか。振動は大きくないか。製品がトレーに正しく入っているか。',
    cause:
      'インクラ部分（リフティング機構）のカム、およびカムフォロワーの劣化・摩耗が考えられる。\n\n重量物のため無理に自分で分解せず、班長・保全担当に共有する。',
    duration: '約30分',
    pastCases: 'まだ実績はありません',
    photos: [
      { id: 'kp-1', url: factoryImg },
      { id: 'kp-2', url: factoryImg },
    ],
    author: 'プラントOP共有 六手山',
    createdAt: '2024/8/9 1:21',
    updatedAt: '2024/8/9 1:21',
    plcCandidates: [
      {
        id: 'plc-seed-1',
        title: '成形ライン異常発生中',
        occurredAt: new Date(2024, 7, 9, 0, 10),
        recoveredAt: new Date(2024, 7, 9, 0, 35),
      },
    ],
    selectedPlcId: 'plc-seed-1',
    insightAt: new Date(2024, 7, 8, 22, 40),
  },
  {
    id: 'knowledge-seed-2',
    title: 'シール不良（かみ込み）の切り分け',
    equipment: 'シール機',
    symptom:
      'シール部分にズレやかみ込みが見られる。確認ポイント：フィルムの蛇行、シール温度、テンションを確認する。',
    cause:
      'フィルムテンションのばらつき、またはシールバーの温度低下が原因のことが多い。温度・テンションを再調整し、改善しなければ保全担当へ。',
    duration: '約15分',
    pastCases: '前月に同様の事象あり。テンション調整で解消。',
    photos: [{ id: 'kp-3', url: factoryImg }],
    author: 'プラントOP共有 露手川',
    createdAt: '2024/8/8 22:10',
    updatedAt: '2024/8/8 22:10',
    plcCandidates: [],
    selectedPlcId: null,
    insightAt: null,
  },
];
