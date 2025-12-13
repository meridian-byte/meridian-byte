import { PostRelations } from '@repo/types/models/post';
import { sampleCategories } from './categories';

export const samplePosts: PostRelations[] = [
  {
    id: '927d0ab9-4b60-4e33-92d6-7b201c66bd73',
    image:
      'https://images.unsplash.com/photo-1518972734183-c5b490a7c637?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
    title: 'The Rise of Artificial Intelligence in Everyday Life',
    excerpt:
      'Exploring how AI is transforming industries and daily routines with unprecedented efficiency.',
    content:
      'Artificial Intelligence (AI) has evolved from a futuristic concept to an integral part of modern society. From virtual assistants like Siri and Alexa to advanced algorithms in healthcare diagnostics, AI is reshaping how we interact with technology. This article delves into the ethical implications, potential job displacements, and innovative applications that AI brings to various sectors including finance, education, and entertainment.',
    allow_comments: true,
    view_count: 0,
    profile_id: 'e1f0aeaa-c466-495f-a057-e6fc3ce59cb9',
    category_id: 'ea3cc2b6-1e82-4b28-a7cc-60f8c4994f7f',
    created_at: new Date('2025-11-10T09:35:35.462141'),
    updated_at: new Date('2025-11-10T09:35:35.462141'),
    status: 'DRAFT',
    category: sampleCategories.find(
      (c) => c.id == 'ea3cc2b6-1e82-4b28-a7cc-60f8c4994f7f'
    )!,
    _count: { comments: 1 },
  },
  {
    id: '755682bc-f240-446a-aaac-91cbca4b7976',
    image:
      'https://images.unsplash.com/photo-1531736275454-adc48d079ce9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
    title: 'Sustainable Living: Tips for Reducing Your Carbon Footprint',
    excerpt:
      'Practical advice on adopting eco-friendly habits to combat climate change effectively.',
    content:
      'In an era where environmental concerns are paramount, sustainable living offers a pathway to minimize our impact on the planet. This piece discusses strategies such as reducing plastic usage, embracing renewable energy sources, and supporting local produce. It also examines the role of governments and corporations in fostering a greener future through policy changes and innovative technologies.',
    allow_comments: true,
    view_count: 0,
    profile_id: '6858d50b-d19d-4fa8-bc72-ef84bd7d0eff',
    category_id: 'd3dec6f0-a6dd-400b-a633-a102a1d00683',
    created_at: new Date('2025-11-10T09:35:35.462154'),
    updated_at: new Date('2025-11-10T09:35:35.462154'),
    status: 'DRAFT',
    category: sampleCategories.find(
      (c) => c.id == 'd3dec6f0-a6dd-400b-a633-a102a1d00683'
    )!,
    _count: { comments: 1 },
  },
  {
    id: '9819649d-b763-40ff-b84f-28e438178b01',
    image:
      'https://images.unsplash.com/photo-1532019333101-b0f43c16a912?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
    title: 'The Future of Space Exploration: Mars and Beyond',
    excerpt:
      'An overview of upcoming missions and the challenges of interplanetary travel.',
    content:
      "Space exploration has captivated humanity for decades, and with recent advancements, colonizing Mars seems within reach. This article covers NASA's Artemis program, SpaceX's Starship initiatives, and the scientific discoveries expected from these ventures. It also addresses the physiological and psychological hurdles astronauts face in long-duration spaceflights.",
    allow_comments: true,
    view_count: 0,
    profile_id: 'd75bd97d-a899-4fa4-9dbb-3612feb39532',
    category_id: 'ee589009-db4e-4af6-9262-cdb88b985ac5',
    created_at: new Date('2025-11-10T09:35:35.462169'),
    updated_at: new Date('2025-11-10T09:35:35.462169'),
    status: 'DRAFT',
    category: sampleCategories.find(
      (c) => c.id == 'ee589009-db4e-4af6-9262-cdb88b985ac5'
    )!,
    _count: { comments: 1 },
  },
  {
    id: 'd05b42cc-674b-4f43-a0a2-fa28aeb913d6',
    image:
      'https://images.unsplash.com/photo-1520529890308-f503006340b4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1167',
    title: 'Mental Health in the Digital Age: Navigating Social Media',
    excerpt:
      'Insights into the psychological effects of online platforms and strategies for healthy usage.',
    content:
      'Social media has revolutionized communication, but it also poses risks to mental well-being. From cyberbullying to addiction, this discussion highlights the downsides while offering tips like digital detoxes, mindful scrolling, and fostering real-world connections to maintain a balanced life in the connected world.',
    allow_comments: true,
    view_count: 0,
    profile_id: 'e2ed50ed-ccd3-4be1-b019-89638792bd16',
    category_id: '7bfa16e8-c63e-4dcc-a9ba-20f3a11e3705',
    created_at: new Date('2025-11-10T09:35:35.462179'),
    updated_at: new Date('2025-11-10T09:35:35.462179'),
    status: 'DRAFT',
    category: sampleCategories.find(
      (c) => c.id == '7bfa16e8-c63e-4dcc-a9ba-20f3a11e3705'
    )!,
    _count: { comments: 1 },
  },
  {
    id: '21bab263-af61-4129-babf-b359f25b62e5',
    image:
      'https://images.unsplash.com/photo-1490365728022-deae76380607?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074',
    title: 'Cryptocurrency Trends: What Investors Need to Know',
    excerpt:
      'Analyzing the volatile market of digital currencies and future predictions.',
    content:
      'Cryptocurrencies have disrupted traditional finance, with Bitcoin and Ethereum leading the charge. This article explores market trends, regulatory developments, and investment strategies. It also warns about risks such as volatility and scams, emphasizing the importance of due diligence and diversified portfolios in this emerging asset class.',
    allow_comments: true,
    view_count: 0,
    profile_id: '693d43e5-ca78-43fb-bd7b-5dcd47ca2f58',
    category_id: 'ec718446-1302-4a37-a752-4442cffc75cd',
    created_at: new Date('2025-11-10T09:35:35.462191'),
    updated_at: new Date('2025-11-10T09:35:35.462191'),
    status: 'DRAFT',
    category: sampleCategories.find(
      (c) => c.id == 'ec718446-1302-4a37-a752-4442cffc75cd'
    )!,
    _count: { comments: 1 },
  },
];
