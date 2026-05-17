export type Visibility = 'public' | 'private' | 'hidden';

export interface User {
  id: string;
  name: string;
  initials: string;
  color: string;
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  count: number;
  parent?: string | null;
}

export interface Note {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  authorId: string;
  createdAt: string;
  modifiedAt: string;
  rating: number;
  ratingCount: number;
  visibility: Visibility;
  folderId?: string | null;
  tags: string[];
  uploaded?: boolean;
  readMinutes: number;
}

export interface Comment {
  id: string;
  noteId: string;
  userId: string;
  date: string;
  content: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  preview: 'academic' | 'checklist' | 'cornell' | 'mindmap' | 'recipe' | 'journal';
}

export const mockUsers: User[] = [
  { id: 'u1', name: 'Filbert Engyo', initials: 'FE', color: '#9d4edd' },
  { id: 'u2', name: 'Aisyah Putri', initials: 'AP', color: '#c77dff' },
  { id: 'u3', name: 'Rian Hartono', initials: 'RH', color: '#7b2cbf' },
  { id: 'u4', name: 'Maya Lestari', initials: 'ML', color: '#e0aaff' },
  { id: 'u5', name: 'Dimas Pratama', initials: 'DP', color: '#5a189a' },
  { id: 'u6', name: 'Sinta Anggraini', initials: 'SA', color: '#9d4edd' },
];

export const currentUser = mockUsers[0];

export const folderColors = [
  '#f87171', '#fb923c', '#fbbf24', '#4ade80',
  '#60a5fa', '#a78bfa', '#f472b6', '#94a3b8'
];

export const mockFolders: Folder[] = [
  { id: 'f1', name: 'Kuliah', color: '#a78bfa', count: 24, parent: null },
  { id: 'f2', name: 'Pribadi', color: '#f472b6', count: 8, parent: null },
  { id: 'f3', name: 'Riset', color: '#60a5fa', count: 12, parent: null },
  { id: 'f4', name: 'Resep', color: '#fb923c', count: 5, parent: null },
  { id: 'f5', name: 'Ide & Inspirasi', color: '#4ade80', count: 17, parent: null },
  { id: 'f6', name: 'Machine Learning', color: '#a78bfa', count: 9, parent: 'f1' },
  { id: 'f7', name: 'Aljabar Linear', color: '#a78bfa', count: 6, parent: 'f1' },
];

const longContent = `
<p>Catatan ini ditulis dengan gaya santai namun terstruktur. Tujuan utamanya adalah membantu kamu memahami konsep dengan cepat tanpa kehilangan kedalaman.</p>

<h2>Mengapa ini penting</h2>

<p>Dalam pembelajaran modern, mencatat bukan sekadar menyalin. Ia adalah proses <strong>aktif</strong> di mana kamu menghubungkan ide baru dengan apa yang sudah kamu tahu. Riset menunjukkan retensi meningkat hingga 34% jika kamu menulis ulang dengan kata-katamu sendiri.</p>

<blockquote>"Catatan terbaik adalah catatan yang membuatmu kembali untuk membacanya." — Anonymous</blockquote>

<h2>Tiga prinsip utama</h2>

<ul>
  <li><strong>Ringkas:</strong> Tulis hanya inti, bukan transkrip.</li>
  <li><strong>Terstruktur:</strong> Gunakan hierarki — judul, subjudul, daftar.</li>
  <li><strong>Visual:</strong> Sertakan diagram atau ilustrasi jika memungkinkan.</li>
</ul>

<h3>Contoh penerapan</h3>

<p>Misalnya saat kamu mempelajari <code>useEffect</code> di React, jangan hanya menulis sintaksnya. Tulis kapan kamu butuh dependency array kosong, kapan kamu butuh cleanup function, dan apa konsekuensinya jika lupa.</p>

<p>Pendekatan ini akan membuat catatanmu menjadi <em>second brain</em> yang benar-benar kamu pakai.</p>

<h2>Penutup</h2>

<p>Mulailah hari ini dengan satu catatan kecil. Konsistensi mengalahkan kesempurnaan.</p>
`.trim();

