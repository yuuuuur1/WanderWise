//記事詳細ページ（編集削除）
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getArticle, deleteArticle } from "@/utils/supabasweFunctions"; // 必要な関数をインポート
import { Article } from "@/utils/interface"; // 型をインポート
import { FaTrash, FaEdit } from "react-icons/fa"; // アイコンをインポート

const ArticleDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id || typeof id !== "string") return;

      try {
        const data = await getArticle(Number(id));
        setArticle(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleDelete = async () => {
    if (!id || typeof id !== "string") return;

    const confirmDelete = window.confirm("本当に削除しますか？");
    if (!confirmDelete) return;

    try {
      await deleteArticle(Number(id)); // 削除関数を実行
      alert("削除されました。");
      router.push("/"); // ホームページにリダイレクト
    } catch (error) {
      console.error("削除エラー:", error);
      alert("削除に失敗しました。");
    }
  };

  const handleEdit = () => {
    if (!id) return;
    router.push(`/edit/${id}`); // 編集ページにリダイレクト
  };

  if (loading) return <p>Loading...</p>;
  if (!article) return <p>Not found</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">{article.title}</h1>
      <p className="text-gray-600 mb-2">location: {article.location}</p>
      <p className="text-gray-600 mb-2">date: {article.date}</p>
      <p className="text-gray-600 mb-4">{article.content}</p>

      <div className="flex space-x-4 justify-center mt-6">
        {/* 編集ボタン */}
        <button
          className="flex items-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          onClick={handleEdit}
        >
          <FaEdit className="mr-2" />
          Edit
        </button>

        {/* 削除ボタン */}
        <button
          className="flex items-center bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          onClick={handleDelete}
        >
          <FaTrash className="mr-2" />
          Delete
        </button>

        {/* 一覧に戻るボタン */}
        <button
          className="flex items-center bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          onClick={() => router.push("/")}
        >
          Return to list
        </button>
      </div>
    </div>
  );
};

export default ArticleDetail;
