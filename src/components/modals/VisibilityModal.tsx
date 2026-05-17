import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Btn } from '../ui/Btn';
import { Globe, Lock, EyeOff, Check } from 'lucide-react';
import type { Visibility } from '../../data/mock';

const options: { value: Visibility; icon: typeof Globe; title: string; desc: string }[] = [
  { value: 'public', icon: Globe, title: 'Publik', desc: 'Siapa saja bisa lihat dan beri komentar' },
  { value: 'private', icon: Lock, title: 'Privat', desc: 'Hanya kamu yang bisa lihat' },
  { value: 'hidden', icon: EyeOff, title: 'Tersembunyi', desc: 'Hanya yang punya link bisa akses' },
];

export function VisibilityModal({
  open, onClose, noteTitle, current = 'private', onSave,
}: {
  open: boolean; onClose: () => void; noteTitle: string; current?: Visibility; onSave?: (v: Visibility) => void;
}) {
  const [value, setValue] = useState<Visibility>(current);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Atur Visibilitas"
      subtitle={noteTitle}
      footer={<Btn className="w-full" size="lg" onClick={() => { onSave?.(value); onClose(); }}>Simpan</Btn>}
    >
      <div className="space-y-3">
        {options.map(opt => {
          const Icon = opt.icon;
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setValue(opt.value)}
              className={`focus-ring w-full text-left flex items-start gap-4 p-4 rounded-xl border-2 transition-all ${
                selected
                  ? 'border-mauve-magic bg-indigo-velvet/30 glow-purple-sm'
                  : 'border-white/10 bg-amethyst-900/40 hover:border-white/20 hover:bg-amethyst-900/60'
              }`}
            >
              <div className={`w-11 h-11 rounded-xl grid place-items-center shrink-0 ${selected ? 'gradient-primary' : 'bg-indigo-ink/60'}`}>
                <Icon size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-text-primary">{opt.title}</div>
                <div className="text-sm text-text-secondary mt-0.5">{opt.desc}</div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 grid place-items-center shrink-0 mt-1 ${selected ? 'border-mauve-magic bg-mauve-magic' : 'border-white/30'}`}>
                {selected && <Check size={12} className="text-amethyst-900" strokeWidth={3} />}
              </div>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
