export interface CategoryMeta {
  slug: string;
  label: string;
  /** Keywords passed to the search_events_by_categories RPC */
  dbKeywords: string[];
  description: string;
}

export const categoryMeta: CategoryMeta[] = [
  {
    slug: "web-development",
    label: "Web Development",
    dbKeywords: ["Web", "Frontend", "Backend", "Fullstack", "web development"],
    description:
      "Web development events in Nigeria bring together frontend, backend, and fullstack developers to share knowledge, build projects, and connect with the community. From React workshops to Node.js meetups, these events cover the full spectrum of modern web development.",
  },
  {
    slug: "web3",
    label: "Web3 & Blockchain",
    dbKeywords: ["Web3", "Blockchain", "crypto", "DeFi", "NFT"],
    description:
      "Nigeria is one of Africa's leading Web3 and blockchain markets. These events bring together developers, founders, and investors building decentralised applications, exploring DeFi, and shaping the future of blockchain technology in Nigeria.",
  },
  {
    slug: "ai-ml",
    label: "AI & Machine Learning",
    dbKeywords: ["AI", "Machine Learning", "AI Safety", "artificial intelligence", "ML"],
    description:
      "Artificial intelligence and machine learning events in Nigeria are growing rapidly. From hands-on workshops on large language models to conferences on AI policy and safety, these events connect Nigeria's AI community and drive innovation across industries.",
  },
  {
    slug: "data-science",
    label: "Data Science & Analytics",
    dbKeywords: ["Data Science", "data", "analytics", "data engineering"],
    description:
      "Data science events in Nigeria connect analysts, engineers, and business leaders who are turning data into decisions. From Python workshops to data visualisation masterclasses, these events build the skills driving Nigeria's data economy.",
  },
  {
    slug: "cybersecurity",
    label: "Cybersecurity",
    dbKeywords: ["Cybersecurity", "security", "infosec", "ethical hacking"],
    description:
      "Cybersecurity events in Nigeria address one of the country's most critical digital challenges. These conferences, workshops, and CTF competitions bring together security professionals, ethical hackers, and policymakers to build a safer digital Nigeria.",
  },
  {
    slug: "mobile-development",
    label: "Mobile Development",
    dbKeywords: ["Mobile", "Android", "iOS", "Flutter", "React Native"],
    description:
      "Mobile development events in Nigeria cover the full ecosystem of app development — from Android and iOS to cross-platform frameworks like Flutter and React Native. Nigeria's mobile-first market makes these events especially valuable for developers building for African users.",
  },
  {
    slug: "cloud-devops",
    label: "Cloud & DevOps",
    dbKeywords: ["Cloud", "DevOps", "Cloud Native", "Serverless", "AWS", "GCP", "Azure"],
    description:
      "Cloud and DevOps events in Nigeria cover modern infrastructure, CI/CD pipelines, container orchestration, and cloud-native architectures. These meetups and conferences help Nigerian engineers stay current with global best practices in software delivery.",
  },
  {
    slug: "startup",
    label: "Startup & Entrepreneurship",
    dbKeywords: ["Startup", "Entrepreneurship", "founder", "venture"],
    description:
      "Startup events in Nigeria connect founders, investors, mentors, and ecosystem builders. From pitch competitions to founder roundtables, these events are where Nigeria's next unicorns are born and where the African startup ecosystem takes shape.",
  },
  {
    slug: "fintech",
    label: "Fintech",
    dbKeywords: ["Fintech", "payments", "banking", "financial technology"],
    description:
      "Nigeria is Africa's fintech capital, and these events reflect that. Fintech conferences and meetups bring together engineers, product managers, regulators, and investors to discuss payments, lending, insurance technology, and the future of financial services in Africa.",
  },
  {
    slug: "design-ux",
    label: "Design & UX",
    dbKeywords: ["Design", "UI/UX", "product design", "UX", "UI"],
    description:
      "Design and UX events in Nigeria bring together product designers, UX researchers, and creative professionals to share skills, critique work, and explore design thinking. These events are essential for designers building products for Nigerian and African markets.",
  },
  {
    slug: "product-management",
    label: "Product Management",
    dbKeywords: ["Product Management", "product manager", "PM", "product"],
    description:
      "Product management events in Nigeria connect PMs, founders, and engineers who are building digital products for African users. These meetups, workshops, and conferences cover everything from roadmapping and user research to growth strategy and stakeholder management.",
  },
  {
    slug: "hackathon",
    label: "Hackathons",
    dbKeywords: ["Hackathon", "hack", "buildathon", "sprint"],
    description:
      "Hackathons in Nigeria are some of the most exciting events in the tech calendar. Developers, designers, and product people come together to build solutions to real African problems in days — and many of Nigeria's most promising startups were born at a hackathon.",
  },
  {
    slug: "edtech",
    label: "EdTech",
    dbKeywords: ["EdTech", "education technology", "elearning", "learning"],
    description:
      "EdTech events in Nigeria explore how technology is transforming education — from digital learning platforms and coding bootcamps to AI tutors and education policy. These events bring together educators, developers, and innovators shaping the future of learning in Nigeria.",
  },
  {
    slug: "healthtech",
    label: "HealthTech",
    dbKeywords: ["HealthTech", "health technology", "digital health", "medtech"],
    description:
      "HealthTech events in Nigeria bring together medical professionals, developers, and innovators building digital health solutions. From telemedicine platforms to hospital management systems, these events explore how technology is improving healthcare access across Nigeria.",
  },
  {
    slug: "women-in-tech",
    label: "Women in Tech",
    dbKeywords: ["Women in Tech", "gender", "diversity", "inclusion"],
    description:
      "Women in Tech events in Nigeria celebrate and support female technologists across the country. These conferences, workshops, and networking events provide mentorship, visibility, and community for women building careers in Nigeria's tech industry.",
  },
  {
    slug: "open-source",
    label: "Open Source",
    dbKeywords: ["Open Source", "OSS", "contributing", "github"],
    description:
      "Open source events in Nigeria connect contributors, maintainers, and advocates who believe in collaborative software development. These meetups and conferences celebrate Nigerian contributions to global open source projects and encourage more developers to get involved.",
  },
  {
    slug: "networking",
    label: "Networking & Community",
    dbKeywords: ["Networking", "Tech Community", "community", "meetup"],
    description:
      "Tech networking events in Nigeria are where connections are made and careers are built. From casual after-work mixers to large community summits, these events bring Nigeria's tech professionals together to share, learn, and grow.",
  },
  {
    slug: "career",
    label: "Career & Jobs",
    dbKeywords: ["Career", "jobs", "hiring", "recruitment", "internship"],
    description:
      "Career events in Nigeria connect tech talent with opportunities. From job fairs and CV workshops to salary negotiation masterclasses, these events help Nigerian developers, designers, and PMs navigate the local and global tech job market.",
  },
  {
    slug: "digital-marketing",
    label: "Digital Marketing",
    dbKeywords: ["Digital Marketing", "marketing", "SEO", "growth", "social media"],
    description:
      "Digital marketing events in Nigeria cover the strategies and tools driving growth for Nigerian businesses online. From SEO workshops to social media marketing conferences, these events help marketers and founders reach Nigerian consumers more effectively.",
  },
  {
    slug: "iot",
    label: "IoT & Hardware",
    dbKeywords: ["IoT", "hardware", "embedded systems", "Arduino", "Raspberry Pi"],
    description:
      "IoT and hardware events in Nigeria bring together makers, engineers, and product builders exploring connected devices and physical computing. These events are growing as Nigeria's maker community expands into smart agriculture, smart homes, and industrial automation.",
  },
  {
    slug: "innovation",
    label: "Innovation & Tech Policy",
    dbKeywords: ["Innovation", "Tech Policy", "AI Safety", "Research", "policy"],
    description:
      "Innovation and tech policy events in Nigeria bring together policymakers, researchers, and technologists to shape the regulatory and strategic direction of Nigeria's digital economy. These conferences address AI governance, data regulation, and the future of Nigerian innovation.",
  },
];

export function getCategoryMeta(slug: string): CategoryMeta | undefined {
  return categoryMeta.find((c) => c.slug === slug);
}
