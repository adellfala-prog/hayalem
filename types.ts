
export interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'rights' | 'academia' | 'employment' | 'programs';
  link: string;
  icon: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  amount: string;
  deadline: string;
  description: string;
  link: string;
  instructions?: string;
}

export interface Workshop {
  id: string;
  title: string;
  description: string;
  type: 'soldier' | 'heritage';
  date: string;
  location: string;
  icon: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  imageUrl?: string;
  isUrgent?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  imageUrl: string;
  category: string;
}
