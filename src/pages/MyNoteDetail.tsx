import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { Header } from '../components/layout/Header';
import { Btn } from '../components/ui/Btn';
import { VisibilityBadge, Chip } from '../components/ui/Badges';
import { FloatBtn } from './NoteDetail';
import { LabelModal } from '../components/modals/LabelModal';
import { VisibilityModal } from '../components/modals/VisibilityModal';
import {
  Pencil, Eye, Tag, FolderInput, MessageSquare, Upload, Home, ChevronRight, Check,
} from 'lucide-react';
import { noteById, folderById, mockFolders } from '../data/mock';

export function MyNoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const note = noteById(id);
  const [labelOpen, setLabelOpen] = useState(false);
  const [visOpen, setVisOpen] = useState(false);
  const [visibility, setVisibility] = useState(note.visibility);
  const [uploaded, setUploaded] = useState(note.uploaded ?? false);

  const folder = folderById(note.folderId);
  const parent = folder?.parent ? mockFolders.find(f => f.id === folder.parent) : null;

  return (
    <div className="min-h-screen">
      <Header
        back
        backTo="/"
        maxWidth="720px"
        right={
          <>
            {uploaded ? (
              <span className="inline-flex items-center gap-1.5 text-sm text-success font-medium px-3 py-1.5 rounded-lg bg-success/10 border border-success/30">
                <Check size={14} /> Sudah Diunggah
              </span>
            ) : (
              <span className="text-xs text-warning font-medium px-2.5 py-1 rounded-full bg-warning/10 border border-warning/25">
                Belum diunggah
              </span>
            )}
          </>
        }
      />

      <article className="max-w-[720px] mx-auto px-6 py-12 relative">
        {/* Breadcrumb folder */}
        <div className="flex items-center gap-1.5 text-sm text-text-muted mb-6 flex-wrap">
          <Link to="/" className="hover:text-text-primary flex items-center gap-1"><Home size={13} /> Beranda</Link>
          {parent && (
            <>
              <ChevronRight size={13} />
              <Link to={`/folder/${parent.id}`} className="hover:text-text-primary">{parent.name}</Link>
            </>
          )}
          {folder && (
            <>
              <ChevronRight size={13} />
              <Link to={`/folder/${folder.id}`} className="text-text-primary font-medium">{folder.name}</Link>
            </>
          )}
        </div>

        {/* Floating action sidebar */}
        <div className="hidden lg:flex absolute -left-20 top-32 flex-col gap-1">
          <FloatBtn onClick={() => navigate(`/editor/${note.id}`)} icon={<Pencil size={18} />} label="Edit" />
          <FloatBtn onClick={() => setVisOpen(true)} icon={<Eye size={18} />} label="Visibilitas" />
          <FloatBtn onClick={() => setLabelOpen(true)} icon={<Tag size={18} />} label="Label" />
          <FloatBtn onClick={() => navigate(`/move/${note.id}`)} icon={<FolderInput size={18} />} label="Pindah" />
          <FloatBtn onClick={() => navigate(`/comments/${note.id}`)} icon={<MessageSquare size={18} />} label="Komentar" />
          <FloatBtn
            onClick={() => uploaded ? setUploaded(false) : navigate(`/upload/${note.id}`)}
            icon={<Upload size={18} />}
            label={uploaded ? 'Update' : 'Unggah'}
          />
        </div>

        <h1 className="font-display font-bold text-text-primary mb-6" style={{ fontSize: '48px', lineHeight: 1.1 }}>
          {note.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 mb-10 text-sm text-text-muted">
          <span>Dibuat {note.createdAt}</span>
          <span>·</span>
          <span>Terakhir diubah {note.modifiedAt}</span>
          <span>·</span>
          <VisibilityBadge visibility={visibility} size="md" />
        </div>

        <div className="prose-reader" dangerouslySetInnerHTML={{ __html: note.content }} />

        {/* Tags */}
        <div className="mt-12 flex flex-wrap items-center gap-2">
          {note.tags.map(t => <Chip key={t}>{t}</Chip>)}
          <button onClick={() => setLabelOpen(true)} className="text-xs text-mauve-soft hover:text-mauve-magic flex items-center gap-1 ml-2">
            <Tag size={12} /> Kelola label
          </button>
        </div>

        {/* Mobile actions */}
        <div className="lg:hidden mt-10 grid grid-cols-3 gap-2">
          <Btn variant="secondary" onClick={() => navigate(`/editor/${note.id}`)} className="!h-11"><Pencil size={14} /> Edit</Btn>
          <Btn variant="secondary" onClick={() => setVisOpen(true)} className="!h-11"><Eye size={14} /> Visibility</Btn>
          <Btn variant="secondary" onClick={() => setLabelOpen(true)} className="!h-11"><Tag size={14} /> Label</Btn>
          <Btn variant="secondary" onClick={() => navigate(`/move/${note.id}`)} className="!h-11"><FolderInput size={14} /> Pindah</Btn>
          <Btn variant="secondary" onClick={() => navigate(`/comments/${note.id}`)} className="!h-11"><MessageSquare size={14} /> Komentar</Btn>
          <Btn onClick={() => navigate(`/upload/${note.id}`)} className="!h-11"><Upload size={14} /> Unggah</Btn>
        </div>
      </article>

      <LabelModal open={labelOpen} onClose={() => setLabelOpen(false)} noteTitle={note.title} initialLabels={note.tags} />
      <VisibilityModal open={visOpen} onClose={() => setVisOpen(false)} noteTitle={note.title} current={visibility} onSave={setVisibility} />
    </div>
  );
}
