import { Todo } from "@/utils/interface";
import Link from "next/link";
import React from "react";

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<any>;
};

const TodoList = (props: Props) => {
  const { todos } = props;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className="bg-white shadow-lg rounded-lg p-4 transition-shadow duration-200 hover:shadow-xl"
        >
          <Link href={`/article/${todo.id}`}>
            <h4 className="font-bold text-lg mb-2 text-gray-800">
              {todo.title}
            </h4>
          </Link>
          <p className="text-sm text-gray-600">location: {todo.location}</p>
          <p className="text-sm text-gray-600">date: {todo.date}</p>
        </div>
      ))}
    </div>
  );
};

export default TodoList;
