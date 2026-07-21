export const machines = [
  { id: 1, name: '包餡機', area: '雪見ライン', icon: '🍡' },
  { id: 2, name: 'シール機', area: '雪見ライン', icon: '📦' },
  { id: 3, name: 'ウェイトチェッカー', area: '検査ライン', icon: '⚖️' },
  { id: 4, name: '金属探知機', area: '検査ライン', icon: '🔍' },
  { id: 5, name: 'コンベア', area: '搬送ライン', icon: '➡️' },
  { id: 6, name: '印字装置', area: '仕上げライン', icon: '🖨️' },
] as const;

export type Machine = (typeof machines)[number];

export type Step = {
  label: string;
  title: string;
  detail: string;
  media: string | null;
};

export type NormalKnowledge = {
  id: string;
  icon: string;
  title: string;
  steps: Step[];
};

export const normalKnowledge: NormalKnowledge[] = [
  {
    id: 'nk1',
    icon: '👁️',
    title: '起動・準備チェック',
    steps: [
      {
        label: '保護具確認',
        title: '保護具の着用を確認してください',
        detail:
          '帽子・マスク・手袋・作業着を着用してください。\n衛生管理のため、手洗い・アルコール消毒を行ってください。',
        media: null,
      },
      {
        label: '殺菌水確認',
        title: '殺菌水が正常に出ているか確認してください',
        detail:
          'フロアの蛇口・ホースから殺菌水が正常に出ていることを確認します。\n出ていない場合はすぐに班長に連絡してください。',
        media: null,
      },
      {
        label: 'カバー確認',
        title: '各ラインのカバー・ネジを目視確認してください',
        detail:
          'カバーの割れ・ネジの脱落がないか確認します。\n異常があれば作業を開始せず班長に報告してください。',
        media: null,
      },
      {
        label: '診断確認',
        title: '各設備の診断・動作確認を行ってください',
        detail:
          'チェックリストに従い、設備ごとの診断動作確認を行います。\n確認後、日報のチェック項目に記録してください。',
        media: null,
      },
    ],
  },
  {
    id: 'nk2',
    icon: '🔄',
    title: '安定稼働の巡回',
    steps: [
      {
        label: 'ライン巡回',
        title: 'ライン全体を見て回ってください',
        detail:
          'まずライン全体をひと通り歩いて、異常がないか目視で確認します。\n「いつもと違う」感覚を大切にしてください。',
        media: null,
      },
      {
        label: 'ラップ確認',
        title: 'ラップ量を確認してください',
        detail:
          'ラップ量が適正範囲内であることを確認します。\n基準値から外れている場合は調整してください。',
        media: null,
      },
      {
        label: 'オイル確認',
        title: 'オイルスプレーの状態を確認してください',
        detail:
          'オイルスプレーが正常に出ていることを確認します。\n出ていない場合はすぐに補充・対処が必要です。',
        media: null,
      },
      {
        label: '包餡機確認',
        title: '包餡機の動きを目視・音で確認してください',
        detail:
          '包餡機の動きを目視で確認し、異音・焦げ付き臭がないかチェックします。\n「いつもと違う音」がする場合は停止して班長に報告してください。',
        media: null,
      },
      {
        label: '重量確認',
        title: 'ウェイトチェッカーで重量を確認してください',
        detail:
          'ウェイトチェッカーの表示を確認します。目安は10秒に1回のペースで目視してください。\nロス率が基準を超えている場合はすぐに対処してください。',
        media: null,
      },
    ],
  },
  {
    id: 'nk3',
    icon: '⚖️',
    title: '重量管理',
    steps: [
      {
        label: '基準確認',
        title: '重量の基準値を確認してください',
        detail: 'そのロットの重量基準値をチェックリストで確認します。',
        media: null,
      },
      {
        label: '目視確認',
        title: 'ウェイトチェッカーの表示を確認してください',
        detail:
          '10秒に1回のペースでウェイトチェッカーの表示を目視します。\n基準値から外れた場合はすぐに調整してください。',
        media: null,
      },
      {
        label: 'ロス確認',
        title: 'ロス率を確認・記録してください',
        detail:
          'ロス率が基準内であることを確認し、日報に記録します。\n基準を超える場合は班長に報告してください。',
        media: null,
      },
    ],
  },
  {
    id: 'nk4',
    icon: '🌙',
    title: '終業前チェック',
    steps: [
      {
        label: 'フィルター',
        title: 'フィルターを取り出して異物確認をしてください',
        detail:
          '餅を送るためのフィルターを取り出し、異物が混入していないか確認します。\n必ず退社前に1回実施してください。',
        media: null,
      },
      {
        label: '包材用意',
        title: '次の番のための包材を用意してください',
        detail:
          'トレー・シール・ピックなど、次の担当者が使う包材を補充・用意します。',
        media: null,
      },
      {
        label: '部品確認',
        title: '交換が必要な部品を7階で確認してください',
        detail:
          '7階の部品庫に行き、夜勤帯で交換が必要な部品の在庫を確認します。\n必要な部品を取り出して現場に置いておきます。',
        media: null,
      },
      {
        label: '連絡ノート',
        title: '連絡ノートに今日の内容を記載してください',
        detail:
          '交換してほしい箇所・問題・トラブル内容を連絡ノートに記載します。\n班の共有チャットでリーダー陣にも共有してください。',
        media: null,
      },
    ],
  },
];

