import type { CategoryContent } from './lib/types';

const mockVideos = (catName: string): any[] => [
  {
    id: `v1-${catName}`,
    title: `שיעור 01: יסודות ועקרונות ב${catName}`,
    vimeoId: '1151968323',
    duration: '12 דקות',
    description: `בסרטון זה נבין את עקרונות ה${catName} וכיצד להתחיל נכון.`,
    thumbnailUrl: `https://picsum.photos/seed/${catName}1/800/450`,
    bulletPoints: ['הכנה מקדימה', 'ציוד נדרש', 'טעויות נפוצות'],
    resources: [{ label: 'דף עבודה', url: '#' }]
  },
  {
    id: `v2-${catName}`,
    title: `שיעור 02: תרגול מתקדם - ${catName}`,
    vimeoId: '1151968407',
    duration: '15 דקות',
    description: `נעלה שלב ב${catName} ונתמקד בעבודה תחת הסחות דעת.`,
    thumbnailUrl: `https://picsum.photos/seed/${catName}2/800/450`,
    bulletPoints: ['העלאת קושי', 'תגמול נכון', 'סיכום אימון'],
    resources: [{ label: "צ'ק ליסט", url: '#' }]
  }
];

const guestsCourseVideos = (): any[] => {
  const videoData = [
    { theory: '1145008366/1ca76e7dc4', practice: '1145008490' },
    { theory: '1145008724', practice: '1164682540' },
    { theory: '1145008844', practice: '1145008906' },
    { theory: '1145009028', practice: '1145009087' },
    { theory: '1145009171', practice: '1145009233' },
  ];

  const videos: any[] = [];
  videoData.forEach((day, index) => {
    const dayNum = index + 1;
    videos.push({
      id: `guests-theory-${dayNum}`,
      title: `יום ${dayNum} תאוריה`,
      vimeoId: day.theory,
      duration: '8 דקות',
      description: `חלק התאוריה של יום ${dayNum}. נלמד את הבסיס המנטלי וההכנה הנדרשת לקראת כניסת אורחים בשקט וברוגע.`,
      thumbnailUrl: `https://picsum.photos/seed/guest-theory${dayNum}/800/450`,
      bulletPoints: ['פסיכולוגיית הכלב מול אורח', 'ניהול סביבה', 'שפת גוף'],
      resources: [{ label: 'דף עבודה יום ' + dayNum, url: '#' }]
    });
    videos.push({
      id: `guests-practice-${dayNum}`,
      title: `יום ${dayNum} תרגול`,
      vimeoId: day.practice,
      duration: '15 דקות',
      description: `חלק התרגול המעשי של יום ${dayNum}. יישום טכניקות העבודה והשליטה בכלב בזמן אמת.`,
      thumbnailUrl: `https://picsum.photos/seed/guest-practice${dayNum}/800/450`,
      bulletPoints: ['תרגול הליכה למקום', 'שימוש ברצועה בבית', 'תגמול מדויק'],
      resources: [{ label: "צ'ק ליסט תרגול יום " + dayNum, url: '#' }]
    });
  });
  return videos;
};

const recallCourseVideos = (): any[] => {
  const dayTitles = [
    'מבט ולורינג',
    'התחלת פקודת אליי',
    'אליי ממרחק',
    'אלייי בתנועה עם גירויים',
    'אליי ברצועה ארוכה',
    'מחברים הכל יחד',
    'אליי מושלם',
  ];

  const videoData = [
    { theory: '1165279755', practice: '1165279688' },
    { theory: '1165279583', practice: '1165279648' },
    { theory: '1165280671', practice: '1165280303' },
    { theory: '1165280330', practice: '1165280372' },
    { theory: '1165280389', practice: '1165280430' },
    { theory: '1165280471', practice: '1165280503' },
    { theory: '1165280569', practice: '1165280630' },
  ];

  const videos: any[] = [];
  videoData.forEach((day, index) => {
    const dayNum = index + 1;
    const dayLabel = dayTitles[index];
    videos.push({
      id: `recall-theory-${dayNum}`,
      title: `יום ${dayNum}: ${dayLabel} - תאוריה`,
      vimeoId: day.theory,
      duration: '10 דקות',
      description: `חלק התאוריה של יום ${dayNum} בנושא ${dayLabel}. נלמד על עקרונות האילוף והבסיס המנטלי.`,
      thumbnailUrl: `https://picsum.photos/seed/theory${dayNum}/800/450`,
      bulletPoints: ['הבנת הגירוי', 'בניית קשר עין', 'שפת גוף נכונה'],
      resources: [{ label: 'דף תאוריה יום ' + dayNum, url: '#' }]
    });
    videos.push({
      id: `recall-practice-${dayNum}`,
      title: `יום ${dayNum}: ${dayLabel} - תרגול מעשי`,
      vimeoId: day.practice,
      duration: '20 דקות',
      description: `התרגול המעשי של יום ${dayNum} בנושא ${dayLabel}. יישום בשטח של מה שלמדנו בחלק התאוריה.`,
      thumbnailUrl: `https://picsum.photos/seed/practice${dayNum}/800/450`,
      bulletPoints: ['תרגול בסביבה סטרילית', 'שימוש בצ׳ופר מתאים', 'חזרתיות והתמדה'],
      resources: [{ label: 'יומן תרגול יום ' + dayNum, url: '#' }]
    });
  });
  return videos;
};

