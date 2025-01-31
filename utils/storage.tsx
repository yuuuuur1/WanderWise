import { supabase } from "../utils/supabase";

type UploadStorage = {
  folder: FileList; // FileListに変更
  bucketName: string;
};

type UploadPathname = {
  path: string;
};

export const uploadStorage = async ({
  folder,
  bucketName,
}: UploadStorage): Promise<UploadPathname> => {
  const file = folder.item(0); // 1ファイルアップロード

  // fileがnullでないことを確認
  if (!file) {
    throw new Error("No file selected for upload."); // エラーメッセージを投げる
  }

  const pathName = `images/${file.name}`; // パス名の設定
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(pathName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  return {
    path: data?.path ?? null,
  };
};
