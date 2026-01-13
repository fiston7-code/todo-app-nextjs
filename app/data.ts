import { Task } from '../types/todoTypes';

export const initialTasks: Task[] = [
  {
    id: 1,
    title: "Apprendre Next.js",
    description: "maitriser les bases pour construire des applications complexe apres",
    completed: false,
    createdAt: new Date('2026-01-12'),
  },
  {
    id: 2,
    title: "Créer une todo app",
    description: "avec supabase pro",
    completed: true,
    createdAt: new Date('2026-01-11'),
  },
  {
    id: 3,
    title: "Déployer sur Vercel",
    description: "pour que le lien soit partageable",
    completed: false,
    createdAt: new Date('2026-01-10'),
  },
];