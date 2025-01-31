"use client";

import React, { useEffect, useState } from "react";
import TodoList from "./TodoList";
import { getAllTodos } from "@/utils/supabasweFunctions";
import Link from "next/link"; // Linkをインポート
import { Todo } from "@/utils/interface";

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const getTodos = async () => {
      const todos = await getAllTodos();
      setTodos(todos);
    };
    getTodos();
  }, []);

  return (
    <section className="bg-gray-100 min-h-screen flex flex-col items-center justify-center py-10 px-6">
      {/* タイトル */}
      <h3 className="text-4xl font-bold text-gray-800 mb-6">Wander Wise</h3>

      {/* ナビゲーションリンク */}
      <div className="mb-4">
        <Link
          href="/create"
          className="bg-gray-800 hover:bg-gray-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Pin Your Next Spot
        </Link>
      </div>

      {/* Todoリスト */}
      <TodoList todos={todos} setTodos={setTodos} />
    </section>
  );
};

export default TodoApp;
