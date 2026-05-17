import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Header } from '../components/layout/Header';
import { Btn } from '../components/ui/Btn';
import { Send } from 'lucide-react';
import { noteById } from '../data/mock';

export function CommentForm() {
  const navigate = useNavigate();
  const { noteId } = useParams();
  const note = noteById(noteId);
  const [text, setText] = useState('');
  const max = 300;
  const counterColor =
    text.length >= 290 ? 'text-danger' :
    text.length >= 250 ? 'text-warning' :
    'text-text-muted';

  return (
    <div className="min-h-screen">
      <Header back title={note.title} />
      <main className="max-w-[720px] mx-auto px-6 py-10">
        <div className="mb-6">
          <div className="text-xs text-text-muted uppercase tracking-wider mb-2">Tulis Komentar untuk</div>
          <h1 className="font-display font-bold text-2xl text-text-primary">{note.title}</h1>
        </div>

        <div className="relative card-surface rounded-2xl">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, max))}
            placeholder="Bagikan pendapatmu tentang catatan ini..."
            autoFocus
            className="focus-ring w-full bg-transparent p-5 pb-12 outline-none text-text-primary placeholder:text-text-muted resize-none rounded-2xl"
            style={{ minHeight: 220 }}
          />
          <div className={`absolute bottom-4 right-5 text-xs font-mono font-medium ${counterColor}`}>
            {text.length}/{max}
          </div>
        </div>

        <div className="flex justify-end mt-5 gap-3">
          <Btn variant="secondary" onClick={() => navigate(`/comments/${noteId}`)}>Batal</Btn>
          <Btn disabled={!text.trim()} onClick={() => navigate(`/comments/${noteId}`)}>
            <Send size={14} /> Kirim Komentar
          </Btn>
        </div>
      </main>
    </div>
  );
}
