import { title } from "process"
import {supabase} from "../utils/supabase"
import { Todo } from "./interface"

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


export const deleteTodo = async (id:number) => {
    await supabase.from('todo').delete()
    .eq('id', id)
}

export const updateTodo = async (id: number, updatedData: Partial<Todo>) => {
    const { error } = await supabase
      .from("todo")
      .update(updatedData)
      .eq("id", id);
  
    if (error) {
      console.error(error);
      throw error;
    }
  };
  