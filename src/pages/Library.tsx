import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { Header } from '../components/layout/Header';
import { Btn } from '../components/ui/Btn';
import { VisibilityBadge } from '../components/ui/Badges';
import { Modal } from '../components/ui/Modal';
import {
  Search, FolderPlus, Plus, Folder, FileText, ChevronRight,
  Pencil, Trash2, ChevronDown, UploadCloud, FileType2,
  Home, ChevronLeft, ChevronRight as ChevronRightArrow,
} from 'lucide-react';
import { mockNotes, mockFolders, folderColors, folderById, userById, type Folder as FolderT } from '../data/mock';

export function Library() {
  const navigate = useNavigate();
  const { folderId } = useParams();
  const currentFolder = folderById(folderId);
  const [openNew, setOpenNew] = useState(false);
  const [folderModal, setFolderModal] = useState<{ open: boolean; folder?: FolderT }>({ open: false });

  const folders = useMemo(() => mockFolders.filter(f => (f.parent ?? null) === (folderId ?? null)), [folderId]);
  const notes = useMemo(() => mockNotes.filter(n => (n.folderId ?? null) === (folderId ?? null)), [folderId]);
  const recent = mockNotes.slice(0, 6);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-[1280px] mx-auto px-6 py-8">
        {/* Title + breadcrumbs */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 text-sm text-text-muted mb-2">
            <Link to="/" className="hover:text-text-primary flex items-center gap-1">
              <Home size={13} /> Beranda
            </Link>
            {currentFolder && (
              <>
                <ChevronRight size={13} />
                <span className="text-text-primary font-medium">{currentFolder.name}</span>
              </>
            )}
          </div>
          <h1 className="font-display font-bold text-3xl text-text-primary">
            {currentFolder ? currentFolder.name : 'Catatan Saya'}
          </h1>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            placeholder={`Cari di ${currentFolder?.name ?? 'semua catatan'}...`}
            className="focus-ring w-full h-12 pl-12 pr-4 rounded-xl bg-amethyst-800/50 border border-white/10 text-text-primary placeholder:text-text-muted"
          />
        </div>

        {/* Recently accessed */}
        {!folderId && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-lg text-text-primary">Diakses Sebelumnya</h2>
              <button className="text-sm text-mauve-soft hover:text-mauve-magic">Lihat semua →</button>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory -mx-6 px-6">
              {recent.map(n => {
                const author = userById(n.authorId);
                return (
                  <Link
                    key={n.id}
                    to={n.visibility === 'public' ? `/note/${n.id}` : `/my-note/${n.id}`}
                    className="snap-start shrink-0 w-64 card-surface rounded-xl p-4 card-hover"
                  >
                    <div className="h-24 mb-3 rounded-lg gradient-primary opacity-70 grid place-items-center">
                      <FileText size={28} className="text-white/80" />
                    </div>
                    <div className="font-semibold text-text-primary truncate">{n.title}</div>
                    <div className="text-xs text-text-muted mt-1 truncate">
                      {author.name} · {n.modifiedAt}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <h2 className="font-display font-semibold text-lg text-text-primary mr-auto">
            Folder & Catatan
          </h2>
          <div className="relative">
            <Btn onClick={() => setOpenNew(!openNew)}>
              <Plus size={15} /> Baru <ChevronDown size={14} />
            </Btn>
            {openNew && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setOpenNew(false)} />
                <div className="absolute right-0 mt-2 w-56 glass rounded-xl shadow-2xl z-20 overflow-hidden anim-fade-up">
                  {[
                    { icon: FileText, label: 'Catatan Kosong', to: '/editor' },
                    { icon: UploadCloud, label: 'Upload File / Scan', to: '/upload' },
                    { icon: FileType2, label: 'Pilih Template', to: '/templates' },
                  ].map(it => (
                    <button
                      key={it.label}
                      onClick={() => { setOpenNew(false); navigate(it.to); }}
                      className="w-full px-4 py-3 flex items-center gap-3 text-sm hover:bg-white/5 text-text-primary text-left"
                    >
                      <it.icon size={16} className="text-mauve-soft" />
                      {it.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <Btn variant="secondary" onClick={() => setFolderModal({ open: true })}>
            <FolderPlus size={15} /> Folder Baru
          </Btn>
        </div>

        {/* List */}
        <div className="rounded-2xl card-surface overflow-hidden">
          {folders.map(f => (
            <FolderRow key={f.id} folder={f} onOpen={() => navigate(`/folder/${f.id}`)} onEdit={() => setFolderModal({ open: true, folder: f })} />
          ))}
          {notes.map(n => (
            <NoteRow key={n.id} note={n} onClick={() => navigate(n.visibility === 'public' ? `/note/${n.id}` : `/my-note/${n.id}`)} />
          ))}
          {folders.length === 0 && notes.length === 0 && (
            <div className="p-10 text-center text-text-muted">Folder ini masih kosong.</div>
          )}
        </div>

        <Pagination />
      </main>

      <FolderFormModal
        open={folderModal.open}
        folder={folderModal.folder}
        onClose={() => setFolderModal({ open: false })}
      />
    </div>
  );
}

function FolderRow({ folder, onOpen, onEdit }: { folder: typeof mockFolders[0]; onOpen: () => void; onEdit: () => void }) {
  return (
    <div
      onClick={onOpen}
      className="group flex items-center gap-4 px-5 py-4 border-b border-white/5 hover:bg-indigo-velvet/20 cursor-pointer transition-colors"
    >
      <div
        className="w-10 h-10 rounded-lg grid place-items-center shrink-0"
        style={{ background: `${folder.color}25`, boxShadow: `inset 0 0 0 1px ${folder.color}50` }}
      >
        <Folder size={20} fill={folder.color} stroke={folder.color} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-text-primary truncate">{folder.name}</div>
        <div className="text-xs text-text-muted mt-0.5">{folder.count} catatan</div>
      </div>
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
        <button
          className="p-2 rounded-lg hover:bg-white/10 text-text-secondary hover:text-mauve-soft transition-colors"
          aria-label="Edit folder"
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
        >
          <Pencil size={15} />
        </button>
        <button className="p-2 rounded-lg hover:bg-danger/20 text-text-secondary hover:text-danger" aria-label="Hapus" onClick={(e) => e.stopPropagation()}>
          <Trash2 size={15} />
        </button>
      </div>
      <ChevronRight size={16} className="text-text-muted shrink-0" />
    </div>
  );
}

function NoteRow({ note, onClick }: { note: typeof mockNotes[0]; onClick: () => void }) {
  const author = userById(note.authorId);
  return (
    <div
      onClick={onClick}
      className="group flex items-center gap-4 px-5 py-4 border-b border-white/5 last:border-b-0 hover:bg-indigo-velvet/20 cursor-pointer transition-colors"
    >
      <div className="w-10 h-10 rounded-lg bg-amethyst-900/50 border border-white/10 grid place-items-center shrink-0">
        <FileText size={18} className="text-mauve-soft" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-text-primary truncate">{note.title}</span>
          <VisibilityBadge visibility={note.visibility} />
        </div>
        <div className="text-xs text-text-muted mt-0.5 truncate">
          {author.name} · {note.modifiedAt}
        </div>
      </div>
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
        <button className="p-2 rounded-lg hover:bg-white/10 text-text-secondary" aria-label="Edit" onClick={(e) => e.stopPropagation()}>
          <Pencil size={15} />
        </button>
        <button className="p-2 rounded-lg hover:bg-danger/20 text-text-secondary hover:text-danger" aria-label="Hapus" onClick={(e) => e.stopPropagation()}>
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

function Pagination() {
  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button className="w-9 h-9 rounded-lg hover:bg-white/5 text-text-secondary grid place-items-center"><ChevronLeft size={16} /></button>
      {[1, 2, 3, '…', 8].map((p, i) => (
        <button
          key={i}
          className={`min-w-9 h-9 px-3 rounded-lg text-sm font-medium grid place-items-center ${
            p === 1 ? 'gradient-primary text-white' : 'text-text-secondary hover:bg-white/5'
          }`}
        >
          {p}
        </button>
      ))}
      <button className="w-9 h-9 rounded-lg hover:bg-white/5 text-text-secondary grid place-items-center"><ChevronRightArrow size={16} /></button>
    </div>
  );
}

function FolderFormModal({ open, onClose, folder }: { open: boolean; onClose: () => void; folder?: FolderT }) {
  const isEdit = !!folder;
  const [name, setName] = useState(folder?.name ?? '');
  const [color, setColor] = useState<string>(folder?.color ?? folderColors[5]);

  useEffect(() => {
    if (open) {
      setName(folder?.name ?? '');
      setColor(folder?.color ?? folderColors[5]);
    }
  }, [open, folder]);

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Folder' : 'Folder Baru'} subtitle={isEdit ? `Mengubah "${folder!.name}"` : undefined}
      footer={
        <div className="flex gap-2">
          {isEdit && (
            <Btn variant="danger" onClick={onClose}>
              <Trash2 size={14} /> Hapus
            </Btn>
          )}
          <Btn variant="secondary" className="flex-1" onClick={onClose}>Batal</Btn>
          <Btn className="flex-1" onClick={onClose} disabled={!name.trim()}>
            {isEdit ? 'Simpan Perubahan' : 'Buat Folder'}
          </Btn>
        </div>
      }>
      <div className="space-y-5">
        <div>
          <label className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2 block">Nama Folder</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            placeholder="Contoh: Catatan Kuliah"
            className="focus-ring w-full h-11 px-3 rounded-lg bg-amethyst-900/50 border border-white/10 text-text-primary placeholder:text-text-muted"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3 block">Warna</label>
          <div className="flex flex-wrap gap-3">
            {folderColors.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-10 h-10 rounded-full transition-all grid place-items-center ${color === c ? 'ring-2 ring-offset-2 ring-offset-amethyst-800 ring-mauve-magic scale-110' : 'hover:scale-110'}`}
                style={{ background: c }}
                aria-label={`Color ${c}`}
              >
                {color === c && <span className="text-white">✓</span>}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amethyst-900/50 border border-white/5">
          <div className="w-10 h-10 rounded-lg grid place-items-center" style={{ background: `${color}25`, boxShadow: `inset 0 0 0 1px ${color}50` }}>
            <Folder size={20} fill={color} stroke={color} />
          </div>
          <div>
            <div className="font-medium text-text-primary">{name || 'Folder Baru'}</div>
            <div className="text-xs text-text-muted">Preview</div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
