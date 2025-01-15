import { title } from "process"
import {supabase} from "../utils/supabase"
import { Todo } from "./interface"
import { Article } from "./interface";

export const getAllTodos = async () => {
    const {data,error}  = await supabase
    .from('todo')
    .select('*')
    .order('updated_at',{ascending:false})
    
    if(error){
        console.error(error)
        throw error
    }
    return data
}

export const addTodo = async ({
  title,
  location,
  dateString,
  content,
  image_url,
}: {
  title: string;
  location: string;
  dateString: string; 
  content: string;
  image_url: string | null;
}) => {
  try {
    console.log({ title, location, dateString }); // ログ出力
    const { error } = await supabase.from("todo").insert({
      title,
      location,
      date: dateString, 
      content,
      image_url,
    });

    if (error) {
      console.error("Error adding todo:", error.message);
      throw error;
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
};

// 特定のIDに基づいて記事を取得する
export const getArticle = async (id: number): Promise<Article | null> => {
  try {
    const { data, error } = await supabase
      .from("todo") // 使用するテーブル名
      .select("*") // 必要な列をすべて取得
      .eq("id", id) // 特定のIDに基づくフィルタリング
      .single(); // 一意の結果を期待

    if (error) {
      console.error("Error fetching article:", error.message);
      throw error;
    }

    return data as Article; // 型アサーションでArticle型を明示
  } catch (error) {
    console.error("Unexpected error:", error);
    return null; // 取得失敗時はnullを返す
  }
};

export const deleteArticle = async (id: number) => {
  await supabase.from("todo").delete().eq("id", id);
};

export const updateArticle = async (
  id: number,
  updatedData: Partial<Article>
) => {
  const { error } = await supabase
    .from("todo") 
    .update(updatedData)
    .eq("id", id);

  if (error) {
    console.error(error);
    throw error;
  }
};