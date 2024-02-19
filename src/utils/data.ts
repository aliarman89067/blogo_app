import {
  Atom,
  Bird,
  Book,
  Bot,
  BrainCircuit,
  Code2,
  HeartHandshake,
  HeartPulse,
  NotebookPen,
  Trophy,
  User,
  Vote,
} from "lucide-react";

export const navbarLinks = [
  {
    id: 1,
    name: "Home",
    href: "/",
  },
  {
    id: 2,
    name: "Create Blog",
    href: "/create-blog",
  },
  {
    id: 3,
    name: "Profile",
    href: "/profile",
  },
];

export const trendingData = [
  {
    image: "/images/trending1.jpg",
    authorImage: "/images/author1.png",
    authorName: "John Doe",
    title: "If you want to be creative, you can't be certain",
    date: "Jan 16 2024",
    rating: 5.6,
  },
  {
    image: "/images/trending2.jpg",
    authorImage: "/images/author2.png",
    authorName: "Jane Josh",
    title: "The Astonishing Origins of 6 Common Compound Words",
    date: "Dec 20, 2023",
    rating: 4.3,
  },
  {
    image: "/images/trending1.jpg",
    authorImage: "/images/author1.png",
    authorName: "John Doe",
    title: "If you want to be creative, you can't be certain",
    date: "Jan 16 2024",
    rating: 5.6,
  },
  {
    image: "/images/trending2.jpg",
    authorImage: "/images/author2.png",
    authorName: "Jane Josh",
    title: "The Astonishing Origins of 6 Common Compound Words",
    date: "Dec 20, 2023",
    rating: 4.3,
  },
  {
    image: "/images/trending1.jpg",
    authorImage: "/images/author1.png",
    authorName: "John Doe",
    title: "If you want to be creative, you can't be certain",
    date: "Jan 16 2024",
    rating: 5.6,
  },
  {
    image: "/images/trending2.jpg",
    authorImage: "/images/author2.png",
    authorName: "Jane Josh",
    title: "The Astonishing Origins of 6 Common Compound Words",
    date: "Dec 20, 2023",
    rating: 4.3,
  },
  {
    image: "/images/trending1.jpg",
    authorImage: "/images/author1.png",
    authorName: "John Doe",
    title: "If you want to be creative, you can't be certain",
    date: "Jan 16 2024",
    rating: 5.6,
  },
  {
    image: "/images/trending2.jpg",
    authorImage: "/images/author2.png",
    authorName: "Jane Josh",
    title: "The Astonishing Origins of 6 Common Compound Words",
    date: "Dec 20, 2023",
    rating: 4.3,
  },
];

export interface BlogsData {
  image: string;
  authorImage: string;
  authorName: string;
  title: string;
  description: string;
  category: string;
  date: string;
  rating: number;
}