export const mockNotes: Note[] = [
  {
    id: 'n1',
    title: 'Memahami Transformer dari Nol',
    excerpt: 'Bagaimana attention mechanism mengubah lanskap NLP — dijelaskan tanpa rumus berlebihan.',
    content: longContent,
    authorId: 'u2',
    createdAt: '2026-04-12',
    modifiedAt: '2026-05-10',
    rating: 4.8,
    ratingCount: 1243,
    visibility: 'public',
    folderId: 'f6',
    tags: ['Machine Learning', 'Deep Learning', 'NLP'],
    uploaded: true,
    readMinutes: 7,
  },
  {
    id: 'n2',
    title: 'Aljabar Linear untuk Programmer',
    excerpt: 'Vector, matrix, eigenvalue — semua yang perlu kamu tahu sebelum nyebur ke ML.',
    content: longContent,
    authorId: 'u3',
    createdAt: '2026-03-22',
    modifiedAt: '2026-04-30',
    rating: 4.6,
    ratingCount: 820,
    visibility: 'public',
    folderId: 'f7',
    tags: ['Matematika', 'Linear Algebra'],
    uploaded: true,
    readMinutes: 9,
  },
  {
    id: 'n3',
    title: 'Catatan UTS Sistem Operasi',
    excerpt: 'Ringkasan singkat semua materi UTS — proses, thread, scheduling, sinkronisasi.',
    content: longContent,
    authorId: 'u1',
    createdAt: '2026-05-01',
    modifiedAt: '2026-05-15',
    rating: 0,
    ratingCount: 0,
    visibility: 'private',
    folderId: 'f1',
    tags: ['Kuliah', 'UTS'],
    uploaded: false,
    readMinutes: 5,
  },
  {
    id: 'n4',
    title: 'Resep Nasi Goreng Spesial',
    excerpt: 'Resep andalan keluarga — rahasianya ada di kecap manis dan bawang putih sangrai.',
    content: longContent,
    authorId: 'u1',
    createdAt: '2026-02-14',
    modifiedAt: '2026-02-14',
    rating: 0,
    ratingCount: 0,
    visibility: 'private',
    folderId: 'f4',
    tags: ['Resep', 'Indonesian'],
    uploaded: false,
    readMinutes: 3,
  },
  {
    id: 'n5',
    title: 'Refleksi Akhir Semester',
    excerpt: 'Apa yang berhasil, apa yang gagal, dan apa yang akan dilakukan berbeda semester depan.',
    content: longContent,
    authorId: 'u1',
    createdAt: '2026-05-12',
    modifiedAt: '2026-05-16',
    rating: 0,
    ratingCount: 0,
    visibility: 'hidden',
    folderId: 'f2',
    tags: ['Jurnal', 'Refleksi'],
    uploaded: false,
    readMinutes: 4,
  },
  {
    id: 'n6',
    title: 'Design Pattern dalam Praktik',
    excerpt: 'Observer, Factory, Singleton — kapan benar-benar pakai, kapan over-engineering.',
    content: longContent,
    authorId: 'u4',
    createdAt: '2026-04-01',
    modifiedAt: '2026-04-20',
    rating: 4.7,
    ratingCount: 532,
    visibility: 'public',
    folderId: null,
    tags: ['Programming', 'Software Engineering'],
    uploaded: true,
    readMinutes: 6,
  },
  {
    id: 'n7',
    title: 'Productivity Tanpa Burnout',
    excerpt: 'Sistem kerja yang sustainable — bukan hustle culture, bukan juga malas-malasan.',
    content: longContent,
    authorId: 'u5',
    createdAt: '2026-03-10',
    modifiedAt: '2026-03-15',
    rating: 4.9,
    ratingCount: 2104,
    visibility: 'public',
    folderId: null,
    tags: ['Produktivitas', 'Self-Improvement'],
    uploaded: true,
    readMinutes: 8,
  },
  {
    id: 'n8',
    title: 'Statistik Inferensial Mudah',
    excerpt: 'Hypothesis testing dan confidence interval — penjelasan ramah pemula.',
    content: longContent,
    authorId: 'u6',
    createdAt: '2026-02-28',
    modifiedAt: '2026-03-05',
    rating: 4.5,
    ratingCount: 678,
    visibility: 'public',
    folderId: null,
    tags: ['Statistik', 'Matematika'],
    uploaded: true,
    readMinutes: 10,
  },
];

export const mockComments: Comment[] = [
  { id: 'c1', noteId: 'n1', userId: 'u3', date: '2026-05-12', content: 'Penjelasan attention-nya keren banget! Akhirnya paham kenapa Transformer bisa parallel sementara RNN nggak. Thanks!' },
  { id: 'c2', noteId: 'n1', userId: 'u4', date: '2026-05-11', content: 'Bagian self-attention yang dijelasin pakai analogi konferensi itu brilian sih. Bookmark buat baca ulang.' },
  { id: 'c3', noteId: 'n1', userId: 'u5', date: '2026-05-09', content: 'Mau request bahas positional encoding lebih dalam, mungkin di catatan terpisah?' },
  { id: 'c4', noteId: 'n1', userId: 'u6', date: '2026-05-08', content: 'Saya ngajar kelas DL dan akan rekomen catatan ini ke mahasiswa. Strukturnya rapi, contohnya konkret.' },
  { id: 'c5', noteId: 'n1', userId: 'u2', date: '2026-05-07', content: 'Catatan paling clear yang pernah saya baca soal Transformer. Salut!' },
];

export const mockTemplates: Template[] = [
  { id: 't1', name: 'Catatan Kuliah', description: 'Format akademik dengan heading dan referensi', preview: 'academic' },
  { id: 't2', name: 'Checklist', description: 'To-do list dengan checkbox interaktif', preview: 'checklist' },
  { id: 't3', name: 'Cornell Notes', description: 'Layout 2 kolom dengan ringkasan di bawah', preview: 'cornell' },
  { id: 't4', name: 'Mind Map', description: 'Brainstorming visual untuk ide non-linear', preview: 'mindmap' },
  { id: 't5', name: 'Resep / Tutorial', description: 'Step-by-step dengan numbering otomatis', preview: 'recipe' },
  { id: 't6', name: 'Jurnal Harian', description: 'Date header dan area menulis bebas', preview: 'journal' },
];

export const allLabels = ['Latsol', 'UTS', 'UAS', 'Penting', 'Review', 'Draft', 'Inspiratif', 'Referensi'];

export const userById = (id: string) => mockUsers.find(u => u.id === id) ?? mockUsers[0];
export const folderById = (id?: string | null) => mockFolders.find(f => f.id === id);
export const noteById = (id?: string) => mockNotes.find(n => n.id === id) ?? mockNotes[0];
