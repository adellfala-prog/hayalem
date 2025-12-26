
import React from 'react';
import { 
  BookOpen, 
  Briefcase, 
  ShieldCheck, 
  Users, 
  GraduationCap, 
  HeartHandshake,
  Home,
  CreditCard,
  Building,
  Scale,
  Mic2,
  Calendar,
  History,
  Flag,
  Coffee,
  Video,
  MapPin,
  Edit,
  Trash2,
  Plus,
  Newspaper,
  FileText,
  Bell,
  User,
  Image as ImageIcon
} from 'lucide-react';
import { Resource, Scholarship, Workshop, NewsItem, BlogPost } from './types';

export const RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'מענק שחרור ופיקדון',
    description: 'מידע על מימוש המענקים והפיקדון האישי דרך האגף והקרן לחיילים משוחררים.',
    category: 'rights',
    link: '#/rights',
    icon: 'ShieldCheck'
  },
  {
    id: '2',
    title: 'מלגות לבני העדה הדרוזית',
    description: 'פירוט מלגות ייעודיות לסטודנטים דרוזים במוסדות להשכלה גבוהה.',
    category: 'academia',
    link: '#/scholarships',
    icon: 'GraduationCap'
  },
  {
    id: '3',
    title: 'תוכניות הכשרה טכנולוגית',
    description: 'קורסים וסדנאות בתחומי ההייטק והטכנולוגיה בשיתוף עמותות מובילות.',
    category: 'employment',
    link: '#/programs',
    icon: 'Briefcase'
  },
  {
    id: '4',
    title: 'ליווי אישי ומנטורינג',
    description: 'חיבור למנטורים בני העדה להכוונה מקצועית ואישית.',
    category: 'programs',
    link: '#/mentoring',
    icon: 'HeartHandshake'
  }
];

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: 'נפתחה ההרשמה למלגת משרד ראש הממשלה לשנת 2025',
    content: 'סטודנטים בני העדה הדרוזית הלומדים במוסדות המוכרים מוזמנים להגיש בקשה למלגה. ההגשה פתוחה עד סוף החודש.',
    date: '10/02/2025',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
    isUrgent: true
  },
  {
    id: 'n2',
    title: 'כנס משתחררים ייחודי בחיפה',
    content: 'כל המידע על זכויות דיור ותעסוקה במקום אחד. יום חמישי הקרוב במרכז הקונגרסים.',
    date: '08/02/2025',
    imageUrl: 'https://images.unsplash.com/photo-1540575861501-7ad05823c9f5?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'n3',
    title: 'תכנית הכשרה חדשה לסייבר והייטק',
    content: 'עמותת "עתידים" פותחת מסלול ייחודי ללוחמים משוחררים מהעדה הדרוזית. לימודים במימון מלא.',
    date: '06/02/2025',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop'
  }
];

export const INITIAL_BLOG: BlogPost[] = [
  {
    id: 'b1',
    title: 'מלוחם בהייטק: סיפורו של ראמי מדליית אל-כרמל',
    summary: 'איך הניסיון כמפקד צוות ביחידה קרבית עזר לראמי להשתלב בתפקיד ניהולי בחברת הייטק מובילה.',
    content: 'סיפור מלא על הדרך שעבר, הקשיים והכלים שקיבל בצה"ל...',
    author: 'עאדל פלאח',
    date: '05/02/2025',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop',
    category: 'סיפורי הצלחה'
  },
  {
    id: 'b2',
    title: 'מורשת העדה: חמישה דברים שלא ידעתם על הקשר למדינה',
    summary: 'סקירה היסטורית על ברית הדמים והחיים, ואיך היא מעצבת את הדור הצעיר כיום.',
    content: 'ההיסטוריה של העדה הדרוזית בישראל היא סיפור של נאמנות וגבורה...',
    author: 'חוקר מורשת',
    date: '01/02/2025',
    imageUrl: 'https://images.unsplash.com/photo-1444491741275-3747c53c99b4?q=80&w=800&auto=format&fit=crop',
    category: 'מורשת'
  }
];

export const INITIAL_WORKSHOPS: Workshop[] = [
  {
    id: 'w1',
    title: 'סדנת הכנה לראיונות עבודה',
    description: 'איך לתרגם את הניסיון הקרבי לשפה עסקית ולעבור ראיונות בהצלחה.',
    type: 'soldier',
    date: '15/05/2024',
    location: 'מרכז צעירים, דליית אל-כרמל',
    icon: 'Mic2'
  },
  {
    id: 'w2',
    title: 'מורשת העדה הדרוזית והמדינה',
    description: 'הרצאה מרתקת על "ברית החיים" והתרומה ההיסטורית של העדה לביטחון ישראל.',
    type: 'heritage',
    date: '22/05/2024',
    location: 'בית המורשת, ירכא',
    icon: 'History'
  }
];