export const blogsData = [
  {
    image: "/images/trending1.jpg",
    authorImage: "/images/author1.png",
    authorName: "John Doe",
    title: "If you want to be creative, you can't be certain",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum, ad. Laudantium tempore fugit quidem facilis, quos quisquam laborum id, voluptatem obcaecati ab, porro reiciendis asperiores iste exercitationem. Dignissimos, quis odit.",
    category: "Technology",
    date: "Jan 16 2024",
    rating: 5.6,
  },
  {
    image: "/images/trending1.jpg",
    authorImage: "/images/author1.png",
    authorName: "John Doe",
    title: "If you want to be creative, you can't be certain",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum, ad. Laudantium tempore fugit quidem facilis, quos quisquam laborum id, voluptatem obcaecati ab, porro reiciendis asperiores iste exercitationem. Dignissimos, quis odit.",
    category: "Technology",
    date: "Jan 16 2024",
    rating: 5.6,
  },
  {
    image: "/images/trending1.jpg",
    authorImage: "/images/author1.png",
    authorName: "John Doe",
    title: "If you want to be creative, you can't be certain",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum, ad. Laudantium tempore fugit quidem facilis, quos quisquam laborum id, voluptatem obcaecati ab, porro reiciendis asperiores iste exercitationem. Dignissimos, quis odit.",
    category: "Technology",
    date: "Jan 16 2024",
    rating: 5.6,
  },
  {
    image: "/images/trending1.jpg",
    authorImage: "/images/author1.png",
    authorName: "John Doe",
    title: "If you want to be creative, you can't be certain",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum, ad. Laudantium tempore fugit quidem facilis, quos quisquam laborum id, voluptatem obcaecati ab, porro reiciendis asperiores iste exercitationem. Dignissimos, quis odit.",
    category: "Technology",
    date: "Jan 16 2024",
    rating: 5.6,
  },
  {
    image: "/images/trending1.jpg",
    authorImage: "/images/author1.png",
    authorName: "John Doe",
    title: "If you want to be creative, you can't be certain",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum, ad. Laudantium tempore fugit quidem facilis, quos quisquam laborum id, voluptatem obcaecati ab, porro reiciendis asperiores iste exercitationem. Dignissimos, quis odit.",
    category: "Technology",
    date: "Jan 16 2024",
    rating: 5.6,
  },
  {
    image: "/images/trending1.jpg",
    authorImage: "/images/author1.png",
    authorName: "John Doe",
    title: "If you want to be creative, you can't be certain",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum, ad. Laudantium tempore fugit quidem facilis, quos quisquam laborum id, voluptatem obcaecati ab, porro reiciendis asperiores iste exercitationem. Dignissimos, quis odit.",
    category: "Technology",
    date: "Jan 16 2024",
    rating: 5.6,
  },
  {
    image: "/images/trending1.jpg",
    authorImage: "/images/author1.png",
    authorName: "John Doe",
    title: "If you want to be creative, you can't be certain",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum, ad. Laudantium tempore fugit quidem facilis, quos quisquam laborum id, voluptatem obcaecati ab, porro reiciendis asperiores iste exercitationem. Dignissimos, quis odit.",
    category: "Technology",
    date: "Jan 16 2024",
    rating: 5.6,
  },
  {
    image: "/images/trending1.jpg",
    authorImage: "/images/author1.png",
    authorName: "John Doe",
    title: "If you want to be creative, you can't be certain",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum, ad. Laudantium tempore fugit quidem facilis, quos quisquam laborum id, voluptatem obcaecati ab, porro reiciendis asperiores iste exercitationem. Dignissimos, quis odit.",
    category: "Technology",
    date: "Jan 16 2024",
    rating: 5.6,
  },
  {
    image: "/images/trending1.jpg",
    authorImage: "/images/author1.png",
    authorName: "John Doe",
    title: "If you want to be creative, you can't be certain",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum, ad. Laudantium tempore fugit quidem facilis, quos quisquam laborum id, voluptatem obcaecati ab, porro reiciendis asperiores iste exercitationem. Dignissimos, quis odit.",
    category: "Technology",
    date: "Jan 16 2024",
    rating: 5.6,
  },
];

export const categories = [
  {
    id: 1,
    name: "Technology",
    description:
      "Select for topics related to AI, robots, computer science, and emerging tech trends.",
    href: "/category/technology",
    nameForDatabase: "technology",
    icon: Bot,
  },
  {
    id: 2,
    name: "Information",
    description:
      "Choose for discussions on data privacy, cybersecurity, digital literacy, and information management.",
    href: "/category/information",
    nameForDatabase: "information",
    icon: Book,
  },
  {
    id: 3,
    name: "Programming",
    description:
      "Opt for topics covering coding languages, software development, coding best practices, and programming tutorials.",
    href: "/category/programming",
    nameForDatabase: "programming",
    icon: Code2,
  },
  {
    id: 4,
    name: "Data Science",
    description:
      "Pick for articles on data analysis, machine learning, data visualization, and big data trends.",
    href: "/category/data-science",
    nameForDatabase: "data-science",
    icon: Atom,
  },
  {
    id: 5,
    name: "Self Improvement",
    description:
      "Indicate for content focusing on personal development, productivity tips, mindfulness, and work-life balance.",
    href: "/category/self-improvement",
    nameForDatabase: "self-improvement",
    icon: HeartPulse,
  },
  {
    id: 6,
    name: "Writing",
    description:
      "Use for posts about writing techniques, storytelling, grammar tips, and authorship advice.",
    href: "/category/writing",
    nameForDatabase: "writing",
    icon: NotebookPen,
  },
  {
    id: 7,
    name: "Relationships",
    description:
      "Select for discussions on interpersonal relationships, communication skills, love, and dating advice.",
    href: "/category/relationships",
    nameForDatabase: "relationships",
    icon: HeartHandshake,
  },
  {
    id: 8,
    name: "Machine Learning",
    description:
      "Choose for content about ML algorithms, deep learning, neural networks, and AI applications.",
    href: "/category/machine-learning",
    nameForDatabase: "machine-learning",
    icon: BrainCircuit,
  },
  {
    id: 9,
    name: "Productivity",
    description:
      "Opt for articles on time management, organization tips, task prioritization, and productivity tools.",
    href: "/category/productivity",
    nameForDatabase: "productivity",
    icon: Trophy,
  },
  {
    id: 10,
    name: "Politics",
    description:
      "Indicate for discussions on political analysis, policy debates, government affairs, and current events commentary.",
    href: "/category/politics",
    nameForDatabase: "politics",
    icon: Vote,
  },
  {
    id: 11,
    name: "Peacefull",
    description:
      "Select Peacefull if you topics contain some calming or relaxing flow.",
    href: "/category/peacefull",
    nameForDatabase: "peacefull",
    icon: Bird,
  },
];
