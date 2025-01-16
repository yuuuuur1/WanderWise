//記事作成ページ
import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabase"; // Supabaseの設定ファイルをインポート
import { uploadStorage } from "@/utils/storage";

const CreateArticle = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState(""); // 場所を管理するstate
  const [date, setDate] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [path, setPathName] = useState<string | undefined>();
  const handleUploadStorage = async (folder: any | null) => {
    if (!folder || !folder.length) return;
    const { path } = await uploadStorage({
      folder,
      bucketName: "articles",
    });
    const { data } = supabase.storage.from("articles").getPublicUrl(path);
    if (path) setPathName(data.publicUrl);
    console.log(path);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = null;

      // 画像アップロード
      if (image) {
        const { data, error } = await supabase.storage
          .from("articles") // 作成したストレージバケット名
          .upload(`images/${Date.now()}_${image.name}`, image);

        if (error) throw error;

        imageUrl = data?.path;
      }

      // 記事データを保存
      const { data, error } = await supabase
        .from("todo")
        .insert({
          title,
          content,
          location,
          date,
          image_url: imageUrl,
        })
        .select("id"); // IDを取得

      if (error) throw error;

      if (data && data.length > 0) {
        const newArticleId = data[0].id;
        router.push(`/article/${newArticleId}`); // 記事詳細ページにリダイレクト
      }
    } catch (error) {
      console.error("Error creating article:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/"); // 一覧ページにリダイレクト
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">New Spot</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            location
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)} // stringのままセット
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => {
              const fileList = e.target?.files;
              console.log(fileList);
              handleUploadStorage(fileList);
            }}
            className="mt-1 block w-full text-sm text-gray-500"
          />
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {loading ? "Saving..." : "Create"}
          </button>
          <button
            type="button"
            onClick={handleBack}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateArticle;
