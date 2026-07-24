import {
  Eye,
  Lightbulb,
  type LucideIcon,
  Music,
  Scale,
  Vibrate,
  Wind,
} from 'lucide-react';
import type { InsightCategory } from '@/lib/insight-data';

// 気付きカテゴリ → アイコン（記録フォームと一覧で共通利用）
export const categoryIcons: Record<InsightCategory, LucideIcon> = {
  振動: Vibrate,
  匂い: Wind,
  '量・重さ': Scale,
  見た目: Eye,
  音: Music,
  その他: Lightbulb,
};