const baseCourseVideos = (): any[] => [
  {
    id: 'base-1',
    title: 'איך שמים רצועה',
    vimeoId: '1178914296',
    duration: '8 דקות',
    description: 'בשיעור זה נלמד איך להלביש את הרצועה בצורה נכונה ורגועה, מבלי לייצר לחץ מיותר על הכלב.',
    thumbnailUrl: 'https://picsum.photos/seed/base1/800/450',
    bulletPoints: ['הכנה מקדימה', 'שפת גוף רגועה', 'מניעת התרגשות יתר'],
    resources: [{ label: 'דף עבודה', url: '#' }]
  },
  {
    id: 'base-2',
    title: 'תקשורת ברצועה',
    vimeoId: '1174457002',
    duration: '10 דקות',
    description: 'איך להשתמש ברצועה ככלי תקשורת ולא רק ככלי שליטה. הבנת הלחץ והשחרור.',
    thumbnailUrl: 'https://picsum.photos/seed/base2/800/450',
    bulletPoints: ['הבנת שפת הרצועה', 'לחץ ושחרור', 'תגובה נכונה למשיכות'],
    resources: [{ label: "צ'ק ליסט", url: '#' }]
  },
  {
    id: 'base-3',
    title: 'לורינג',
    vimeoId: '1178780025',
    duration: '7 דקות',
    description: 'טכניקת הלורינג (הובלה עם אוכל) היא הבסיס לכל פקודה שנלמד בעתיד.',
    thumbnailUrl: 'https://picsum.photos/seed/base3/800/450',
    bulletPoints: ['אחיזה נכונה של האוכל', 'הובלת הכלב', 'תזמון התגמול'],
    resources: [{ label: 'מדריך לורינג', url: '#' }]
  },
  {
    id: 'base-4',
    title: 'הרגלה למגע',
    vimeoId: '1178914816',
    duration: '9 דקות',
    description: 'בניית אמון דרך מגע. איך להרגיל את הכלב למגע בכל חלקי הגוף בצורה חיובית.',
    thumbnailUrl: 'https://picsum.photos/seed/base4/800/450',
    bulletPoints: ['מגע הדרגתי', 'חיזוק חיובי', 'זיהוי סימני אי נוחות'],
    resources: [{ label: 'דף מעקב', url: '#' }]
  },
  {
    id: 'base-5',
    title: 'מבט',
    vimeoId: '1178932554',
    duration: '6 דקות',
    description: 'הבסיס לכל עבודה - יצירת קשר עין. איך ללמד את הכלב להסתכל עלינו.',
    thumbnailUrl: 'https://picsum.photos/seed/base5/800/450',
    bulletPoints: ['יצירת קשר עין', 'עבודה תחת גירויים', 'חיזוק הקשר'],
    resources: [{ label: 'תרגיל המבט', url: '#' }]
  }
];

const energyReleaseVideos = (): any[] => [
  {
    id: 'energy-guide-1',
    title: "מדריך פריקת אנרגיה - חלק א': הבנת הצרכים",
    description: 'המדריך המלא להבנת כוס האנרגיה של הכלב, זיהוי חוסר שקט ומניעת התנהגויות לא רצויות.',
    thumbnailUrl: 'https://picsum.photos/seed/dog-energy/800/450',
    bulletPoints: ['מושג כוס האנרגיה', 'זיהוי חוסר שקט', 'מניעת הרס ונביחות'],
    resources: [{ label: "פתח קובץ: מדריך חלק א'", url: '#' }]
  },
  {
    id: 'energy-guide-2',
    title: "מדריך פריקת אנרגיה - חלק ב': כלים ושיטות",
    description: 'פירוט של שלושת עמודי התווך: פריקה פיזית, מנטלית ואוראלית.',
    thumbnailUrl: 'https://picsum.photos/seed/dog-toys/800/450',
    bulletPoints: ['פריקה פיזית ומנטלית', 'פריקה אוראלית', 'חוקי המשחק ובטיחות'],
    resources: [{ label: "פתח קובץ: מדריך חלק ב'", url: '#' }]
  }
];