export type TroubleKnowledge = {
  id: string;
  icon: string;
  label: string;
  steps: Step[];
};

export const troubleKnowledge: TroubleKnowledge[] = [
  {
    id: 'tk1',
    icon: '🔊',
    label: '異音がする',
    steps: [
      {
        label: 'ライン停止',
        title: '製造ラインを停止してください',
        detail:
          '異音を確認したら、まずラインを停止します。\n停止時刻を必ず記録してください（⚠️2時間タイムリミットあり）。',
        media: null,
      },
      {
        label: '音の特定',
        title: '異音の場所・種類を特定してください',
        detail:
          'どの設備から、どんな音がするかを確認します。\n包餡機・コンベア・シール機・印字装置のどこか特定してください。',
        media: null,
      },
      {
        label: '目視確認',
        title: '異音箇所を目視で確認してください',
        detail:
          '焦げ付き・部品の摩耗・オイル切れがないか確認します。\n⚠️ 電源が切れていることを確認してから触れてください。',
        media: null,
      },
      {
        label: '班長報告',
        title: '状況を班長に報告してください',
        detail:
          '異音の原因・場所・停止時刻を班長に報告します。\n自分で判断できない場合はすぐに報告してください。',
        media: null,
      },
    ],
  },
  {
    id: 'tk2',
    icon: '🍡',
    label: '餅が詰まった・巻きついた',
    steps: [
      {
        label: 'ライン停止',
        title: '製造ラインを全停止してください',
        detail:
          '餅の詰まり・巻き付きを確認したらすぐにラインを全停止します。\n停止時刻を記録してください（⚠️2時間以内に復旧が必要）。',
        media: null,
      },
      {
        label: '状況確認',
        title: '詰まり・巻き付き箇所と範囲を確認してください',
        detail:
          'コンベアのどこに餅が詰まっているか確認します。\n⚠️ 一人での対応は禁止です。必ずツーマンセルで対応してください。',
        media: null,
      },
      {
        label: '分解洗浄',
        title: '汚れた部分を分解・洗浄してください',
        detail:
          '機械の理解がある人と一緒に分解します。\n洗浄後、異物が残っていないか確認してください。',
        media: null,
      },
      {
        label: '復旧確認',
        title: 'きれいな状態に戻して動作確認してください',
        detail:
          '組み立て後、単独動作確認を行います。\n正常に動いたら系外排出品を戻して生産再開します。',
        media: null,
      },
      {
        label: '班長報告',
        title: '復旧完了を班長に報告してください',
        detail:
          '復旧完了・停止時間・原因を班長に報告します。\n1時間以上の停止の場合は長時間停止報告が必要です。',
        media: null,
      },
    ],
  },
  {
    id: 'tk3',
    icon: '⚙️',
    label: 'シリンダー動作不良',
    steps: [
      {
        label: '表示確認',
        title: 'HMIの表示を確認してください',
        detail:
          'HMIのエラー表示内容を確認します。\n停止時刻を記録してください（⚠️2時間以内の復旧が必要）。',
        media: null,
      },
      {
        label: '全停止',
        title: '製造ラインを全停止してください',
        detail:
          'シール機上で異常が発生している場合、製造ライン全体を止めます。\n10分以上の停止になるときはインクラシャッターをおろします。',
        media: null,
      },
      {
        label: '原因判断',
        title: 'シリンダー不良かエアー漏れかを判断してください',
        detail:
          'センサーを確認し、シリンダー本体の問題かエアー漏れかを切り分けます。\n判断できない場合は班長・技術課に連絡してください。',
        media: null,
      },
      {
        label: '部品確認',
        title: '7階で交換部品の在庫を確認してください',
        detail:
          '7階の部品庫に行き、必要なシリンダー・部品の在庫を確認します。\n部品ファイルも確認してください。',
        media: null,
      },
      {
        label: '交換',
        title: 'シリンダーを交換してください',
        detail:
          '交換手順に従ってシリンダーを交換します。\n⚠️ 必ず電源を切ってから作業してください。',
        media: null,
      },
      {
        label: '動作確認',
        title: '単独動作確認をしてください',
        detail:
          '交換後、単独動作確認を行います。\n正常に動いたら系外排出品を戻して生産準備をします。',
        media: null,
      },
      {
        label: '班長報告',
        title: '復旧完了を班長に報告してください',
        detail:
          '停止時間・交換部品・復旧内容を班長に報告します。\n規格外品が出た場合は別途報告が必要です。',
        media: null,
      },
    ],
  },
  {
    id: 'tk4',
    icon: '💨',
    label: 'エアー漏れ',
    steps: [
      {
        label: '漏れ確認',
        title: 'エアー漏れの箇所を特定してください',
        detail:
          '音や目視でエアー漏れ箇所を特定します。\n停止時刻を記録してください。',
        media: null,
      },
      {
        label: '停止判断',
        title: 'ライン停止が必要か判断してください',
        detail:
          'エアー漏れの程度によってライン停止が必要か判断します。\n判断できない場合はすぐに班長に相談してください。',
        media: null,
      },
      {
        label: '班長報告',
        title: '状況を班長に報告してください',
        detail: '漏れ箇所・程度・停止有無を班長に報告します。',
        media: null,
      },
    ],
  },
  {
    id: 'tk5',
    icon: '⚖️',
    label: '重量異常',
    steps: [
      {
        label: '数値確認',
        title: 'ウェイトチェッカーの数値を確認してください',
        detail:
          '基準値からどれだけ外れているか数値を確認します。\n規格外品が出ていないか確認してください。',
        media: null,
      },
      {
        label: '原因確認',
        title: '重量異常の原因を確認してください',
        detail: '包餡機の設定・材料の状態・ラップ量を確認します。',
        media: null,
      },
      {
        label: '調整',
        title: '設定を調整してください',
        detail:
          '原因に応じて調整を行います。\n調整後も異常が続く場合は班長に報告してください。',
        media: null,
      },
      {
        label: '記録',
        title: '日報に記録してください',
        detail:
          '重量異常の内容・対処内容を充填日報に記録します。\n規格外品が出た場合はリーダー・班長・主任に電話連絡が必要です。',
        media: null,
      },
    ],
  },
  {
    id: 'tk6',
    icon: '🛑',
    label: 'ライン停止（原因不明）',
    steps: [
      {
        label: '停止確認',
        title: '停止時刻と状況を確認してください',
        detail:
          '停止時刻を生産管理板に記録します（⚠️2時間タイムリミット）。\nHMIのエラー表示を確認してください。',
        media: null,
      },
      {
        label: '緊急判断',
        title: '緊急度を判断してください',
        detail:
          '短時間で復旧できるか、班長・技術課への連絡が必要かを判断します。\n判断できない場合はすぐに班長に連絡してください。',
        media: null,
      },
      {
        label: '班長報告',
        title: '班長に連絡してください',
        detail:
          '停止時刻・エラー表示内容・状況を班長に報告します。\n1時間以上になりそうな場合は早めに長時間停止の報告をしてください。',
        media: null,
      },
    ],
  },
  {
    id: 'tk7',
    icon: '🔧',
    label: 'リフティング動作不良',
    steps: [
      {
        label: '停止確認',
        title: 'ラインを停止して停止時刻を記録してください',
        detail:
          'リフティング動作不良を確認したらラインを停止します。\n停止時刻を生産管理板に記録してください（⚠️2時間タイムリミット）。',
        media: null,
      },
      {
        label: '動作確認',
        title: 'リフティング機構を目視で確認してください',
        detail:
          'リフティング部の動作・センサー・エアー供給を確認します。\n⚠️ 電源を切ってから確認してください。',
        media: null,
      },
      {
        label: '原因判断',
        title: 'センサー異常かメカ不良かを判断してください',
        detail:
          'センサーのランプ状態を確認し、センサー異常かメカ的な不良かを切り分けます。\n判断できない場合は技術課に連絡してください（日勤帯のみ対応可）。',
        media: null,
      },
      {
        label: '部品確認',
        title: '必要な部品を7階で確認してください',
        detail: '7階の部品庫で交換部品の在庫を確認します。',
        media: null,
      },
      {
        label: '復旧・確認',
        title: '復旧後、単独動作確認をしてください',
        detail:
          '修理・交換後に単独動作確認を行います。\n正常確認後、生産再開してください。',
        media: null,
      },
      {
        label: '班長報告',
        title: '復旧完了を班長に報告してください',
        detail:
          '停止時間・原因・対処内容を班長に報告します。\n充填日報の停止時間帯欄に記録してください。',
        media: null,
      },
    ],
  },
  {
    id: 'tk8',
    icon: '🔩',
    label: '仮シール動作異常',
    steps: [
      {
        label: '停止確認',
        title: 'ラインを停止して停止時刻を記録してください',
        detail:
          '仮シールの動作異常を確認したらラインを停止します。\n停止時刻を生産管理板に記録してください（⚠️2時間タイムリミット）。',
        media: null,
      },
      {
        label: '動作確認',
        title: '仮シール機構を目視で確認してください',
        detail:
          '仮シールの下降動作・センサー・エアー供給を確認します。\nシール圧着状態も合わせて確認してください。',
        media: null,
      },
      {
        label: '原因判断',
        title: 'センサー異常かメカ不良かを判断してください',
        detail:
          'センサーのランプ状態を確認し、原因を切り分けます。\n判断できない場合は技術課に連絡してください（日勤帯のみ対応可）。',
        media: null,
      },
      {
        label: '調整・交換',
        title: '調整または部品交換を行ってください',
        detail:
          '原因に応じて調整または部品交換を行います。\n⚠️ 必ず電源を切ってから作業してください。',
        media: null,
      },
      {
        label: '動作確認',
        title: '単独動作確認をしてください',
        detail:
          '修理後、単独動作確認を行います。\nシール圧着状態が正常であることを確認してから生産再開してください。',
        media: null,
      },
      {
        label: '班長報告',
        title: '復旧完了を班長に報告してください',
        detail:
          '停止時間・原因・対処内容を班長に報告します。\n充填日報の停止時間帯欄に記録してください。',
        media: null,
      },
    ],
  },
];

