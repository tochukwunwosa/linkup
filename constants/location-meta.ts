export interface LocationMeta {
  slug: string;
  label: string;
  /** Used in ILIKE query against the `location` text column */
  searchTerm: string;
  description: string;
}

export const locationMeta: LocationMeta[] = [
  {
    slug: "lagos",
    label: "Lagos",
    searchTerm: "Lagos",
    description:
      "Lagos is Nigeria's commercial capital and its largest tech hub. From startup pitch nights in Victoria Island to developer meetups in Yaba — Nigeria's Silicon Valley — the city hosts more tech events than any other in the country. Whether you're into Web3, AI, fintech, or design, there's always something happening in Lagos.",
  },
  {
    slug: "abuja",
    label: "Abuja",
    searchTerm: "Abuja",
    description:
      "Abuja, Nigeria's Federal Capital Territory, is home to a fast-growing tech ecosystem driven by government initiatives, policy innovation, and an active community of developers, entrepreneurs, and fintech professionals. The city regularly hosts conferences, workshops, and networking events that shape Nigeria's digital economy.",
  },
  {
    slug: "rivers",
    label: "Rivers",
    searchTerm: "Rivers",
    description:
      "Port Harcourt is one of Nigeria's most active tech cities outside Lagos. The Rivers State tech community hosts regular developer meetups, hackathons, and startup events, supported by a growing number of innovation hubs and tech companies in the region.",
  },
  {
    slug: "enugu",
    label: "Enugu",
    searchTerm: "Enugu",
    description:
      "Enugu is emerging as a significant tech hub in South East Nigeria. With a growing community of developers, designers, and tech entrepreneurs, the state hosts conferences, meetups, and innovation events that are putting it on the map as a key player in Nigeria's tech ecosystem.",
  },
  {
    slug: "kano",
    label: "Kano",
    searchTerm: "Kano",
    description:
      "Kano is the gateway to Northern Nigeria's tech scene. The city's young, tech-savvy population drives a growing ecosystem of innovation hubs, developer communities, and startup events. Tech meetups and workshops in Kano are helping to build the next generation of northern Nigerian tech talent.",
  },
  {
    slug: "oyo",
    label: "Oyo",
    searchTerm: "Oyo",
    description:
      "Ibadan, the capital of Oyo State, is one of Nigeria's largest cities and an increasingly active tech community. Home to the University of Ibadan and several innovation spaces, the state regularly hosts developer meetups, hackathons, and tech conferences.",
  },
  {
    slug: "anambra",
    label: "Anambra",
    searchTerm: "Anambra",
    description:
      "Anambra State is a growing tech destination in South East Nigeria. With Awka and Onitsha as commercial centres, the state's tech community is building momentum through meetups, bootcamps, and innovation events.",
  },
  {
    slug: "delta",
    label: "Delta",
    searchTerm: "Delta",
    description:
      "Delta State is an emerging tech hub in Nigeria's South South region. With Asaba and Warri as active centres, the state hosts tech events, developer gatherings, and startup competitions that are nurturing local digital talent.",
  },
  {
    slug: "edo",
    label: "Edo",
    searchTerm: "Edo",
    description:
      "Benin City, the capital of Edo State, is home to a vibrant and growing tech community. The city hosts regular developer meetups, hackathons, and tech conferences, making it one of the rising tech hubs in Nigeria's South South region.",
  },
  {
    slug: "kaduna",
    label: "Kaduna",
    searchTerm: "Kaduna",
    description:
      "Kaduna is one of Northern Nigeria's most active tech cities. The state hosts a variety of tech events, from developer workshops to startup competitions, supported by a growing number of innovation hubs and tech-focused institutions.",
  },
  {
    slug: "kwara",
    label: "Kwara",
    searchTerm: "Kwara",
    description:
      "Ilorin, the capital of Kwara State, is a growing hub for tech talent in North Central Nigeria. The city's tech community organises regular meetups, workshops, and conferences, building a vibrant ecosystem for developers and entrepreneurs.",
  },
  {
    slug: "imo",
    label: "Imo",
    searchTerm: "Imo",
    description:
      "Owerri, Imo State's capital, is home to an active tech community in South East Nigeria. The city hosts developer events, hackathons, and innovation workshops that are building a strong foundation for the state's digital economy.",
  },
  {
    slug: "plateau",
    label: "Plateau",
    searchTerm: "Plateau",
    description:
      "Jos, the capital of Plateau State, is a growing tech hub in North Central Nigeria. The city's diverse community supports a range of tech events, from developer meetups to startup pitch competitions and innovation summits.",
  },
  {
    slug: "cross-river",
    label: "Cross River",
    searchTerm: "Cross River",
    description:
      "Calabar, the capital of Cross River State, is one of Nigeria's most scenic cities and an emerging tech destination. The state hosts tech events, developer workshops, and innovation meetups as part of its growing digital economy.",
  },
  {
    slug: "akwa-ibom",
    label: "Akwa Ibom",
    searchTerm: "Akwa Ibom",
    description:
      "Uyo, the capital of Akwa Ibom State, is an emerging tech hub in Nigeria's South South region. The city's tech community is growing rapidly, with regular developer meetups, hackathons, and innovation events.",
  },
  {
    slug: "niger",
    label: "Niger",
    searchTerm: "Niger",
    description:
      "Minna, the capital of Niger State, is developing its tech ecosystem in North Central Nigeria. The state hosts developer workshops, tech meetups, and innovation events that are building local digital capacity.",
  },
  {
    slug: "benue",
    label: "Benue",
    searchTerm: "Benue",
    description:
      "Makurdi, the capital of Benue State, is home to a growing tech community in North Central Nigeria. Local developers and entrepreneurs regularly organise tech meetups and innovation events in the state.",
  },
  {
    slug: "nasarawa",
    label: "Nasarawa",
    searchTerm: "Nasarawa",
    description:
      "Lafia, the capital of Nasarawa State, is an emerging tech destination in North Central Nigeria. The state's proximity to Abuja makes it an active participant in the FCT's broader tech ecosystem.",
  },
  {
    slug: "kogi",
    label: "Kogi",
    searchTerm: "Kogi",
    description:
      "Lokoja, the capital of Kogi State, is developing its tech community at the confluence of Nigeria's two major rivers. The state hosts developer events and innovation workshops that are building local tech capacity.",
  },
  {
    slug: "abia",
    label: "Abia",
    searchTerm: "Abia",
    description:
      "Umuahia and Aba in Abia State are growing centres of tech activity in South East Nigeria. The state's entrepreneurial culture supports a vibrant community of developers, designers, and startup founders.",
  },
  {
    slug: "ebonyi",
    label: "Ebonyi",
    searchTerm: "Ebonyi",
    description:
      "Abakaliki, the capital of Ebonyi State, is a growing tech destination in South East Nigeria. The state's tech community is building momentum with developer meetups and innovation events.",
  },
  {
    slug: "bayelsa",
    label: "Bayelsa",
    searchTerm: "Bayelsa",
    description:
      "Yenagoa, the capital of Bayelsa State, is an emerging tech hub in Nigeria's South South region. The state hosts developer meetups, tech workshops, and innovation events as part of its growing digital economy.",
  },
  {
    slug: "ogun",
    label: "Ogun",
    searchTerm: "Ogun",
    description:
      "Ogun State, located between Lagos and Ibadan, is an active tech corridor in South West Nigeria. The state hosts developer events, hackathons, and startup meetups, benefitting from its proximity to Lagos's vibrant tech ecosystem.",
  },
  {
    slug: "ondo",
    label: "Ondo",
    searchTerm: "Ondo",
    description:
      "Akure, the capital of Ondo State, is home to a growing tech community in South West Nigeria. The state hosts developer meetups, tech workshops, and innovation events, with a strong university-driven tech culture.",
  },
  {
    slug: "osun",
    label: "Osun",
    searchTerm: "Osun",
    description:
      "Osogbo, the capital of Osun State, is an emerging tech hub in South West Nigeria. The state hosts developer meetups, hackathons, and innovation events, with a growing community of young tech professionals.",
  },
  {
    slug: "ekiti",
    label: "Ekiti",
    searchTerm: "Ekiti",
    description:
      "Ado-Ekiti, the capital of Ekiti State, is developing a tech ecosystem in South West Nigeria. The state hosts developer workshops and tech meetups that are building local digital talent.",
  },
  {
    slug: "katsina",
    label: "Katsina",
    searchTerm: "Katsina",
    description:
      "Katsina is a growing tech destination in North West Nigeria. The state's tech community hosts developer workshops and innovation events as part of Nigeria's expanding northern tech ecosystem.",
  },
  {
    slug: "kebbi",
    label: "Kebbi",
    searchTerm: "Kebbi",
    description:
      "Birnin Kebbi, the capital of Kebbi State, is developing its tech community in North West Nigeria. The state hosts innovation workshops and tech events as part of the broader northern Nigeria tech ecosystem.",
  },
  {
    slug: "sokoto",
    label: "Sokoto",
    searchTerm: "Sokoto",
    description:
      "Sokoto is an emerging tech destination in North West Nigeria. The state hosts developer workshops and innovation events as part of Nigeria's commitment to building digital talent across all regions.",
  },
  {
    slug: "zamfara",
    label: "Zamfara",
    searchTerm: "Zamfara",
    description:
      "Gusau, the capital of Zamfara State, is building its tech community in North West Nigeria. Local developer groups and innovation hubs host workshops and events to develop digital skills in the state.",
  },
  {
    slug: "jigawa",
    label: "Jigawa",
    searchTerm: "Jigawa",
    description:
      "Dutse, the capital of Jigawa State, is an emerging tech hub in North West Nigeria. The state hosts developer events and innovation workshops to build local digital capacity.",
  },
  {
    slug: "adamawa",
    label: "Adamawa",
    searchTerm: "Adamawa",
    description:
      "Yola, the capital of Adamawa State, is home to a growing tech community in North East Nigeria. Local developer groups and innovation spaces host workshops and events to build digital skills.",
  },
  {
    slug: "bauchi",
    label: "Bauchi",
    searchTerm: "Bauchi",
    description:
      "Bauchi State is developing its tech ecosystem in North East Nigeria. The state hosts developer workshops and innovation events to build local digital talent and support the growth of tech entrepreneurship.",
  },
  {
    slug: "borno",
    label: "Borno",
    searchTerm: "Borno",
    description:
      "Maiduguri, the capital of Borno State, is building a tech community in North East Nigeria. Innovation hubs and developer groups host workshops and events to develop digital skills and support local entrepreneurs.",
  },
  {
    slug: "gombe",
    label: "Gombe",
    searchTerm: "Gombe",
    description:
      "Gombe State is an emerging tech destination in North East Nigeria. The state hosts developer workshops and innovation events as part of Nigeria's commitment to building digital talent across all regions.",
  },
  {
    slug: "taraba",
    label: "Taraba",
    searchTerm: "Taraba",
    description:
      "Jalingo, the capital of Taraba State, is developing its tech ecosystem in North East Nigeria. Local developer communities and innovation groups host events to build digital skills and support tech entrepreneurship.",
  },
  {
    slug: "yobe",
    label: "Yobe",
    searchTerm: "Yobe",
    description:
      "Damaturu, the capital of Yobe State, is building a tech community in North East Nigeria. Local innovation hubs and developer groups host workshops to develop digital skills in the state.",
  },
];

export function getLocationMeta(slug: string): LocationMeta | undefined {
  return locationMeta.find((l) => l.slug === slug);
}
