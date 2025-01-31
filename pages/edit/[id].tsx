import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getArticle, updateArticle } from "@/utils/supabasweFunctions";
import { supabase } from "@/utils/supabase";
import { Article } from "@/utils/interface";
import Image from "next/image";

const EditArticle = () => {
  const router = useRouter();
  const { id } = router.query;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState<string | null>(null); // 型をstring | nullに変更

  // 記事データを取得
  useEffect(() => {
    const fetchArticle = async () => {
      if (!id || typeof id !== "string") return;

      try {
        const data = await getArticle(Number(id));
        if (data) {
          setArticle(data);
          setTitle(data.title);
          setContent(data.content);
          setLocation(data.location);
          setDate(data.date);

          // image_urlがnullでない場合のみgetPublicUrlを呼び出す
          if (data.image_url) {
            const { data: urlData } = supabase.storage
              .from("articles")
              .getPublicUrl(data?.image_url);
            console.log(urlData);
            setImage(urlData.publicUrl); // 画像のURLをimageにセット
          }
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  // 保存処理
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || typeof id !== "string") return;

    setSaving(true);
    try {
      let imageUrl = article?.image_url || null;

      // 新しい画像が選択された場合
      if (file) {
        console.log(file.name);
        const filePath = `images/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("articles")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        imageUrl = filePath;
      }

      // 記事データを更新
      const updatedData = {
        title,
        content,
        location,
        date,
        image_url: imageUrl,
      };

      await updateArticle(Number(id), updatedData);
      alert("記事を更新しました！");
      router.push(`/article/${id}`); // 詳細ページへリダイレクト
    } catch (error) {
      console.error("Error updating article:", error);
      alert("記事の更新に失敗しました。");
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newFile = e.target.files[0];
      setFile(newFile);

      // FileReaderを使って画像のURLを生成
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string); // 生成したURLをimageにセット
      };
      reader.readAsDataURL(newFile); // 画像ファイルを読み込む
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!article) return <p>Not found</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">Edit</h1>
      <form onSubmit={handleSave}>
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
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500"
          />
          {image && ( // imageを使って表示
            <Image
              src={image} // 修正: srcにimageを設定
              // src={file}
              alt={article.title}
              className="mt-4 w-full max-h-64 object-cover rounded"
            />
          )}
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            disabled={saving}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => router.push(`/article/${id}`)}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditArticle;