export type FaqItem = {
  id: string;
  text: string;
};

export const initialFaqItems: FaqItem[] = [
  { id: 'fq1', text: '異音がしたときはどうすればいい？' },
  { id: 'fq2', text: '餅がコンベアに巻きついたらどうする？' },
  { id: 'fq3', text: 'シリンダーが動かないときの確認ポイントは？' },
  { id: 'fq4', text: '2時間タイムリミットとは何ですか？' },
  { id: 'fq5', text: 'エアー漏れを発見したらどうする？' },
  { id: 'fq6', text: '重量異常が出たときの対処は？' },
  { id: 'fq7', text: 'ラインを止める判断基準は？' },
  { id: 'fq8', text: '夜勤帯に技術課がいない時はどうする？' },
  { id: 'fq9', text: 'フィルターチェックはいつやればいい？' },
  { id: 'fq10', text: '規格外品が出たとき誰に連絡する？' },
];

export type MemoItem = {
  id: number;
  date: string;
  text: string;
};

export const initialMemoList: MemoItem[] = [
  {
    id: 1,
    date: '2026/06/12 14:23',
    text: '包餡機のモーター音が少しいつもより高い気がする。まだ異常ではないが様子を見る必要がある。',
  },
  {
    id: 2,
    date: '2026/06/12 11:05',
    text: '今日のロット、餅の手触りが微妙に違う。重量ばらつきが出やすいかもしれない。',
  },
  {
    id: 3,
    date: '2026/06/11 16:30',
    text: '後輩が手順③と④を混同しやすい。次回指導時に重点的に確認する。',
  },
  {
    id: 4,
    date: '2026/06/11 13:15',
    text: 'コンベアの振動が先週より少し強くなった気がする。次回点検時に確認予定。',
  },
  {
    id: 5,
    date: '2026/06/10 15:48',
    text: '湿度が高い日は包餡機の調整値を少し変えたほうがいい。今日も微調整で対応した。',
  },
];

