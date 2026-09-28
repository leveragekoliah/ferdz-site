export const socials = [
  { name: 'TikTok', handle: '@fferrdz', url: 'https://tiktok.com/@fferrdz' },
  { name: 'Instagram', handle: '@fferrdz', url: 'https://instagram.com/fferrdz' },
  { name: 'YouTube', handle: 'fferrdz TV', url: 'https://youtube.com/@fferrdztv86' },
  { name: 'Facebook', handle: 'Ferdz', url: 'https://www.facebook.com/share/1ZxvwehTpp/' },
]

export const stats = [
  { value: '17', unit: 'yrs', label: 'Behind the chair' },
  { value: '10+', unit: 'yrs', label: 'Trading the markets' },
  { value: '5.0', unit: '★', label: '122 client reviews' },
  { value: '250K', unit: '', label: 'Peak views on one post' },
]

// Real Booksy reviews for HIBarbers (confirmed clients). First names only, as shown on Booksy.
export const reviews = [
  { quote: 'Always the cleanest cuts.', name: 'Brandon', service: 'Precision Haircut' },
  { quote: 'Ferdz is the guy to go to in the valley. His attention to detail is perfection.', name: 'Pono', service: 'Precision Haircut' },
  { quote: 'One of the best cuts I’ve ever received.', name: 'Brandon', service: 'Precision Haircut' },
  { quote: 'Perfection.', name: 'Brittney', service: 'Precision Haircut' },
  { quote: 'The best.', name: 'Cesar', service: 'Haircut + Beard Grooming' },
  { quote: 'Best barber I’ve been to in a long time. His blend and fade is top notch.', name: 'Joshua', service: 'New Client Special' },
  { quote: 'Got my 15-year-old son right. My son said Ferdz was really cool.', name: 'Rudy', service: 'Precision Haircut' },
  { quote: 'Work is always clean and he takes his time. Makes you feel comfortable the whole cut.', name: 'Josh', service: 'Haircut + Beard Grooming' },
  { quote: 'Great haircut.', name: 'Jackson', service: 'Haircut' },
  { quote: 'Great haircut.', name: 'Ismael', service: 'Haircut' },
]

export type Offer = { name: string; price: string; detail: string; featured?: boolean }
export type Business = {
  slug: string
  index: string
  name: string
  kicker: string
  tagline: string
  summary: string
  image?: string
  visual?: 'usdjpy' | 'card'
  /** looping logo video in public/video/logos/<name>.mp4 */
  logoLoop?: string
  /** 9:16 post from the business's own Instagram / TikTok, shown on the Businesses grid */
  reel?: { src: string; alt: string; source: string }
  tiktok?: boolean
  instagram?: { handle: string; title: string; codes: string[]; shape?: 'portrait' | 'reel' }[]
  imageAlt?: string
  /** tall photos use a portrait frame on the business page */
  imageTall?: boolean
  cta: { label: string; url: string }
  secondaryCta?: { label: string; url: string }
  facts?: { label: string; value: string }[]
  offersTitle?: string
  offers?: Offer[]
  includesTitle?: string
  includes?: string[]
  steps?: { title: string; body: string }[]
  stepsTitle?: string
  policies?: string[]
  disclaimer?: string
}

