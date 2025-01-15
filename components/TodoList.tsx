import { Todo } from "@/utils/interface";
import {
  deleteTodo,
  getAllTodos,
  updateTodo,
} from "@/utils/supabasweFunctions";
import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<any>;
};

const TodoList = (props: Props) => {
  const { todos, setTodos } = props;
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");
  const [editLocation, setEditLocation] = useState<string>("");
  const [editDate, setEditDate] = useState<string>("");

  const handleDelete = async (id: number) => {
    await deleteTodo(id);
    let todos = await getAllTodos();
    setTodos(todos);
  };

  const handleEdit = (todo: Todo) => {
    setEditId(todo.id);
    setEditTitle(todo.title);
    setEditLocation(todo.location);
    setEditDate(todo.date);
  };

  const handleSave = async () => {
    if (!editId) return;

    await updateTodo(editId, {
      title: editTitle,
      location: editLocation,
      date: editDate,
    });

    let todos = await getAllTodos();
    setTodos(todos);
    setEditId(null);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {todos.map((todo) =>
        editId === todo.id ? (
          <div key={todo.id} className="bg-white shadow-lg rounded-lg p-4">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
            <button
              className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 mr-2"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600"
              onClick={() => setEditId(null)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div
            key={todo.id}
            className="bg-white shadow-lg rounded-lg p-4 transition-shadow duration-200 hover:shadow-xl"
          >
            <h4 className="font-bold text-lg mb-2 text-gray-800">
              {todo.title}
            </h4>
            <p className="text-sm text-gray-600">場所: {todo.location}</p>
            <p className="text-sm text-gray-600">日時: {todo.date}</p>
            <button
              className="mt-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 mr-2"
              onClick={() => handleEdit(todo)}
            >
              <FaEdit size={12} />
            </button>
            <button
              className="mt-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
              onClick={() => handleDelete(todo.id)}
            >
              <FaTrash size={12} />
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default TodoList;
