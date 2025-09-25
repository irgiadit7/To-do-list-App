import React, { useState, useEffect, useRef } from "react";

function App() {
  const [lists, setLists] = useState([
    {
      id: "tugas-saya",
      name: "Tugas Saya",
      todos: [
        {
          id: Date.now(),
          text: "Contoh Tugas",
          completed: false,
          details:
            "Ini adalah detail tugas dalam mode pengembangan. Anda bisa mengedit tampilan modal ini secara langsung tanpa perlu halaman memuat ulang.",
          date: "",
          time: "",
          subtasks: [{ id: 1, text: "Sub-tugas 1", completed: false }],
          priority: "high",
          isFavorite: true,
          createdAt: new Date(),
        },
      ],
    },
  ]);
  const [currentList, setCurrentList] = useState("tugas-saya");
  const [input, setInput] = useState("");
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isDevMode, setIsDevMode] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [sortOrder, setSortOrder] = useState("manual");
  const [showCompleted, setShowCompleted] = useState(true);

  const sortMenuRef = useRef(null);
  const optionsMenuRef = useRef(null);
  const scrollableNavRef = useRef(null);

  useEffect(() => {
    const savedDevMode = sessionStorage.getItem("isDevMode") === "true";
    if (savedDevMode) {
      setIsDevMode(true);
      const savedTodo = JSON.parse(sessionStorage.getItem("selectedTodo"));
      if (savedTodo) {
        setSelectedTodo(savedTodo);
        setShowModal(true);
      }
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
        setShowSortMenu(false);
      }
      if (
        optionsMenuRef.current &&
        !optionsMenuRef.current.contains(event.target)
      ) {
        setShowOptionsMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sortMenuRef, optionsMenuRef]);

  const addTodo = () => {
    // Pastikan ada list yang dipilih sebelum menambah todo
    if (input.trim() && currentList && currentList !== "favorites") {
      setLists((prevLists) =>
        prevLists.map((list) =>
          list.id === currentList
            ? {
                ...list,
                todos: [
                  ...(list.todos || []),
                  {
                    id: Date.now(),
                    text: input,
                    completed: false,
                    details: "",
                    date: "",
                    time: "",
                    subtasks: [],
                    priority: "normal",
                    isFavorite: false,
                    createdAt: new Date(),
                  },
                ],
              }
            : list
        )
      );
      setInput("");
    } else if (currentList === "favorites") {
        alert("Tidak bisa menambah tugas di daftar Favorit. Silakan pilih daftar lain.");
    }
  };

  const toggleComplete = (id) => {
    setLists((prevLists) =>
      prevLists.map((list) => ({
        ...list,
        todos: (list.todos || []).map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ),
      }))
    );
  };

  const deleteTodo = (id) => {
    setLists((prevLists) =>
      prevLists.map((list) => ({
        ...list,
        todos: (list.todos || []).filter((t) => t.id !== id),
      }))
    );
    setSelectedTodo(null);
    setShowModal(false);
    sessionStorage.removeItem("selectedTodo");
  };

  const openTodoDetails = (todo) => {
    setSelectedTodo(todo);
    setShowModal(true);
    if (isDevMode) {
      sessionStorage.setItem("selectedTodo", JSON.stringify(todo));
    }
  };

  const closeTodoDetails = () => {
    setSelectedTodo(null);
    setShowModal(false);
    if (isDevMode) {
      sessionStorage.removeItem("selectedTodo");
    }
  };

  const updateTodoDetails = (updatedFields) => {
    setLists((prevLists) =>
      prevLists.map((list) => ({
        ...list,
        todos: (list.todos || []).map((todo) =>
          todo.id === selectedTodo.id ? { ...todo, ...updatedFields } : todo
        ),
      }))
    );
    setSelectedTodo((prev) => ({ ...prev, ...updatedFields }));
    if (isDevMode) {
      sessionStorage.setItem(
        "selectedTodo",
        JSON.stringify({ ...selectedTodo, ...updatedFields })
      );
    }
  };

  const handleAddSubtask = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      const newSubtask = {
        id: Date.now(),
        text: e.target.value,
        completed: false,
      };
      updateTodoDetails({ subtasks: [...selectedTodo.subtasks, newSubtask] });
      e.target.value = "";
    }
  };

  const toggleSubtask = (subtaskId) => {
    const updatedSubtasks = selectedTodo.subtasks.map((subtask) =>
      subtask.id === subtaskId
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    );
    updateTodoDetails({ subtasks: updatedSubtasks });
  };

  const deleteSubtask = (subtaskId) => {
    const updatedSubtasks = selectedTodo.subtasks.filter(
      (subtask) => subtask.id !== subtaskId
    );
    updateTodoDetails({ subtasks: updatedSubtasks });
  };

  const toggleFavorite = (id) => {
    setLists((prevLists) =>
      prevLists.map((list) => ({
        ...list,
        todos: (list.todos || []).map((todo) =>
          todo.id === id ? { ...todo, isFavorite: !todo.isFavorite } : todo
        ),
      }))
    );
    if (selectedTodo && selectedTodo.id === id) {
      setSelectedTodo((prev) => ({ ...prev, isFavorite: !prev.isFavorite }));
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };

  const handleRenameList = () => {
    const newName = prompt(
      "Masukkan nama daftar baru:",
      lists.find((l) => l.id === currentList)?.name
    );
    if (newName && newName.trim()) {
      setLists((prevLists) =>
        prevLists.map((list) =>
          list.id === currentList ? { ...list, name: newName.trim() } : list
        )
      );
    }
    setShowOptionsMenu(false);
  };

  const handleDeleteCompleted = () => {
    setLists((prevLists) =>
      prevLists.map((list) => ({
        ...list,
        todos: (list.todos || []).filter((todo) => !todo.completed),
      }))
    );
    setShowOptionsMenu(false);
  };

  const addList = () => {
    const listName = prompt("Masukkan nama daftar baru:");
    if (listName && listName.trim()) {
      const newId = Date.now().toString();
      setLists((prevLists) => [
        ...prevLists,
        {
          id: newId,
          name: listName.trim(),
          todos: [],
        },
      ]);
      setCurrentList(newId);
    }
  };

  const getSortedTodos = () => {
    let todosToDisplay;
    if (currentList === "favorites") {
      todosToDisplay = lists
        .flatMap((list) => list.todos || [])
        .filter((todo) => todo.isFavorite && !todo.completed);
    } else {
      todosToDisplay = lists.find((list) => list.id === currentList)?.todos || [];
    }

    let sortedList = [...todosToDisplay];
    if (sortOrder === "date") {
      sortedList.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortOrder === "favorite") {
      sortedList.sort((a, b) => b.isFavorite - a.isFavorite);
    } else if (sortOrder === "title") {
      sortedList.sort((a, b) => a.text.localeCompare(b.text));
    }
    return sortedList;
  };

  const sortedTodos = getSortedTodos();
  const incompleteTodos = sortedTodos.filter((todo) => !todo.completed);
  const allCompletedTodos = lists
    .flatMap((list) => list.todos || [])
    .filter((todo) => todo.completed);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-sky-200 to-sky-700 p-4 font-sans relative">
      {/* PERUBAHAN: Tambah padding-bottom (pb-24) untuk mobile agar list tidak tertutup input bar
      */}
      <div className="bg-white shadow-lg rounded-3xl p-8 max-w-md w-full relative md:static pb-24 md:pb-8">
        {!showModal && (
          <>
            {/* PERUBAHAN: Hapus `overflow-hidden` dari container menu ini agar bisa di-scroll
            */}
            <div className="mb-6 flex items-end border-b-2 border-gray-200 relative">
              <div className="flex-none z-10 bg-white">
                <button
                  onClick={() => setCurrentList("favorites")}
                  className={`px-2 md:px-4 font-medium text-gray-900 pb-2 transition-all duration-300 relative group
                    ${currentList === "favorites" ? "text-sky-600" : ""}`}
                >
                  <span className="flex items-center justify-center text-yellow-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      className="bi bi-star-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                    </svg>
                  </span>
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-sky-500 transition-all duration-300 ${
                      currentList === "favorites" ? "w-full" : "w-0"
                    }`}
                  ></span>
                </button>
              </div>

              <div
                ref={scrollableNavRef}
                className="flex-grow flex-shrink-0 overflow-x-auto whitespace-nowrap scrollbar-hide flex"
              >
                {lists.map((list) => (
                  <button
                    key={list.id}
                    onClick={() => setCurrentList(list.id)}
                    className={`inline-block px-2 md:px-4 font-medium text-gray-900 pb-2 transition-all duration-300 relative group
                      ${currentList === list.id ? "text-sky-600" : ""}`}
                  >
                    {list.name}
                    <span
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-sky-500 transition-all duration-300 ${
                        currentList === list.id ? "w-full" : "w-0"
                      }`}
                    ></span>
                  </button>
                ))}
                <button
                  onClick={addList}
                  className={`inline-block px-2 md:px-4 font-medium text-gray-900 pb-2 transition-all duration-300 relative group`}
                >
                  + Daftar Baru
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-medium text-gray-900 truncate pr-2">
                {currentList === "favorites"
                  ? "Favorit"
                  : lists.find((l) => l.id === currentList)?.name}
              </h1>
              <div className="flex items-center space-x-2 relative flex-shrink-0">
                <div className="relative">
                  <button
                    onClick={() => setShowSortMenu(!showSortMenu)}
                    className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-arrow-down-up"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5m-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5"
                      />
                    </svg>
                  </button>
                  {showSortMenu && (
                    <div
                      ref={sortMenuRef}
                      className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20"
                    >
                      <button
                        onClick={() => {
                          setSortOrder("manual");
                          setShowSortMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Urutan yang saya buat
                      </button>
                      <button
                        onClick={() => {
                          setSortOrder("date");
                          setShowSortMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Tanggal
                      </button>
                      <button
                        onClick={() => {
                          setSortOrder("favorite");
                          setShowSortMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Baru saja dibintangi
                      </button>
                      <button
                        onClick={() => {
                          setSortOrder("title");
                          setShowSortMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Judul
                      </button>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                    className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-three-dots-vertical"
                      viewBox="0 0 16 16"
                    >
                      <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                    </svg>
                  </button>
                  {showOptionsMenu && (
                    <div
                      ref={optionsMenuRef}
                      className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20"
                    >
                      <button
                        onClick={handleRenameList}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Ganti Nama Daftar
                      </button>
                      <button
                        onClick={handleDeleteCompleted}
                        className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                      >
                        Hapus Semua Tugas Selesai
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="hidden md:flex mb-6 items-center space-x-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                type="text"
                placeholder="Tambahkan tugas baru..."
                className="flex-grow px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300 placeholder-gray-400 text-sm"
                onKeyDown={(e) => e.key === "Enter" && addTodo()}
                disabled={currentList === "favorites"}
              />
              <button
                onClick={addTodo}
                className="bg-sky-600 text-white w-12 h-12 rounded-full text-2xl hover:bg-sky-700 active:scale-95 transition-all duration-200 shadow-md flex items-center justify-center disabled:bg-gray-400"
                disabled={currentList === "favorites"}
              >
                +
              </button>
            </div>

            {incompleteTodos.length > 0 && (
              <ul className="space-y-4">
                {incompleteTodos.map((todo) => (
                  <li
                    key={todo.id}
                    className="bg-gray-100 p-4 rounded-xl flex justify-between items-center transition-all duration-300 transform hover:scale-[1.02] shadow-sm cursor-pointer"
                    onClick={() => openTodoDetails(todo)}
                  >
                    <div className="flex items-center flex-grow overflow-hidden whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleComplete(todo.id);
                        }}
                        className="mr-3 w-5 h-5 rounded-full text-sky-600 bg-gray-200 border-gray-300 focus:ring-sky-500 cursor-pointer flex-shrink-0"
                      />
                      <span className="flex-grow text-gray-800 transition-all duration-300 text-sm truncate">
                        {todo.text}
                      </span>
                    </div>
                    {/* PERUBAHAN: Tombol bintang diperbaiki dengan conditional class dan e.stopPropagation()
                    */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(todo.id);
                      }}
                      className={`ml-2 border-none text-lg hover:scale-110 active:scale-95 transition-all duration-200 flex-shrink-0 ${
                        todo.isFavorite
                          ? "text-yellow-500"
                          : "text-gray-300 hover:text-yellow-500"
                      }`}
                    >
                      &#9733;
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {(sortedTodos.length === 0 && currentList !== 'favorites') && (
              <p className="text-center text-gray-400 mt-8 text-sm">
                Daftar ini kosong.
              </p>
            )}
             {(sortedTodos.length === 0 && currentList === 'favorites') && (
              <p className="text-center text-gray-400 mt-8 text-sm">
                Belum ada tugas favorit.
              </p>
            )}


            {allCompletedTodos.length > 0 && (
              <div className="mt-8 pt-8 border-t-2 border-gray-200">
                <button
                  className="w-full text-left text-xl font-medium mb-4 text-gray-900 flex justify-between items-center"
                  onClick={() => setShowCompleted(!showCompleted)}
                >
                  Selesai ({allCompletedTodos.length})
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-5 h-5 transition-transform duration-200 ${
                      showCompleted ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {showCompleted && (
                  <ul className="space-y-4">
                    {allCompletedTodos.map((todo) => (
                      <li
                        key={todo.id}
                        className="bg-gray-100 p-4 rounded-xl flex justify-between items-center transition-all duration-300 transform hover:scale-[1.02] shadow-sm cursor-pointer"
                        onClick={() => openTodoDetails(todo)}
                      >
                        <div className="flex items-center flex-grow overflow-hidden whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleComplete(todo.id);
                            }}
                            className="mr-3 w-5 h-5 rounded-full text-sky-600 bg-gray-200 border-gray-300 focus:ring-sky-500 cursor-pointer flex-shrink-0"
                          />
                          <span className="flex-grow text-gray-500 line-through text-sm truncate">
                            {todo.text}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTodo(todo.id);
                          }}
                          className="ml-2 border-none text-red-500 text-lg hover:text-red-700 active:scale-95 transition-all duration-200 flex-shrink-0"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.5 4.478a.75.75 0 0 1 .491.565l.633 4.757a.75.75 0 0 1-.295.617l-5.467 4.549a.75.75 0 0 1-.58.192.75.75 0 0 1-.54-.158L3.38 8.046A.75.75 0 0 1 3 7.534V4.5a.75.75 0 0 1 .75-.75h1.22l.487-1.125A.75.75 0 0 1 6.077 2h3.847a.75.75 0 0 1 .63.375L11.034 3h1.22a.75.75 0 0 1 .75.75v.728l1.325.265a.75.75 0 0 1 .565.491Z"
                              clipRule="evenodd"
                            />
                            <path d="M11.25 4.5h2.25v2.25h-2.25V4.5ZM1.5 10.5h21v12h-21v-12Zm1.5 3h18v6.75h-18V13.5Zm1.5 3h15v3h-15v-3Zm1.5 3h12v3h-12v-3Z" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* PERUBAHAN: Input bar baru untuk mobile, menggantikan tombol FAB lama
      */}
      {!showModal && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-20">
          <div className="flex items-center space-x-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type="text"
              placeholder={currentList === 'favorites' ? 'Pilih daftar lain' : 'Tambahkan tugas baru...'}
              className="flex-grow px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300 placeholder-gray-400 text-sm"
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
              disabled={currentList === 'favorites'}
            />
            <button
              onClick={addTodo}
              className="bg-sky-600 text-white w-12 h-12 rounded-full text-2xl hover:bg-sky-700 active:scale-95 transition-all duration-200 shadow-md flex items-center justify-center flex-shrink-0 disabled:bg-gray-400"
              disabled={currentList === 'favorites'}
            >
              +
            </button>
          </div>
        </div>
      )}

      {(showModal || isDevMode) && selectedTodo && (
        <div className="fixed inset-0 bg-white p-4 overflow-y-auto z-30">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <button
              onClick={closeTodoDetails}
              className="text-gray-500 hover:text-gray-700 text-4xl"
            >
              &times;
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => toggleFavorite(selectedTodo.id)}
                className={`text-2xl hover:scale-110 active:scale-95 transition-all duration-200 ${
                  selectedTodo.isFavorite ? "text-yellow-500" : "text-gray-400"
                }`}
              >
                &#9733;
              </button>
              <button
                onClick={() => deleteTodo(selectedTodo.id)}
                className="text-gray-500 hover:text-red-500 active:scale-95 transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="16"
                  fill="currentColor"
                  className="bi bi-trash-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                </svg>
              </button>
            </div>
          </div>

          <h2 className="text-3xl text-center font-bold mt-4 mb-2">
            {selectedTodo?.text}
          </h2>
          <div
            className={`w-full h-2 rounded-full mb-4 ${getPriorityColor(
              selectedTodo?.priority
            )}`}
          ></div>

          <div className="my-4 flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="18"
              fill="currentColor"
              className="bi bi-list"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
              />
            </svg>
            <textarea
              className="flex w-full border-none focus:outline-none  transition-all duration-300 text-sm placeholder-grey-950"
              value={selectedTodo?.details}
              onChange={(e) => updateTodoDetails({ details: e.target.value })}
              placeholder="Tambahkan detail"
            />
          </div>

          <div className="flex space-x-4 my-4">
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-1">
                Tanggal
              </label>
              <input
                type="date"
                value={selectedTodo?.date}
                onChange={(e) => updateTodoDetails({ date: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300 text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-1">
                Waktu
              </label>
              <input
                type="time"
                value={selectedTodo?.time}
                onChange={(e) => updateTodoDetails({ time: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300 text-sm"
              />
            </div>
          </div>

          <div className="my-4">
            <label className="block text-gray-700 font-medium mb-1">
              Atur Prioritas
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => updateTodoDetails({ priority: "high" })}
                className={`flex-1 p-2 rounded-full border-2 transition-all duration-200 text-sm ${
                  selectedTodo?.priority === "high"
                    ? "bg-red-500 text-white border-red-500"
                    : "bg-red-200 text-red-700 border-red-200 hover:bg-red-300"
                }`}
              >
                High
              </button>
              <button
                onClick={() => updateTodoDetails({ priority: "medium" })}
                className={`flex-1 p-2 rounded-full border-2 transition-all duration-200 text-sm ${
                  selectedTodo?.priority === "medium"
                    ? "bg-yellow-500 text-white border-yellow-500"
                    : "bg-yellow-200 text-yellow-700 border-yellow-200 hover:bg-yellow-300"
                }`}
              >
                Medium
              </button>
              <button
                onClick={() => updateTodoDetails({ priority: "low" })}
                className={`flex-1 p-2 rounded-full border-2 transition-all duration-200 text-sm ${
                  selectedTodo?.priority === "low"
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-green-200 text-green-700 border-green-200 hover:bg-green-300"
                }`}
              >
                Low
              </button>
            </div>
          </div>

          <div className="my-4">
            <label className="block text-gray-700 font-medium mb-1">
              Tambahkan sub-tugas
            </label>
            <input
              type="text"
              placeholder="Masukkan judul"
              onKeyDown={handleAddSubtask}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300 text-sm"
            />
            <ul className="mt-2 space-y-2">
              {selectedTodo?.subtasks.map((subtask) => (
                <li
                  key={subtask.id}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => toggleSubtask(subtask.id)}
                      className="mr-2 w-4 h-4 rounded-full text-sky-600 bg-gray-200 border-gray-300 focus:ring-sky-500 cursor-pointer"
                    />
                    <span
                      className={`text-sm ${
                        subtask.completed
                          ? "line-through text-gray-500"
                          : "text-gray-800"
                      }`}
                    >
                      {subtask.text}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteSubtask(subtask.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;