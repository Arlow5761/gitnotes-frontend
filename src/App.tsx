import { BrowserRouter, Routes, Route } from 'react-router';
import { Library } from './pages/Library';
import { Editor } from './pages/Editor';
import { Upload } from './pages/Upload';
import { Templates } from './pages/Templates';
import { SearchPage } from './pages/Search';
import { NoteDetail } from './pages/NoteDetail';
import { MyNoteDetail } from './pages/MyNoteDetail';
import { UploadNote } from './pages/UploadNote';
import { Comments } from './pages/Comments';
import { CommentForm } from './pages/CommentForm';
import { MoveToFolder } from './pages/MoveToFolder';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Library />} />
        <Route path="/folder/:folderId" element={<Library />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/editor/:id" element={<Editor />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/upload-scan" element={<Upload />} />
        <Route path="/import" element={<Upload />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/note/:id" element={<NoteDetail />} />
        <Route path="/my-note/:id" element={<MyNoteDetail />} />
        <Route path="/upload/:noteId" element={<UploadNote />} />
        <Route path="/comments/:noteId" element={<Comments />} />
        <Route path="/comment/:noteId" element={<CommentForm />} />
        <Route path="/move/:noteId" element={<MoveToFolder />} />
      </Routes>
    </BrowserRouter>
  );
}
