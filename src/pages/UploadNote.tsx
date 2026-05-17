import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Header } from '../components/layout/Header';
import { Btn } from '../components/ui/Btn';
import { VisibilityBadge, Chip, Avatar } from '../components/ui/Badges';
import { VisibilityModal } from '../components/modals/VisibilityModal';
import { Copy, Upload, Sparkles, Check } from 'lucide-react';
import { noteById, userById } from '../data/mock';

export function UploadNote() {
  const navigate = useNavigate();
  const { noteId } = useParams();
  const note = noteById(noteId);
  const author = userById(note.authorId);
  const [visOpen, setVisOpen] = useState(false);
  const [visibility, setVisibility] = useState(note.visibility);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const link = `gitnotes.com/${note.id}-xyz`;

  if (success) {
    return (
      <div className="min-h-screen">
        <Header back backTo={`/my-note/${noteId}`} />
        <main className="max-w-[600px] mx-auto px-6 py-24 text-center anim-fade-up">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full gradient-primary grid place-items-center glow-purple">
            <Check size={48} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="font-display font-bold text-3xl text-text-primary mb-3">Berhasil Diunggah! 🎉</h1>
          <p className="text-text-secondary mb-8">Catatanmu sekarang tersedia di GitNotes. Bagikan link untuk mendapatkan rating dan komentar.</p>
          <div className="card-surface rounded-xl p-4 flex items-center gap-3 mb-6">
            <code className="font-mono text-sm text-mauve-soft flex-1 text-left truncate">{link}</code>
            <Btn variant="secondary" size="sm" onClick={() => { navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>
              {copied ? <><Check size={14} /> Tersalin</> : <><Copy size={14} /> Salin</>}
            </Btn>
          </div>
          <div className="flex gap-3 justify-center">
            <Btn variant="secondary" onClick={() => navigate(`/my-note/${noteId}`)}>Kembali ke Catatan</Btn>
            <Btn onClick={() => navigate(`/note/${noteId}`)}>Lihat Halaman Publik →</Btn>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header back backTo={`/my-note/${noteId}`} title="Unggah ke GitNotes" />
      <main className="max-w-[1100px] mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8">
          {/* Preview */}
          <div className="card-surface rounded-2xl p-8">
            <div className="text-xs text-text-muted uppercase tracking-wider mb-4">Preview</div>
            <h1 className="font-display font-bold text-text-primary mb-4 text-3xl leading-tight">{note.title}</h1>
            <div className="flex items-center gap-3 mb-6">
              <Avatar user={author} size={36} />
              <div>
                <div className="text-sm font-medium text-text-primary">{author.name}</div>
                <div className="text-xs text-text-muted">{note.readMinutes} min read</div>
              </div>
            </div>
            <div className="prose-reader text-base line-clamp-[12]" dangerouslySetInnerHTML={{ __html: note.content }} />
            <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/10">
              {note.tags.map(t => <Chip key={t}>{t}</Chip>)}
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-5">
            <div className="card-surface rounded-2xl p-5">
              <div className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">Visibilitas</div>
              <div className="flex items-center gap-3">
                <VisibilityBadge visibility={visibility} size="md" />
                <button onClick={() => setVisOpen(true)} className="ml-auto text-sm text-mauve-soft hover:text-mauve-magic font-medium">
                  Ubah
                </button>
              </div>
              <p className="text-xs text-text-muted mt-3 leading-relaxed">
                {visibility === 'public' ? 'Catatan akan muncul di pencarian publik dan dapat dirating siapapun.' : visibility === 'private' ? 'Hanya kamu yang dapat mengakses catatan ini.' : 'Hanya yang punya link bisa mengakses.'}
              </p>
            </div>

            <div className="card-surface rounded-2xl p-5">
              <div className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">Pranala Catatan</div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-amethyst-900/50 border border-white/5">
                <code className="font-mono text-xs text-mauve-soft truncate flex-1">{link}</code>
                <button
                  onClick={() => { navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                  className="p-1.5 hover:bg-white/10 rounded text-text-secondary hover:text-text-primary"
                  aria-label="Copy"
                >
                  {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div className="card-surface rounded-2xl p-5">
              <div className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">Tag Terpasang</div>
              <div className="flex flex-wrap gap-2">
                {note.tags.map(t => <Chip key={t}>{t}</Chip>)}
              </div>
            </div>

            <Btn size="lg" className="w-full glow-purple" onClick={() => setSuccess(true)}>
              <Upload size={17} /> Unggah Sekarang
              <Sparkles size={15} className="text-mauve-soft" />
            </Btn>
            <p className="text-xs text-text-muted text-center">
              Dengan mengunggah, kamu menyetujui ketentuan komunitas GitNotes.
            </p>
          </div>
        </div>
      </main>

      <VisibilityModal open={visOpen} onClose={() => setVisOpen(false)} noteTitle={note.title} current={visibility} onSave={setVisibility} />
    </div>
  );
}
