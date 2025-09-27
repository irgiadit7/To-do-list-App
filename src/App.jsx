import React, { useState, useEffect, useRef } from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

function App() {
  // ===================================================================================
  // === BAGIAN STATE MANAGEMENT (useState) ===
  // ===================================================================================
  // FUNGSI: Mengelola semua data dinamis dalam aplikasi.

  // State untuk menyimpan semua daftar (lists) dan tugas (todos) di dalamnya.
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
  // State untuk melacak ID dari daftar yang sedang aktif/dipilih pengguna.
  const [currentList, setCurrentList] = useState("tugas-saya");
  // State untuk menampung teks dari input field saat menambahkan tugas baru.
  const [input, setInput] = useState("");
  // State untuk menyimpan data lengkap dari tugas yang sedang dibuka detailnya.
  const [selectedTodo, setSelectedTodo] = useState(null);
  // State untuk menampilkan atau menyembunyikan modal detail tugas.
  const [showModal, setShowModal] = useState(false);
  // State untuk mode pengembangan (fitur tambahan).
  const [isDevMode, setIsDevMode] = useState(false);
  // State untuk menampilkan/menyembunyikan menu pengurutan (sort).
  const [showSortMenu, setShowSortMenu] = useState(false);
  // State untuk menampilkan/menyembunyikan menu opsi (ganti nama, hapus, dll.).
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  // State untuk menyimpan metode pengurutan yang dipilih.
  const [sortOrder, setSortOrder] = useState("manual");
  // State untuk menampilkan/menyembunyikan daftar tugas yang sudah selesai.
  const [showCompleted, setShowCompleted] = useState(true);
  // State untuk menampilkan/menyembunyikan input field di versi mobile.
  const [showMobileInput, setShowMobileInput] = useState(false);
  // State untuk data pengguna (null jika belum login).
  const [user, setUser] = useState(null);
  // State untuk menampilkan/menyembunyikan menu dropdown profil.
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  // State untuk menampilkan/menyembunyikan modal tambah daftar baru.
  const [showAddListModal, setShowAddListModal] = useState(false);
  // State untuk menampung teks dari input field nama daftar baru.
  const [newListName, setNewListName] = useState("");

  // ===================================================================================
  // === BAGIAN REFS (useRef) ===
  // ===================================================================================
  // FUNGSI: Memberikan akses langsung ke elemen DOM.

  const sortMenuRef = useRef(null);
  const optionsMenuRef = useRef(null);
  const scrollableNavRef = useRef(null);
  const mobileInputRef = useRef(null);
  const profileMenuRef = useRef(null);
  const newListInputRef = useRef(null);

  // ===================================================================================
  // === BAGIAN USEEFFECT (Lifecycle & Side Effects) ===
  // ===================================================================================
  // FUNGSI: Menjalankan kode sebagai respons terhadap perubahan state atau siklus hidup komponen.

  // Fokus otomatis ke input field di mobile saat muncul.
  useEffect(() => {
    if (showMobileInput && mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  }, [showMobileInput]);

  // Fokus otomatis ke input field di modal tambah daftar.
  useEffect(() => {
    if (showAddListModal && newListInputRef.current) {
      newListInputRef.current.focus();
    }
  }, [showAddListModal]);

  // Berjalan sekali saat komponen dimuat untuk memeriksa mode dev.
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

  // Menangani klik di luar menu untuk menutupnya.
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

  // --- Fungsi untuk Autentikasi (Dummy) ---
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

  // --- Fungsi untuk Manajemen Tugas (Todo) ---
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

  // --- Fungsi untuk Manajemen Sub-Tugas ---
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

  // --- Fungsi Lain-lain ---
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
        return "bg-gray-400";
    }
  };

  // --- Fungsi untuk Manajemen Daftar (List) ---
  const handleRenameList = () => {
    const currentName = lists.find((l) => l.id === currentList)?.name;
    const newName = prompt("Masukkan nama daftar baru:", currentName);
    if (newName && newName.trim()) {
      setLists(
        lists.map((list) =>
          list.id === currentList ? { ...list, name: newName.trim() } : list
        )
      );
    }
    setShowOptionsMenu(false);
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

  // --- Logika untuk Pengurutan dan Pemfilteran Tugas ---
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
    // PERUBAHAN FINAL: Semua kelas layout ada di sini, tidak ada div tambahan.
    <BackgroundBeamsWithCollision className="lg:max-h-screen min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-4 font-sans relative">

        {/* --- CSS TAMBAHAN UNTUK STYLING --- */}
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

        {/* --- KOMPONEN: Tombol Profil --- */}
        {!showModal && !showAddListModal && (
          <div className="fixed md:absolute top-4 right-4 z-40">
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

        {/* --- KONTENER UTAMA TO-DO LIST --- */}
        <div className={`bg-zinc-900 shadow-lg rounded-3xl p-6 md:p-8 max-w-md w-full relative transition-all duration-300 ${showAddListModal ? 'blur-sm' : 'blur-none'}`}>
          {!showModal && (
            <>
              {/* --- KOMPONEN: Header Navigasi Daftar --- */}
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

              {/* --- KOMPONEN: Judul Daftar dan Tombol Opsi --- */}
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

              {/* --- KOMPONEN: Input Tambah Tugas (Desktop) --- */}
              <div className="hidden md:flex mb-6 items-center space-x-2">
                <div className="relative group flex-grow">
                  <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 blur opacity-0 group-focus-within:opacity-75 transition duration-200 animate-pulse"></div>
                  <input value={input} onChange={(e) => setInput(e.target.value)} type="text" placeholder="Tambahkan tugas baru..." className="relative text-white w-full bg-zinc-800 px-4 py-3 border border-white/20 rounded-full focus:outline-none focus:ring-0 focus:border-transparent placeholder-gray-500 text-sm" onKeyDown={(e) => e.key === "Enter" && addTodo()} disabled={currentList === "favorites"}/>
                </div>
                <button onClick={addTodo} className="bg-sky-900 text-white w-12 h-12 rounded-2xl text-2xl hover:bg-sky-600 active:scale-95 transition-all duration-200 shadow-md flex items-center justify-center disabled:bg-gray-400 flex-shrink-0" disabled={currentList === "favorites"}>+</button>
              </div>

              {/* --- KOMPONEN: Daftar Tugas (Belum Selesai) --- */}
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
              
              {/* --- KOMPONEN: Pesan Jika Kosong --- */}
              {sortedTodos.length === 0 && (
                <p className="text-center text-gray-400 mt-8 text-sm">{currentList === 'favorites' ? 'Belum ada tugas favorit.' : 'Daftar ini kosong.'}</p>
              )}

              {/* --- KOMPONEN: Daftar Tugas (Selesai) --- */}
              {completedTodosInCurrentList.length > 0 && (
                <div className="mt-8 pt-6 border-t-2 border-zinc-800">
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
                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M16.5 4.478a.75.75 0 0 1 .491.565l.633 4.757a.75.75 0 0 1-.295.617l-5.467 4.549a.75.75 0 0 1-.58.192.75.75 0 0 1-.54-.158L3.38 8.046A.75.75 0 0 1 3 7.534V4.5a.75.75 0 0 1 .75-.75h1.22l.487-1.125A.75.75 0 0 1 6.077 2h3.847a.75.75 0 0 1 .63.375L11.034 3h1.22a.75.75 0 0 1 .75.75v.728l1.325.265a.75.75 0 0 1 .565.491Z" clipRule="evenodd" /><path d="M11.25 4.5h2.25v2.25h-2.25V4.5ZM1.5 10.5h21v12h-21v-12Zm1.5 3h18v6.75h-18V13.5Zm1.5 3h15v3h-15v-3Zm1.5 3h12v3h-12v-3Z" /></svg>
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

        {/* --- KOMPONEN: Modal Tambah Daftar Baru --- */}
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

        {/* --- KOMPONEN: Tombol Aksi Tambah Tugas (Mobile) --- */}
        {!showModal && !showMobileInput && !showAddListModal &&(
          <div className="md:hidden fixed bottom-4 right-4 z-20">
            <button onClick={() => setShowMobileInput(true)} className="bg-sky-600 text-white w-14 h-14 rounded-full text-2xl hover:bg-sky-700 active:scale-95 transition-all duration-200 shadow-lg flex items-center justify-center" disabled={currentList === "favorites"}>+</button>
          </div>
        )}

        {/* --- KOMPONEN: Input Tambah Tugas (Mobile) --- */}
        {!showModal && showMobileInput && (
          <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-zinc-900 border-t border-zinc-800 z-20">
            <div className="flex items-center space-x-2">
              <div className="relative group flex-grow">
                  <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 blur opacity-0 group-focus-within:opacity-75 transition duration-200 animate-pulse"></div>
                  <input ref={mobileInputRef} value={input} onChange={(e) => setInput(e.target.value)} type="text" placeholder="Tambahkan tugas baru..." className="relative text-white w-full bg-zinc-800 px-4 py-3 border border-white/20 rounded-full focus:outline-none focus:ring-0 focus:border-transparent placeholder-gray-500 text-sm" onKeyDown={(e) => e.key === "Enter" && addTodo()}/>
              </div>
              <button onClick={addTodo} className="bg-sky-900 text-white w-12 h-12 rounded-2xl text-2xl hover:bg-sky-700 active:scale-95 transition-all duration-200 shadow-md flex items-center justify-center flex-shrink-0">+</button>
            </div>
          </div>
        )}

        {/* --- KOMPONEN: Modal Detail Tugas --- */}
        {(showModal || isDevMode) && selectedTodo && (
          <div className="fixed inset-0 bg-white p-4 overflow-y-auto z-30">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <button onClick={closeTodoDetails} className="text-gray-500 hover:text-gray-700 text-4xl">&times;</button>
              <div className="flex items-center space-x-2">
                <button onClick={() => toggleFavorite(selectedTodo.id)} className={`text-2xl hover:scale-110 active:scale-95 transition-all duration-200 ${selectedTodo.isFavorite ? "text-yellow-500" : "text-gray-400"}`}>&#9733;</button>
                <button onClick={() => deleteTodo(selectedTodo.id)} className="text-gray-500 hover:text-red-500 active:scale-95 transition-all duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" /></svg>
                </button>
              </div>
            </div>
            <h2 className="text-3xl text-center font-bold mt-4 mb-2">{selectedTodo?.text}</h2>
            <div className={`w-full h-2 rounded-full mb-4 ${getPriorityColor(selectedTodo?.priority)}`}></div>
            <div className="my-4 flex">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="18" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16"><path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/></svg>
              <textarea className="flex w-full border-none focus:outline-none transition-all duration-300 text-sm placeholder-grey-950" value={selectedTodo?.details} onChange={(e) => updateTodoDetails({ details: e.target.value })} placeholder="Tambahkan detail"/>
            </div>
            <div className="flex space-x-4 my-4">
              <div className="flex-1">
                <label className="block text-gray-700 font-medium mb-1">Tanggal</label>
                <input type="date" value={selectedTodo?.date} onChange={(e) => updateTodoDetails({ date: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300 text-sm"/>
              </div>
              <div className="flex-1">
                <label className="block text-gray-700 font-medium mb-1">Waktu</label>
                <input type="time" value={selectedTodo?.time} onChange={(e) => updateTodoDetails({ time: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300 text-sm"/>
              </div>
            </div>
            <div className="my-4">
              <label className="block text-gray-700 font-medium mb-1">Atur Prioritas</label>
              <div className="flex space-x-2">
                <button onClick={() => updateTodoDetails({ priority: "high" })} className={`flex-1 p-2 rounded-full border-2 transition-all duration-200 text-sm ${selectedTodo?.priority === "high" ? "bg-red-500 text-white border-red-500" : "bg-red-200 text-red-700 border-red-200 hover:bg-red-300"}`}>High</button>
                <button onClick={() => updateTodoDetails({ priority: "medium" })} className={`flex-1 p-2 rounded-full border-2 transition-all duration-200 text-sm ${selectedTodo?.priority === "medium" ? "bg-yellow-500 text-white border-yellow-500" : "bg-yellow-200 text-yellow-700 border-yellow-200 hover:bg-yellow-300"}`}>Medium</button>
                <button onClick={() => updateTodoDetails({ priority: "low" })} className={`flex-1 p-2 rounded-full border-2 transition-all duration-200 text-sm ${selectedTodo?.priority === "low" ? "bg-green-500 text-white border-green-500" : "bg-green-200 text-green-700 border-green-200 hover:bg-green-300"}`}>Low</button>
              </div>
            </div>
            <div className="my-4">
              <label className="block text-gray-700 font-medium mb-1">Tambahkan sub-tugas</label>
              <input type="text" placeholder="Masukkan judul" onKeyDown={handleAddSubtask} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300 text-sm"/>
              <ul className="mt-2 space-y-2">
                {selectedTodo?.subtasks.map((subtask) => (
                  <li key={subtask.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                    <div className="flex items-center">
                      <input type="checkbox" checked={subtask.completed} onChange={() => toggleSubtask(subtask.id)} className="mr-2 w-4 h-4 rounded-full text-sky-600 bg-gray-200 border-gray-300 focus:ring-sky-500 cursor-pointer"/>
                      <span className={`text-sm ${subtask.completed ? "line-through text-gray-500" : "text-gray-800"}`}>{subtask.text}</span>
                    </div>
                    <button onClick={() => deleteSubtask(subtask.id)} className="text-red-400 hover:text-red-600">&times;</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
    </BackgroundBeamsWithCollision>
  );
}

export default App;