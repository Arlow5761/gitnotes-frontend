import { useNavigate, useParams } from 'react-router';
import { Header } from '../components/layout/Header';
import { Btn } from '../components/ui/Btn';
import { Avatar } from '../components/ui/Badges';
import { MessageSquarePlus, ChevronDown } from 'lucide-react';
import { noteById, mockComments, userById } from '../data/mock';

export function Comments() {
  const navigate = useNavigate();
  const { noteId } = useParams();
  const note = noteById(noteId);
  const comments = mockComments.filter(c => c.noteId === note.id);
  const total = comments.length;

  return (
    <div className="min-h-screen">
      <Header back title={note.title} right={
        note.visibility === 'public' && (
          <Btn size="sm" onClick={() => navigate(`/comment/${note.id}`)}>
            <MessageSquarePlus size={14} /> Buat Komentar
          </Btn>
        )
      } />
      <main className="max-w-[720px] mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display font-bold text-2xl text-text-primary">
            Komentar <span className="text-text-muted">({total})</span>
          </h1>
          <div className="relative">
            <select className="appearance-none focus-ring h-9 pl-3 pr-9 rounded-lg bg-white/5 border border-white/10 text-sm text-text-primary cursor-pointer">
              <option className="bg-amethyst-800">Terbaru</option>
              <option className="bg-amethyst-800">Terlama</option>
              <option className="bg-amethyst-800">Paling Disukai</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1">
          {comments.map((c, i) => {
            const user = userById(c.userId);
            return (
              <div key={c.id} className="anim-fade-up py-5 border-b border-white/5 last:border-0" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-start gap-3 mb-2.5">
                  <Avatar user={user} size={40} />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-text-primary">{user.name}</div>
                    <div className="text-xs text-text-muted mt-0.5">{c.date}</div>
                  </div>
                </div>
                <p className="text-text-secondary leading-relaxed pl-[52px]">{c.content}</p>
              </div>
            );
          })}
        </div>

        {total === 0 && (
          <div className="text-center py-16 text-text-muted">
            Belum ada komentar. Jadilah yang pertama berkomentar!
          </div>
        )}
      </main>
    </div>
  );
}
