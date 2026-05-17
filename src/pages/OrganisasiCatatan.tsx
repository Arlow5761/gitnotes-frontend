import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Folder,
  FileText,
  Pencil,
  Minus,
  Plus,
  Search,
  Sun,
  Moon,
} from "lucide-react";

function useTheme() {
  const [dark, setDark] = useState(
    () => document.documentElement.classList.contains("dark")
  );
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);
  return { dark, toggle: () => setDark((d) => !d) };
}

// --- Mock Data ---

interface NoteCard {
  id: number;
  title: string;
  author: string;
  date: string;
}

interface ListItem {
  id: number;
  type: "note" | "folder";
  title: string;
  date: string;
  checked: boolean;
}

const recentCards: NoteCard[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  title: "Catatan Dummy",
  author: "Penulis Dummy",
  date: "01-01-2026",
}));

const initialItems: ListItem[] = [
  { id: 1, type: "note", title: "Catatan Dummy", date: "01-01-2026", checked: false },
  { id: 2, type: "folder", title: "Folder Dummy", date: "01-01-2026", checked: false },
  { id: 3, type: "folder", title: "Folder Dummy", date: "01-01-2026", checked: false },
  { id: 4, type: "folder", title: "Folder Dummy", date: "01-01-2026", checked: false },
  { id: 5, type: "folder", title: "Folder Dummy", date: "01-01-2026", checked: false },
];

const ITEMS_PER_PAGE = 10;
const VISIBLE_CARDS = 5;

// --- Component ---

export default function OrganisasiCatatan() {
  const { dark, toggle } = useTheme();
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<ListItem[]>(initialItems);
  const [page, setPage] = useState(1);
  const [cardOffset, setCardOffset] = useState(0);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const addMenuRef = useRef<HTMLDivElement>(null);

  // Filtered + paginated items
  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentItems = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // Card navigation
  const maxCardOffset = Math.max(0, recentCards.length - VISIBLE_CARDS);

  function toggleCheck(id: number) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  }

  function removeItem(id: number) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function getTodayDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    return `${day}-${month}-${year}`;
  }

  function createFolder() {
    const trimmed = folderName.trim();
    if (!trimmed) return;

    const nextId =
      items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;
    const newFolder: ListItem = {
      id: nextId,
      type: "folder",
      title: trimmed,
      date: getTodayDate(),
      checked: false,
    };

    setItems((prev) => [newFolder, ...prev]);
    setPage(1);
    setFolderName("");
    setFolderModalOpen(false);
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground px-6 py-5 font-sans">
      {/* Top bar */}
      <div className="flex items-center justify-end mb-5">
        <button
          onClick={toggle}
          className="border border-border rounded p-1.5 hover:bg-muted text-foreground"
          aria-label="Toggle theme"
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-extrabold mb-4 text-foreground tracking-tight">Organisasi Catatan</h1>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          placeholder="Cari"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full border border-border rounded pl-9 pr-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* Recently Accessed */}
      <section className="mb-6">
        <h2 className="text-sm font-medium text-muted-foreground mb-3">
          Diakses Sebelumnya
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCardOffset((o) => Math.max(0, o - 1))}
            disabled={cardOffset === 0}
            className="border border-border rounded p-1 disabled:opacity-30 hover:bg-muted text-foreground"
          >
            <ChevronLeft size={14} />
          </button>

          <div className="flex gap-3 flex-1 overflow-hidden">
            {recentCards
              .slice(cardOffset, cardOffset + VISIBLE_CARDS)
              .map((card) => (
                <div
                  key={card.id}
                  className="flex-1 min-w-0 border border-border rounded p-2 flex flex-col items-center text-center cursor-pointer hover:bg-muted"
                >
                  <div className="w-full aspect-[4/3] bg-muted rounded mb-2 flex items-center justify-center">
                    <FileText size={20} className="text-muted-foreground" />
                  </div>
                  <p className="text-xs font-medium truncate w-full text-foreground">
                    {card.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate w-full">
                    {card.author}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{card.date}</p>
                </div>
              ))}
          </div>

          <button
            onClick={() => setCardOffset((o) => Math.min(maxCardOffset, o + 1))}
            disabled={cardOffset >= maxCardOffset}
            className="border border-border rounded p-1 disabled:opacity-30 hover:bg-muted text-foreground"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </section>

      {/* Note List */}
      <section>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-muted-foreground">Daftar Catatan</h2>
          <div className="flex gap-2 relative">
            <div className="relative" ref={addMenuRef}>
              <button
                onClick={() => setAddMenuOpen((o) => !o)}
                className="flex items-center gap-1 border border-border rounded px-3 py-1 text-sm text-foreground hover:bg-muted"
              >
                <Plus size={13} />
                Catatan
              </button>
              {addMenuOpen && (
                <div className="absolute right-0 top-full mt-1 border border-border rounded bg-popover text-popover-foreground shadow-md z-10 min-w-[100px]">
                  {["Scan", "Import", "Baru"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setAddMenuOpen(false)}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-muted"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setFolderModalOpen(true)}
              className="flex items-center gap-1 border border-border rounded px-3 py-1 text-sm text-foreground hover:bg-muted"
            >
              <Plus size={13} />
              Folder
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex flex-col gap-2">
          {currentItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 border border-border rounded px-3 py-2 bg-card text-card-foreground"
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleCheck(item.id)}
                className="w-4 h-4 shrink-0 accent-primary"
              />
              {item.type === "folder" ? (
                <Folder size={16} className="text-muted-foreground shrink-0" />
              ) : null}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-card-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
              {item.type === "note" && (
                <button className="text-muted-foreground hover:text-foreground shrink-0">
                  <Pencil size={14} />
                </button>
              )}
              <button
                onClick={() => removeItem(item.id)}
                className="text-muted-foreground hover:text-destructive shrink-0"
              >
                <Minus size={14} />
              </button>
            </div>
          ))}

          {currentItems.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              Tidak ada catatan ditemukan.
            </p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="border border-border rounded p-1 disabled:opacity-30 hover:bg-muted text-foreground"
          >
            <ArrowLeft size={14} />
          </button>
          <span className="border border-border rounded px-3 py-1 text-sm text-foreground">
            {page}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="border border-border rounded p-1 disabled:opacity-30 hover:bg-muted text-foreground"
          >
            <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {folderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="w-full max-w-md rounded-lg border border-border bg-card text-card-foreground p-5 shadow-xl">
            <h3 className="text-lg font-bold mb-2">Buat Folder</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Masukkan nama folder baru.
            </p>
            <input
              autoFocus
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") createFolder();
              }}
              placeholder="Nama folder"
              className="w-full border border-input rounded px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setFolderModalOpen(false);
                  setFolderName("");
                }}
                className="px-3 py-1.5 text-sm rounded border border-border hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={createFolder}
                disabled={!folderName.trim()}
                className="px-3 py-1.5 text-sm rounded bg-primary text-primary-foreground disabled:opacity-50 hover:opacity-90"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