export const INITIAL_CATEGORIES: CategoryContent[] = [
  {
    id: '9',
    title: 'קורס אליי מושלם ב-7 ימים',
    emoji: '🐕💨',
    image: '/categories/recall.jpg',
    description: 'הקורס המקיף ביותר ללימוד קריאת "אליי" בטוחה ומהירה תוך שבוע. 14 שיעורים של תאוריה ותרגול.',
    videos: recallCourseVideos()
  },
  {
    id: '10',
    title: 'קורס GUESTS - איך להכניס אורחים הביתה בשקט',
    emoji: '🚪🤝',
    image: '/categories/guests.jpg',
    description: 'איך להכניס אורחים הביתה בשקט וברוגע ב-5 ימים בלבד.',
    videos: guestsCourseVideos()
  },
  {
    id: '1',
    title: 'התחלה נכונה ובניית בסיס',
    emoji: '🏠',
    image: '/categories/foundation.jpg',
    description: 'הנחת היסודות לקשר בריא בתוך הבית וגבולות ברורים.',
    videos: baseCourseVideos()
  },
  {
    id: '2',
    title: 'הרגלה לכלוב אילוף',
    emoji: '📦',
    image: '/categories/crate.jpg',
    description: 'הפיכת הכלוב למקום רגוע ובטוח עבור הכלב.',
    videos: [
      {
        id: 'crate-1',
        title: 'שיעור 01: יסודות ועקרונות בהרגלה לכלוב אילוף',
        vimeoId: '1150040718',
        duration: '12 דקות',
        description: 'בסרטון זה נבין את עקרונות ההרגלה לכלוב אילוף וכיצד להתחיל נכון.',
        thumbnailUrl: 'https://picsum.photos/seed/crate1/800/450',
        bulletPoints: ['הכנה מקדימה', 'ציוד נדרש', 'טעויות נפוצות'],
        resources: [{ label: 'דף עבודה', url: '#' }]
      },
      {
        id: 'crate-2',
        title: 'שיעור 02: תרגול מעשי - הרגלה לכלוב אילוף',
        vimeoId: '1150040106',
        duration: '15 דקות',
        description: 'נעלה שלב בהרגלה לכלוב אילוף ונתמקד בעבודה תחת הסחות דעת.',
        thumbnailUrl: 'https://picsum.photos/seed/crate2/800/450',
        bulletPoints: ['העלאת קושי', 'תגמול נכון', 'סיכום אימון'],
        resources: [{ label: "צ'ק ליסט", url: '#' }]
      }
    ]
  },
  {
    id: '3',
    title: 'פקודות בסיס',
    emoji: '✋',
    description: 'לימוד שב, ארצה, הישאר ופקודות משמעת חיוניות.',
    videos: mockVideos('פקודות בסיס'),
    isComingSoon: true
  },
  {
    id: '4',
    title: 'הליכה נכונה עם רצועה',
    emoji: '🐕',
    description: 'טיול רגוע ללא משיכות וניטרול גירויים ברחוב.',
    isComingSoon: true,
    videos: [
      {
        id: 'walk-1',
        vimeoId: '1151968323',
        title: 'איך להוביל ברצועה כלב שמתנגד להליכה חלק 1',
        duration: '12 דקות',
        description: 'התחילו את התרגול בסביבה שקטה ללא גירויים.',
        thumbnailUrl: 'https://picsum.photos/seed/walk1/800/450',
        bulletPoints: ['התחילו בסביבה שקטה', 'רצועה רפויה', 'תגמול על קשר עין'],
        resources: [{ label: 'הורדת דף סיכום (PDF)', url: '#' }]
      },
      {
        id: 'walk-2',
        vimeoId: '1151968407',
        title: 'איך להוביל ברצועה כלב שמתנגד להליכה חלק 2',
        duration: '15 דקות',
        description: 'תרגול מעשי של הובלה נכונה בסביבת הבית.',
        thumbnailUrl: 'https://picsum.photos/seed/walk2/800/450',
        bulletPoints: ['זיהוי גירויים מרחוק', 'שינויי כיוון', 'עצירה במעבר חצייה'],
        resources: [{ label: "צ'ק ליסט טיול", url: '#' }]
      }
    ]
  },
  {
    id: '5',
    title: 'נשכנות גורית',
    emoji: '🦷',
    image: '/categories/chewing.jpg',
    description: 'ניהול יצר הנשכנות והפנייתו למשחקים מתאימים.',
    isComingSoon: true,
    videos: [
      {
        id: 'bite-1',
        title: 'שיעור 01: יסודות ועקרונות בנשכנות גורית',
        vimeoId: '1151968323',
        duration: '12 דקות',
        description: 'בסרטון זה נבין את עקרונות הנשכנות הגורית וכיצד להתחיל נכון.',
        thumbnailUrl: 'https://picsum.photos/seed/bite1/800/450',
        bulletPoints: ['הכנה מקדימה', 'ציוד נדרש', 'טעויות נפוצות'],
        resources: [{ label: 'דף עבודה', url: '#' }]
      },
      {
        id: 'bite-2',
        vimeoId: '1152552979',
        title: 'שיעור 02: ניהול נשכנות מעשי',
        duration: '15 דקות',
        description: 'תרגול מעשי והבנת שפת הגוף של הגור בזמן נשכנות.',
        thumbnailUrl: 'https://picsum.photos/seed/bite2/800/450',
        bulletPoints: ['ניתוב למשחק', 'עצירת אינטראקציה', 'שימוש בצעצועי לעיסה'],
        resources: [{ label: "צ'ק ליסט", url: '#' }]
      }
    ]
  },
  {
    id: '6',
    title: 'פריקת אנרגיה',
    emoji: '🎾',
    image: '/categories/energy.jpg',
    description: 'המדריך המלא לפריקת אנרגיה מאוזנת: פיזית, מנטלית ואוראלית.',
    videos: energyReleaseVideos()
  },
  {
    id: '7',
    title: 'אכילה מהרצפה',
    emoji: '🍕',
    description: 'מניעת איסוף אוכל ומפגעים מהמדרכה במהלך הטיול.',
    videos: [
      {
        id: 'eating-1',
        title: 'שיעור 01: יסודות ועקרונות באכילה מהרצפה',
        vimeoId: '1168466433',
        duration: '12 דקות',
        description: 'בסרטון זה נבין את עקרונות האכילה מהרצפה וכיצד להתחיל נכון.',
        thumbnailUrl: 'https://picsum.photos/seed/eating1/800/450',
        bulletPoints: ['הכנה מקדימה', 'ציוד נדרש', 'טעויות נפוצות'],
        resources: [{ label: 'דף עבודה', url: '#' }]
      }
    ]
  },
  {
    id: '8',
    title: 'תינוק חדש בבית',
    emoji: '👶',
    description: 'הכנת הכלב לשינוי הגדול והכרת התינוק בצורה בטוחה.',
    videos: mockVideos('תינוק חדש'),
    isComingSoon: true
  }
];

