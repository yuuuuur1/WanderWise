import "@/styles/globals.css";
import Header from "@/components/Header"; // ヘッダーをインポート
import { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      {/* ヘッダーを全体に適用 */}
      <Header />
      <main className="p-4">
        {/* 各ページのコンポーネント */}
        <Component {...pageProps} />
      </main>
    </div>
  );
}