export type TroubleRecord = {
  equipment: string;
  reason: string;
  startTime: string;
  endTime: string;
  minutes: number;
};

export type ReportItem = {
  id: string;
  date: string;
  shift: string;
  operator: string;
  line: string;
  machine: string;
  troubles: TroubleRecord[];
  qualityAbnormal: boolean | 'あり' | 'なし';
  qualityNote: string;
  handover: string;
  status: string;
};

export const initialReportList: ReportItem[] = [
  {
    id: 'r1',
    date: '2026/06/12',
    shift: '早番',
    operator: '松田',
    line: '雪見2号ライン',
    machine: '包餡機',
    troubles: [
      {
        equipment: '包餡機 1号',
        reason: 'リフティング動作不良',
        startTime: '11:45',
        endTime: '13:15',
        minutes: 90,
      },
      {
        equipment: 'シール機入口C/V',
        reason: '仮シール下降動作異常',
        startTime: '14:55',
        endTime: '15:05',
        minutes: 10,
      },
    ],
    qualityAbnormal: true,
    qualityNote: 'シール圧着にばらつきあり。早番帯に発生。要確認。',
    handover:
      '包餡機1号のリフティング動作、明日も様子を見てほしい。部品交換済みだが念のため。',
    status: '要注意・様子見が必要',
  },
  {
    id: 'r2',
    date: '2026/06/11',
    shift: '遅番',
    operator: '山崎',
    line: '雪見2号ライン',
    machine: 'シール機',
    troubles: [],
    qualityAbnormal: false,
    qualityNote: '',
    handover: '特になし。通常稼働。',
    status: '問題なし・通常稼働中',
  },
];

