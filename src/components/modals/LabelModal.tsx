import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Btn } from '../ui/Btn';
import { Chip } from '../ui/Badges';
import { Plus } from 'lucide-react';
import { allLabels } from '../../data/mock';

export function LabelModal({ open, onClose, noteTitle, initialLabels = [] }: { open: boolean; onClose: () => void; noteTitle: string; initialLabels?: string[] }) {
  const [attached, setAttached] = useState<string[]>(initialLabels.length ? initialLabels : ['Penting', 'Review']);
  const [input, setInput] = useState('');

  const addLabel = (l: string) => {
    if (!l.trim() || attached.includes(l)) return;
    setAttached([...attached, l]);
  };

  const suggestions = allLabels.filter(l => !attached.includes(l));

  return (
    <Modal open={open} onClose={onClose} title="Atur Label" subtitle={noteTitle} footer={
      <Btn className="w-full" size="lg" onClick={onClose}>Simpan</Btn>
    }>
      <div className="space-y-5">
        <div>
          <div className="text-xs font-medium text-text-muted mb-2 uppercase tracking-wider">Label terpasang</div>
          <div className="flex flex-wrap gap-2 min-h-[40px] p-3 rounded-xl bg-amethyst-900/50 border border-white/5">
            {attached.length === 0 && <span className="text-sm text-text-muted">Belum ada label</span>}
            {attached.map(l => (
              <Chip key={l} active onRemove={() => setAttached(attached.filter(x => x !== l))}>{l}</Chip>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-medium text-text-muted mb-2 uppercase tracking-wider">Tambah label baru</div>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { addLabel(input); setInput(''); } }}
              placeholder="Ketik nama label..."
              className="focus-ring flex-1 h-10 px-3 rounded-lg bg-amethyst-900/50 border border-white/10 text-sm text-text-primary placeholder:text-text-muted"
            />
            <Btn variant="secondary" onClick={() => { addLabel(input); setInput(''); }}>
              <Plus size={16} /> Tambah
            </Btn>
          </div>
        </div>

        {suggestions.length > 0 && (
          <div>
            <div className="text-xs font-medium text-text-muted mb-2 uppercase tracking-wider">Saran</div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map(l => (
                <Chip key={l} onClick={() => addLabel(l)}>+ {l}</Chip>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