export const businesses: Business[] = [
  {
    slug: 'barber',
    reel: { src: '/img/ig/DZGfeKyPhId.jpg', alt: 'Fresh cut from @hibarbers: the work speaks for itself', source: '@hibarbers' },
    index: '01',
    name: 'HIBarbers',
    kicker: 'Hawaii Celebrity Barber · Phoenix',
    tagline: 'Precision cuts. No rushed work.',
    summary:
      'Seventeen years of barbering, brought from Hawaii to central Phoenix. Clean fades, sharp lineups, beard detailing and traditional shaves. Every client gets full attention from start to finish.',
    image: '/img/ferdz-cutting.jpg',
    imageAlt: 'Ferdz cutting a client’s hair',
    cta: { label: 'Book a cut on Booksy', url: 'https://celebritybarber1.booksy.com/a/' },
    instagram: [
      { handle: 'hibarbers', title: 'The work speaks for itself.', codes: ['DZGfeKyPhId', 'DZLR7utyueU', 'DZOxeXqTtQV', 'DZafmGBmkKD', 'DZdAwN5z-Hd', 'DaLbhH9jz4m'] },
      { handle: 'hibarbers', title: 'From the chair.', shape: 'reel', codes: ['DdcB7bXhada', 'DdZdHzFheql', 'DdXEsGuhg8g', 'Dcg3AU6y5zU'] },
    ],
    facts: [
      { label: 'Location', value: 'Blended Barber Co. · 3341 N 7th Ave #1, Phoenix, AZ 85013' },
      { label: 'Hours', value: 'Daily 9 AM – 8 PM · after-hours Thu & Fri' },
      { label: 'Rating', value: '5.0 ★ from 122 reviews on Booksy' },
    ],
    offersTitle: 'The menu',
    offers: [
      { name: 'Precision Haircut', price: '$70', detail: 'Consultation, precision cut, line-up and detailed finish · 40 min' },
      { name: 'Haircut + Beard Grooming', price: '$90', detail: 'Precision cut, beard trim and shape, line-up and detail work · 1 hr' },
      { name: 'Premium Haircut Experience', price: '$85', detail: 'Cut, wash and shampoo, hot towel, extra detailing · 50 min' },
      { name: 'Premium Haircut + Beard Experience', price: '$110', detail: 'The full treatment with beard, wash and hot towel · 1 hr 10 min' },
      { name: 'Gentleman’s Specialty Cut', price: '$150', detail: 'Mohawks, side combs, frohawks, afros. Razor lineup and blow-dry · 1 hr' },
      { name: 'Priority / After-Hours', price: '$120', detail: 'After 6 PM, Thursdays and Fridays only · 40 min' },
      { name: 'New Client Special', price: '$55', detail: 'First visit, Tue–Thu before 2 PM. Haircut only · 30 min' },
      { name: 'Executive Private Grooming', price: '$500', detail: 'He travels to you for a full-service cut in a private setting. By request only.', featured: true },
    ],
    policies: [
      'Coming in with product in your hair adds $50.',
      'No-call, no-show appointments are non-refundable.',
      'After-hours cuts are Thursdays and Fridays only.',
    ],
  },
  {
    slug: 'collabs',
    reel: { src: '/img/tiktok/7537341374820142391.jpg', alt: 'Ferdz reviewing an Aloha-vibes restaurant in Mesa on TikTok', source: 'TikTok · 247K views' },
    index: '02',
    name: 'Restaurant Collabs',
    kicker: 'Food content · Real reviews',
    tagline: 'Real reviews. Real reach.',
    summary:
      'Ferdz visits your restaurant, films the experience, and posts an edited short-form video across his platforms within 48 hours. Your spot gets tagged everywhere and you get a view report.',
    image: '/img/ferdz-collabs.jpg',
    imageAlt: 'Ferdz walking down a lit staircase at an upscale restaurant',
    imageTall: true,
    cta: { label: 'Email to book a feature', url: 'mailto:ferdzsocialbuzz@gmail.com?subject=Restaurant%20collab' },
    secondaryCta: { label: 'DM @fferrdz', url: 'https://instagram.com/fferrdz' },
    tiktok: true,
    facts: [
      { label: 'TikTok', value: '50K view floor · 250K peak' },
      { label: 'Instagram', value: '26K views on a recent post' },
      { label: 'Platforms', value: 'TikTok, Instagram, YouTube, Facebook, Snapchat' },
    ],
    includesTitle: 'Every booking includes',
    includes: [
      'An in-person visit, filmed on location',
      'A short-form edit made for each platform',
      'Your restaurant tagged on every post',
      'A performance report after the post goes live',
      'Content live within 48 hours of the visit',
    ],
    offersTitle: 'Packages',
    offers: [
      { name: 'Starter', price: '$400', detail: 'One TikTok post, full edit, tagged, view report' },
      { name: 'Dual Platform', price: '$600', detail: 'TikTok + Instagram, repost rights included' },
      { name: 'Full Package', price: '$900', detail: 'All five platforms, full repost rights, priority booking', featured: true },
      { name: 'Monthly Partner', price: '$1,500/mo', detail: 'Two visits a month, TikTok + Instagram, monthly report' },
    ],
    steps: [
      { title: 'Reach out', body: 'DM @fferrdz or email ferdzsocialbuzz@gmail.com with your restaurant and package.' },
      { title: 'Pick your date', body: 'Tuesday and Sunday slots. Limited to two restaurants a day.' },
      { title: 'Prepay to confirm', body: 'Full payment locks your date: Cash App, Zelle, Venmo or PayPal.' },
      { title: 'Ferdz shows up and posts', body: 'Filmed, edited and live within 48 hours, with your view report.' },
    ],
    policies: [
      'Full prepayment is required to confirm a date.',
      'Cancellations within 48 hours forfeit the payment.',
      'Reviews are honest. Payment guarantees exposure, not a positive review.',
      'Repost rights come with Dual Platform and above.',
    ],
  },
  {
    slug: 'credit',
    reel: { src: '/img/ig/Dc1WmachCKP.jpg', alt: 'Trap N Credit reel: pre-approved for $20K, then denied?', source: '@trapncredit' },
    index: '03',
    name: 'Trap N Credit',
    kicker: 'Credit education · Repair support',
    tagline: 'From the trap to real credit.',
    summary:
      'Personalized credit education and strategic support. We review your report, find inaccurate or questionable items, and build a clear plan toward cards, auto loans, homeownership and business funding. No quick fixes, no empty promises.',
    visual: 'card',
    cta: { label: 'Get a free credit audit', url: '/free-credit-audit' },
    instagram: [
      { handle: 'trapncredit', title: 'Credit, explained on the feed.', shape: 'reel', codes: ['Dc1WmachCKP', 'Dc35l-OBEw6', 'Dc8_-ifNyNj', 'DdRgpvgNLSn', 'DdUSFA0NyiG', 'DdUTfF5h1qi', 'DdW02QBh-qr', 'Ddg8FVet1vZ'] },
    ],
    secondaryCta: { label: 'Monitor your credit', url: 'https://creditheroscore.com/lp/285-ar/index.asp?GUID=I5U4A25ZILL6&SID=MKARES7S4&itemSelectV2=183&tGUID=3B72F26E-82EB-46FC-8A28-D548A5DA6A8F' },
    steps: [
      { title: 'Sign up', body: 'Share your basic info through the secure portal so we can pull your report.' },
      { title: 'Review', body: 'A credit specialist walks through your report with you and builds a plan.' },
      { title: 'Stay updated', body: 'We work the plan and keep you posted on progress. 90-day money-back guarantee.' },
    ],
    offersTitle: 'Do-it-yourself guides',
    offers: [
      { name: 'From the Trap to Real Credit', price: '$27', detail: 'The step-by-step system Ferdz used on his own credit' },
      { name: 'Fix Your Credit: Step-by-Step', price: '$27', detail: 'A beginner-friendly system for cleaning up your report' },
      { name: 'Credit Sweep Advanced', price: '$197', detail: 'Escalation and deletion strategies for when basic disputes don’t work', featured: true },
    ],
    disclaimer:
      'Results vary and are not guaranteed. You have the right to dispute inaccurate information on your credit report yourself, for free, directly with the credit bureaus. Credit education only; not legal or financial advice.',
  },
  {
    slug: 'trading',
    reel: { src: '/img/ig/DYIN9BhPXYq.jpg', alt: 'Locked-In Traders reel: market structure is everything', source: '@lockedin.fx' },
    index: '04',
    name: 'Locked-In Traders',
    kicker: 'Trading community · Whop',
    tagline: 'Not a signals group.',
    summary:
      'A community for traders who want to read the market and execute with discipline. Structure over hype, discipline over emotion, consistency over lucky wins. Skill that compounds.',
    visual: 'usdjpy',
    cta: { label: 'Join on Whop', url: 'https://whop.com/lockedintraders?a=fferrdzfx' },
    instagram: [
      { handle: 'lockedin.fx', title: 'Structure. Discipline. Execution.', shape: 'reel', codes: ['DYIN9BhPXYq', 'DZ7qxhTPmia', 'DZvFJQYvDbh', 'DaD5ic3v6Bt', 'DaSskCNvTkI', 'DaUbJlsPjwf', ] },
    ],
    facts: [
      { label: 'Experience', value: '10+ years trading the markets' },
      { label: 'Approach', value: 'Structure, risk management, psychology' },
      { label: 'Community', value: 'Hosted on Whop · 5.0 ★' },
    ],
    includesTitle: 'What we focus on',
    includes: [
      'Clean market structure',
      'Smart risk management',
      'High-quality setups',
      'Trader psychology',
      'Real breakdowns, not flexed profits',
    ],
    policies: ['No signal spam.', 'No gambling mindset.', 'No get-rich-quick talk.'],
    disclaimer:
      'Educational content only; not financial advice. Trading involves substantial risk of loss and is not suitable for everyone. Past performance does not guarantee future results.',
  },
  {
    slug: 'the-cut-list',
    reel: { src: '/img/ig/DYN0yvDvELh.jpg', alt: 'The Cut List founding barber #001 spotlight', source: '@thecutlistofficial' },
    index: '05',
    name: 'The Cut List Global',
    kicker: 'Elite barber network · Phoenix → Worldwide',
    tagline: 'You can’t buy your way in. You earn it.',
    summary:
      'The best barbers in every city, personally vetted by someone who has cut at the highest level for 17 years. Barbers earn a featured spot. Clients who are traveling, relocating or just tired of bad cuts find someone they can trust.',
    image: '/img/ig/DYCmS2HR8VH.jpg',
    imageAlt: 'The Cut List gold TCL logo',
    cta: { label: 'Apply as a barber', url: 'https://thecutlistglobal.com/#apply' },
    secondaryCta: { label: 'Find a barber', url: 'https://thecutlistglobal.com/#cities' },
    facts: [
      { label: 'Founder', value: 'Ferdz · 17 years behind the chair' },
      { label: 'Founding barbers', value: 'Being chosen now: #001, #002 and #003 named' },
      { label: 'Cost', value: 'Free to apply, free to search and book' },
    ],
    includesTitle: 'For barbers',
    includes: [
      'A featured profile on thecutlistglobal.com',
      'Promotion on TikTok and Instagram',
      'Listed by city so clients can find you',
      'The Cut List badge of credibility',
      'Access to traveling clients in your city',
    ],
    instagram: [
      { handle: 'thecutlistofficial', title: 'Founding barbers.', shape: 'reel', codes: ['DYN0yvDvELh', 'DYUwfkkxAJ_', 'DYvVpt6PKO-'] },
      { handle: 'thecutlistofficial', title: 'This isn’t any list. It’s the standard.', shape: 'reel', codes: ['DX4nCyLEcOf', 'DZAe12HR46D', 'DWwvZxaj9wA', 'DY8cUUcRO20'] },
    ],
    stepsTitle: 'The standard every barber must meet',
    steps: [
      { title: 'Consistency', body: 'The same precision every client, every appointment. Not just on a good day.' },
      { title: 'Precision', body: 'Sharp lines, clean blends, flawless transitions. Skill is the minimum.' },
      { title: 'Customer service', body: 'Punctual, professional and personable, every time.' },
      { title: 'Clean environment', body: 'Station, tools and shop kept to a professional standard.' },
    ],
    policies: [
      'Every barber is personally reviewed before they are listed.',
      'Barbers who drop below the standard come off the list.',
      'Clients book directly with the barber. No middleman.',
    ],
  },
]

export const getBusiness = (slug?: string) => businesses.find((b) => b.slug === slug)
