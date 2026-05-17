import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { Header } from '../components/layout/Header';
import { Avatar, Chip } from '../components/ui/Badges';
import { RatingModal } from '../components/modals/RatingModal';
import { Star, Bookmark, MessageSquare, Share2, Clock } from 'lucide-react';
import { noteById, userById, mockComments } from '../data/mock';

export function NoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const note = noteById(id);
  const author = userById(note.authorId);
  const [ratingOpen, setRatingOpen] = useState(false);

  const commentCount = mockComments.filter(c => c.noteId === note.id).length || 24;

  return (
    <div className="min-h-screen">
      <Header back backTo="/search" minimal />
      <article className="max-w-[720px] mx-auto px-6 py-12 relative">
        {/* Floating action sidebar */}
        <div className="hidden lg:flex absolute -left-20 top-32 flex-col gap-1 sticky-actions">
          <FloatBtn onClick={() => setRatingOpen(true)} icon={<Star size={18} />} label="Rating" />
          <FloatBtn icon={<Bookmark size={18} />} label="Simpan" />
          <FloatBtn onClick={() => navigate(`/comments/${note.id}`)} icon={<MessageSquare size={18} />} label="Komentar" badge={commentCount} />
          <FloatBtn icon={<Share2 size={18} />} label="Share" />
        </div>

        <h1 className="font-display font-bold text-text-primary mb-6" style={{ fontSize: '48px', lineHeight: 1.1 }}>
          {note.title}
        </h1>

        <div className="flex items-center gap-3 mb-3">
          <Avatar user={author} size={44} />
          <div>
            <div className="text-sm text-text-secondary">oleh <span className="font-semibold text-text-primary">{author.name}</span></div>
            <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
              <span>{note.modifiedAt}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1"><Clock size={11} /> {note.readMinutes} min read</span>
            </div>
          </div>
        </div>

        <button onClick={() => setRatingOpen(true)} className="inline-flex items-center gap-2 mb-10 px-3 py-1.5 rounded-full bg-warning/10 border border-warning/30 hover:bg-warning/15 transition-colors">
          <Star size={14} className="fill-warning text-warning" />
          <span className="text-sm font-semibold text-warning">{note.rating.toFixed(1)}</span>
          <span className="text-xs text-text-muted">({note.ratingCount.toLocaleString()} ratings)</span>
        </button>

        <div className="prose-reader" dangerouslySetInnerHTML={{ __html: note.content }} />

        {/* Sticky action bar mobile */}
        <div className="lg:hidden sticky bottom-4 mt-12 glass rounded-2xl p-2 flex items-center justify-around">
          <FloatBtn onClick={() => setRatingOpen(true)} icon={<Star size={18} />} label="Rating" inline />
          <FloatBtn icon={<Bookmark size={18} />} label="Simpan" inline />
          <FloatBtn onClick={() => navigate(`/comments/${note.id}`)} icon={<MessageSquare size={18} />} label="Komentar" inline />
          <FloatBtn icon={<Share2 size={18} />} label="Share" inline />
        </div>

        {/* Tags + author bio */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-wrap gap-2 mb-8">
            {note.tags.map(t => <Chip key={t}>{t}</Chip>)}
          </div>
          <div className="card-surface rounded-2xl p-6 flex items-start gap-4">
            <Avatar user={author} size={56} />
            <div className="flex-1">
              <div className="font-display font-semibold text-text-primary">{author.name}</div>
              <div className="text-sm text-text-secondary mt-1">
                Penulis aktif di GitNotes. Berbagi catatan seputar teknologi, pembelajaran, dan refleksi pribadi.
              </div>
            </div>
            <button className="text-sm text-mauve-soft hover:text-mauve-magic font-medium">Ikuti</button>
          </div>

          <div className="mt-10">
            <h3 className="font-display font-semibold text-lg text-text-primary mb-4">Catatan terkait</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link to="/note/n2" className="block card-surface rounded-xl p-4 card-hover">
                <div className="font-semibold text-text-primary line-clamp-1">Aljabar Linear untuk Programmer</div>
                <div className="text-sm text-text-muted mt-2 line-clamp-2">Vector, matrix, eigenvalue — semua yang perlu kamu tahu sebelum nyebur ke ML.</div>
              </Link>
              <Link to="/note/n6" className="block card-surface rounded-xl p-4 card-hover">
                <div className="font-semibold text-text-primary line-clamp-1">Design Pattern dalam Praktik</div>
                <div className="text-sm text-text-muted mt-2 line-clamp-2">Observer, Factory, Singleton — kapan benar-benar pakai.</div>
              </Link>
            </div>
          </div>
        </div>
      </article>

      <RatingModal open={ratingOpen} onClose={() => setRatingOpen(false)} noteTitle={note.title} />
    </div>
  );
}

export function FloatBtn({ icon, label, onClick, badge, inline }: { icon: React.ReactNode; label: string; onClick?: () => void; badge?: number; inline?: boolean }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`focus-ring relative group rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/10 transition-colors grid place-items-center ${inline ? 'h-11 px-3 flex flex-col gap-0.5' : 'w-11 h-11'}`}
    >
      {icon}
      {inline && <span className="text-[10px]">{label}</span>}
      {badge !== undefined && (
        <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-mauve-magic text-amethyst-900 text-[9px] font-bold grid place-items-center">{badge}</span>
      )}
      {!inline && (
        <span className="absolute left-full ml-3 px-2 py-1 rounded bg-amethyst-800 text-xs text-text-primary opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity border border-white/10">
          {label}
        </span>
      )}
    </button>
  );
}