export type HistoryItem = {
  id: number;
  symptom: string;
  lastDate: string;
  count: string;
  period: string;
};

export const historyData: HistoryItem[] = [
  {
    id: 1,
    symptom: '異音がする',
    lastDate: '2025/05/25',
    count: '5件',
    period: '12か月',
  },
  {
    id: 2,
    symptom: '餅が詰まった・巻きついた',
    lastDate: '2025/05/20',
    count: '2件',
    period: '6か月',
  },
  {
    id: 3,
    symptom: 'シリンダー動作不良',
    lastDate: '2025/05/18',
    count: '8件',
    period: '12か月',
  },
  {
    id: 4,
    symptom: '重量異常',
    lastDate: '2025/05/15',
    count: '1件',
    period: '3か月',
  },
  {
    id: 5,
    symptom: 'ライン停止（原因不明）',
    lastDate: '2025/05/10',
    count: '3件',
    period: '12か月',
  },
  {
    id: 6,
    symptom: '異音がする',
    lastDate: '2025/05/08',
    count: '2件',
    period: '6か月',
  },
  {
    id: 7,
    symptom: 'エアー漏れ',
    lastDate: '2025/05/05',
    count: '6件',
    period: '12か月',
  },
  {
    id: 8,
    symptom: '仮シール動作異常',
    lastDate: '2025/04/28',
    count: '1件',
    period: '3か月',
  },
  {
    id: 9,
    symptom: 'リフティング動作不良',
    lastDate: '2025/04/20',
    count: '4件',
    period: '12か月',
  },
  {
    id: 10,
    symptom: '重量異常',
    lastDate: '2025/04/15',
    count: '2件',
    period: '6か月',
  },
];

export const UNREAD_IDS = new Set([1, 2]);
