
const NAV_LINKS = [
    { name: 'Home', path: 'index.html' },
    { name: 'About', path: 'about.html' },
    { name: 'Programs', path: 'programs.html' },
    { name: 'Impact', path: 'impact.html' },
    { name: 'Get Involved', path: 'volunteer.html' },
    { name: 'Events', path: 'events.html' },
    { name: 'Blog', path: 'content/blog/index.html' },
    { name: 'Contact', path: 'contact.html' },
];

const FOOTER_LINKS = {
    quick: [
        { name: 'About Us', path: 'about.html' },
        { name: 'Our Programs', path: 'programs.html' },
        { name: 'Impact Stories', path: 'impact.html' },
        { name: 'Events', path: 'events.html' },
        { name: 'Contact Us', path: 'contact.html' }
    ],
    involved: [
        { name: 'Donate Now', path: 'donate.html' },
        { name: 'Volunteer', path: 'volunteer.html' },
        { name: 'Partner with Us', path: 'partners.html' },
    ],
    legal: [
        { name: 'Privacy Policy', path: 'content/policies/privacy-policy.html' },
        { name: 'Terms of Service', path: 'content/policies/terms.html' }
    ]
};

const CAUSES = [
    "Women’s Empowerment", "Child Education", "Youth Employability", 
    "Healthcare", "Animal Welfare", "Environment", "Disability Inclusion", "Elderly Care"
];

const IMPACT_STATS = [
    { value: 15000, label: 'Women Skilled', suffix: '+' },
    { value: 25000, label: 'Children Educated', suffix: '+' },
    { value: 50000, label: 'Trees Planted', suffix: '+' },
    { value: 8000, label: 'Animals Rescued', suffix: '+' },
];

const PROGRAMS_DATA = [
  {
    slug: 'women-skilling',
    title: 'Saksham: Women’s Skill Development',
    cause: 'Women’s Empowerment',
    location: 'Mumbai, Maharashtra',
    shortDescription: 'Empowering women with vocational skills like tailoring and digital literacy for financial independence.',
    longDescription: 'Project Saksham provides comprehensive training to underprivileged women, equipping them with marketable skills. Our curriculum includes tailoring, computer basics, financial literacy, and entrepreneurship workshops. We also provide support for job placement and starting small businesses, creating a ripple effect of empowerment in their communities.',
    imageUrl: 'https://picsum.photos/seed/women-skilling/600/400',
    imageAlt: 'Women learning tailoring'
  },
  {
    slug: 'child-education',
    title: 'Vidya: Child Education & Protection',
    cause: 'Child Education',
    location: 'Delhi, NCR',
    shortDescription: 'Ensuring access to quality education and a safe learning environment for out-of-school children.',
    longDescription: 'Project Vidya runs learning centers in urban slums, providing bridge education to help children join mainstream schools. We focus on holistic development, including nutrition, health check-ups, and workshops on child rights and safety. Our goal is to break the cycle of poverty through education.',
    imageUrl: 'https://picsum.photos/seed/child-education/600/400',
    imageAlt: 'Children studying'
  },
  {
    slug: 'animal-rescue',
    title: 'Karuna: Animal Welfare & Rescue',
    cause: 'Animal Welfare',
    location: 'Bangalore, Karnataka',
    shortDescription: 'Providing rescue, medical care, and shelter for stray and injured animals.',
    longDescription: 'Project Karuna operates a 24/7 helpline and ambulance for animal rescue. Our shelter provides medical treatment, vaccination, sterilization, and adoption services. We also conduct awareness campaigns to promote compassion and responsible pet ownership in the community.',
    imageUrl: 'https://picsum.photos/seed/animal-rescue/600/400',
    imageAlt: 'Rescue dog'
  },
  {
    slug: 'tree-planting',
    title: 'Harit: Environment & Sustainability',
    cause: 'Environment',
    location: 'Pune, Maharashtra',
    shortDescription: 'Conducting large-scale tree planting drives and promoting waste management solutions.',
    longDescription: 'Project Harit focuses on increasing green cover in urban and rural areas through community-led tree plantation drives. We also work with local bodies to implement effective waste segregation and recycling programs, fostering a culture of environmental responsibility.',
    imageUrl: 'https://picsum.photos/seed/tree-planting/600/400',
    imageAlt: 'Planting saplings'
  },
];

const EVENTS_DATA = [
    { id: 1, title: 'Annual Charity Gala 2024', date: '2024-12-15', location: 'The Grand Ballroom, Mumbai', description: 'Join us for an evening of inspiration and fundraising.', imageUrl: 'https://picsum.photos/seed/gala-event/600/400', isPast: false },
    { id: 2, title: 'Community Tree Planting Drive', date: '2024-08-05', location: 'Sanjay Van, New Delhi', description: 'Volunteer with us to plant 5000 saplings.', imageUrl: 'https://picsum.photos/seed/planting-event/600/400', isPast: false },
    { id: 3, title: 'Women Entrepreneurs Exhibition', date: '2024-05-20', location: 'Community Hall, Bangalore', description: 'A showcase of products by graduates of our skilling programs.', imageUrl: 'https://picsum.photos/seed/exhibition-event/600/400', isPast: true },
];

const BLOG_POSTS_DATA = [
    { 
        slug: 'empowerment-stories', 
        url: 'content/blog/empowerment-stories.html',
        title: 'From Skills to Success: Stories of Empowerment', 
        author: 'Aanya Sharma', 
        date: 'July 15, 2024', 
        excerpt: 'Meet three incredible women who transformed their lives and communities after graduating from our Saksham skilling program...', 
        imageUrl: 'https://picsum.photos/seed/blog-post-1/800/500'
    },
    { 
        slug: 'power-of-education', 
        url: 'content/blog/power-of-education.html',
        title: 'The Ripple Effect: How Educating One Child Lifts a Community', 
        author: 'Rohan Verma', 
        date: 'June 28, 2024', 
        excerpt: 'Education is more than just literacy; it\'s a beacon of hope. We explore the profound, long-term impact of our Vidya program...', 
        imageUrl: 'https://picsum.photos/seed/blog-post-2/800/500'
    },
    { 
        slug: 'compassion-in-action', 
        url: 'content/blog/compassion-in-action.html',
        title: 'Compassion in Action: A Day in the Life of Our Animal Rescue Team', 
        author: 'Vikram Singh', 
        date: 'May 10, 2024', 
        excerpt: 'The phone rings at 2 AM. A stray dog has been hit by a car. For our Karuna team, the day has just begun...', 
        imageUrl: 'https://picsum.photos/seed/blog-post-3/800/500'
    },
];