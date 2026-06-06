
import { db } from './firebase';
import { collection, doc, getDoc, setDoc, writeBatch } from 'firebase/firestore';
import { PROJECTS } from '../data';

export async function seedProjects() {
  try {
    const projectsCol = collection(db, 'projects');
    
    // Check if projects are already seeded
    const firstProject = await getDoc(doc(projectsCol, PROJECTS[0].id));
    if (firstProject.exists()) {
      console.log('Projects already seeded');
      return;
    }

    const batch = writeBatch(db);
    PROJECTS.forEach((project) => {
      const projectRef = doc(projectsCol, project.id);
      batch.set(projectRef, project);
    });

    await batch.commit();
    console.log('Successfully seeded projects');
  } catch (error) {
    console.error('Error seeding projects:', error);
  }
}