export const SCHOLARSHIPS: Scholarship[] = [
  {
    id: 's1',
    name: 'מלגת משרד ראש הממשלה',
    provider: 'הרשות לפיתוח כלכלי של המגזר הדרוזי והצ\'רקסי',
    amount: '₪5,000 - ₪10,000',
    deadline: '31/12/2024',
    description: 'מלגה לסטודנטים בני העדה הדרוזית הלומדים לתואר ראשון במוסדות מוכרים ע"י המל"ג. המלגה מותנית בפעילות חברתית.',
    link: 'https://www.gov.il/he/departments/druze_and_circassian_communities'
  }
];

export const ACADEMIC_INSTITUTIONS = [
  {
    name: "הטכניון - מכון טכנולוגי לישראל",
    type: "university",
    link: "https://www.technion.ac.il",
    location: "חיפה",
    logo: "https://logo.clearbit.com/technion.ac.il"
  },
  {
    name: "אוניברסיטת חיפה",
    type: "university",
    link: "https://www.haifa.ac.il",
    location: "חיפה",
    logo: "https://logo.clearbit.com/haifa.ac.il"
  }
];

export const FAQS = [
  {
    question: "מה ההבדל בין מענק שחרור לפיקדון?",
    answer: "מענק השחרור נכנס ישירות לחשבון הבנק עד 60 יום מהשחרור וניתן לשימוש חופשי. הפיקדון נשמר למשך 5 שנים למטרות מוגדרות (לימודים, נישואין, דיור ועוד) ולאחר מכן היתרה הופכת למזומן."
  }
];

export const AVAILABLE_ICONS = [
  { id: 'Mic2', label: 'מיקרופון/הרצאה' },
  { id: 'History', label: 'היסטוריה/מורשת' },
  { id: 'Flag', label: 'דגל/לאומיות' },
  { id: 'CreditCard', label: 'כספים/כלכלה' },
  { id: 'Briefcase', label: 'עבודה/קריירה' },
  { id: 'GraduationCap', label: 'אקדמיה/לימודים' },
  { id: 'Users', label: 'קהילה/מנהיגות' },
  { id: 'Video', label: 'וידאו/זום' },
  { id: 'Coffee', label: 'מפגש חברתי' },
  { id: 'BookOpen', label: 'ספר/ידע' }
];

export const getIcon = (name: string) => {
  switch (name) {
    case 'BookOpen': return <BookOpen className="w-6 h-6" />;
    case 'Briefcase': return <Briefcase className="w-6 h-6" />;
    case 'ShieldCheck': return <ShieldCheck className="w-6 h-6" />;
    case 'Users': return <Users className="w-6 h-6" />;
    case 'GraduationCap': return <GraduationCap className="w-6 h-6" />;
    case 'HeartHandshake': return <HeartHandshake className="w-6 h-6" />;
    case 'Home': return <Home className="w-6 h-6" />;
    case 'CreditCard': return <CreditCard className="w-6 h-6" />;
    case 'Building': return <Building className="w-6 h-6" />;
    case 'Scale': return <Scale className="w-6 h-6" />;
    case 'Mic2': return <Mic2 className="w-6 h-6" />;
    case 'History': return <History className="w-6 h-6" />;
    case 'Flag': return <Flag className="w-6 h-6" />;
    case 'Coffee': return <Coffee className="w-6 h-6" />;
    case 'Video': return <Video className="w-6 h-6" />;
    case 'MapPin': return <MapPin className="w-6 h-6" />;
    case 'Edit': return <Edit className="w-6 h-6" />;
    case 'Trash2': return <Trash2 className="w-6 h-6" />;
    case 'Plus': return <Plus className="w-6 h-6" />;
    case 'Newspaper': return <Newspaper className="w-6 h-6" />;
    case 'FileText': return <FileText className="w-6 h-6" />;
    case 'Bell': return <Bell className="w-6 h-6" />;
    case 'User': return <User className="w-6 h-6" />;
    case 'ImageIcon': return <ImageIcon className="w-6 h-6" />;
    default: return <BookOpen className="w-6 h-6" />;
  }
};
