import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Header } from '../components/layout/Header';
import { Btn } from '../components/ui/Btn';
import { Search, Check } from 'lucide-react';
import { mockTemplates, type Template } from '../data/mock';

export function Templates() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string>('t1');
  const [query, setQuery] = useState('');

  const filtered = mockTemplates.filter(t => t.name.toLowerCase().includes(query.toLowerCase()));
  const selectedTpl = mockTemplates.find(t => t.id === selected);

  return (
    <div className="min-h-screen pb-32">
      <Header back backTo="/" right={
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari template..."
            className="focus-ring h-9 w-56 pl-9 pr-3 rounded-lg bg-white/5 border border-white/10 text-sm placeholder:text-text-muted"
          />
        </div>
      } />

      <main className="max-w-[1280px] mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="font-display font-bold text-4xl text-text-primary">Pilih Template</h1>
          <p className="text-text-secondary mt-2">Mulai dengan template yang sesuai kebutuhanmu.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(t => (
            <button
              key={t.id}
              onClick={() => setSelected(t.id)}
              className={`group text-left rounded-2xl border-2 transition-all overflow-hidden card-hover ${
                selected === t.id
                  ? 'border-mauve-magic glow-purple-sm bg-indigo-velvet/30'
                  : 'border-white/10 card-surface'
              }`}
            >
              <div className="aspect-[4/3] bg-amethyst-900/60 relative overflow-hidden border-b border-white/5">
                <TemplatePreview kind={t.preview} />
                {selected === t.id && (
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full gradient-primary grid place-items-center glow-purple-sm">
                    <Check size={14} className="text-white" strokeWidth={3} />
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="font-display font-semibold text-text-primary mb-1">{t.name}</div>
                <div className="text-sm text-text-muted">{t.description}</div>
              </div>
            </button>
          ))}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 glass border-t border-white/10 z-30">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex items-center gap-4">
          <div className="text-sm">
            <span className="text-text-muted">Template Terpilih: </span>
            <span className="font-semibold text-mauve-soft">{selectedTpl?.name ?? '—'}</span>
          </div>
          <div className="flex-1" />
          <Btn size="lg" onClick={() => navigate(`/editor?source=template&meta=${encodeURIComponent(selectedTpl?.name ?? '')}`)}>
            Gunakan Template →
          </Btn>
        </div>
      </div>
    </div>
  );
}

function TemplatePreview({ kind }: { kind: Template['preview'] }) {
  if (kind === 'academic') {
    return (
      <div className="p-5 space-y-2 h-full">
        <div className="h-3 w-2/3 rounded bg-mauve-magic/60" />
        <div className="h-1.5 w-1/3 rounded bg-mauve-soft/40" />
        <div className="space-y-1.5 mt-4">
          <div className="h-1.5 rounded bg-white/20" />
          <div className="h-1.5 rounded bg-white/20 w-11/12" />
          <div className="h-1.5 rounded bg-white/20 w-9/12" />
        </div>
        <div className="h-2 w-1/4 rounded bg-mauve-magic/50 mt-3" />
        <div className="space-y-1.5">
          <div className="h-1.5 rounded bg-white/20" />
          <div className="h-1.5 rounded bg-white/20 w-10/12" />
        </div>
      </div>
    );
  }
  if (kind === 'checklist') {
    return (
      <div className="p-5 space-y-2.5 h-full">
        {[true, true, false, false, false].map((c, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div className={`w-3.5 h-3.5 rounded border ${c ? 'bg-mauve-magic border-mauve-magic' : 'border-white/30'} grid place-items-center`}>
              {c && <Check size={9} className="text-amethyst-900" strokeWidth={4} />}
            </div>
            <div className={`h-1.5 rounded ${c ? 'bg-white/20' : 'bg-white/30'}`} style={{ width: `${60 + i * 5}%` }} />
          </div>
        ))}
      </div>
    );
  }
  if (kind === 'cornell') {
    return (
      <div className="p-4 grid grid-cols-3 gap-3 h-full">
        <div className="col-span-1 space-y-1.5 border-r border-white/10 pr-3">
          <div className="h-1.5 rounded bg-mauve-magic/50 w-2/3" />
          <div className="h-1.5 rounded bg-white/20" />
          <div className="h-1.5 rounded bg-white/20 w-4/5" />
        </div>
        <div className="col-span-2 space-y-1.5">
          <div className="h-1.5 rounded bg-white/20" />
          <div className="h-1.5 rounded bg-white/20" />
          <div className="h-1.5 rounded bg-white/20 w-3/4" />
          <div className="h-1.5 rounded bg-white/20 w-2/3" />
        </div>
        <div className="col-span-3 border-t border-white/10 pt-2 space-y-1.5">
          <div className="h-1.5 rounded bg-mauve-soft/40 w-1/4" />
          <div className="h-1.5 rounded bg-white/15" />
        </div>
      </div>
    );
  }
  if (kind === 'mindmap') {
    return (
      <svg viewBox="0 0 200 150" className="w-full h-full p-3">
        <circle cx="100" cy="75" r="20" fill="#9d4edd" opacity="0.7" />
        <circle cx="40" cy="35" r="11" fill="#c77dff" opacity="0.6" />
        <circle cx="160" cy="35" r="11" fill="#c77dff" opacity="0.6" />
        <circle cx="40" cy="115" r="11" fill="#c77dff" opacity="0.6" />
        <circle cx="160" cy="115" r="11" fill="#c77dff" opacity="0.6" />
        <line x1="100" y1="75" x2="40" y2="35" stroke="#9d4edd" strokeWidth="1.5" opacity="0.5" />
        <line x1="100" y1="75" x2="160" y2="35" stroke="#9d4edd" strokeWidth="1.5" opacity="0.5" />
        <line x1="100" y1="75" x2="40" y2="115" stroke="#9d4edd" strokeWidth="1.5" opacity="0.5" />
        <line x1="100" y1="75" x2="160" y2="115" stroke="#9d4edd" strokeWidth="1.5" opacity="0.5" />
      </svg>
    );
  }
  if (kind === 'recipe') {
    return (
      <div className="p-5 space-y-2.5 h-full">
        {[1, 2, 3, 4].map(n => (
          <div key={n} className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full gradient-primary text-[10px] font-bold text-white grid place-items-center">{n}</div>
            <div className="h-1.5 rounded bg-white/20 flex-1" />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="p-5 space-y-2 h-full">
      <div className="h-2 w-1/3 rounded bg-mauve-soft/50" />
      <div className="mt-3 space-y-1.5">
        <div className="h-1.5 rounded bg-white/20" />
        <div className="h-1.5 rounded bg-white/20 w-11/12" />
        <div className="h-1.5 rounded bg-white/20 w-10/12" />
        <div className="h-1.5 rounded bg-white/20 w-9/12" />
      </div>
    </div>
  );
}
