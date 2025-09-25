import React from "react";

function App() {
  const [todos, setTodos] = React.useState([]);
  const [input, setInput] = React.useState("");

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
      setInput("");
    }
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      })
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-sky-200 to-sky-700 p-4">
      <div className="bg-white shadow-lg rounded-3xl p-8 max-w-md w-full">

        <h1 className="text-3xl font-medium text-center mb-6 text-gray-900">Tugas Saya</h1>

        <div className="mb-4 flex items-center space-x-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Tambahkan tugas baru..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300"
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          />
          <button
            onClick={addTodo}
            className="bg-sky-600 text-white w-12 h-12 rounded-full text-2xl hover:bg-sky-700 active:scale-95 transition-all duration-200 shadow-md flex items-center justify-center"
          >
            +
          </button>
        </div>

        <ul className="space-y-4">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="bg-gray-100 p-4 rounded-xl flex justify-between items-center transition-all duration-300 transform hover:scale-[1.02]"
            >
              <div className="flex items-center flex-grow">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id)}
                  className="mr-3 w-5 h-5 text-sky-600 bg-gray-200 rounded-full border-gray-300 focus:ring-sky-500 cursor-pointer"
                />
                <span
                  className={`flex-grow text-gray-800 transition-all duration-300 ${todo.completed ? "line-through text-gray-500" : ""}`}
                >
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="ml-2 border-none text-red-500 text-lg hover:text-red-700 active:scale-95 transition-all duration-200"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        {todos.length === 0 && (
          <p className="text-center text-gray-400 mt-8">
            Belum ada tugas. Tambahkan tugas baru di atas!
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
