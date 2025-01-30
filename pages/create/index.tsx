//記事作成ページ
import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabase"; // Supabaseの設定ファイルをインポート
import { uploadStorage } from "@/utils/storage";

const CreateArticle = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [file, setFile] = useState<FileList | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // 画像プレビュー用
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList[0]) {
      setFile(fileList);
      setPreviewUrl(URL.createObjectURL(fileList[0])); // プレビュー用のURLをセット
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let filePath = null;
      if (file && file.length > 0) {
        filePath = `images/${file[0].name}`;
      }

      // 記事データを保存
      const { data, error } = await supabase
        .from("todo")
        .insert({
          title,
          content,
          location,
          date,
          image_url: filePath,
        })
        .select("id");

      if (error) throw error;

      if (data && data.length > 0) {
        const newArticleId = data[0].id;
        router.push(`/article/${newArticleId}`);
      }
    } catch (error) {
      console.error("Error creating article:", error);
    } finally {
      setLoading(false);
    }
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
            Location
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
            Content
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
            Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500"
          />
          {/* プレビュー画像の表示 */}
          {previewUrl && (
            <div className="mt-4">
              <p className="text-gray-600 text-sm">Preview:</p>
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full max-h-64 object-cover rounded"
              />
            </div>
          )}
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
            onClick={() => router.push("/")}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateArticle;
