import { useState, useEffect } from 'react';

export const useProject = () => {
  const [projects, setProjects] = useState<string[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [isCreateProjectDialogOpen, setIsCreateProjectDialogOpen] = useState(false);

  // プロジェクト一覧を取得する関数
  const fetchProjects = async () => {
    try {
      const res = await fetch('http://localhost:8000/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects);
      } else {
        console.error('Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  // 新しいプロジェクトを作成する関数
  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    try {
      const res = await fetch('http://localhost:8000/create_project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ project: newProjectName }),
      });
      if (res.ok) {
        setNewProjectName('');
        setIsCreateProjectDialogOpen(false);
        fetchProjects(); // プロジェクト作成後に一覧を再取得
        // setProject(newProjectName); // This line is removed
      } else {
        console.error('Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  // コンポーネントマウント時にプロジェクト一覧を取得
  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    newProjectName,
    setNewProjectName,
    isCreateProjectDialogOpen,
    setIsCreateProjectDialogOpen,
    handleCreateProject,
    fetchProjects,
  };
};
