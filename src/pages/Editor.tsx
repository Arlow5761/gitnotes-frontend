import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router';
import { Header } from '../components/layout/Header';
import { Btn } from '../components/ui/Btn';
import {
  Bold, Italic, Underline, Heading1, Heading2, Quote, Link as LinkIcon,
  List, ListOrdered, Check, ImageIcon, FileText, FileInput, X,
} from 'lucide-react';

export function Editor() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { id } = useParams();
  const source = params.get('source');
  const sourceMeta = params.get('meta');

  const [title, setTitle] = useState(id ? 'Catatan UTS Sistem Operasi' : '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const [toolbar, setToolbar] = useState<{ x: number; y: number } | null>(null);

  // Initialize editor content imperatively ONCE so subsequent re-renders
  // (autosave indicator, etc.) never wipe what the user typed.
  useEffect(() => {
    if (!editorRef.current) return;
    if (editorRef.current.innerHTML.trim() !== '') return;
    editorRef.current.innerHTML = id
      ? '<p>Catatan ini sudah berisi konten contoh. Klik dan mulai mengubah...</p><h2>Bab 1: Pengenalan</h2><p>Sistem operasi adalah perangkat lunak yang mengelola sumber daya komputer dan menyediakan layanan umum untuk program komputer.</p>'
      : '<p><br/></p>';
  }, [id]);

  // Debounced autosave indicator. Does NOT touch editor DOM.
  useEffect(() => {
    if (saved) return;
    setSaving(true);
    const t = setTimeout(() => { setSaving(false); setSaved(true); }, 800);
    return () => clearTimeout(t);
  }, [saved]);

  const exec = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    editorRef.current?.focus();
  };

  const handleSelection = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) { setToolbar(null); return; }
    const rect = sel.getRangeAt(0).getBoundingClientRect();
    if (rect.width === 0) { setToolbar(null); return; }
    setToolbar({ x: rect.left + rect.width / 2, y: rect.top - 50 });
  };

  const sourceInfo = () => {
    if (source === 'scan') return { icon: <ImageIcon size={12} />, text: 'Hasil Scan' };
    if (source === 'template') return { icon: <FileText size={12} />, text: `Template: ${sourceMeta ?? 'Catatan Kuliah'}` };
    if (source === 'import') return { icon: <FileInput size={12} />, text: `Import: ${sourceMeta ?? 'document.pdf'}` };
    return null;
  };
  const info = sourceInfo();

  return (
    <div className="min-h-screen">
      <Header
        back
        backTo="/"
        right={
          <>
            <span className="text-xs text-text-muted hidden sm:inline mr-2">
              {saving ? (
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" /> Menyimpan...
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5">
                  <Check size={12} className="text-success" /> Tersimpan
                </span>
              )}
            </span>
            <Btn onClick={() => navigate(`/my-note/${id ?? 'n3'}`)}>Selesai</Btn>
          </>
        }
      />

      <main className="max-w-[1280px] mx-auto px-6 py-12">
       <div className="max-w-[720px] mx-auto">
        {info && !dismissed && (
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full bg-indigo-velvet/30 border border-mauve-magic/30 text-xs text-mauve-soft anim-fade-up">
            {info.icon}
            <span>{info.text}</span>
            <button onClick={() => setDismissed(true)} className="hover:text-text-primary ml-1" aria-label="Dismiss">
              <X size={12} />
            </button>
          </div>
        )}

        <input
          value={title}
          onChange={(e) => { setTitle(e.target.value); setSaved(false); }}
          placeholder="Judul catatan..."
          className="w-full bg-transparent outline-none font-display font-bold text-text-primary placeholder:text-text-muted/40 mb-8"
          style={{ fontSize: '48px', lineHeight: 1.15 }}
        />

        {/* Mini toolbar always visible */}
        <div className="flex items-center gap-1 mb-6 pb-3 border-b border-white/5 sticky top-16 bg-amethyst-900/80 backdrop-blur z-10 -mx-2 px-2">
          <ToolBtn onClick={() => exec('bold')} icon={<Bold size={15} />} label="Bold" />
          <ToolBtn onClick={() => exec('italic')} icon={<Italic size={15} />} label="Italic" />
          <ToolBtn onClick={() => exec('underline')} icon={<Underline size={15} />} label="Underline" />
          <div className="w-px h-5 bg-white/10 mx-1" />
          <ToolBtn onClick={() => exec('formatBlock', 'H2')} icon={<Heading1 size={15} />} label="H1" />
          <ToolBtn onClick={() => exec('formatBlock', 'H3')} icon={<Heading2 size={15} />} label="H2" />
          <ToolBtn onClick={() => exec('formatBlock', 'BLOCKQUOTE')} icon={<Quote size={15} />} label="Quote" />
          <div className="w-px h-5 bg-white/10 mx-1" />
          <ToolBtn onClick={() => exec('insertUnorderedList')} icon={<List size={15} />} label="Bullet" />
          <ToolBtn onClick={() => exec('insertOrderedList')} icon={<ListOrdered size={15} />} label="Number" />
          <ToolBtn onClick={() => { const url = prompt('URL?'); if (url) exec('createLink', url); }} icon={<LinkIcon size={15} />} label="Link" />
        </div>

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={() => setSaved(false)}
          onMouseUp={handleSelection}
          onKeyUp={handleSelection}
          className="prose-reader min-h-[400px] outline-none"
          style={{ caretColor: '#c77dff' }}
        />

        {toolbar && (
          <div
            className="fixed z-50 glass rounded-xl shadow-2xl flex items-center gap-0.5 p-1 anim-fade-up"
            style={{ left: toolbar.x, top: toolbar.y, transform: 'translateX(-50%)' }}
          >
            <ToolBtn onClick={() => exec('bold')} icon={<Bold size={14} />} label="Bold" mini />
            <ToolBtn onClick={() => exec('italic')} icon={<Italic size={14} />} label="Italic" mini />
            <ToolBtn onClick={() => exec('underline')} icon={<Underline size={14} />} label="U" mini />
            <div className="w-px h-4 bg-white/10 mx-0.5" />
            <ToolBtn onClick={() => exec('formatBlock', 'H2')} icon={<Heading1 size={14} />} label="H1" mini />
            <ToolBtn onClick={() => exec('formatBlock', 'BLOCKQUOTE')} icon={<Quote size={14} />} label="Q" mini />
            <ToolBtn onClick={() => { const url = prompt('URL?'); if (url) exec('createLink', url); }} icon={<LinkIcon size={14} />} label="Link" mini />
          </div>
        )}
       </div>
      </main>
    </div>
  );
}

function ToolBtn({ onClick, icon, label, mini }: { onClick: () => void; icon: React.ReactNode; label: string; mini?: boolean }) {
  return (
    <button
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault()}
      aria-label={label}
      className={`focus-ring rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/10 transition-colors ${mini ? 'w-8 h-8' : 'w-9 h-9'} grid place-items-center`}
    >
      {icon}
    </button>
  );
}
