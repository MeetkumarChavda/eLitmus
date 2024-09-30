import { 
  BotMessageSquare, 
  BatteryCharging, 
  Fingerprint, 
  ShieldHalf, 
  PlugZap, 
  GlobeLock 
} from "lucide-react";


import user1 from "../assets/profile-pictures/user1.jpg";
import user2 from "../assets/profile-pictures/user2.jpg";
import user3 from "../assets/profile-pictures/user3.jpg";
import user4 from "../assets/profile-pictures/user4.jpg";
import user5 from "../assets/profile-pictures/user5.jpg";
import user6 from "../assets/profile-pictures/user6.jpg";


export const testimonials = [
  {
    user: "Alice Johnson",
    company: "EduTech Solutions",
    image: user1,
    text: "This exam portal transformed our assessment process! The user experience is smooth, and it saves us a lot of time.",
  },
  {
    user: "Mark Thompson",
    company: "Learning Sphere",
    image: user2,
    text: "We were impressed by the efficiency and reliability of this platform. Our students find it intuitive and easy to use.",
  },
  {
    user: "Sarah Miller",
    company: "Academic Innovations",
    image: user3,
    text: "The analytics feature helped us understand student performance better than ever. A must-have tool for educational institutions!",
  },
  {
    user: "James Davis",
    company: "Future Learning",
    image: user4,
    text: "The integration with your app was seamless. This portal made our exam process so much more efficient!",
  },
  {
    user: "Linda Brown",
    company: "Global Education Network",
    image: user5,
    text: "Exceptional customer support and a robust platform. It has significantly improved our exam administration.",
  },
  {
    user: "Robert Wilson",
    company: "NextGen Learning",
    image: user6,
    text: "The question bank feature is fantastic! We can now create custom exams quickly and effortlessly.",
  },
];

export const features = [
  {
    icon: <BotMessageSquare />,
    text: "User-Friendly Interface",
    description:
      "Our exam portal offers an intuitive interface for both students and administrators, ensuring a smooth experience.",
  },
  {
    icon: <Fingerprint />,
    text: "Secure Authentication",
    description:
      "We implement JWT authentication to ensure the good level of security for user accounts.",
  },
  {
    icon: <ShieldHalf />,
    text: "Customizable Exam Templates",
    description:
      "Create tailored exams with a variety of question types including multiple-choice, essay, and more.",
  },
  {
    icon: <BatteryCharging />,
    text: "Real-Time Monitoring",
    description:
      "Monitor students in real-time during exams to ensure academic integrity and a fair testing environment.",
  },
  {
    icon: <PlugZap />,
    text: "Collaboration Tools",
    description:
      "Collaborate with educators to design and administer exams efficiently, streamlining the assessment process.",
  },
  {
    icon: <GlobeLock />,
    text: "Comprehensive Analytics",
    description:
      "Access detailed analytics on student performance and exam statistics to improve future assessments.",
  },
];

export const checklistItems = [
  {
    title: "Easy Exam Creation",
    description:
      "Quickly set up exams using our streamlined exam builder that allows for easy question import and arrangement.",
  },
  {
    title: "Instant Grading",
    description:
      "Receive instant results with automated grading, saving time for educators and providing prompt feedback to students.",
  },
  {
    title: "Adaptive Learning Paths",
    description:
      "Utilize analytics to create personalized learning paths for students based on their performance in assessments.",
  },
  {
    title: "Secure Online Testing",
    description:
      "Conduct secure online exams with proctoring features to ensure integrity during assessments.",
  },
];


export const resourcesLinks = [
  { href: "#", text: "Getting Started" },
  { href: "#", text: "Community Forums" },
];

export const platformLinks = [
  { href: "#", text: "Features" },
  { href: "#", text: "Supported Devices" },
  { href: "#", text: "System Requirements" },
  { href: "#", text: "Downloads" },
  { href: "#", text: "Release Notes" },
];

export const communityLinks = [
  { href: "#", text: "Events" },
  { href: "#", text: "Meetups" },
  { href: "#", text: "Conferences" },
  { href: "#", text: "Hackathons" },
];
