export type PlcCandidate = {
  id: string;
  title: string;
  occurredAt: Date;
  recoveredAt: Date;
};

export type PlcFetchStatus = 'idle' | 'loading' | 'error';

function minutesBefore(base: Date, minutes: number): Date {
  return new Date(base.getTime() - minutes * 60_000);
}

// 設備ごとのモック異常履歴（デモ用の固定データ）。
// ここに定義の無い設備で「取得」すると、取得エラー状態を再現できる。
const MOCK_EQUIPMENT_HISTORY: Record<
  string,
  { title: string; startMinutesAgo: number; durationMinutes: number }[]
> = {
  包餡機: [
    {
      title: '成形ライン異常発生中',
      startMinutesAgo: 130,
      durationMinutes: 25.5,
    },
    {
      title: 'モールド排出装置1異常発生',
      startMinutesAgo: 260,
      durationMinutes: 0.2,
    },
    {
      title: 'ピック最終検査カメラコントローラ異常（XG_1）',
      startMinutesAgo: 400,
      durationMinutes: 0.2,
    },
  ],
  シール機: [
    { title: 'シール温度異常検知', startMinutesAgo: 90, durationMinutes: 4 },
    {
      title: 'フィルム送り軸異常停止',
      startMinutesAgo: 200,
      durationMinutes: 1.5,
    },
  ],
  コンベア: [
    { title: 'コンベア過負荷停止', startMinutesAgo: 60, durationMinutes: 3.2 },
    {
      title: 'インバーター周波数16 手前側ポンプフィーダ',
      startMinutesAgo: 150,
      durationMinutes: 0.2,
    },
  ],
};

function buildCandidates(
  equipment: string,
  defs: { title: string; startMinutesAgo: number; durationMinutes: number }[],
  now: Date
): PlcCandidate[] {
  return defs.map((def, index) => {
    const occurredAt = minutesBefore(now, def.startMinutesAgo);
    const recoveredAt = new Date(
      occurredAt.getTime() + def.durationMinutes * 60_000
    );
    return {
      id: `plc-${equipment}-${index}`,
      title: def.title,
      occurredAt,
      recoveredAt,
    };
  });
}

/** 対象設備のPLC異常履歴を取得する（モック）。定義が無い設備は null（＝取得エラー）を返す。 */
export function fetchPlcCandidates(
  equipment: string,
  now: Date
): PlcCandidate[] | null {
  const defs = MOCK_EQUIPMENT_HISTORY[equipment];
  if (!defs) {
    return null;
  }
  return buildCandidates(equipment, defs, now);
}

/** 「履歴から選択」モーダル用に、全設備分の履歴をまとめて返す。 */
export function fetchAllPlcHistory(now: Date): PlcCandidate[] {
  return Object.entries(MOCK_EQUIPMENT_HISTORY).flatMap(([equipment, defs]) =>
    buildCandidates(equipment, defs, now)
  );
}

export function plcDurationMinutes(candidate: PlcCandidate): number {
  return (
    Math.round(
      ((candidate.recoveredAt.getTime() - candidate.occurredAt.getTime()) /
        60_000) *
        10
    ) / 10
  );
}

export function formatPlcDateTime(date: Date): string {
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${String(
    date.getHours()
  ).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

/** ミリ秒差を「◯日◯時間◯分」形式に整形する。 */
export function formatDurationJa(ms: number): string {
  const totalMinutes = Math.max(0, Math.round(ms / 60_000));
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) {
    return `${days}日${hours}時間${minutes}分`;
  }
  if (hours > 0) {
    return `${hours}時間${minutes}分`;
  }
  return `${minutes}分`;
}
