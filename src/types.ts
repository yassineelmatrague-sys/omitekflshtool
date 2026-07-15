export type ToolId = 'json' | 'base64' | 'regex' | 'jwt' | 'hash' | 'sql';

export interface Tool {
  id: ToolId;
  nameEn: string;
  nameAr: string;
  icon: string;
  descriptionEn: string;
  descriptionAr: string;
  category: 'data' | 'encoder' | 'security' | 'text';
}

export type Language = 'en' | 'ar';

export interface HistoryItem {
  id: string;
  toolId: ToolId;
  timestamp: number;
  input: string;
  output?: string;
  label?: string;
}
