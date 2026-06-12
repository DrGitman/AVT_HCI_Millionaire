export const TOPICS = [
  {
    id: 'ubuntu',
    title: 'Ubuntu & Communalism',
    description: 'Foundational collective ethics for social interaction.',
    heroTitle: 'The Collective Essence of Interactive Systems',
    quote: 'Umuntu ngumuntu ngabantu — A person is a person through other persons',
    quoteAttribution: 'Zulu Proverb',
    nextTopicId: 'sagacity',
  },
  {
    id: 'sagacity',
    title: 'Philosophical Sagacity',
    description: 'Integrating indigenous wisdom into modern frameworks.',
    heroTitle: 'Indigenous Reasoning in Digital Systems',
    quote: 'Wisdom is like a baobab tree; no one individual can embrace it.',
    quoteAttribution: 'African Proverb',
    nextTopicId: 'paradigm',
  },
  {
    id: 'paradigm',
    title: 'African HCI Paradigm',
    description: 'Decolonizing digital interfaces for local contexts.',
    heroTitle: 'Context-First Interface Architecture',
    quote: 'Technology must speak the language of the community it serves.',
    quoteAttribution: 'HCI Research Collective',
    nextTopicId: 'ethics',
  },
  {
    id: 'ethics',
    title: 'Ethics & Data Sovereignty',
    description: 'Protecting community knowledge in the digital age.',
    heroTitle: 'Guardianship of Communal Knowledge',
    quote: 'Data about the people must remain with the people.',
    quoteAttribution: 'Digital Sovereignty Charter',
    nextTopicId: 'wellbeing',
  },
  {
    id: 'wellbeing',
    title: 'Digital Well-being',
    description: 'Fostering health and harmony through mindful design.',
    heroTitle: 'Harmonious Engagement in Interactive Spaces',
    quote: 'A calm interface nurtures a calm community.',
    quoteAttribution: 'Well-being Design Lab',
    nextTopicId: null,
  },
]

export const getTopicById = (id) => TOPICS.find((t) => t.id === id) ?? TOPICS[0]
