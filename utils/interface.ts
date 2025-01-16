  //Todo: リスト表示や軽量な操作（基本タスク管理）に使用。
export interface Todo {
    id: number; // 一意のID
    title: string; // タイトル
    location: string; // 場所
    date: string; // 日付
  }
  
  // Todo を拡張して Article を定義
  //Article: 記事の詳細ページや編集ページなど、フルデータが必要な場面で使用。
  //
  export interface Article extends Todo {
    content: string; // 詳細
    image_url: string | null; // 画像URL
  }
  