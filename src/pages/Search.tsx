import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Header } from '../components/layout/Header';
import { Btn } from '../components/ui/Btn';
import { Chip, VisibilityBadge, Avatar } from '../components/ui/Badges';
import {
  Search, FolderOpen, BookOpen, ChevronDown, Pencil, Star, Plus,
  FileText, Globe, Library,
} from 'lucide-react';
import { mockNotes, userById } from '../data/mock';

type Mode = 'private' | 'public';

export function SearchPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('private');
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<string[]>([]);
  const [sort, setSort] = useState('Terbaru');

  const myNotes = mockNotes.filter(n => n.authorId === 'u1');
  const publicNotes = mockNotes.filter(n => n.visibility === 'public' && n.authorId !== 'u1');
  const results = (mode === 'private' ? myNotes : publicNotes)
    .filter(n => n.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-screen">
      <Header back backTo="/" title="Cari Catatan" />
      <main className="max-w-[1024px] mx-auto px-6 py-8">
        {/* Tab switch */}
        <div className="relative mb-6 p-1 rounded-2xl bg-amethyst-800/60 border border-white/10 flex">
          <button
            onClick={() => setMode('private')}
            className={`relative z-10 flex-1 h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${mode === 'private' ? 'text-white' : 'text-text-secondary'}`}
          >
            <Library size={17} /> Catatan Saya
          </button>
          <button
            onClick={() => setMode('public')}
            className={`relative z-10 flex-1 h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${mode === 'public' ? 'text-white' : 'text-text-secondary'}`}
          >
            <Globe size={17} /> Jelajahi Publik
          </button>
          <div
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl gradient-primary glow-purple-sm transition-all"
            style={{ left: mode === 'private' ? '4px' : 'calc(50% + 0px)' }}
          />
        </div>

        {/* Search bar */}
        <div className="relative mb-5">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={mode === 'private' ? 'Cari catatan kamu...' : 'Cari catatan dari komunitas...'}
            className="focus-ring w-full h-12 pl-12 pr-4 rounded-xl bg-amethyst-800/50 border border-white/10 text-text-primary placeholder:text-text-muted"
          />
        </div>

        {/* Filters & sort */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs text-text-muted mr-1">Filter:</span>
          {['Tag: Latsol', 'Koleksi: Kuliah'].map(f => (
            <Chip key={f} active onRemove={() => setFilters(filters.filter(x => x !== f))}>{f}</Chip>
          ))}
          <button className="inline-flex items-center gap-1 h-7 px-3 rounded-full text-xs font-medium text-text-secondary hover:text-text-primary border border-dashed border-white/15 hover:border-white/30">
            <Plus size={11} /> Tambah Filter
          </button>
          <div className="flex-1" />
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none focus-ring h-9 pl-3 pr-9 rounded-lg bg-white/5 border border-white/10 text-sm text-text-primary cursor-pointer"
            >
              <option className="bg-amethyst-800">Terbaru</option>
              <option className="bg-amethyst-800">Terlama</option>
              <option className="bg-amethyst-800">Rating Tertinggi</option>
              <option className="bg-amethyst-800">Paling Populer</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>
        </div>

        {/* Results */}
        <div className="text-xs text-text-muted mb-3">{results.length} hasil ditemukan</div>
        <div className="rounded-2xl card-surface overflow-hidden">
          {results.length === 0 && (
            <div className="p-12 text-center">
              <FolderOpen size={40} className="mx-auto text-text-muted/40 mb-3" />
              <div className="text-text-secondary">
                {mode === 'private' ? 'Belum ada catatan kamu yang cocok' : 'Belum ada hasil dari komunitas'}
              </div>
            </div>
          )}
          {results.map(n => mode === 'private' ? (
            <PrivateRow key={n.id} note={n} onOpen={() => navigate(`/my-note/${n.id}`)} onEdit={() => navigate(`/editor/${n.id}`)} />
          ) : (
            <PublicRow key={n.id} note={n} onOpen={() => navigate(`/note/${n.id}`)} />
          ))}
        </div>
      </main>
    </div>
  );
}

function PrivateRow({ note, onOpen, onEdit }: { note: typeof mockNotes[0]; onOpen: () => void; onEdit: () => void }) {
  return (
    <div onClick={onOpen} className="group flex items-center gap-4 px-5 py-4 border-b border-white/5 last:border-0 hover:bg-indigo-velvet/20 cursor-pointer transition-colors">
      <div className="w-10 h-10 rounded-lg bg-amethyst-900/50 border border-white/10 grid place-items-center shrink-0">
        <FileText size={18} className="text-mauve-soft" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-text-primary truncate">{note.title}</span>
          <VisibilityBadge visibility={note.visibility} />
        </div>
        <div className="text-xs text-text-muted mt-1 truncate">
          {note.modifiedAt} · {note.tags.slice(0, 2).join(', ')}
        </div>
      </div>
      <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="p-2 rounded-lg hover:bg-white/10 text-text-secondary hover:text-mauve-soft transition-colors" aria-label="Edit">
        <Pencil size={16} />
      </button>
    </div>
  );
}

function PublicRow({ note, onOpen }: { note: typeof mockNotes[0]; onOpen: () => void }) {
  const author = userById(note.authorId);
  return (
    <div onClick={onOpen} className="flex items-center gap-4 px-5 py-4 border-b border-white/5 last:border-0 hover:bg-indigo-velvet/20 cursor-pointer transition-colors">
      <BookOpen size={20} className="text-mauve-soft shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-text-primary truncate">{note.title}</div>
        <div className="flex items-center gap-2 mt-1.5">
          <Avatar user={author} size={20} />
          <span className="text-xs text-text-secondary">{author.name}</span>
          <span className="text-text-muted">·</span>
          <span className="text-xs text-text-muted">{note.modifiedAt}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 text-sm text-warning shrink-0">
        <Star size={14} className="fill-warning" /> {note.rating.toFixed(1)}
      </div>
      <Btn size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); onOpen(); }}>Lihat</Btn>
    </div>
  );
}
