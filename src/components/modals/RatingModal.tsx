import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Btn } from '../ui/Btn';
import { Star } from 'lucide-react';

export function RatingModal({ open, onClose, noteTitle }: { open: boolean; onClose: () => void; noteTitle: string }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');

  const value = hover || rating;

  const handleClick = (i: number, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const half = e.clientX - rect.left < rect.width / 2;
    setRating(i + (half ? 0.5 : 1));
  };
  const handleMove = (i: number, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const half = e.clientX - rect.left < rect.width / 2;
    setHover(i + (half ? 0.5 : 1));
  };

  return (
    <Modal open={open} onClose={onClose} title="Berikan Rating" subtitle={noteTitle}
      footer={<Btn className="w-full" size="lg" onClick={onClose} disabled={rating === 0}>Kirim Rating</Btn>}>
      <div className="space-y-5">
        <div className="text-center py-4">
          <div className="flex justify-center gap-2 mb-4" onMouseLeave={() => setHover(0)}>
            {[0, 1, 2, 3, 4].map(i => {
              const fill = value - i;
              return (
                <button
                  key={i}
                  onClick={(e) => handleClick(i, e)}
                  onMouseMove={(e) => handleMove(i, e)}
                  className="focus-ring relative w-12 h-12 transition-transform hover:scale-110"
                  aria-label={`Rating ${i + 1}`}
                >
                  <Star size={48} className="absolute inset-0 text-white/15" strokeWidth={1.5} />
                  <div className="absolute inset-0 overflow-hidden" style={{ width: `${Math.max(0, Math.min(1, fill)) * 100}%` }}>
                    <Star size={48} className="text-warning fill-warning drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" strokeWidth={1.5} />
                  </div>
                </button>
              );
            })}
          </div>
          <div className="text-sm text-text-secondary">
            Rating kamu: <span className="text-text-primary font-bold text-base">{value.toFixed(1)}</span> <span className="text-text-muted">/ 5</span>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2 block">Komentar singkat (opsional)</label>
          <input
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Apa yang kamu suka dari catatan ini?"
            className="focus-ring w-full h-10 px-3 rounded-lg bg-amethyst-900/50 border border-white/10 text-sm text-text-primary placeholder:text-text-muted"
          />
        </div>
      </div>
    </Modal>
  );
}
