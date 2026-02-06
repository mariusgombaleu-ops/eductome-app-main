import { UserProfile, ChatSession } from '../types';

const USER_KEY = 'eductome_user';
const SESSIONS_KEY = 'eductome_sessions';

export const storageService = {
  getUser: (): UserProfile | null => {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  saveUser: (user: UserProfile): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  updatePoints: (pointsToAdd: number): UserProfile | null => {
    const user = storageService.getUser();
    if (user) {
      user.disciplinePoints += pointsToAdd;
      // Simple Gamification Logic: Add badge every 100 points
      if (user.disciplinePoints >= 100 && !user.badges.includes('Disciple')) {
        user.badges.push('Disciple');
      }
      if (user.disciplinePoints >= 500 && !user.badges.includes('Maître de la Discipline')) {
        user.badges.push('Maître de la Discipline');
      }
      storageService.saveUser(user);
    }
    return user;
  },

  getSessions: (): ChatSession[] => {
    const data = localStorage.getItem(SESSIONS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveSession: (session: ChatSession): void => {
    const sessions = storageService.getSessions();
    const index = sessions.findIndex(s => s.id === session.id);
    if (index >= 0) {
      sessions[index] = session;
    } else {
      sessions.push(session);
    }
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  },

  clear: () => {
    localStorage.clear();
  }
};