export const INITIAL_USERS = [
  { email: 'leviorel@gmail.com', name: 'אוראל לוי', isAdmin: true, status: 'active' as const },
  { email: 'fujfujfuj224@gmail.com', name: 'משתמש', isAdmin: false, status: 'active' as const },
  { email: 'shaharcohenen@gmail.com', name: 'שחר', isAdmin: false, status: 'active' as const },
  { email: 'snir.vaknin@gmail.com', name: 'שניר', isAdmin: false, status: 'active' as const },
  { email: 'sivansar6@gmail.com', name: 'סיון', isAdmin: false, status: 'active' as const },
  { email: 'zafriorel@gmail.com', name: 'זפרי', isAdmin: false, status: 'active' as const },
  { email: 'nadavaviv1998@gmail.com', name: 'נדב', isAdmin: false, status: 'active' as const },
  { email: 'guyrotem7@gmail.com', name: 'גיא', isAdmin: false, status: 'active' as const },
  { email: 'michelsonnik@gmail.com', name: 'מיכלסון', isAdmin: false, status: 'active' as const },
  { email: 'sarahi10kitzhak@gmail.com', name: 'שרה', isAdmin: false, status: 'active' as const },
  { email: 'orj1010@gmail.com', name: 'אור', isAdmin: false, status: 'active' as const },
  { email: 'ofir.aharoni5@gmail.com', name: 'עופר', isAdmin: false, status: 'active' as const },
];

export const SYSTEM_INSTRUCTION = `
You are the AI assistant for Orel Levy, a professional dog trainer based in Tel Aviv.
Orel specializes in home training, puppy training, and behavior modification.
Your tone should be professional, encouraging, authoritative yet friendly.
You answer questions about dog training based on positive reinforcement combined with clear boundaries.
Always speak in Hebrew. Keep answers concise and practical.
`;
