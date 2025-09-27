import React, { useState, useEffect, useRef } from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import thinkingFaceSVG from '/thinking-face-animate.svg';

function App() {
  // ===================================================================================
  // === BAGIAN STATE MANAGEMENT (useState) ===
  // ===================================================================================

  const [lists, setLists] = useState([
    {
      id: "tugas-saya",
      name: "Tugas Saya",
      todos: [],
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
  const [showMobileInput, setShowMobileInput] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAddListModal, setShowAddListModal] = useState(false);
  const [newListName, setNewListName] = useState("");

  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameInput, setRenameInput] = useState("");


  // ===================================================================================
  // === BAGIAN REFS (useRef) ===
  // ===================================================================================

  const sortMenuRef = useRef(null);
  const optionsMenuRef = useRef(null);
  const scrollableNavRef = useRef(null);
  const mobileInputRef = useRef(null);
  const profileMenuRef = useRef(null);
  const newListInputRef = useRef(null);
  const renameModalInputRef = useRef(null);


  // ===================================================================================
  // === BAGIAN USEEFFECT (Lifecycle & Side Effects) ===
  // ===================================================================================

  useEffect(() => {
    if (showMobileInput && mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  }, [showMobileInput]);

  useEffect(() => {
    if (showAddListModal && newListInputRef.current) {
      newListInputRef.current.focus();
    }
  }, [showAddListModal]);

  useEffect(() => {
    if (showRenameModal && renameModalInputRef.current) {
      renameModalInputRef.current.focus();
    }
  }, [showRenameModal]);

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
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target)) {
        setShowOptionsMenu(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sortMenuRef, optionsMenuRef, profileMenuRef]);

  // ===================================================================================
  // === BAGIAN FUNGSI-FUNGSI UTAMA (Handlers & Logic) ===
  // ===================================================================================

  const handleLogin = () => {
    alert("Fungsi login akan diimplementasikan di sini.");
    setUser({ name: "User" });
    setShowProfileMenu(false);
  };
  const handleRegister = () => {
    alert("Fungsi registrasi akan diimplementasikan di sini.");
    setShowProfileMenu(false);
  };
  const handleLogout = () => {
    alert("Anda telah logout.");
    setUser(null);
    setShowProfileMenu(false);
  };

  const addTodo = () => {
    if (input.trim() && currentList && currentList !== "favorites") {
      const newTodo = {
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
      };
      setLists(
        lists.map((list) =>
          list.id === currentList
            ? { ...list, todos: [...(list.todos || []), newTodo] }
            : list
        )
      );
      setInput("");
      setShowMobileInput(false);
    } else if (currentList === "favorites") {
      alert("Tidak bisa menambah tugas di daftar Favorit.");
    }
  };

  const toggleComplete = (id) => {
    setLists(
      lists.map((list) => ({
        ...list,
        todos: (list.todos || []).map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ),
      }))
    );
  };

  const deleteTodo = (id) => {
    setLists(
      lists.map((list) => ({
        ...list,
        todos: (list.todos || []).filter((t) => t.id !== id),
      }))
    );
    if (selectedTodo && selectedTodo.id === id) {
      closeTodoDetails();
    }
  };

  const openTodoDetails = (todo) => {
    setSelectedTodo(todo);
    setShowModal(true);
  };

  const closeTodoDetails = () => {
    setSelectedTodo(null);
    setShowModal(false);
  };

  const updateTodoDetails = (updatedFields) => {
    setLists(
      lists.map((list) => ({
        ...list,
        todos: (list.todos || []).map((todo) =>
          todo.id === selectedTodo.id ? { ...todo, ...updatedFields } : todo
        ),
      }))
    );
    setSelectedTodo((prev) => ({ ...prev, ...updatedFields }));
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
    updateTodoDetails({
      subtasks: selectedTodo.subtasks.filter((sub) => sub.id !== subtaskId),
    });
  };

  const toggleFavorite = (id) => {
    setLists(
      lists.map((list) => ({
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
        return "bg-zinc-600"; // Warna default diubah agar sesuai tema gelap
    }
  };
  
  const getPriorityButtonClass = (priority, selectedPriority) => {
    const baseClass = "flex-1 p-2 rounded-lg border-2 transition-all duration-200 text-sm font-medium";
    const colors = {
      high: {
        selected: "bg-red-500 text-white border-red-500",
        unselected: "bg-transparent text-red-400 border-zinc-700 hover:bg-zinc-800 hover:border-red-500"
      },
      medium: {
        selected: "bg-yellow-500 text-white border-yellow-500",
        unselected: "bg-transparent text-yellow-400 border-zinc-700 hover:bg-zinc-800 hover:border-yellow-500"
      },
      low: {
        selected: "bg-green-500 text-white border-green-500",
        unselected: "bg-transparent text-green-400 border-zinc-700 hover:bg-zinc-800 hover:border-green-500"
      }
    };
    return `${baseClass} ${selectedPriority === priority ? colors[priority].selected : colors[priority].unselected}`;
  };

  const handleRenameList = () => {
    const currentName = lists.find((l) => l.id === currentList)?.name;
    if (currentList !== "favorites") {
      setRenameInput(currentName || "");
      setShowRenameModal(true);
    } else {
      alert("Daftar Favorit tidak bisa diubah namanya.");
    }
    setShowOptionsMenu(false);
  };

  const handleRenameSubmit = () => {
    if (renameInput.trim()) {
      setLists(
        lists.map((list) =>
          list.id === currentList ? { ...list, name: renameInput.trim() } : list
        )
      );
    }
    setShowRenameModal(false);
  };

  const handleDeleteList = (listId) => {
    if (lists.length <= 1) {
      alert("Tidak bisa menghapus satu-satunya daftar yang ada.");
      return;
    }
    const newLists = lists.filter((list) => list.id !== listId);
    setLists(newLists);
    if (currentList === listId) {
      setCurrentList(newLists[0]?.id || null);
    }
    setShowOptionsMenu(false);
  };

  const handleDeleteCompleted = () => {
    setLists(
      lists.map((list) =>
        list.id === currentList
          ? { ...list, todos: (list.todos || []).filter((t) => !t.completed) }
          : list
      )
    );
    setShowOptionsMenu(false);
  };

  const handleAddNewList = () => {
    if (newListName.trim()) {
      const newId = Date.now().toString();
      setLists([...lists, { id: newId, name: newListName.trim(), todos: [] }]);
      setCurrentList(newId);
      setNewListName("");
      setShowAddListModal(false);
    } else {
      alert("Nama daftar tidak boleh kosong.");
    }
  };

  const getSortedTodos = () => {
    let todosToDisplay;
    if (currentList === "favorites") {
      todosToDisplay = lists
        .flatMap((list) => list.todos || [])
        .filter((todo) => todo.isFavorite);
    } else {
      todosToDisplay =
        lists.find((list) => list.id === currentList)?.todos || [];
    }
    const sortedList = [...todosToDisplay];
    if (sortOrder === "date") {
      sortedList.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortOrder === "favorite") {
      sortedList.sort((a, b) => Number(b.isFavorite) - Number(a.isFavorite));
    } else if (sortOrder === "title") {
      sortedList.sort((a, b) => a.text.localeCompare(b.text));
    }
    return sortedList;
  };

  const sortedTodos = getSortedTodos();
  const incompleteTodos = sortedTodos.filter((todo) => !todo.completed);
  const completedTodosInCurrentList = sortedTodos.filter(
    (todo) => todo.completed
  );

  // ===================================================================================
  // === BAGIAN RENDER (JSX) ===
  // ===================================================================================
  return (
    <div className="bg-slate-950 font-sans">
      <BackgroundBeamsWithCollision className="fixed inset-0 z-0 min-h-screen lg:max-h-screen bg-slate-950"/>
      
      <div className="relative z-10 w-full h-screen overflow-y-auto scrollbar-hide-native p-4 flex flex-col items-center">

        <style>{`
          .scrollbar-hide-native::-webkit-scrollbar { display: none; }
          .scrollbar-hide-native { -ms-overflow-style: none; scrollbar-width: none; }
          
          .custom-checkbox {
            appearance: none; -webkit-appearance: none;
            position: relative; width: 20px; height: 20px;
            border-radius: 9999px; border: 2px solid #52525b;
            cursor: pointer; transition: background-color 0.2s, border-color 0.2s;
            flex-shrink: 0;
          }
          .custom-checkbox:checked { background-color: #0284c7; border-color: #0284c7; }
          .custom-checkbox::before {
            content: ''; position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%) scale(0);
            width: 12px; height: 12px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='white'%3E%3Cpath d='M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022z'/%3E%3C/svg%3E");
            background-size: contain; background-repeat: no-repeat;
            transition: transform 0.2s ease-in-out;
          }
          .custom-checkbox:checked::before { transform: translate(-50%, -50%) scale(1); }
        `}</style>

        {!showModal && !showAddListModal && (
          <div className="fixed top-4 right-4 z-40">
            <div className="relative" ref={profileMenuRef}>
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="w-10 h-10 rounded-full bg-gray-200/80 backdrop-blur-sm hover:bg-gray-500 flex items-center justify-center transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person-fill text-gray-600" viewBox="0 0 16 16">
                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                </svg>
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                  {user ? (
                    <>
                      <div className="px-4 py-3 text-sm text-gray-700">
                        <div>Masuk sebagai</div>
                        <div className="font-semibold truncate">{user.name}</div>
                      </div>
                      <div className="border-t border-gray-100"></div>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100">Logout</button>
                    </>
                  ) : (
                    <>
                      <button onClick={handleLogin} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Login</button>
                      <button onClick={handleRegister} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Daftar</button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="max-w-md w-full my-auto">
          <div className={`bg-zinc-900 shadow-lg rounded-3xl p-6 md:p-8 w-full relative transition-all duration-300 ${showAddListModal || showRenameModal ? 'blur-sm' : 'blur-none'}`}>
            {!showModal && (
              <>
                <div className="mb-6 flex items-center border-b-2 border-zinc-800 relative">
                  <div className="flex-none z-10">
                    <button onClick={() => setCurrentList("favorites")} className="px-2 md:px-4 font-medium pb-2 transition-all duration-300 relative group">
                      <span className={`flex items-center justify-center transition-colors duration-300 ${ currentList === "favorites" ? "text-yellow-400" : "text-white opacity-30"}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
                          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                        </svg>
                      </span>
                      <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-yellow-400 transition-all duration-300 ${currentList === "favorites" ? "w-7 rounded-md" : "w-0"}`}></span>
                    </button>
                  </div>
                  <div ref={scrollableNavRef} className="flex-grow min-w-0 overflow-x-auto whitespace-nowrap flex scrollbar-hide-native">
                    {lists.map((list) => (
                      <button key={list.id} onClick={() => setCurrentList(list.id)} className={`inline-block px-2 md:px-4 font-medium ml-5 pb-2 transition-all duration-300 relative group ${currentList === list.id ? "text-sky-600" : "text-white opacity-50"}`}>
                        {list.name}
                        <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-sky-500 transition-all duration-300 ${currentList === list.id ? "w-full" : "w-0"}`}></span>
                      </button>
                    ))}
                    <button onClick={() => setShowAddListModal(true)} className="inline-block px-2 md:px-6 font-medium text-white opacity-50 pb-2 ml-6 transition-all duration-300 relative group">
                      + Daftar Baru
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-medium text-white opacity-80 truncate pr-2">
                    {currentList === "favorites" ? "Favorit" : lists.find((l) => l.id === currentList)?.name}
                  </h1>
                  <div className="flex items-center space-x-2 relative flex-shrink-0">
                    <div className="relative">
                      <button onClick={() => setShowSortMenu(!showSortMenu)} className="p-2 text-white opacity-80 rounded-full hover:bg-zinc-800 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-up" viewBox="0 0 16 16"><path fillRule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5m-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5"/></svg>
                      </button>
                      {showSortMenu && (
                        <div ref={sortMenuRef} className="absolute right-0 mt-2 w-48 bg-gray-950 border border-gray-800 rounded-md shadow-lg z-20">
                          <button onClick={() => { setSortOrder("manual"); setShowSortMenu(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 hover:text-white">Urutan Saya</button>
                          <button onClick={() => { setSortOrder("date"); setShowSortMenu(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 hover:text-white">Tanggal</button>
                          <button onClick={() => { setSortOrder("favorite"); setShowSortMenu(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 hover:text-white">Favorit</button>
                          <button onClick={() => { setSortOrder("title"); setShowSortMenu(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 hover:text-white">Judul</button>
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <button onClick={() => setShowOptionsMenu(!showOptionsMenu)} className="p-2 rounded-full text-white opacity-80 hover:bg-zinc-800 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16"><path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg>
                      </button>
                      {showOptionsMenu && (
                        <div ref={optionsMenuRef} className="absolute right-0 mt-2 w-48 bg-gray-950 border border-gray-800 rounded-md shadow-lg z-20">
                          <button onClick={handleRenameList} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 hover:text-white">Ganti Nama</button>
                          <button onClick={handleDeleteCompleted} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-800 hover:text-red-400">Hapus Selesai</button>
                          {currentList !== "tugas-saya" && currentList !== "favorites" &&(
                            <button onClick={() => handleDeleteList(currentList)} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-800 hover:text-red-400">Hapus Daftar</button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="hidden md:flex mb-6 items-center space-x-2">
                  <div className="relative group flex-grow">
                    <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 blur opacity-0 group-focus-within:opacity-75 transition duration-200 animate-pulse"></div>
                    <input value={input} onChange={(e) => setInput(e.target.value)} type="text" placeholder="Tambahkan tugas baru..." className="relative text-white w-full bg-zinc-800 px-4 py-3 border border-white/20 rounded-full focus:outline-none focus:ring-0 focus:border-transparent placeholder-gray-500 text-sm" onKeyDown={(e) => e.key === "Enter" && addTodo()} disabled={currentList === "favorites"}/>
                  </div>
                  <button onClick={addTodo} className="bg-sky-900 text-white w-12 h-12 rounded-2xl text-2xl hover:bg-sky-600 active:scale-95 transition-all duration-200 shadow-md flex items-center justify-center disabled:bg-gray-400 flex-shrink-0" disabled={currentList === "favorites"}>+</button>
                </div>

                {incompleteTodos.length > 0 && (
                  <ul className="space-y-1">
                    {incompleteTodos.map((todo) => (
                      <li key={todo.id} className="p-4 rounded-xl flex justify-between items-center transition-all duration-300 hover:bg-zinc-800 group">
                        <div className="flex items-center flex-grow overflow-hidden whitespace-nowrap">
                          <input id={`todo-${todo.id}`} type="checkbox" checked={todo.completed} onChange={() => toggleComplete(todo.id)} className="custom-checkbox mr-4"/>
                          <span onClick={() => openTodoDetails(todo)} className="flex-grow text-gray-200 text-sm truncate cursor-pointer group-hover:text-sky-400 transition-colors">{todo.text}</span>
                        </div>
                        <button onClick={() => toggleFavorite(todo.id)} className={`ml-2 text-lg hover:scale-110 active:scale-95 transition-all duration-200 flex-shrink-0 ${todo.isFavorite ? 'bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent' : 'text-gray-600 hover:text-yellow-400'}`}>&#9733;</button>
                      </li>
                    ))}
                  </ul>
                )}
                
                {incompleteTodos.length === 0 && (
                  <div className="text-center text-gray-400 mt-8">
                    <img src={thinkingFaceSVG} alt="Thinking Face" className="mx-auto w-50 h-50 mb-4" />
                    <p className="text-sm">{currentList === 'favorites' ? 'Belum ada tugas favorit.' : 'Daftar ini kosong.'}</p>
                  </div>
                )}
              </>
            )}
          </div>
          
          {completedTodosInCurrentList.length > 0 && (
            <div className="bg-zinc-900 shadow-lg rounded-3xl p-6 md:p-8 w-full mt-4 flex-shrink-0">
              <button className="w-full text-left text-lg font-medium mb-4 text-gray-300 flex justify-between items-center" onClick={() => setShowCompleted(!showCompleted)}>
                Selesai ({completedTodosInCurrentList.length})
                <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 transition-transform duration-200 ${showCompleted ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {showCompleted && (
                  <ul className="space-y-1">
                    {completedTodosInCurrentList.map((todo) => (
                      <li key={todo.id} className="p-4 rounded-xl flex justify-between items-center transition-all duration-300 hover:bg-zinc-800 group">
                        <div className="flex items-center flex-grow overflow-hidden whitespace-nowrap">
                          <input id={`todo-${todo.id}`} type="checkbox" checked={todo.completed} onChange={() => toggleComplete(todo.id)} className="custom-checkbox mr-4"/>
                          <span onClick={() => openTodoDetails(todo)} className="flex-grow text-gray-500 line-through text-sm truncate cursor-pointer group-hover:text-sky-400 transition-colors">{todo.text}</span>
                        </div>
                        <button onClick={() => deleteTodo(todo.id)} className="ml-2 border-none text-red-500 text-lg hover:text-red-700 active:scale-95 transition-all duration-200 flex-shrink-0">
                           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" /></svg>
                        </button>
                      </li>
                    ))}
                  </ul>
              )}
            </div>
          )}
        </div>

        {showAddListModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setShowAddListModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            <div className="relative bg-zinc-800 rounded-xl shadow-lg p-6 w-full max-w-sm">
              <h2 className="text-white text-lg font-semibold mb-4">Buat Daftar Baru</h2>
              <input ref={newListInputRef} type="text" value={newListName} onChange={(e) => setNewListName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddNewList()} placeholder="Masukkan judul daftar" className="w-full text-white bg-zinc-700 p-2 rounded border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-sky-500"/>
              <div className="flex justify-end space-x-2 mt-4">
                <button onClick={() => setShowAddListModal(false)} className="px-4 py-2 text-gray-300 hover:bg-zinc-700 rounded transition-colors">Batal</button>
                <button onClick={handleAddNewList} className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 disabled:bg-gray-500/50 disabled:cursor-not-allowed transition-colors" disabled={!newListName.trim()}>Simpan</button>
              </div>
            </div>
          </div>
        )}

        {showRenameModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setShowRenameModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            <div className="relative bg-zinc-800 rounded-xl shadow-lg p-6 w-full max-w-sm">
              <h2 className="text-white text-lg font-semibold mb-4">Ganti Nama Daftar</h2>
              <input 
                ref={renameModalInputRef} 
                type="text" 
                value={renameInput} 
                onChange={(e) => setRenameInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit()} 
                placeholder="Masukkan judul baru" 
                className="w-full text-white bg-zinc-700 p-2 rounded border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <div className="flex justify-end space-x-2 mt-4">
                <button onClick={() => setShowRenameModal(false)} className="px-4 py-2 text-gray-300 hover:bg-zinc-700 rounded transition-colors">Batal</button>
                <button onClick={handleRenameSubmit} className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 disabled:bg-gray-500/50 disabled:cursor-not-allowed transition-colors" disabled={!renameInput.trim()}>Simpan</button>
              </div>
            </div>
          </div>
        )}
        
        {!showModal && !showAddListModal && (
          <div className="md:hidden">
            <div className="fixed bottom-4 right-4 z-30">
              { !showMobileInput ? (
                <button 
                  onClick={() => setShowMobileInput(true)} 
                  className="bg-sky-600 text-white w-14 h-14 rounded-full text-2xl hover:bg-sky-700 active:scale-95 transition-all duration-300 shadow-lg flex items-center justify-center" 
                  disabled={currentList === "favorites"}
                >
                  +
                </button>
              ) : (
                <button 
                  onClick={() => setShowMobileInput(false)}
                  className="bg-sky-600 text-white  w-14 h-14 rounded-full text-2xl hover:bg-sky-700 active:scale-95 transition-all duration-300 shadow-lg flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>
            {showMobileInput && (
              <div className="fixed bottom-0 left-0 right-0 p-4   z-20 transition-transform duration-300 ease-in-out translate-y-0">
                <div className="flex items-center space-x-2">
                  <div className="relative group flex-grow">
                      <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 blur opacity-0 group-focus-within:opacity-75 transition duration-800 animate-pulse"></div>
                      <input ref={mobileInputRef} value={input} onChange={(e) => setInput(e.target.value)} type="text" placeholder="Tambahkan tugas baru..." className="relative text-white w-full bg-zinc-800 px-4 py-3 border rounded-full focus:outline-none focus:ring-0 focus:border-transparent placeholder-gray-500 text-sm" onKeyDown={(e) => e.key === "Enter" && addTodo()}/>
                  </div>
                  <button onClick={addTodo} className="bg-sky-900 text-white w-12 h-12 rounded-2xl text-2xl hover:bg-sky-700 active:scale-95 transition-all duration-200 shadow-md flex items-center justify-center flex-shrink-0">+</button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {(showModal || isDevMode) && selectedTodo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={closeTodoDetails} className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            
            <div className="relative bg-zinc-900 rounded-2xl shadow-lg w-full max-w-md max-h-[90vh] flex flex-col">
              {/* --- Header Modal --- */}
              <div className="flex items-center justify-between p-4 border-b border-zinc-800 flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <button onClick={() => toggleFavorite(selectedTodo.id)} className={`p-2 rounded-full transition-colors duration-200 ${selectedTodo.isFavorite ? "text-yellow-400 bg-yellow-400/10" : "text-zinc-400 hover:bg-zinc-800"}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                    </svg>
                  </button>
                  <button onClick={() => deleteTodo(selectedTodo.id)} className="p-2 text-zinc-400 rounded-full hover:bg-zinc-800 hover:text-red-400 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/></svg>
                  </button>
                </div>
                <button onClick={closeTodoDetails} className="p-2 text-zinc-400 rounded-full hover:bg-zinc-800 transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/></svg>
                </button>
              </div>

              {/* --- Konten Modal (Scrollable) --- */}
              <div className="p-6 overflow-y-auto space-y-6 scrollbar-hide-native">
                <h2 className="text-2xl font-bold text-white">{selectedTodo?.text}</h2>
                <div className={`w-full h-1.5 rounded-full ${getPriorityColor(selectedTodo?.priority)}`}></div>

                <div className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-text-left text-zinc-400 mr-3 mt-1 flex-shrink-0" viewBox="0 0 16 16"><path fillRule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/></svg>
                  <textarea className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-zinc-300 text-sm placeholder-zinc-500 resize-none" rows="3" value={selectedTodo?.details} onChange={(e) => updateTodoDetails({ details: e.target.value })} placeholder="Tambahkan detail..."/>
                </div>

                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-zinc-400 font-medium mb-2 text-sm">Tanggal</label>
                    <input type="date" value={selectedTodo?.date} onChange={(e) => updateTodoDetails({ date: e.target.value })} className="w-full p-2 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300 text-sm"/>
                  </div>
                  <div className="flex-1">
                    <label className="block text-zinc-400 font-medium mb-2 text-sm">Waktu</label>
                    <input type="time" value={selectedTodo?.time} onChange={(e) => updateTodoDetails({ time: e.target.value })} className="w-full p-2 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300 text-sm"/>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-2 text-sm">Prioritas</label>
                  <div className="flex space-x-2">
                    <button onClick={() => updateTodoDetails({ priority: 'high' })} className={getPriorityButtonClass('high', selectedTodo?.priority)}>High</button>
                    <button onClick={() => updateTodoDetails({ priority: 'medium' })} className={getPriorityButtonClass('medium', selectedTodo?.priority)}>Medium</button>
                    <button onClick={() => updateTodoDetails({ priority: 'low' })} className={getPriorityButtonClass('low', selectedTodo?.priority)}>Low</button>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-2 text-sm">Sub-tugas</label>
                  <input type="text" placeholder="Tambahkan sub-tugas baru & tekan Enter..." onKeyDown={handleAddSubtask} className="w-full p-2 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300 text-sm placeholder-zinc-500"/>
                  <ul className="mt-3 space-y-2">
                    {selectedTodo?.subtasks.map((subtask) => (
                      <li key={subtask.id} className="flex items-center justify-between bg-zinc-800/50 p-3 rounded-lg group">
                        <div className="flex items-center">
                          <input type="checkbox" id={`subtask-${subtask.id}`} checked={subtask.completed} onChange={() => toggleSubtask(subtask.id)} className="custom-checkbox mr-3"/>
                          <label htmlFor={`subtask-${subtask.id}`} className={`text-sm cursor-pointer ${subtask.completed ? "line-through text-zinc-500" : "text-zinc-300"}`}>{subtask.text}</label>
                        </div>
                        <button onClick={() => deleteSubtask(subtask.id)} className="text-zinc-500 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100">&times;</button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;