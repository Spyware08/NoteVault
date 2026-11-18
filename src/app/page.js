
"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  Plus,
  Notebook,
  Image as ImageIcon,
  Lock,
  MoreVertical,
  Trash2,
  LogOut,
  Search,
  ShieldCheck,
  FileText,
  LayoutDashboard,
  Globe,
  X,
  ArrowUpRight,
  Menu,
  
  Settings,
  User,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import CircularProgress from "@mui/material/CircularProgress";
import { setUser } from "@/redux/userSlice";
import SidebarNavigation from "@/components/SidebarNavigation";

export default function () {
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);

  const [myNotes, setMyNotes] = useState([]);
  const [allNotes, setAllNotes] = useState([]);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  // FETCH DATA
  useEffect(() => {
    if (user === undefined) return;

    if (!user) {
      router.replace("/auth");
      return;
    }

    const loadData = async () => {
      try {
        await Promise.all([
          fetchMyNotes(),
          fetchAllNotes(),
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // FETCH MY NOTES
  const fetchMyNotes = async () => {
    try {
      const res = await fetch(
        `/api/noteSchema?userId=${user?.id}`
      );

      const data = await res.json();

      if (data.success) {
        setMyNotes(data.notes || []);
      }
    } catch (error) {
      console.error("My notes error:", error);
    }
  };

  // FETCH PUBLIC NOTES
  const fetchAllNotes = async () => {
    try {
      const res = await fetch(
        `/api/noteSchema?public=true`
      );

      const data = await res.json();

      if (data.success) {
        setAllNotes(
          data.notes?.filter(
            (item) => item?.userId != user?.id
          ) || []
        );
      }
    } catch (error) {
      console.error("Public notes error:", error);
    }
  };

  // DELETE NOTE
  const deleteNote = async (id) => {
    try {
      const res = await fetch(
        `/api/noteSchema?id=${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (data.success) {
        setMyNotes((prev) =>
          prev.filter((note) => note._id !== id)
        );

        setDeleteModal(null);
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // LOGOUT
  const handleLogout = () => {
    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    dispatch(setUser(null));
    router.replace("/auth");
  };

  // SEARCH
  const filteredMyNotes = myNotes.filter((note) =>
    `${note.title || ""} ${note.note || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredPublicNotes = allNotes.filter((note) =>
    `${note.title || ""} ${note.note || ""} ${note.user?.name || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // STATISTICS
  const stats = [
    {
      title: "Total Notes",
      value: myNotes.length,
      icon: Notebook,
      color: "#F59B45",
      bg: "bg-[#3A2D22]",
    },
    {
      title: "Notes With Images",
      value: myNotes.filter(
        (n) => n.images?.length > 0
      ).length,
      icon: ImageIcon,
      color: "#B78BFA",
      bg: "bg-[#30283B]",
    },
    {
      title: "Private Notes",
      value: myNotes.filter(
        (n) => n.privateNote
      ).length,
      icon: ShieldCheck,
      color: "#37C99A",
      bg: "bg-[#20372F]",
    },
  ];

  // SCROLL TO SECTION
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setMobileMenu(false);
  };

  // LOADING
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#151617]">
        <CircularProgress
          size={42}
          thickness={4}
          sx={{ color: "#F59B45" }}
        />
      </div>
    );
  }

  // NOTE CARD
  const NoteCard = ({
    note,
    index,
    isPublic = false,
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.04,
      }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-xl border border-[#383838] bg-[#222425] transition-all duration-300 hover:border-[#A66A35] hover:shadow-lg hover:shadow-black/20"
    >
      {/* THREE DOT MENU */}
      {!isPublic && (
        <div className="absolute right-3 top-3 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();

              setMenuOpenId(
                menuOpenId === note._id
                  ? null
                  : note._id
              );
            }}
            className="rounded-lg border border-[#444444] bg-[#292B2C]/95 p-2 text-gray-300 transition hover:border-[#F59B45] hover:text-[#F59B45]"
          >
            <MoreVertical size={18} />
          </button>

          {menuOpenId === note._id && (
            <div className="absolute right-0 mt-2 w-36 overflow-hidden rounded-lg border border-[#414141] bg-[#292B2C] py-1 shadow-xl">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteModal(note._id);
                  setMenuOpenId(null);
                }}
                className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-400 transition hover:bg-[#3B2929]"
              >
                <Trash2 size={15} />
                Delete Note
              </button>
            </div>
          )}
        </div>
      )}

      {/* NOTE CLICK */}
      <div
        onClick={() =>
          router.push(
            isPublic
              ? `/public-note/${note._id}`
              : `/note/${note._id}`
          )
        }
        className="cursor-pointer"
      >
        {/* IMAGE */}
        <div className="relative h-44 overflow-hidden border-b border-[#383838] bg-[#292B2C]">
          {note?.images?.length > 0 ? (
            <img
              src={note.images[0].imageBase}
              alt={note.title || "Note image"}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#292B2C] to-[#202122]">
              <FileText
                size={42}
                strokeWidth={1.4}
                className="text-[#A66A35]"
              />
            </div>
          )}

          {note.privateNote && !isPublic && (
            <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-md border border-[#A66A35]/40 bg-[#29221C]/95 px-3 py-1.5 text-xs font-semibold text-[#F5A04C]">
              <Lock size={12} />
              Private
            </span>
          )}
        </div>

        {/* NOTE DETAILS */}
        <div className="p-4">

          {isPublic && (
            <p className="mb-2 text-xs font-semibold text-[#F59B45]">
              By: {note.user?.name || "User"}
            </p>
          )}

          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 className="line-clamp-1 text-base font-bold text-gray-100 transition group-hover:text-[#F59B45]">
              {note.title || "Untitled Note"}
            </h3>

            <ArrowUpRight
              size={17}
              className="shrink-0 text-gray-500 transition group-hover:text-[#F59B45]"
            />
          </div>

          <p className="line-clamp-3 text-sm leading-6 text-gray-400">
            {note.note || "No description available."}
          </p>

          {note?.images?.length > 0 && (
            <div className="mt-4 flex items-center gap-2 border-t border-[#3B3D3E] pt-3 text-xs text-gray-500">
              <ImageIcon size={14} />
              {note.images.length} Image
              {note.images.length > 1 ? "s" : ""}
            </div>
          )}

        </div>
      </div>
    </motion.div>
  );

  // SIDEBAR
  const Sidebar = () => (
    <aside className="flex h-full flex-col border-r border-[#343536] bg-[#1D1F20]">

      {/* BRAND */}
      <div className="flex h-[76px] items-center gap-3 border-b border-[#343536] px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#292B2C]">
          <img
            src="/icon.png"
            alt="NoteVault"
            className="h-8 w-8 object-contain"
          />
        </div>

        <h1 className="text-xl font-extrabold tracking-tight text-white">
          Note<span className="text-[#F59B45]">Vault</span>
        </h1>
      </div>

      {/* USER STATUS */}
      <div className="border-b border-[#343536] p-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[2px] text-gray-500">
            System Status
          </span>

          <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Active
          </span>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            Total Notes
          </span>

          <span className="text-xs font-bold text-[#F59B45]">
            {myNotes.length} Notes
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">
            Image Notes
          </span>

          <span className="text-xs font-semibold text-emerald-400">
            {myNotes.filter(
              (n) => n.images?.length > 0
            ).length} Notes
          </span>
        </div>

        <button
          onClick={() => router.push("/add-note")}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-[#E88A35] py-3 text-sm font-bold text-[#171717] transition hover:bg-[#F59B45]"
        >
          <Plus size={17} />
          CREATE NOTE
        </button>
      </div>

      {/* NAVIGATION */}
      <div className="flex-1 p-4">

        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[2px] text-gray-600">
          Menu
        </p>

       < SidebarNavigation />
        {/* <div className="mb-3 mt-9 px-3 text-[10px] font-bold uppercase tracking-[2px] text-gray-600">
          Account
        </div>

        <button
          onClick={() => router.push("/profile")}
          className="flex w-full items-center gap-3 rounded-md px-4 py-3 text-sm text-gray-400 transition hover:bg-[#292B2C] hover:text-white"
        >
          <User size={17} />
          My Profile
        </button>

        <button
          onClick={() => router.push("/settings")}
          className="flex w-full items-center gap-3 rounded-md px-4 py-3 text-sm text-gray-400 transition hover:bg-[#292B2C] hover:text-white"
        >
          <Settings size={17} />
          Settings
        </button> */}

      </div>

      {/* SIDEBAR FOOTER */}
      <div className="border-t border-[#343536] p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#A66A35] bg-[#33291F] font-bold text-[#F59B45]">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {user?.name || "User"}
            </p>

            <p className="text-xs text-gray-500">
              Personal Account
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-md border border-[#444444] px-4 py-2.5 text-sm text-gray-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

    </aside>
  );

  return (
    <PageWrapper>
      <main className="min-h-screen bg-[#171819] text-white">

        <div className="flex min-h-screen">

          {/* DESKTOP SIDEBAR */}
          <div className="hidden w-[245px] shrink-0 lg:block">
            <div className="sticky top-0 h-screen">
              <Sidebar />
            </div>
          </div>

          {/* MAIN AREA */}
          <div className="min-w-0 flex-1">

            {/* TOP HEADER */}
            <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#343536] bg-[#1D1F20]/95 px-5 backdrop-blur-xl sm:px-8">

              <div className="flex items-center gap-3">

                <button
                  onClick={() => setMobileMenu(!mobileMenu)}
                  className="rounded-lg border border-[#414141] p-2 text-gray-300 lg:hidden"
                >
                  <Menu size={20} />
                </button>

                <div>
                  <h2 className="text-base font-bold text-white">
                    My Workspace
                  </h2>

                  <p className="hidden text-xs text-gray-500 sm:block">
                    Manage your personal notes and ideas
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-3">

                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-white">
                    {user?.name}
                  </p>

                  <p className="text-[10px] text-emerald-400">
                    Verified Account
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#A66A35] bg-[#33291F] font-bold text-[#F59B45]">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

              </div>
            </header>

            {/* MOBILE SIDEBAR */}
            {mobileMenu && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div
                  onClick={() => setMobileMenu(false)}
                  className="absolute inset-0 bg-black/70"
                />

                <div className="relative h-full w-[270px]">
                  <div className="h-full">
                    <Sidebar />
                  </div>
                </div>
              </div>
            )}

            {/* DASHBOARD CONTENT */}
            <div
              id="dashboard"
              className="mx-auto max-w-[1600px] p-5 sm:p-8"
            >

              {/* PAGE TITLE */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center"
              >
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[2px] text-[#E88A35]">
                    PERSONAL DASHBOARD
                  </p>

                  <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    My Portfolio
                  </h1>

                  <p className="mt-2 text-sm text-gray-500">
                    You have full control to manage your own notes and images.
                  </p>
                </div>

                <button
                  onClick={() => router.push("/add-note")}
                  className="flex items-center justify-center gap-2 rounded-md bg-[#E88A35] px-6 py-3 text-sm font-bold text-[#171717] shadow-lg shadow-orange-950/20 transition hover:bg-[#F59B45]"
                >
                  <Plus size={19} />
                  Create New Note
                </button>

              </motion.div>

              {/* STATISTICS */}
              <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

                {stats.map((stat, index) => {
                  const Icon = stat.icon;

                  return (
                    <motion.div
                      key={stat.title}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                      className="relative overflow-hidden rounded-lg border border-[#383A3B] bg-[#222425] p-5 transition hover:border-[#A66A35]"
                    >
                      <div className="flex items-center justify-between">

                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            {stat.title}
                          </p>

                          <h3 className="mt-3 text-3xl font-bold text-white">
                            {stat.value}
                          </h3>

                          <p className="mt-2 text-xs text-gray-500">
                            Current workspace
                          </p>
                        </div>

                        <div className={`rounded-lg p-4 ${stat.bg}`}>
                          <Icon
                            size={26}
                            style={{ color: stat.color }}
                          />
                        </div>

                      </div>

                      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-[#E88A35] via-[#A66A35] to-transparent" />
                    </motion.div>
                  );
                })}

              </section>

              {/* SEARCH AND NOTES HEADING */}
              <div
                id="my-notes"
                className="mb-5 flex scroll-mt-24 flex-col justify-between gap-4 sm:flex-row sm:items-center"
              >

                <div>
                  <h2 className="text-xl font-bold text-white">
                    My Notes
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Your saved notes and personal documents
                  </p>
                </div>

                <div className="flex w-full gap-3 sm:w-auto">

                  <div className="relative flex-1 sm:w-64">
                    <Search
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />

                    <input
                      type="text"
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                      placeholder="Search notes..."
                      className="w-full rounded-md border border-[#414141] bg-[#222425] py-2.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#E88A35] focus:ring-2 focus:ring-[#E88A35]/10"
                    />
                  </div>

                  <button
                    onClick={() => router.push("/add-note")}
                    className="flex items-center gap-2 rounded-md bg-[#E88A35] px-4 py-2.5 text-sm font-bold text-[#171717] transition hover:bg-[#F59B45]"
                  >
                    <Plus size={17} />
                    <span className="hidden sm:inline">Add</span>
                  </button>

                </div>
              </div>

              {/* MY NOTES PANEL */}
              <section className="mb-10 overflow-hidden rounded-lg border border-[#383A3B] bg-[#202223]">

                <div className="flex items-center justify-between border-b border-[#383A3B] bg-[#252728] px-5 py-4">

                  <div className="flex items-center gap-3">
                    <div className="rounded-md bg-[#392C20] p-2">
                      <Notebook
                        size={18}
                        className="text-[#F59B45]"
                      />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white">
                        My Personal Notes
                      </h3>

                      <p className="text-[11px] text-gray-500">
                        Manage your saved content
                      </p>
                    </div>
                  </div>

                  <span className="rounded-md border border-[#A66A35]/40 bg-[#392C20] px-3 py-1.5 text-xs font-semibold text-[#F59B45]">
                    {filteredMyNotes.length} Notes
                  </span>

                </div>

                <div className="p-5">

                  {filteredMyNotes.length === 0 ? (
                    <div className="rounded-md border border-dashed border-[#484848] bg-[#242627] px-5 py-14 text-center">

                      <FileText
                        size={38}
                        className="mx-auto mb-4 text-[#A66A35]"
                      />

                      <h3 className="font-bold text-white">
                        {search
                          ? "No matching notes"
                          : "No notes found"}
                      </h3>

                      <p className="mt-2 text-sm text-gray-500">
                        {search
                          ? "Try a different search keyword."
                          : "Create your first note to get started."}
                      </p>

                      {!search && (
                        <button
                          onClick={() =>
                            router.push("/add-note")
                          }
                          className="mt-5 rounded-md bg-[#E88A35] px-5 py-2.5 text-sm font-bold text-[#171717] hover:bg-[#F59B45]"
                        >
                          Create Note
                        </button>
                      )}

                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                      {filteredMyNotes.map((note, index) => (
                        <NoteCard
                          key={note._id}
                          note={note}
                          index={index}
                        />
                      ))}
                    </div>
                  )}

                </div>
              </section>

              {/* PUBLIC NOTES */}
              <section
                id="public-notes"
                className="mb-10 scroll-mt-24 overflow-hidden rounded-lg border border-[#383A3B] bg-[#202223]"
              >

                <div className="flex items-center justify-between border-b border-[#383A3B] bg-[#252728] px-5 py-4">

                  <div className="flex items-center gap-3">
                    <div className="rounded-md bg-[#392C20] p-2">
                      <Globe
                        size={18}
                        className="text-[#F59B45]"
                      />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white">
                        Explore Public Notes
                      </h3>

                      <p className="text-[11px] text-gray-500">
                        Discover content shared by other users
                      </p>
                    </div>
                  </div>

                  <span className="rounded-md border border-[#A66A35]/40 bg-[#392C20] px-3 py-1.5 text-xs font-semibold text-[#F59B45]">
                    {filteredPublicNotes.length} Notes
                  </span>

                </div>

                <div className="p-5">

                  {filteredPublicNotes.length === 0 ? (
                    <div className="rounded-md border border-dashed border-[#484848] bg-[#242627] px-5 py-12 text-center">

                      <Globe
                        size={36}
                        className="mx-auto mb-3 text-[#A66A35]"
                      />

                      <h3 className="font-bold text-white">
                        No public notes available
                      </h3>

                      <p className="mt-2 text-sm text-gray-500">
                        Public notes from other users will appear here.
                      </p>

                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                      {filteredPublicNotes.map((note, index) => (
                        <NoteCard
                          key={note._id}
                          note={note}
                          index={index}
                          isPublic={true}
                        />
                      ))}
                    </div>
                  )}

                </div>
              </section>

              {/* FOOTER */}
              <footer className="mt-12 border-t border-[#383A3B] pt-6 pb-5">

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                  <div className="flex items-center gap-2">
                    <img
                      src="/icon.png"
                      alt="NoteVault"
                      className="h-6 w-6 object-contain"
                    />

                    <span className="text-sm font-bold text-gray-400">
                      Note<span className="text-[#E88A35]">Vault</span>
                    </span>
                  </div>

                  <p className="text-xs text-gray-600">
                    Organize your thoughts. Save your ideas.
                  </p>

                  <span className="text-xs text-gray-600">
                    Built with Next.js ⚡
                  </span>

                </div>

              </footer>

            </div>
          </div>
        </div>

        {/* DELETE MODAL */}
        {deleteModal && (
          <div
            onClick={() => setDeleteModal(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 15,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-xl border border-[#414141] bg-[#242627] p-6 shadow-2xl"
            >

              <div className="mb-5 flex items-center justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-400">
                  <Trash2 size={23} />
                </div>

                <button
                  onClick={() => setDeleteModal(null)}
                  className="rounded-lg p-2 text-gray-400 transition hover:bg-[#383A3B] hover:text-white"
                >
                  <X size={20} />
                </button>

              </div>

              <h2 className="text-xl font-bold text-white">
                Delete Note?
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                Are you sure you want to delete this note?
                This action cannot be undone.
              </p>

              <div className="mt-7 flex justify-end gap-3">

                <button
                  onClick={() => setDeleteModal(null)}
                  className="rounded-md border border-[#484848] px-5 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-[#383A3B]"
                >
                  Cancel
                </button>

                <button
                  onClick={() => deleteNote(deleteModal)}
                  className="rounded-md bg-red-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-600"
                >
                  Delete
                </button>

              </div>
            </motion.div>
          </div>
        )}

      </main>
    </PageWrapper>
  );
}
