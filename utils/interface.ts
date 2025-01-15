// Todo の基本インターフェース
export interface Todo {
    id: number; // 一意のID
    title: string; // タイトル
    location: string; // 場所
    date: string; // 日付
  }
  
  // Todo を拡張して Article を定義
  export interface Article extends Todo {
    content: string; // 詳細
    image_url: string | null; // 画像URL
  }
  