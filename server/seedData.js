import User from './models/User.js';
import Listing, { AMENITIES } from './models/Listing.js';
import RoommateRequest from './models/RoommateRequest.js';
import Message, { threadId } from './models/Message.js';
import Report from './models/Report.js';

// 40 new users across Bengaluru, Mumbai, Pune, Hyderabad, and Delhi NCR
// ~70% seeking: true (30 of 40 = 75%), realistic Indian names, ages 20-35, varied occupations & lifestyles
export const newUsersList = [
  // --- Bengaluru (8 users) ---
  {
    name: 'Aditya Nair', email: 'aditya.nair@nestmate.test', age: 25, gender: 'male', occupation: 'Frontend Engineer', city: 'Bengaluru',
    bio: 'Working at a fintech startup. Love specialty pour-overs, indie music gigs, and cycling around Cubbon Park on Sunday mornings.',
    seeking: true, budget: { min: 10000, max: 18000 }, moveInDateOffset: 12, preferredLocalities: ['Indiranagar', 'Koramangala'],
    lifestyle: { smoking: 'no', pets: 'ok', cleanliness: 4, sleep: 'flexible', guests: 'sometimes', diet: 'any' }
  },
  {
    name: 'Kavya Krishnan', email: 'kavya.krishnan@nestmate.test', age: 27, gender: 'female', occupation: 'Product Designer', city: 'Bengaluru',
    bio: 'Design lead at an edtech company. I have a calm rescue cat named Chutney. Need a bright, sunny room with respectful flatmates.',
    seeking: true, budget: { min: 14000, max: 22000 }, moveInDateOffset: 20, preferredLocalities: ['HSR Layout', 'Koramangala'],
    lifestyle: { smoking: 'no', pets: 'have', cleanliness: 5, sleep: 'early', guests: 'rarely', diet: 'vegetarian' }
  },
  {
    name: 'Rahul Verma', email: 'rahul.verma@nestmate.test', age: 29, gender: 'male', occupation: 'DevOps Consultant', city: 'Bengaluru',
    bio: 'Cloud architect working with US teams. Looking for chill flatmates near Outer Ring Road tech parks.',
    seeking: true, budget: { min: 12000, max: 20000 }, moveInDateOffset: 15, preferredLocalities: ['Bellandur', 'Marathahalli'],
    lifestyle: { smoking: 'yes', pets: 'no', cleanliness: 2, sleep: 'night', guests: 'sometimes', diet: 'any' }
  },
  {
    name: 'Sneha Rao', email: 'sneha.rao@nestmate.test', age: 23, gender: 'female', occupation: 'Junior Data Analyst', city: 'Bengaluru',
    bio: 'Recent analytics graduate. Organized, quiet, loves baking sourdough on weekends, and appreciates clean shared spaces.',
    seeking: true, budget: { min: 6000, max: 11000 }, moveInDateOffset: 8, preferredLocalities: ['BTM Layout', 'Jayanagar'],
    lifestyle: { smoking: 'no', pets: 'ok', cleanliness: 4, sleep: 'early', guests: 'rarely', diet: 'vegetarian' }
  },
  {
    name: 'Vikram Hegde', email: 'vikram.hegde@nestmate.test', age: 31, gender: 'male', occupation: 'Technical Program Manager', city: 'Bengaluru',
    bio: 'TPM at a multinational tech firm. Marathon runner and fitness buff. Enjoy hosting casual weekend board game sessions.',
    seeking: true, budget: { min: 18000, max: 28000 }, moveInDateOffset: 25, preferredLocalities: ['Whitefield', 'Indiranagar'],
    lifestyle: { smoking: 'no', pets: 'ok', cleanliness: 4, sleep: 'flexible', guests: 'often', diet: 'any' }
  },
  {
    name: 'Pooja Deshmukh', email: 'pooja.deshmukh@nestmate.test', age: 26, gender: 'female', occupation: 'Content Strategist', city: 'Bengaluru',
    bio: 'Brand writer who works remotely twice a week. Fan of cafe hopping, reading literary fiction, and collecting vinyl records.',
    seeking: true, budget: { min: 11000, max: 17000 }, moveInDateOffset: 30, preferredLocalities: ['Koramangala', 'HSR Layout'],
    lifestyle: { smoking: 'outside', pets: 'ok', cleanliness: 3, sleep: 'night', guests: 'sometimes', diet: 'any' }
  },
  {
    name: 'Arjun Reddy', email: 'arjun.reddy@nestmate.test', age: 33, gender: 'male', occupation: 'Architect', city: 'Bengaluru',
    bio: 'Independent architect running a studio in Indiranagar. I lease quality apartments designed with natural light in mind.',
    seeking: false, budget: { min: 0, max: 0 },
    lifestyle: { smoking: 'no', pets: 'no', cleanliness: 5, sleep: 'early', guests: 'rarely', diet: 'vegetarian' }
  },
  {
    name: 'Divya Menon', email: 'divya.menon@nestmate.test', age: 28, gender: 'female', occupation: 'HR Business Partner', city: 'Bengaluru',
    bio: 'People operations lead at an enterprise software company. Property owner leasing shared flats in Whitefield.',
    seeking: false, budget: { min: 0, max: 0 },
    lifestyle: { smoking: 'no', pets: 'ok', cleanliness: 4, sleep: 'flexible', guests: 'sometimes', diet: 'any' }
  },

  // --- Mumbai (8 users) ---
  {
    name: 'Aryan Malhotra', email: 'aryan.malhotra@nestmate.test', age: 26, gender: 'male', occupation: 'Investment Banking Analyst', city: 'Mumbai',
    bio: 'Intense work weeks in BKC. Need a tidy, calm flat to recharge, close to Western line and great food joints.',
    seeking: true, budget: { min: 25000, max: 42000 }, moveInDateOffset: 10, preferredLocalities: ['Bandra West', 'Lower Parel'],
    lifestyle: { smoking: 'outside', pets: 'no', cleanliness: 4, sleep: 'night', guests: 'rarely', diet: 'any' }
  },
  {
    name: 'Riya Sen', email: 'riya.sen@nestmate.test', age: 24, gender: 'female', occupation: 'Copywriter & Ad Strategist', city: 'Mumbai',
    bio: 'Working in an advertising agency near Versova. Passionate about indie theater, street photography, and sunset walks along Carter Road.',
    seeking: true, budget: { min: 14000, max: 24000 }, moveInDateOffset: 18, preferredLocalities: ['Andheri West', 'Bandra West'],
    lifestyle: { smoking: 'no', pets: 'ok', cleanliness: 4, sleep: 'flexible', guests: 'sometimes', diet: 'any' }
  },
  {
    name: 'Kunal Joshi', email: 'kunal.joshi@nestmate.test', age: 28, gender: 'male', occupation: 'Full Stack Developer', city: 'Mumbai',
    bio: 'IIT Bombay grad working at a logistics platform in Powai. Have a friendly golden retriever who loves everyone.',
    seeking: true, budget: { min: 15000, max: 25000 }, moveInDateOffset: 22, preferredLocalities: ['Powai', 'Andheri East'],
    lifestyle: { smoking: 'no', pets: 'have', cleanliness: 3, sleep: 'flexible', guests: 'sometimes', diet: 'vegetarian' }
  },
  {
    name: 'Ananya Bhattacharya', email: 'ananya.bhattacharya@nestmate.test', age: 30, gender: 'female', occupation: 'Brand Manager', city: 'Mumbai',
    bio: 'FMCG brand strategist. Morning yoga practitioner, plant-based cooking fan, looking for an ultra-tidy, serene home.',
    seeking: true, budget: { min: 20000, max: 35000 }, moveInDateOffset: 14, preferredLocalities: ['Juhu', 'Bandra West'],
    lifestyle: { smoking: 'no', pets: 'ok', cleanliness: 5, sleep: 'early', guests: 'rarely', diet: 'vegan' }
  },
  {
    name: 'Siddharth Kapoor', email: 'siddharth.kapoor@nestmate.test', age: 25, gender: 'male', occupation: 'Cinematographer', city: 'Mumbai',
    bio: 'Freelance filmmaker and assistant cinematographer. Spontaneous schedules, love movie screenings, relaxed and open-minded.',
    seeking: true, budget: { min: 12000, max: 20000 }, moveInDateOffset: 7, preferredLocalities: ['Andheri West', 'Malad West'],
    lifestyle: { smoking: 'yes', pets: 'ok', cleanliness: 2, sleep: 'night', guests: 'often', diet: 'any' }
  },
  {
    name: 'Tanvi Gokhale', email: 'tanvi.gokhale@nestmate.test', age: 27, gender: 'female', occupation: 'Financial Consultant', city: 'Mumbai',
    bio: 'Chartered accountant based out of Lower Parel. Hindustani classical music student, badminton player on Saturdays.',
    seeking: true, budget: { min: 16000, max: 26000 }, moveInDateOffset: 28, preferredLocalities: ['Worli', 'Lower Parel'],
    lifestyle: { smoking: 'no', pets: 'no', cleanliness: 4, sleep: 'early', guests: 'sometimes', diet: 'vegetarian' }
  },
  {
    name: 'Farhan Merchant', email: 'farhan.merchant@nestmate.test', age: 34, gender: 'male', occupation: 'Property Consultant', city: 'Mumbai',
    bio: 'Real estate consultant offering hand-picked flats in Bandra, Lower Parel, and Powai. Transparent dealings.',
    seeking: false, budget: { min: 0, max: 0 },
    lifestyle: { smoking: 'outside', pets: 'ok', cleanliness: 3, sleep: 'flexible', guests: 'sometimes', diet: 'any' }
  },
  {
    name: 'Meenal Kulkarni', email: 'meenal.kulkarni@nestmate.test', age: 32, gender: 'female', occupation: 'Interior Designer', city: 'Mumbai',
    bio: 'Designer renting modern, semi-furnished apartments in Thane West and Powai. Fast response on inquiries.',
    seeking: false, budget: { min: 0, max: 0 },
    lifestyle: { smoking: 'no', pets: 'no', cleanliness: 5, sleep: 'early', guests: 'rarely', diet: 'any' }
  },

  // --- Pune (8 users) ---
  {
    name: 'Nikhil Kulkarni', email: 'nikhil.kulkarni@nestmate.test', age: 25, gender: 'male', occupation: 'Embedded Systems Engineer', city: 'Pune',
    bio: 'Automotive systems engineer in Hinjewadi. Weekend trekker to Sahyadri forts, PC gamer on quiet evenings.',
    seeking: true, budget: { min: 8000, max: 15000 }, moveInDateOffset: 10, preferredLocalities: ['Baner', 'Wakad'],
    lifestyle: { smoking: 'no', pets: 'ok', cleanliness: 4, sleep: 'flexible', guests: 'sometimes', diet: 'any' }
  },
  {
    name: 'Shweta Patil', email: 'shweta.patil@nestmate.test', age: 26, gender: 'female', occupation: 'UX Researcher', city: 'Pune',
    bio: 'Design researcher. Houseplant enthusiast, pottery hobbyist, and lover of tranquil evenings with filter coffee and books.',
    seeking: true, budget: { min: 9000, max: 16000 }, moveInDateOffset: 16, preferredLocalities: ['Koregaon Park', 'Viman Nagar'],
    lifestyle: { smoking: 'no', pets: 'ok', cleanliness: 5, sleep: 'early', guests: 'rarely', diet: 'vegetarian' }
  },
  {
    name: 'Rohan Sawant', email: 'rohan.sawant@nestmate.test', age: 27, gender: 'male', occupation: 'Operations Manager', city: 'Pune',
    bio: 'Supply chain operations manager at an EV manufacturer. Cook traditional Maharashtrian food and follow IPL closely.',
    seeking: true, budget: { min: 7000, max: 13000 }, moveInDateOffset: 12, preferredLocalities: ['Hinjewadi', 'Wakad'],
    lifestyle: { smoking: 'outside', pets: 'no', cleanliness: 3, sleep: 'flexible', guests: 'sometimes', diet: 'any' }
  },
  {
    name: 'Aishwarya Shinde', email: 'aishwarya.shinde@nestmate.test', age: 24, gender: 'female', occupation: 'Digital Marketer', city: 'Pune',
    bio: 'Social media strategist with an adorable 1-year-old beagle pup. Looking for warm, pet-loving flatmates in East Pune.',
    seeking: true, budget: { min: 8000, max: 14000 }, moveInDateOffset: 24, preferredLocalities: ['Viman Nagar', 'Kharadi'],
    lifestyle: { smoking: 'no', pets: 'have', cleanliness: 4, sleep: 'flexible', guests: 'sometimes', diet: 'any' }
  },
  {
    name: 'Abhinav Date', email: 'abhinav.date@nestmate.test', age: 29, gender: 'male', occupation: 'Biotech Researcher', city: 'Pune',
    bio: 'Postdoctoral researcher at IISER Pune. Strict vegetarian, very disciplined lifestyle, morning runner, non-drinker.',
    seeking: true, budget: { min: 10000, max: 17000 }, moveInDateOffset: 19, preferredLocalities: ['Kothrud', 'Aundh'],
    lifestyle: { smoking: 'no', pets: 'no', cleanliness: 5, sleep: 'early', guests: 'rarely', diet: 'vegetarian' }
  },
  {
    name: 'Neha Deshpande', email: 'neha.deshpande@nestmate.test', age: 28, gender: 'female', occupation: 'Product Analyst', city: 'Pune',
    bio: 'Fintech product analyst. Enjoy hosting friendly weekend movie nights, experimenting with Italian cooking, and exploring cafes.',
    seeking: true, budget: { min: 11000, max: 18000 }, moveInDateOffset: 35, preferredLocalities: ['Baner', 'Aundh'],
    lifestyle: { smoking: 'no', pets: 'ok', cleanliness: 4, sleep: 'night', guests: 'often', diet: 'any' }
  },
  {
    name: 'Gaurav Inamdar', email: 'gaurav.inamdar@nestmate.test', age: 33, gender: 'male', occupation: 'IT Project Manager', city: 'Pune',
    bio: 'Project manager managing co-living setups in Baner and Hinjewadi. Prioritize safety, hygiene, and high-speed fiber.',
    seeking: false, budget: { min: 0, max: 0 },
    lifestyle: { smoking: 'no', pets: 'ok', cleanliness: 4, sleep: 'flexible', guests: 'sometimes', diet: 'any' }
  },
  {
    name: 'Rashmi Chitnis', email: 'rashmi.chitnis@nestmate.test', age: 30, gender: 'female', occupation: 'Educational Consultant', city: 'Pune',
    bio: 'Overseas education advisor with well-kept family-friendly apartments in Koregaon Park and Kothrud.',
    seeking: false, budget: { min: 0, max: 0 },
    lifestyle: { smoking: 'no', pets: 'no', cleanliness: 4, sleep: 'early', guests: 'rarely', diet: 'vegetarian' }
  },

  // --- Hyderabad (8 users) ---
  {
    name: 'Karthik Varma', email: 'karthik.varma@nestmate.test', age: 27, gender: 'male', occupation: 'AI / ML Engineer', city: 'Hyderabad',
    bio: 'Building LLM systems at a tech enterprise in Financial District. Biryani lover, weekend gamer, and open-source contributor.',
    seeking: true, budget: { min: 10000, max: 18000 }, moveInDateOffset: 14, preferredLocalities: ['Gachibowli', 'Hitec City'],
    lifestyle: { smoking: 'no', pets: 'ok', cleanliness: 4, sleep: 'night', guests: 'sometimes', diet: 'any' }
  },
  {
    name: 'Harini Reddy', email: 'harini.reddy@nestmate.test', age: 25, gender: 'female', occupation: 'Cloud Solutions Architect', city: 'Hyderabad',
    bio: 'Cloud consultant in Madhapur. Love decluttered spaces, indoor plants, fresh south Indian filter coffee, and hatha yoga.',
    seeking: true, budget: { min: 12000, max: 20000 }, moveInDateOffset: 21, preferredLocalities: ['Madhapur', 'Kondapur'],
    lifestyle: { smoking: 'no', pets: 'no', cleanliness: 5, sleep: 'flexible', guests: 'rarely', diet: 'vegetarian' }
  },
  {
    name: 'Sai Teja', email: 'sai.teja@nestmate.test', age: 24, gender: 'male', occupation: 'Frontend Developer', city: 'Hyderabad',
    bio: 'Startup developer. Love watching cinema, playing cricket on weekends, and cooking late-night snacks with roommates.',
    seeking: true, budget: { min: 7000, max: 13000 }, moveInDateOffset: 9, preferredLocalities: ['Kondapur', 'Kukatpally'],
    lifestyle: { smoking: 'yes', pets: 'ok', cleanliness: 2, sleep: 'night', guests: 'often', diet: 'any' }
  },
  {
    name: 'Deepa Rao', email: 'deepa.rao@nestmate.test', age: 29, gender: 'female', occupation: 'Senior QA Automation Engineer', city: 'Hyderabad',
    bio: 'Hybrid QA engineer. Have a sweet, calm rescue cat named Mittens. Looking for an organized, pet-friendly flatmate.',
    seeking: true, budget: { min: 11000, max: 19000 }, moveInDateOffset: 27, preferredLocalities: ['Hitec City', 'Gachibowli'],
    lifestyle: { smoking: 'no', pets: 'have', cleanliness: 4, sleep: 'early', guests: 'sometimes', diet: 'any' }
  },
  {
    name: 'Pranay Goud', email: 'pranay.goud@nestmate.test', age: 28, gender: 'male', occupation: 'Data Scientist', city: 'Hyderabad',
    bio: 'Data science practitioner. Enthusiastic about marathon training, playing badminton at Durgam Cheruvu, and trying local food spots.',
    seeking: true, budget: { min: 13000, max: 22000 }, moveInDateOffset: 17, preferredLocalities: ['Jubilee Hills', 'Madhapur'],
    lifestyle: { smoking: 'no', pets: 'ok', cleanliness: 4, sleep: 'flexible', guests: 'sometimes', diet: 'any' }
  },
  {
    name: 'Manasa Kancharla', email: 'manasa.kancharla@nestmate.test', age: 26, gender: 'female', occupation: 'HR Specialist', city: 'Hyderabad',
    bio: 'HR specialist at a healthcare firm. Early riser, Carnatic vocal music enthusiast, very mindful of quiet hours and cleanliness.',
    seeking: true, budget: { min: 9000, max: 16000 }, moveInDateOffset: 31, preferredLocalities: ['Gowlidoddy', 'Gachibowli'],
    lifestyle: { smoking: 'no', pets: 'no', cleanliness: 5, sleep: 'early', guests: 'rarely', diet: 'vegetarian' }
  },
  {
    name: 'Suresh Chukkapalli', email: 'suresh.chukkapalli@nestmate.test', age: 35, gender: 'male', occupation: 'Real Estate Investor', city: 'Hyderabad',
    bio: 'Managing premium 3BHK and 4BHK apartments in Jubilee Hills, Banjara Hills, and Gachibowli.',
    seeking: false, budget: { min: 0, max: 0 },
    lifestyle: { smoking: 'no', pets: 'ok', cleanliness: 4, sleep: 'early', guests: 'sometimes', diet: 'any' }
  },
  {
    name: 'Swathi Raju', email: 'swathi.raju@nestmate.test', age: 31, gender: 'female', occupation: 'Architectural Consultant', city: 'Hyderabad',
    bio: 'Architect offering high-quality living accommodations for IT professionals in Kondapur and Madhapur.',
    seeking: false, budget: { min: 0, max: 0 },
    lifestyle: { smoking: 'no', pets: 'no', cleanliness: 5, sleep: 'flexible', guests: 'rarely', diet: 'any' }
  },

  // --- Delhi NCR (8 users) ---
  {
    name: 'Varun Aggarwal', email: 'varun.aggarwal@nestmate.test', age: 27, gender: 'male', occupation: 'Investment Associate', city: 'Delhi NCR',
    bio: 'Working with a private equity team in DLF Cyber City. Squash player on weekdays, love weekend highway drives and good food.',
    seeking: true, budget: { min: 15000, max: 28000 }, moveInDateOffset: 15, preferredLocalities: ['Cyber City', 'DLF Phase 5'],
    lifestyle: { smoking: 'outside', pets: 'ok', cleanliness: 4, sleep: 'flexible', guests: 'sometimes', diet: 'any' }
  },
  {
    name: 'Simran Kaur', email: 'simran.kaur@nestmate.test', age: 25, gender: 'female', occupation: 'Fashion Merchandiser', city: 'Delhi NCR',
    bio: 'NIFT graduate working with a designer label. Have a cuddly pug named Bozo. Friendly, social, and love aesthetic home spaces.',
    seeking: true, budget: { min: 12000, max: 22000 }, moveInDateOffset: 11, preferredLocalities: ['Hauz Khas', 'Greater Kailash'],
    lifestyle: { smoking: 'no', pets: 'have', cleanliness: 4, sleep: 'flexible', guests: 'often', diet: 'any' }
  },
  {
    name: 'Aman Gupta', email: 'aman.gupta@nestmate.test', age: 24, gender: 'male', occupation: 'Growth Marketer', city: 'Delhi NCR',
    bio: 'E-commerce growth lead. Indie rock music listener, guitarist, night owl, always up for rooftop conversations.',
    seeking: true, budget: { min: 9000, max: 16000 }, moveInDateOffset: 19, preferredLocalities: ['Sector 62 Noida', 'Indirapuram'],
    lifestyle: { smoking: 'yes', pets: 'no', cleanliness: 1, sleep: 'night', guests: 'often', diet: 'any' }
  },
  {
    name: 'Kritika Sharma', email: 'kritika.sharma@nestmate.test', age: 29, gender: 'female', occupation: 'Policy Consultant', city: 'Delhi NCR',
    bio: 'Public policy researcher. Early morning reader, organic tea enthusiast, mindful of calm and hygienic living spaces in South Delhi.',
    seeking: true, budget: { min: 14000, max: 24000 }, moveInDateOffset: 26, preferredLocalities: ['Saket', 'Hauz Khas'],
    lifestyle: { smoking: 'no', pets: 'no', cleanliness: 5, sleep: 'early', guests: 'rarely', diet: 'vegetarian' }
  },
  {
    name: 'Raghav Chawla', email: 'raghav.chawla@nestmate.test', age: 26, gender: 'male', occupation: 'Software Developer', city: 'Delhi NCR',
    bio: 'Fintech software engineer in Cyber Hub. Badminton enthusiast, passionate home cook, appreciate a peaceful, organized environment.',
    seeking: true, budget: { min: 11000, max: 19000 }, moveInDateOffset: 22, preferredLocalities: ['Cyber City', 'DLF Phase 5'],
    lifestyle: { smoking: 'no', pets: 'ok', cleanliness: 4, sleep: 'flexible', guests: 'sometimes', diet: 'any' }
  },
  {
    name: 'Tanya Singhal', email: 'tanya.singhal@nestmate.test', age: 28, gender: 'female', occupation: 'Legal Counsel', city: 'Delhi NCR',
    bio: 'Corporate counsel at a law firm. Vegan, fitness practitioner, and dedicated to keeping common spaces neat and serene.',
    seeking: true, budget: { min: 16000, max: 27000 }, moveInDateOffset: 13, preferredLocalities: ['Greater Kailash', 'Lajpat Nagar'],
    lifestyle: { smoking: 'no', pets: 'ok', cleanliness: 4, sleep: 'early', guests: 'sometimes', diet: 'vegan' }
  },
  {
    name: 'Harsh Bhasin', email: 'harsh.bhasin@nestmate.test', age: 34, gender: 'male', occupation: 'Senior Consultant & Host', city: 'Delhi NCR',
    bio: 'Corporate advisor managing executive flatshares across DLF Cyber City and Golf Course Road.',
    seeking: false, budget: { min: 0, max: 0 },
    lifestyle: { smoking: 'outside', pets: 'ok', cleanliness: 4, sleep: 'flexible', guests: 'sometimes', diet: 'any' }
  },
  {
    name: 'Pallavi Chadha', email: 'pallavi.chadha@nestmate.test', age: 32, gender: 'female', occupation: 'Commercial Property Host', city: 'Delhi NCR',
    bio: 'Managing modern co-living homes in Noida Sector 62 and South Delhi with complete amenities.',
    seeking: false, budget: { min: 0, max: 0 },
    lifestyle: { smoking: 'no', pets: 'no', cleanliness: 5, sleep: 'early', guests: 'rarely', diet: 'any' }
  }
];

// Helper to build 60 listings (12 per city)
// Mix: 30 private-room (6 per city), 15 shared-room (3 per city), 15 entire-place (3 per city)
// Rents 5k-35k (entire places higher: 26k-65k), deposit 1-3x rent, availableFrom next 60 days
// Images: []
export function getNewListingsData(users, existingUsers, soon) {
  const allUsers = [...users, ...(existingUsers ? Object.values(existingUsers) : [])];
  const byEmail = (em) => {
    const u = allUsers.find((x) => x.email === em);
    if (!u) throw new Error(`User not found for listing: ${em}`);
    return u._id;
  };

  return [
    // ==========================================
    // BENGALURU (12 listings)
    // ==========================================
    // 6 Private Rooms
    {
      owner: byEmail('arjun.reddy@nestmate.test'),
      title: 'Spacious balcony private room in Indiranagar 12th Main',
      type: 'private-room', rent: 16000, deposit: 32000, city: 'Bengaluru', locality: 'Indiranagar',
      address: '12th Main Road, HAL 2nd Stage, Indiranagar',
      bedrooms: 3, bathrooms: 3, currentRoommates: 2, furnished: true,
      amenities: ['wifi', 'ac', 'attached bathroom', 'balcony', 'power backup', 'washing machine', 'kitchen'],
      genderPreference: 'any', rules: { smoking: false, pets: true, guests: true },
      availableFrom: soon(5), images: [],
      description: 'Airy master bedroom with private balcony in a quiet Indiranagar lane. Walking distance from 100 Feet Road cafes and the metro station. High-speed fiber and modular kitchen ready.'
    },
    {
      owner: byEmail('karan@nestmate.test'),
      title: 'Quiet master bedroom with attached bath in Koramangala 4th Block',
      type: 'private-room', rent: 14000, deposit: 28000, city: 'Bengaluru', locality: 'Koramangala',
      address: '4th Block, near Maharaja Signal, Koramangala',
      bedrooms: 3, bathrooms: 2, currentRoommates: 2, furnished: true,
      amenities: ['wifi', 'attached bathroom', 'geyser', 'kitchen', 'power backup', 'washing machine'],
      genderPreference: 'any', rules: { smoking: false, pets: false, guests: true },
      availableFrom: soon(12), images: [],
      description: 'Well-ventilated room with ample wardrobe space in a friendly 3BHK. Located right next to major dining hubs and tech offices. Housekeeping and high-speed broadband included.'
    },
    {
      owner: byEmail('divya.menon@nestmate.test'),
      title: 'Women-only private room in HSR Sector 2, gated society',
      type: 'private-room', rent: 13500, deposit: 27000, city: 'Bengaluru', locality: 'HSR Layout',
      address: '24th Main Road, Sector 2, HSR Layout',
      bedrooms: 3, bathrooms: 3, currentRoommates: 2, furnished: true,
      amenities: ['wifi', 'ac', 'kitchen', 'washing machine', 'lift', 'security', 'power backup'],
      genderPreference: 'female', rules: { smoking: false, pets: false, guests: true },
      availableFrom: soon(8), images: [],
      description: 'Cozy and secure private room in a gated apartment complex in HSR Sector 2. Sharing with two female working professionals who maintain a clean, peaceful home. Close to parks and supermarkets.'
    },
    {
      owner: byEmail('divya.menon@nestmate.test'),
      title: 'Tech park facing private room in Bellandur, Green Glen',
      type: 'private-room', rent: 15000, deposit: 30000, city: 'Bengaluru', locality: 'Bellandur',
      address: 'Green Glen Layout, Bellandur',
      bedrooms: 3, bathrooms: 2, currentRoommates: 2, furnished: true,
      amenities: ['wifi', 'ac', 'gym', 'lift', 'power backup', 'security', 'washing machine'],
      genderPreference: 'any', rules: { smoking: false, pets: true, guests: true },
      availableFrom: soon(16), images: [],
      description: 'Ideal room for folks working along Outer Ring Road and EcoWorld. Society features a clubhouse, gym, and 24/7 power backup. Easy auto and bus connectivity at your doorstep.'
    },
    {
      owner: byEmail('arjun.reddy@nestmate.test'),
      title: 'Bright private room in Whitefield near Hope Farm',
      type: 'private-room', rent: 12500, deposit: 25000, city: 'Bengaluru', locality: 'Whitefield',
      address: 'Channasandra Main Road, near Hope Farm, Whitefield',
      bedrooms: 2, bathrooms: 2, currentRoommates: 1, furnished: true,
      amenities: ['wifi', 'parking', 'lift', 'power backup', 'geyser', 'kitchen'],
      genderPreference: 'any', rules: { smoking: false, pets: true, guests: true },
      availableFrom: soon(22), images: [],
      description: 'Peaceful room in a modern residential high-rise near the Whitefield Purple Line metro. Shared with a quiet software engineer. Features a spacious kitchen and balcony garden.'
    },
    {
      owner: byEmail('karan@nestmate.test'),
      title: 'Comfortable private room in Jayanagar 9th Block',
      type: 'private-room', rent: 11500, deposit: 23000, city: 'Bengaluru', locality: 'Jayanagar',
      address: '9th Block, near Ragigudda Temple, Jayanagar',
      bedrooms: 2, bathrooms: 2, currentRoommates: 1, furnished: true,
      amenities: ['wifi', 'geyser', 'washing machine', 'kitchen', 'power backup'],
      genderPreference: 'male', rules: { smoking: false, pets: false, guests: true },
      availableFrom: soon(14), images: [],
      description: 'Peaceful room in a green and serene Jayanagar neighborhood. Close to South End Circle metro and shopping complexes. Looking for a neat and easygoing roommate.'
    },
    // 3 Shared Rooms
    {
      owner: byEmail('karan@nestmate.test'),
      title: 'Shared room near Koramangala Sony World Signal',
      type: 'shared-room', rent: 7500, deposit: 15000, city: 'Bengaluru', locality: 'Koramangala',
      address: '80 Feet Road, 6th Block, Koramangala',
      bedrooms: 3, bathrooms: 2, currentRoommates: 4, furnished: true,
      amenities: ['wifi', 'geyser', 'housekeeping', 'washing machine', 'power backup'],
      genderPreference: 'male', rules: { smoking: false, pets: false, guests: false },
      availableFrom: soon(6), images: [],
      description: 'Twin-sharing room with individual study tables and lockable wardrobes. Regular housekeeping and daily waste collection included. Great choice for students and young techies.'
    },
    {
      owner: byEmail('divya.menon@nestmate.test'),
      title: 'Two-sharing room for women in BTM Layout 2nd Stage',
      type: 'shared-room', rent: 6500, deposit: 13000, city: 'Bengaluru', locality: 'BTM Layout',
      address: '7th Cross, BTM Layout 2nd Stage',
      bedrooms: 2, bathrooms: 2, currentRoommates: 2, furnished: true,
      amenities: ['wifi', 'kitchen', 'geyser', 'security', 'washing machine'],
      genderPreference: 'female', rules: { smoking: false, pets: false, guests: false },
      availableFrom: soon(10), images: [],
      description: 'Clean shared accommodation with wooden beds and memory foam mattresses. Five minutes walk from BTM water tank bus stop and lake road. Safe and secure residential surroundings.'
    },
    {
      owner: byEmail('arjun.reddy@nestmate.test'),
      title: 'Economical shared room in Marathahalli near Spice Garden',
      type: 'shared-room', rent: 5800, deposit: 11600, city: 'Bengaluru', locality: 'Marathahalli',
      address: 'Spice Garden Compound, Marathahalli',
      bedrooms: 3, bathrooms: 2, currentRoommates: 3, furnished: true,
      amenities: ['wifi', 'power backup', 'geyser', 'housekeeping'],
      genderPreference: 'any', rules: { smoking: false, pets: false, guests: true },
      availableFrom: soon(18), images: [],
      description: 'Budget-friendly shared room with fast fiber connection and power backup. Quick commute to Prestige Tech Park and Cessna Business Park. Meals can be arranged with local cook.'
    },
    // 3 Entire Places
    {
      owner: byEmail('arjun.reddy@nestmate.test'),
      title: 'Architect-designed 2BHK flat in Indiranagar Defence Colony',
      type: 'entire-place', rent: 48000, deposit: 144000, city: 'Bengaluru', locality: 'Indiranagar',
      address: 'Defence Colony, Indiranagar',
      bedrooms: 2, bathrooms: 2, currentRoommates: 0, furnished: true,
      amenities: ['wifi', 'ac', 'parking', 'kitchen', 'washing machine', 'balcony', 'power backup', 'security'],
      genderPreference: 'any', rules: { smoking: false, pets: true, guests: true },
      availableFrom: soon(25), images: [],
      description: 'Fully furnished designer 2BHK home with custom teak furniture and wide terrace garden. Nestled in prime Defence Colony with dedicated car parking. Ideal for professionals or small families.'
    },
    {
      owner: byEmail('divya.menon@nestmate.test'),
      title: 'Modern 3BHK high-rise apartment in Whitefield ITPL Road',
      type: 'entire-place', rent: 42000, deposit: 126000, city: 'Bengaluru', locality: 'Whitefield',
      address: 'ITPL Main Road, Whitefield',
      bedrooms: 3, bathrooms: 3, currentRoommates: 0, furnished: true,
      amenities: ['gym', 'lift', 'parking', 'power backup', 'security', 'wifi', 'balcony', 'kitchen'],
      genderPreference: 'any', rules: { smoking: false, pets: true, guests: true },
      availableFrom: soon(30), images: [],
      description: 'Gated community flat on the 14th floor with panoramic city views and clubhouse access. Walk to ITPL and upcoming metro link. Includes two covered parking slots.'
    },
    {
      owner: byEmail('karan@nestmate.test'),
      title: 'Furnished 2BHK garden apartment in HSR Sector 1',
      type: 'entire-place', rent: 36000, deposit: 108000, city: 'Bengaluru', locality: 'HSR Layout',
      address: '19th Main Road, Sector 1, HSR Layout',
      bedrooms: 2, bathrooms: 2, currentRoommates: 0, furnished: true,
      amenities: ['wifi', 'kitchen', 'parking', 'power backup', 'washing machine', 'security'],
      genderPreference: 'any', rules: { smoking: false, pets: true, guests: true },
      availableFrom: soon(20), images: [],
      description: 'Spacious ground floor 2BHK with private backyard access and abundant greenery. Fully equipped kitchen with refrigerator and washing machine. Quiet family-friendly residential lane.'
    },

    // ==========================================
    // MUMBAI (12 listings)
    // ==========================================
    // 6 Private Rooms
    {
      owner: byEmail('farhan.merchant@nestmate.test'),
      title: 'Sea-breeze private room in Bandra West near Pali Hill',
      type: 'private-room', rent: 24000, deposit: 48000, city: 'Mumbai', locality: 'Bandra West',
      address: 'Pali Naka, Bandra West',
      bedrooms: 3, bathrooms: 2, currentRoommates: 2, furnished: true,
      amenities: ['wifi', 'ac', 'lift', 'washing machine', 'kitchen', 'security'],
      genderPreference: 'any', rules: { smoking: false, pets: true, guests: true },
      availableFrom: soon(9), images: [],
      description: 'Charming private room with high ceilings in a vintage Bandra building. Steps away from artisan bakeries, organic grocers, and sea promenade. Sharing with two working creatives.'
    },
    {
      owner: byEmail('meenal.kulkarni@nestmate.test'),
      title: 'Modern private bedroom in Powai Hiranandani Gardens',
      type: 'private-room', rent: 21000, deposit: 42000, city: 'Mumbai', locality: 'Powai',
      address: 'Central Avenue, Hiranandani Gardens, Powai',
      bedrooms: 3, bathrooms: 3, currentRoommates: 2, furnished: true,
      amenities: ['wifi', 'ac', 'attached bathroom', 'gym', 'lift', 'power backup', 'security'],
      genderPreference: 'any', rules: { smoking: false, pets: false, guests: true },
      availableFrom: soon(15), images: [],
      description: 'Elegantly furnished master bedroom with attached bath overlooking Powai Lake. Access to world-class township amenities, supermarket, and gyms. Gated community with 24-hour security.'
    },
    {
      owner: byEmail('farhan.merchant@nestmate.test'),
      title: 'Cozy private room in Andheri West near Lokhandwala',
      type: 'private-room', rent: 17500, deposit: 35000, city: 'Mumbai', locality: 'Andheri West',
      address: 'Lokhandwala Complex, Andheri West',
      bedrooms: 3, bathrooms: 2, currentRoommates: 2, furnished: true,
      amenities: ['wifi', 'ac', 'kitchen', 'lift', 'washing machine', 'power backup'],
      genderPreference: 'female', rules: { smoking: false, pets: false, guests: true },
      availableFrom: soon(7), images: [],
      description: 'Well-appointed room for women in the heart of Lokhandwala. Metro and Infinity Mall within walking distance. Fully equipped modular kitchen and friendly flatmates.'
    },
    {
      owner: byEmail('meenal.kulkarni@nestmate.test'),
      title: 'Executive private room in Lower Parel near Phoenix Mall',
      type: 'private-room', rent: 23000, deposit: 69000, city: 'Mumbai', locality: 'Lower Parel',
      address: 'Senapati Bapat Marg, Lower Parel',
      bedrooms: 2, bathrooms: 2, currentRoommates: 1, furnished: true,
      amenities: ['wifi', 'ac', 'gym', 'lift', 'security', 'power backup', 'attached bathroom'],
      genderPreference: 'any', rules: { smoking: false, pets: false, guests: true },
      availableFrom: soon(14), images: [],
      description: 'Premium master room walking distance to One World Center and Kamala Mills offices. High floor with spectacular skyline vistas and attached modern washroom. Includes housekeeping.'
    },
    {
      owner: byEmail('farhan.merchant@nestmate.test'),
      title: 'Peaceful private room in Juhu near Tara Road',
      type: 'private-room', rent: 22000, deposit: 44000, city: 'Mumbai', locality: 'Juhu',
      address: 'Juhu Tara Road, near Juhu Beach',
      bedrooms: 3, bathrooms: 2, currentRoommates: 2, furnished: true,
      amenities: ['wifi', 'ac', 'balcony', 'kitchen', 'security', 'washing machine'],
      genderPreference: 'female', rules: { smoking: false, pets: true, guests: true },
      availableFrom: soon(21), images: [],
      description: 'Lush green surroundings just 300 meters from Juhu beach. Spacious room with breezy windows and ample wardrobe storage. Respectful and tidy flatmates.'
    },
    {
      owner: byEmail('meenal.kulkarni@nestmate.test'),
      title: 'Budget-friendly private room in Malad West Link Road',
      type: 'private-room', rent: 13500, deposit: 27000, city: 'Mumbai', locality: 'Malad West',
      address: 'New Link Road, Malad West',
      bedrooms: 2, bathrooms: 2, currentRoommates: 1, furnished: true,
      amenities: ['wifi', 'geyser', 'lift', 'kitchen', 'washing machine'],
      genderPreference: 'male', rules: { smoking: false, pets: false, guests: true },
      availableFrom: soon(11), images: [],
      description: 'Convenient room near Mindspace business hub and Inorbit Mall. Clean flat shared with a working marketing professional. Metro line 2A is just 2 minutes away.'
    },
    // 3 Shared Rooms
    {
      owner: byEmail('farhan.merchant@nestmate.test'),
      title: 'Shared room in Andheri West near D.N. Nagar Metro',
      type: 'shared-room', rent: 9000, deposit: 18000, city: 'Mumbai', locality: 'Andheri West',
      address: 'D.N. Nagar, Andheri West',
      bedrooms: 2, bathrooms: 2, currentRoommates: 3, furnished: true,
      amenities: ['wifi', 'ac', 'geyser', 'lift', 'housekeeping'],
      genderPreference: 'male', rules: { smoking: false, pets: false, guests: false },
      availableFrom: soon(6), images: [],
      description: 'Twin sharing room with individual study tables and high-speed WiFi. Daily housekeeping keeps common spaces spotless. Excellent connectivity via Metro lines 1 and 2.'
    },
    {
      owner: byEmail('meenal.kulkarni@nestmate.test'),
      title: 'Affordable shared accommodation for women in Thane West',
      type: 'shared-room', rent: 6800, deposit: 13600, city: 'Mumbai', locality: 'Thane West',
      address: 'Ghodbunder Road, Thane West',
      bedrooms: 3, bathrooms: 2, currentRoommates: 4, furnished: true,
      amenities: ['wifi', 'kitchen', 'lift', 'security', 'washing machine'],
      genderPreference: 'female', rules: { smoking: false, pets: false, guests: false },
      availableFrom: soon(17), images: [],
      description: 'Comfortable twin-sharing room in a secure township on Ghodbunder Road. Gated security with clubhouse and park within the society. Ideal for IT employees in Thane.'
    },
    {
      owner: byEmail('farhan.merchant@nestmate.test'),
      title: 'Student & intern shared room in Powai near IIT gate',
      type: 'shared-room', rent: 8500, deposit: 17000, city: 'Mumbai', locality: 'Powai',
      address: 'JVLR, near IIT Main Gate, Powai',
      bedrooms: 2, bathrooms: 2, currentRoommates: 3, furnished: true,
      amenities: ['wifi', 'geyser', 'kitchen', 'power backup'],
      genderPreference: 'any', rules: { smoking: false, pets: false, guests: true },
      availableFrom: soon(24), images: [],
      description: 'Shared room suited for interns and young engineers working along JVLR. Close to bus stops, food stalls, and grocery marts. Includes high-speed broadband.'
    },
    // 3 Entire Places
    {
      owner: byEmail('farhan.merchant@nestmate.test'),
      title: 'Sea view luxury 2BHK flat in Bandra West Bandstand',
      type: 'entire-place', rent: 65000, deposit: 195000, city: 'Mumbai', locality: 'Bandra West',
      address: 'BJ Road, Bandstand, Bandra West',
      bedrooms: 2, bathrooms: 2, currentRoommates: 0, furnished: true,
      amenities: ['wifi', 'ac', 'lift', 'security', 'parking', 'balcony', 'kitchen', 'washing machine'],
      genderPreference: 'any', rules: { smoking: false, pets: true, guests: true },
      availableFrom: soon(28), images: [],
      description: 'Stunning 2BHK with direct Arabian Sea views from living room and master bedroom. Designer interiors, modular kitchen, and reserved basement parking. Highly sought-after neighborhood.'
    },
    {
      owner: byEmail('meenal.kulkarni@nestmate.test'),
      title: 'Spacious 2BHK apartment in Powai Lake Homes',
      type: 'entire-place', rent: 46000, deposit: 138000, city: 'Mumbai', locality: 'Powai',
      address: 'Lake Homes Complex, Powai',
      bedrooms: 2, bathrooms: 2, currentRoommates: 0, furnished: true,
      amenities: ['gym', 'parking', 'lift', 'security', 'power backup', 'kitchen', 'balcony'],
      genderPreference: 'any', rules: { smoking: false, pets: true, guests: true },
      availableFrom: soon(35), images: [],
      description: 'Tastefully furnished 2BHK with scenic hill views and lush green walking tracks. Access to swimming pool, gym, and badminton court. Round-the-clock security and maintenance.'
    },
    {
      owner: byEmail('farhan.merchant@nestmate.test'),
      title: 'Modern 1BHK apartment in Worli Seaface enclave',
      type: 'entire-place', rent: 38000, deposit: 114000, city: 'Mumbai', locality: 'Worli',
      address: 'Khan Abdul Gaffar Khan Road, Worli Seaface',
      bedrooms: 1, bathrooms: 1, currentRoommates: 0, furnished: true,
      amenities: ['wifi', 'ac', 'parking', 'lift', 'security', 'kitchen'],
      genderPreference: 'any', rules: { smoking: false, pets: false, guests: true },
      availableFrom: soon(19), images: [],
      description: 'Chic 1BHK just a short walk from Worli Sea Face promenade. Quick access to Bandra-Worli Sea Link and Lower Parel corporate hubs. Completely move-in ready with modern white goods.'
    },

    // ==========================================
    // PUNE (12 listings)
    // ==========================================
    // 6 Private Rooms
    {
      owner: byEmail('gaurav.inamdar@nestmate.test'),
      title: 'Sunny private room in Baner near Balewadi High Street',
      type: 'private-room', rent: 12000, deposit: 24000, city: 'Pune', locality: 'Baner',
      address: 'Pan Card Club Road, Baner',
      bedrooms: 3, bathrooms: 2, currentRoommates: 2, furnished: true,
      amenities: ['wifi', 'ac', 'lift', 'kitchen', 'washing machine', 'power backup'],
      genderPreference: 'any', rules: { smoking: false, pets: true, guests: true },
      availableFrom: soon(8), images: [],
      description: 'Bright private room with personal workstation and wide balcony views. Close to Balewadi High Street restaurants and Baner hill trails. High-speed broadband and parking available.'
    },
    {
      owner: byEmail('rashmi.chitnis@nestmate.test'),
      title: 'Greenery facing private room in Koregaon Park Lane 7',
      type: 'private-room', rent: 14500, deposit: 29000, city: 'Pune', locality: 'Koregaon Park',
      address: 'Lane 7, Koregaon Park',
      bedrooms: 3, bathrooms: 3, currentRoommates: 2, furnished: true,
      amenities: ['wifi', 'ac', 'attached bathroom', 'balcony', 'kitchen', 'security'],
      genderPreference: 'female', rules: { smoking: false, pets: false, guests: true },
      availableFrom: soon(14), images: [],
      description: 'Charming private room under canopy of banyan trees in Koregaon Park. Walking distance to famous cafes, art centers, and Osho garden. Looking for a neat female flatmate.'
    },
    {
      owner: byEmail('gaurav.inamdar@nestmate.test'),
      title: 'Attached bath room in Wakad near Hinjewadi Bridge',
      type: 'private-room', rent: 10500, deposit: 21000, city: 'Pune', locality: 'Wakad',
      address: 'Datta Mandir Road, Wakad',
      bedrooms: 2, bathrooms: 2, currentRoommates: 1, furnished: true,
      amenities: ['wifi', 'attached bathroom', 'geyser', 'lift', 'power backup', 'parking'],
      genderPreference: 'male', rules: { smoking: false, pets: false, guests: true },
      availableFrom: soon(10), images: [],
      description: 'Ideal setup for IT professionals working in Hinjewadi Phase 1 & 2. Gated society with clubhouse, gym, and 100% power backup. Dedicated two-wheeler parking included.'
    },
    {
      owner: byEmail('rashmi.chitnis@nestmate.test'),
      title: 'Cozy private room in Viman Nagar near Phoenix Marketcity',
      type: 'private-room', rent: 13000, deposit: 26000, city: 'Pune', locality: 'Viman Nagar',
      address: 'VIP Road, Viman Nagar',
      bedrooms: 3, bathrooms: 2, currentRoommates: 2, furnished: true,
      amenities: ['wifi', 'ac', 'kitchen', 'washing machine', 'security', 'lift'],
      genderPreference: 'any', rules: { smoking: false, pets: true, guests: true },
      availableFrom: soon(16), images: [],
      description: 'Modern room in central Viman Nagar. Close to airport, Symbiosis campus, and Phoenix Marketcity. Shared kitchen and bright common living space.'
    },
    {
      owner: byEmail('gaurav.inamdar@nestmate.test'),
      title: 'Peaceful private bedroom in Aundh near Westend Mall',
      type: 'private-room', rent: 11000, deposit: 22000, city: 'Pune', locality: 'Aundh',
      address: 'DP Road, Aundh',
      bedrooms: 2, bathrooms: 2, currentRoommates: 1, furnished: true,
      amenities: ['wifi', 'geyser', 'kitchen', 'parking', 'balcony'],
      genderPreference: 'any', rules: { smoking: false, pets: false, guests: true },
      availableFrom: soon(20), images: [],
      description: 'Well-ventilated private room in a peaceful residential building in Aundh. Short walk to botanical gardens and organic food stores. Respectful flatmate environment.'
    },
    {
      owner: byEmail('rashmi.chitnis@nestmate.test'),
      title: 'Spacious room in Kothrud near MIT World Peace University',
      type: 'private-room', rent: 9500, deposit: 19000, city: 'Pune', locality: 'Kothrud',
      address: 'Paud Road, Kothrud',
      bedrooms: 3, bathrooms: 2, currentRoommates: 2, furnished: true,
      amenities: ['wifi', 'geyser', 'kitchen', 'power backup'],
      genderPreference: 'any', rules: { smoking: false, pets: false, guests: false },
      availableFrom: soon(12), images: [],
      description: 'Quiet room suitable for graduate students or junior researchers. Close to metro station and Paud Road bus stops. Pure vegetarian household.'
    },
    // 3 Shared Rooms
    {
      owner: byEmail('gaurav.inamdar@nestmate.test'),
      title: 'Twin-sharing room in Hinjewadi Phase 1 near Infosys',
      type: 'shared-room', rent: 5500, deposit: 11000, city: 'Pune', locality: 'Hinjewadi',
      address: 'Hinjewadi Phase 1, near Wipro Circle',
      bedrooms: 3, bathrooms: 2, currentRoommates: 4, furnished: true,
      amenities: ['wifi', 'geyser', 'housekeeping', 'power backup', 'lift'],
      genderPreference: 'male', rules: { smoking: false, pets: false, guests: false },
      availableFrom: soon(4), images: [],
      description: 'Pocket-friendly shared room for IT freshers. Bed, mattress, and personal wardrobe provided. Daily housekeeping keeps premises clean.'
    },
    {
      owner: byEmail('rashmi.chitnis@nestmate.test'),
      title: 'Shared room for women in Kharadi near EON Free Zone',
      type: 'shared-room', rent: 6200, deposit: 12400, city: 'Pune', locality: 'Kharadi',
      address: 'EON IT Park Road, Kharadi',
      bedrooms: 2, bathrooms: 2, currentRoommates: 2, furnished: true,
      amenities: ['wifi', 'kitchen', 'security', 'washing machine', 'lift'],
      genderPreference: 'female', rules: { smoking: false, pets: false, guests: false },
      availableFrom: soon(15), images: [],
      description: 'Two-sharing bedroom in a secure gated township near EON IT Park. Includes high-speed broadband and fully equipped kitchen. Safe and convenient for working women.'
    },
    {
      owner: byEmail('gaurav.inamdar@nestmate.test'),
      title: 'Budget shared accommodation in Baner near Pashan Link Road',
      type: 'shared-room', rent: 5800, deposit: 11600, city: 'Pune', locality: 'Baner',
      address: 'Pashan-Baner Link Road, Baner',
      bedrooms: 3, bathrooms: 2, currentRoommates: 3, furnished: true,
      amenities: ['wifi', 'geyser', 'power backup', 'kitchen'],
      genderPreference: 'any', rules: { smoking: false, pets: false, guests: true },
      availableFrom: soon(22), images: [],
      description: 'Comfortable twin-sharing space with peaceful hill surroundings. Perfect for professionals working along the highway. Easy public transit access.'
    },
    // 3 Entire Places
    {
      owner: byEmail('rashmi.chitnis@nestmate.test'),
      title: 'Elegant 2BHK terrace apartment in Koregaon Park',
      type: 'entire-place', rent: 34000, deposit: 102000, city: 'Pune', locality: 'Koregaon Park',
      address: 'South Main Road, Koregaon Park',
      bedrooms: 2, bathrooms: 2, currentRoommates: 0, furnished: true,
      amenities: ['wifi', 'ac', 'parking', 'balcony', 'kitchen', 'washing machine', 'security'],
      genderPreference: 'any', rules: { smoking: false, pets: true, guests: true },
      availableFrom: soon(26), images: [],
      description: 'Lush 2BHK apartment with a wrap-around private terrace garden. Located in one of Pune’s premier neighborhoods with quiet roads and cafe culture. Reserved covered car park.'
    },
    {
      owner: byEmail('gaurav.inamdar@nestmate.test'),
      title: 'Modern 3BHK flat in Baner near Mumbai-Pune Expressway',
      type: 'entire-place', rent: 38000, deposit: 114000, city: 'Pune', locality: 'Baner',
      address: 'Near Amar Paragon, Baner',
      bedrooms: 3, bathrooms: 3, currentRoommates: 0, furnished: true,
      amenities: ['gym', 'lift', 'parking', 'power backup', 'security', 'kitchen', 'balcony'],
      genderPreference: 'any', rules: { smoking: false, pets: true, guests: true },
      availableFrom: soon(32), images: [],
      description: 'Brand new 3BHK on high floor with clubhouse, swimming pool, and gym access. Seamless connectivity to Hinjewadi and Expressway. Excellent natural lighting in all rooms.'
    },
    {
      owner: byEmail('gaurav.inamdar@nestmate.test'),
      title: 'Semi-furnished 2BHK in Wakad near Bhumkar Chowk',
      type: 'entire-place', rent: 26000, deposit: 78000, city: 'Pune', locality: 'Wakad',
      address: 'Bhumkar Chowk, Wakad',
      bedrooms: 2, bathrooms: 2, currentRoommates: 0, furnished: false,
      amenities: ['parking', 'lift', 'power backup', 'security', 'balcony'],
      genderPreference: 'any', rules: { smoking: false, pets: false, guests: true },
      availableFrom: soon(18), images: [],
      description: 'Spacious 2BHK in a newly handed-over gated community. Ideal for small families or working professionals wanting to furnish on their own. Close to schools and retail hubs.'
    },

    // ==========================================
    // HYDERABAD (12 listings)
    // ==========================================
    // 6 Private Rooms
    {
      owner: byEmail('suresh.chukkapalli@nestmate.test'),
      title: 'Luxury private room in Jubilee Hills Road No. 36',
      type: 'private-room', rent: 19000, deposit: 38000, city: 'Hyderabad', locality: 'Jubilee Hills',
      address: 'Road No. 36, Jubilee Hills',
      bedrooms: 3, bathrooms: 3, currentRoommates: 2, furnished: true,
      amenities: ['wifi', 'ac', 'attached bathroom', 'parking', 'power backup', 'kitchen', 'security'],
      genderPreference: 'any', rules: { smoking: false, pets: false, guests: true },
      availableFrom: soon(10), images: [],
      description: 'Upscale private room with attached bath in Hyderabad’s most exclusive residential zone. Surrounded by high-end dining, boutique studios, and parks. Includes covered parking.'
    },
    {
      owner: byEmail('swathi.raju@nestmate.test'),
      title: 'Tech-friendly private room in Gachibowli Financial District',
      type: 'private-room', rent: 14000, deposit: 28000, city: 'Hyderabad', locality: 'Gachibowli',
      address: 'Nanakramguda, Financial District, Gachibowli',
      bedrooms: 3, bathrooms: 2, currentRoommates: 2, furnished: true,
      amenities: ['wifi', 'ac', 'gym', 'lift', 'power backup', 'washing machine', 'security'],
      genderPreference: 'any', rules: { smoking: false, pets: true, guests: true },
      availableFrom: soon(7), images: [],
      description: 'Comfortable private room in a top-tier gated community right next to Microsoft and Amazon campuses. Society features olympic gym, clubhouse, and grocery stores. 24/7 power backup.'
    },
    {
      owner: byEmail('swathi.raju@nestmate.test'),
      title: 'Women-only private room in Madhapur near Inorbit Mall',
      type: 'private-room', rent: 13500, deposit: 27000, city: 'Hyderabad', locality: 'Madhapur',
      address: 'Kavuri Hills, Madhapur',
      bedrooms: 3, bathrooms: 3, currentRoommates: 2, furnished: true,
      amenities: ['wifi', 'ac', 'kitchen', 'washing machine', 'lift', 'security', 'attached bathroom'],
      genderPreference: 'female', rules: { smoking: false, pets: false, guests: true },
      availableFrom: soon(14), images: [],
      description: 'Spacious room with attached bathroom in peaceful Kavuri Hills. Short walk to Durgam Cheruvu cable bridge and Madhapur metro station. Clean, female-only shared flat.'
    },
    {
      owner: byEmail('suresh.chukkapalli@nestmate.test'),
      title: 'Quiet private room in Kondapur near Botanical Garden',
      type: 'private-room', rent: 12000, deposit: 24000, city: 'Hyderabad', locality: 'Kondapur',
      address: 'Botanical Garden Road, Kondapur',
      bedrooms: 2, bathrooms: 2, currentRoommates: 1, furnished: true,
      amenities: ['wifi', 'ac', 'balcony', 'kitchen', 'parking', 'power backup'],
      genderPreference: 'any', rules: { smoking: false, pets: true, guests: true },
      availableFrom: soon(18), images: [],
      description: 'Pleasant room overlooking the lush green canopy of the Botanical Garden. High-speed broadband and modular kitchen available. Very peaceful residential community.'
    },
    {
      owner: byEmail('swathi.raju@nestmate.test'),
      title: 'Furnished private room in Hitec City near Cyber Towers',
      type: 'private-room', rent: 14500, deposit: 29000, city: 'Hyderabad', locality: 'Hitec City',
      address: 'Cyber Towers Road, Hitec City',
      bedrooms: 3, bathrooms: 2, currentRoommates: 2, furnished: true,
      amenities: ['wifi', 'ac', 'lift', 'power backup', 'washing machine', 'security'],
      genderPreference: 'male', rules: { smoking: false, pets: false, guests: true },
      availableFrom: soon(11), images: [],
      description: 'Walk-to-work convenience for IT professionals in Hitec City. Room comes with Queen bed, work desk, ergonomic chair, and wardrobe. Regular housekeeping included.'
    },
    {
      owner: byEmail('suresh.chukkapalli@nestmate.test'),
      title: 'Breezy room in Banjara Hills Road No. 12',
      type: 'private-room', rent: 15500, deposit: 31000, city: 'Hyderabad', locality: 'Banjara Hills',
      address: 'Road No. 12, Banjara Hills',
      bedrooms: 3, bathrooms: 2, currentRoommates: 2, furnished: true,
      amenities: ['wifi', 'ac', 'balcony', 'kitchen', 'parking', 'geyser'],
      genderPreference: 'any', rules: { smoking: false, pets: false, guests: true },
      availableFrom: soon(25), images: [],
      description: 'Large room with French windows and a private balcony garden in Banjara Hills. Shared with two quiet working consultants. Close to Taj Krishna and shopping centers.'
    },
    // 3 Shared Rooms
    {
      owner: byEmail('swathi.raju@nestmate.test'),
      title: 'Twin-sharing room in Kondapur near KIMS Hospital',
      type: 'shared-room', rent: 6500, deposit: 13000, city: 'Hyderabad', locality: 'Kondapur',
      address: 'Near KIMS Hospital, Kondapur',
      bedrooms: 2, bathrooms: 2, currentRoommates: 3, furnished: true,
      amenities: ['wifi', 'geyser', 'housekeeping', 'power backup'],
      genderPreference: 'male', rules: { smoking: false, pets: false, guests: false },
      availableFrom: soon(5), images: [],
      description: 'Budget-friendly shared room with individual beds, lockers, and study desks. Reliable high-speed WiFi and hot water supply. Cleaned twice weekly.'
    },
    {
      owner: byEmail('suresh.chukkapalli@nestmate.test'),
      title: 'Shared room for women in Kukatpally Housing Board',
      type: 'shared-room', rent: 5500, deposit: 11000, city: 'Hyderabad', locality: 'Kukatpally',
      address: 'KPHB Colony 4th Phase, Kukatpally',
      bedrooms: 3, bathrooms: 2, currentRoommates: 4, furnished: true,
      amenities: ['wifi', 'kitchen', 'security', 'washing machine'],
      genderPreference: 'female', rules: { smoking: false, pets: false, guests: false },
      availableFrom: soon(12), images: [],
      description: 'Secure shared flat in KPHB Colony close to JNTU and metro station. Equipped with self-cooking kitchen and automatic washing machine. Friendly atmosphere for students and working women.'
    },
    {
      owner: byEmail('swathi.raju@nestmate.test'),
      title: 'Shared flatmate spot in Gowlidoddy near Q City',
      type: 'shared-room', rent: 6000, deposit: 12000, city: 'Hyderabad', locality: 'Gowlidoddy',
      address: 'Gowlidoddy Main Road, near Q City',
      bedrooms: 2, bathrooms: 2, currentRoommates: 2, furnished: true,
      amenities: ['wifi', 'geyser', 'power backup', 'kitchen'],
      genderPreference: 'any', rules: { smoking: false, pets: false, guests: true },
      availableFrom: soon(20), images: [],
      description: 'Low-cost shared accommodation within 5 minutes of Financial District companies. Good water supply and power backup. Ideal for contractors and new joiners.'
    },
    // 3 Entire Places
    {
      owner: byEmail('suresh.chukkapalli@nestmate.test'),
      title: 'Palatial 3BHK gated villa in Jubilee Hills',
      type: 'entire-place', rent: 58000, deposit: 174000, city: 'Hyderabad', locality: 'Jubilee Hills',
      address: 'Near Journalist Colony, Jubilee Hills',
      bedrooms: 3, bathrooms: 3, currentRoommates: 0, furnished: true,
      amenities: ['wifi', 'ac', 'parking', 'gym', 'power backup', 'security', 'balcony', 'kitchen'],
      genderPreference: 'any', rules: { smoking: false, pets: true, guests: true },
      availableFrom: soon(30), images: [],
      description: 'Luxurious 3BHK independent home featuring manicured private lawn and Italian marble flooring. Uninterrupted power supply, servant quarter, and two-car garage. Top security.'
    },
    {
      owner: byEmail('swathi.raju@nestmate.test'),
      title: 'High-floor 2BHK in Gachibowli My Home Bhooja',
      type: 'entire-place', rent: 45000, deposit: 135000, city: 'Hyderabad', locality: 'Gachibowli',
      address: 'My Home Bhooja, Gachibowli',
      bedrooms: 2, bathrooms: 2, currentRoommates: 0, furnished: true,
      amenities: ['gym', 'lift', 'parking', 'power backup', 'security', 'balcony', 'kitchen'],
      genderPreference: 'any', rules: { smoking: false, pets: true, guests: true },
      availableFrom: soon(24), images: [],
      description: 'Magnificent 2BHK on the 22nd floor with sprawling views across Biodiversity Park. State-of-the-art clubhouse with infinity pool, tennis courts, and cafe. Seamless living experience.'
    },
    {
      owner: byEmail('swathi.raju@nestmate.test'),
      title: 'Cozy 2BHK apartment in Madhapur near Durgam Cheruvu',
      type: 'entire-place', rent: 32000, deposit: 96000, city: 'Hyderabad', locality: 'Madhapur',
      address: 'Vittal Rao Nagar, Madhapur',
      bedrooms: 2, bathrooms: 2, currentRoommates: 0, furnished: false,
      amenities: ['parking', 'lift', 'power backup', 'security', 'balcony'],
      genderPreference: 'any', rules: { smoking: false, pets: false, guests: true },
      availableFrom: soon(16), images: [],
      description: 'Spacious semi-furnished 2BHK with modular kitchen cabinets and spacious wardrobes. Located right in the heart of Hyderabad’s tech corridor. Walk to cafes and metro.'
    },

    // ==========================================
    // DELHI NCR (12 listings)
    // ==========================================
    // 6 Private Rooms
    {
      owner: byEmail('harsh.bhasin@nestmate.test'),
      title: 'Executive private suite in DLF Phase 5 Golf Course Road',
      type: 'private-room', rent: 22000, deposit: 44000, city: 'Delhi NCR', locality: 'DLF Phase 5',
      address: 'Golf Course Road, DLF Phase 5, Gurugram',
      bedrooms: 3, bathrooms: 3, currentRoommates: 2, furnished: true,
      amenities: ['wifi', 'ac', 'attached bathroom', 'gym', 'lift', 'power backup', 'security'],
      genderPreference: 'any', rules: { smoking: false, pets: true, guests: true },
      availableFrom: soon(6), images: [],
      description: 'Master bedroom with attached marble washroom on Golf Course Road. Complex has clubhouse, swimming pool, and round-the-clock concierge. Walk to Sector 53-54 Rapid Metro station.'
    },
    {
      owner: byEmail('pallavi.chadha@nestmate.test'),
      title: 'Sunlit bohemian private room in Hauz Khas Village',
      type: 'private-room', rent: 17500, deposit: 35000, city: 'Delhi NCR', locality: 'Hauz Khas',
      address: 'Hauz Khas Enclave, New Delhi',
      bedrooms: 3, bathrooms: 2, currentRoommates: 2, furnished: true,
      amenities: ['wifi', 'ac', 'balcony', 'kitchen', 'washing machine', 'security'],
      genderPreference: 'female', rules: { smoking: false, pets: true, guests: true },
      availableFrom: soon(13), images: [],
      description: 'Artistic room with private balcony looking out onto Hauz Khas deer park. Shared with two creative female flatmates who enjoy a quiet, warm home. Minutes from yellow line metro.'
    },
    {
      owner: byEmail('harsh.bhasin@nestmate.test'),
      title: 'Walk to Cyber Hub private room in Cyber City',
      type: 'private-room', rent: 16500, deposit: 33000, city: 'Delhi NCR', locality: 'Cyber City',
      address: 'DLF Phase 2, near Cyber City, Gurugram',
      bedrooms: 3, bathrooms: 2, currentRoommates: 2, furnished: true,
      amenities: ['wifi', 'ac', 'power backup', 'kitchen', 'washing machine', 'parking'],
      genderPreference: 'any', rules: { smoking: false, pets: false, guests: true },
      availableFrom: soon(9), images: [],
      description: '5-minute walking distance to DLF Cyber City offices and dining. Fully furnished with double bed, study unit, and air conditioning. High-speed 300 Mbps fiber line.'
    },
    {
      owner: byEmail('pallavi.chadha@nestmate.test'),
      title: 'Private room in Greater Kailash 1 near M-Block market',
      type: 'private-room', rent: 18500, deposit: 37000, city: 'Delhi NCR', locality: 'Greater Kailash',
      address: 'GK-1, M Block, New Delhi',
      bedrooms: 3, bathrooms: 3, currentRoommates: 2, furnished: true,
      amenities: ['wifi', 'ac', 'attached bathroom', 'kitchen', 'lift', 'power backup'],
      genderPreference: 'any', rules: { smoking: false, pets: false, guests: true },
      availableFrom: soon(20), images: [],
      description: 'Prime South Delhi location in a gated and guarded GK-1 street. Generous room size with attached bathroom and modular wardrobe. Great food and retail steps away.'
    },
    {
      owner: byEmail('pallavi.chadha@nestmate.test'),
      title: 'Cozy private room in Sector 62 Noida near metro',
      type: 'private-room', rent: 11000, deposit: 22000, city: 'Delhi NCR', locality: 'Sector 62 Noida',
      address: 'Sector 62, Noida',
      bedrooms: 2, bathrooms: 2, currentRoommates: 1, furnished: true,
      amenities: ['wifi', 'ac', 'power backup', 'kitchen', 'washing machine', 'security'],
      genderPreference: 'male', rules: { smoking: false, pets: false, guests: true },
      availableFrom: soon(15), images: [],
      description: 'Comfortable private room in an established residential society in Noida. Walking distance to electronic city metro station and tech parks. Includes all basic white goods.'
    },
    {
      owner: byEmail('harsh.bhasin@nestmate.test'),
      title: 'Peaceful private room in Saket near Select Citywalk',
      type: 'private-room', rent: 15000, deposit: 30000, city: 'Delhi NCR', locality: 'Saket',
      address: 'Press Enclave Road, Saket, New Delhi',
      bedrooms: 3, bathrooms: 2, currentRoommates: 2, furnished: true,
      amenities: ['wifi', 'ac', 'balcony', 'kitchen', 'lift', 'security'],
      genderPreference: 'any', rules: { smoking: false, pets: true, guests: true },
      availableFrom: soon(17), images: [],
      description: 'Quiet room in a serene South Delhi gated pocket near Saket metro and Select Citywalk. Bright windows with tree views and shared modular kitchen. Friendly, educated flatmates.'
    },
    // 3 Shared Rooms
    {
      owner: byEmail('pallavi.chadha@nestmate.test'),
      title: 'Twin-sharing room in Indirapuram near Shipra Mall',
      type: 'shared-room', rent: 5800, deposit: 11600, city: 'Delhi NCR', locality: 'Indirapuram',
      address: 'Vaibhav Khand, Indirapuram, Ghaziabad',
      bedrooms: 2, bathrooms: 2, currentRoommates: 3, furnished: true,
      amenities: ['wifi', 'geyser', 'power backup', 'kitchen'],
      genderPreference: 'female', rules: { smoking: false, pets: false, guests: false },
      availableFrom: soon(8), images: [],
      description: 'Affordable twin-sharing room for women in a clean Indirapuram high-rise. Regular water supply, power backup, and gated security. Kitchen available for self-cooking.'
    },
    {
      owner: byEmail('harsh.bhasin@nestmate.test'),
      title: 'Shared room in DLF Phase 3 near Cyber City',
      type: 'shared-room', rent: 7000, deposit: 14000, city: 'Delhi NCR', locality: 'Cyber City',
      address: 'U-Block, DLF Phase 3, Gurugram',
      bedrooms: 3, bathrooms: 2, currentRoommates: 4, furnished: true,
      amenities: ['wifi', 'ac', 'geyser', 'housekeeping', 'power backup'],
      genderPreference: 'male', rules: { smoking: false, pets: false, guests: false },
      availableFrom: soon(12), images: [],
      description: 'Well-maintained shared room in Gurugram’s prime rental hub. Separate wooden beds and individual cupboards provided. Housekeeping and high-speed Wi-Fi included in maintenance.'
    },
    {
      owner: byEmail('pallavi.chadha@nestmate.test'),
      title: 'Economical shared room in Lajpat Nagar 4',
      type: 'shared-room', rent: 6200, deposit: 12400, city: 'Delhi NCR', locality: 'Lajpat Nagar',
      address: 'Lajpat Nagar 4, New Delhi',
      bedrooms: 2, bathrooms: 2, currentRoommates: 2, furnished: true,
      amenities: ['wifi', 'geyser', 'kitchen', 'washing machine'],
      genderPreference: 'any', rules: { smoking: false, pets: false, guests: true },
      availableFrom: soon(21), images: [],
      description: 'Convenient shared living in central South Delhi near Moolchand metro station. Close to market areas and transit corridors. Clean space with shared cooking facilities.'
    },
    // 3 Entire Places
    {
      owner: byEmail('harsh.bhasin@nestmate.test'),
      title: 'Luxury 3BHK penthouse in DLF Phase 5 Gurugram',
      type: 'entire-place', rent: 62000, deposit: 186000, city: 'Delhi NCR', locality: 'DLF Phase 5',
      address: 'DLF The Crest, Sector 54, Gurugram',
      bedrooms: 3, bathrooms: 3, currentRoommates: 0, furnished: true,
      amenities: ['wifi', 'ac', 'gym', 'parking', 'power backup', 'lift', 'security', 'balcony', 'kitchen'],
      genderPreference: 'any', rules: { smoking: false, pets: true, guests: true },
      availableFrom: soon(28), images: [],
      description: 'Grand 3BHK high-rise apartment on Golf Course Road with panoramic views of the Aravalli hills. Premium Italian marble finishes, VRV air conditioning, and top-tier security. 2 dedicated car parks.'
    },
    {
      owner: byEmail('pallavi.chadha@nestmate.test'),
      title: 'Renovated 2BHK builder floor in Greater Kailash 2',
      type: 'entire-place', rent: 48000, deposit: 144000, city: 'Delhi NCR', locality: 'Greater Kailash',
      address: 'GK-2, near M-Block Market, New Delhi',
      bedrooms: 2, bathrooms: 2, currentRoommates: 0, furnished: true,
      amenities: ['wifi', 'ac', 'parking', 'kitchen', 'lift', 'power backup', 'balcony'],
      genderPreference: 'any', rules: { smoking: false, pets: true, guests: true },
      availableFrom: soon(33), images: [],
      description: 'Second-floor builder apartment with private elevator and stilt parking in upscale GK-2. Brand new modular kitchen and double-glazed soundproof windows. Walking distance to Jahanpanah City Forest.'
    },
    {
      owner: byEmail('pallavi.chadha@nestmate.test'),
      title: 'Modern 2BHK apartment in Sector 62 Noida',
      type: 'entire-place', rent: 29000, deposit: 87000, city: 'Delhi NCR', locality: 'Sector 62 Noida',
      address: 'Stellar Park, Sector 62, Noida',
      bedrooms: 2, bathrooms: 2, currentRoommates: 0, furnished: false,
      amenities: ['parking', 'lift', 'power backup', 'security', 'gym', 'balcony'],
      genderPreference: 'any', rules: { smoking: false, pets: false, guests: true },
      availableFrom: soon(22), images: [],
      description: 'Spacious semi-furnished 2BHK in a peaceful society near Fortis Hospital Noida. Well-ventilated corner unit with wide balconies overlooking central green parks. Quick access to NH-24.'
    }
  ];
}

// 25 Roommate Requests in mixed statuses:
// 8 accepted (used for chat threads), 9 pending, 5 rejected, 3 cancelled
// Strictly distinct pairs, no duplicates, no clashes with existing pairs
export function getNewRequestsData(users, existingUsers) {
  const getUid = (em) => {
    const all = [...users, ...Object.values(existingUsers)];
    const u = all.find((x) => x.email === em);
    if (!u) throw new Error(`User not found: ${em}`);
    return u._id;
  };

  return [
    // --- 8 ACCEPTED REQUESTS (Pair conversations will be seeded for these) ---
    {
      from: getUid('aditya.nair@nestmate.test'), to: getUid('sneha.rao@nestmate.test'), status: 'accepted',
      message: 'Hi Sneha! Saw your profile for Bengaluru. We both appreciate quiet spaces and our budgets overlap well. Would you be open to flat-hunting together in Jayanagar or Indiranagar?'
    },
    {
      from: getUid('kavya.krishnan@nestmate.test'), to: getUid('ananya@nestmate.test'), status: 'accepted',
      message: 'Hey Ananya! I love that you also enjoy calm weekdays and board games. My cat Chutney is very gentle and sweet. Would love to team up for a flat near Indiranagar/HSR!'
    },
    {
      from: getUid('aryan.malhotra@nestmate.test'), to: getUid('riya.sen@nestmate.test'), status: 'accepted',
      message: 'Hi Riya! I work long days in BKC and am looking for a calm place near Bandra. Your profile and budget look very aligned with mine. Let me know if you are open to searching together.'
    },
    {
      from: getUid('nikhil.kulkarni@nestmate.test'), to: getUid('rohan.sawant@nestmate.test'), status: 'accepted',
      message: 'Hey Rohan, we both work around Hinjewadi and have flexible routines. Want to look for a 2BHK or 3BHK in Baner or Wakad?'
    },
    {
      from: getUid('karthik.varma@nestmate.test'), to: getUid('sai.teja@nestmate.test'), status: 'accepted',
      message: 'Hi Sai Teja! Both of us work in tech and enjoy gaming and good food. Looking at flats near Kondapur or Gachibowli within 15-20k range. Interested in teaming up?'
    },
    {
      from: getUid('varun.aggarwal@nestmate.test'), to: getUid('raghav.chawla@nestmate.test'), status: 'accepted',
      message: 'Hey Raghav, working in DLF Cyber City as well. Our budgets and move-in timelines align nicely. Let me know if you would like to explore 2BHKs in DLF Phase 5.'
    },
    {
      from: getUid('shweta.patil@nestmate.test'), to: getUid('aishwarya.shinde@nestmate.test'), status: 'accepted',
      message: 'Hi Aishwarya! I saw your post looking in Viman Nagar. I am a UX researcher and love pets—your beagle pup looks adorable! Would love to connect.'
    },
    {
      from: getUid('harini.reddy@nestmate.test'), to: getUid('deepa.rao@nestmate.test'), status: 'accepted',
      message: 'Hello Deepa, we both work in Hitec City/Madhapur and have similar budgets and move-in dates. I am very comfortable with cats. Let us know if we can look at flats together!'
    },

    // --- 9 PENDING REQUESTS ---
    {
      from: getUid('rahul.verma@nestmate.test'), to: getUid('vikram.hegde@nestmate.test'), status: 'pending',
      message: 'Hi Vikram, noticed you are also looking in East Bengaluru. My budget is 12k-20k. Let me know if you are exploring 3BHKs in Whitefield or Bellandur.'
    },
    {
      from: getUid('sneha.rao@nestmate.test'), to: getUid('pooja.deshmukh@nestmate.test'), status: 'pending',
      message: 'Hey Pooja! I am a junior data analyst searching in HSR or BTM. Loved your profile bio, let me know if you would like to chat about options!'
    },
    {
      from: getUid('kunal.joshi@nestmate.test'), to: getUid('siddharth.kapoor@nestmate.test'), status: 'pending',
      message: 'Hey Siddharth, looking for pet-friendly flatmates in Mumbai around Andheri/Powai. Let me know if you are still looking.'
    },
    {
      from: getUid('tanvi.gokhale@nestmate.test'), to: getUid('riya.sen@nestmate.test'), status: 'pending',
      message: 'Hi Riya, I work in Lower Parel and commute towards Bandra. Thought our preferences matched well!'
    },
    {
      from: getUid('abhinav.date@nestmate.test'), to: getUid('nikhil.kulkarni@nestmate.test'), status: 'pending',
      message: 'Hello Nikhil, I am a postdoc researcher at IISER. Looking for quiet flatmates in Aundh or Baner. Let me know if you are interested.'
    },
    {
      from: getUid('neha.deshpande@nestmate.test'), to: getUid('shweta.patil@nestmate.test'), status: 'pending',
      message: 'Hi Shweta, love your design background and calm vibe! Are you still looking around Baner or Koregaon Park?'
    },
    {
      from: getUid('pranay.goud@nestmate.test'), to: getUid('karthik.varma@nestmate.test'), status: 'pending',
      message: 'Hey Karthik, fellow data scientist here. Looking for a neat 2BHK near Madhapur or Durgam Cheruvu. Let me know if you want to pair up.'
    },
    {
      from: getUid('manasa.kancharla@nestmate.test'), to: getUid('harini.reddy@nestmate.test'), status: 'pending',
      message: 'Hello Harini, early riser and vegetarian here looking around Gachibowli. Saw that our cleanliness and diet habits match 100%!'
    },
    {
      from: getUid('kritika.sharma@nestmate.test'), to: getUid('tanya.singhal@nestmate.test'), status: 'pending',
      message: 'Hi Tanya, I am in policy research looking around South Delhi. Both of us prefer serene, vegan/vegetarian spaces. Would love to connect!'
    },

    // --- 5 REJECTED REQUESTS (Representing declined requests) ---
    {
      from: getUid('rohan@nestmate.test'), to: getUid('vikram.hegde@nestmate.test'), status: 'rejected',
      message: 'Hey Vikram, looking to move to Whitefield soon. Let me know if you want to look at 2BHKs together.'
    },
    {
      from: getUid('siddharth.kapoor@nestmate.test'), to: getUid('aryan.malhotra@nestmate.test'), status: 'rejected',
      message: 'Hey Aryan, looking for someone to split a flat in Bandra. I have late shoots and friends visiting often.'
    },
    {
      from: getUid('rohan.sawant@nestmate.test'), to: getUid('abhinav.date@nestmate.test'), status: 'rejected',
      message: 'Hi Abhinav, let me know if you are open to a 2BHK in Wakad. I cook non-veg on weekends.'
    },
    {
      from: getUid('sai.teja@nestmate.test'), to: getUid('pranay.goud@nestmate.test'), status: 'rejected',
      message: 'Hi Pranay, looking to share a flat in Kondapur within 7k-10k. Let me know if that works for you.'
    },
    {
      from: getUid('raghav.chawla@nestmate.test'), to: getUid('kritika.sharma@nestmate.test'), status: 'rejected',
      message: 'Hey Kritika, saw your South Delhi search. Wondering if you would consider DLF Phase 5 Gurugram near Cyber City?'
    },

    // --- 3 CANCELLED REQUESTS ---
    {
      from: getUid('pooja.deshmukh@nestmate.test'), to: getUid('kavya.krishnan@nestmate.test'), status: 'cancelled',
      message: 'Hey Kavya, I might have found a studio apartment in Indiranagar, so cancelling for now. Best of luck with your hunt!'
    },
    {
      from: getUid('tanya.singhal@nestmate.test'), to: getUid('simran.kaur@nestmate.test'), status: 'cancelled',
      message: 'Hi Simran, my firm just reassigned me to a new branch, so changing localities. Wish you the best!'
    },
    {
      from: getUid('aman.gupta@nestmate.test'), to: getUid('varun.aggarwal@nestmate.test'), status: 'cancelled',
      message: 'Hey Varun, decided to extend my current lease in Noida for another six months. Cheers!'
    }
  ];
}

// 60-80 chat messages across the 8 accepted pairs
// Uses threadId helper: threadId(userA._id, userB._id)
export function getNewMessagesData(users, existingUsers) {
  const getUid = (em) => {
    const all = [...users, ...Object.values(existingUsers)];
    const u = all.find((x) => x.email === em);
    if (!u) throw new Error(`User not found: ${em}`);
    return u._id;
  };

  const msgs = [];
  const addConvo = (emA, emB, dialogs) => {
    const idA = getUid(emA);
    const idB = getUid(emB);
    const tid = threadId(idA, idB);
    dialogs.forEach(([speaker, text, isRead]) => {
      const sender = speaker === 'A' ? idA : idB;
      const recipient = speaker === 'A' ? idB : idA;
      msgs.push({
        thread: tid,
        sender,
        recipient,
        text,
        read: isRead ?? true
      });
    });
  };

  // Pair 1: Aditya Nair & Sneha Rao (10 messages)
  addConvo('aditya.nair@nestmate.test', 'sneha.rao@nestmate.test', [
    ['A', 'Hi Sneha! Thanks for accepting my request. How has your flat search been going so far?'],
    ['B', 'Hey Aditya! It is going okay, honestly mostly just browsing listings. Glad to connect!'],
    ['A', 'Same here. I saw a couple of really nice 2BHKs in Jayanagar 4th Block and BTM. Both around 24k total, so 12k each.'],
    ['B', '12k fits my budget comfortably. Does either of them have a decent kitchen and backup power? I work hybrid.'],
    ['A', 'Yes! The Jayanagar one has a spacious modular kitchen and full power backup. The owner is also very responsive.'],
    ['B', 'That sounds promising! Can we schedule a visit sometime this weekend?'],
    ['A', 'How about Saturday morning around 11:30 AM? We could grab a coffee nearby and inspect the place.'],
    ['B', 'Saturday 11:30 works great for me. Could you share the location pin on WhatsApp?'],
    ['A', 'Sure thing, just texted it to you. Let me know if you need any directions.'],
    ['B', 'Got it, see you on Saturday!', false]
  ]);

  // Pair 2: Kavya Krishnan & Ananya Rao (9 messages)
  addConvo('kavya.krishnan@nestmate.test', 'ananya@nestmate.test', [
    ['A', 'Hey Ananya! So happy you accepted. I saw in your profile you love board games too!'],
    ['B', 'Hi Kavya! Yes, huge Catan and Wingspan fan here haha. And your cat Chutney is adorable!'],
    ['A', 'Chutney will love you! She mostly sleeps in sunny spots by the window.'],
    ['B', 'Aww, pets are totally welcome. Are you leaning more towards Indiranagar or HSR?'],
    ['A', 'Indiranagar would be ideal because of metro access, but HSR Sector 2 also has great flats.'],
    ['B', 'I have my eye on an Indiranagar 3BHK where one of the rooms just opened up. Rent is 15.5k.'],
    ['A', 'Oh wow, that is well within my 14k-22k range. Is it furnished?'],
    ['B', 'Yes, fully furnished with washing machine, fridge, and AC in bedrooms.'],
    ['A', 'That is awesome! Let us definitely set up a visit with the landlord.', false]
  ]);

  // Pair 3: Aryan Malhotra & Riya Sen (9 messages)
  addConvo('aryan.malhotra@nestmate.test', 'riya.sen@nestmate.test', [
    ['A', 'Hi Riya, thanks for connecting! Work has been crazy in BKC, so finding a good flatmate in Bandra is a priority.'],
    ['B', 'Hey Aryan! Totally understand, agency life in Versova is just as hectic. Bandra West would be a sweet spot for both of us.'],
    ['A', 'Agreed. Have you checked the sea-facing flat near Bandstand? Rent is higher but split three ways it could work.'],
    ['B', 'I saw that! It looks gorgeous, but a 2BHK around Pali Hill or Perry Cross Road might be more practical and cozy.'],
    ['A', 'True. Pali Hill would keep the commute under 25 minutes for me.'],
    ['B', 'There is a 2BHK on 16th Road asking 48k total. Semi-furnished with parking.'],
    ['A', '24k each is spot on for my budget. Shall we contact the broker tomorrow?'],
    ['B', 'Yes please, let us do a quick call tomorrow evening after 7 PM to coordinate.'],
    ['A', 'Sounds like a plan. Talk tomorrow!', false]
  ]);

  // Pair 4: Nikhil Kulkarni & Rohan Sawant (9 messages)
  addConvo('nikhil.kulkarni@nestmate.test', 'rohan.sawant@nestmate.test', [
    ['A', 'Hey Rohan! Great to connect with another Hinjewadi techie.'],
    ['B', 'Hey Nikhil! Absolutely man, the daily commute from Kothrud was getting painful, so moving to Wakad or Baner makes sense.'],
    ['A', 'Totally. I saw a gated 2BHK in Wakad near Bhumkar Chowk for 22k. Comes with gym and covered parking.'],
    ['B', 'Bhumkar Chowk is super close to my office. How is the water supply in that society?'],
    ['A', 'The listing says municipal water plus 24-hour tanker backup, so no issues.'],
    ['B', 'That is crucial. Do you cook at home or rely on tiffin services?'],
    ['A', 'I cook simple meals on weekdays and eat out on weekends. You mentioned you make good Maharashtrian food?'],
    ['B', 'Haha yes, Sunday mutton rassa and poha are on me!'],
    ['A', 'Deal! Let us go see the flat this Sunday afternoon.', false]
  ]);

  // Pair 5: Karthik Varma & Sai Teja (9 messages)
  addConvo('karthik.varma@nestmate.test', 'sai.teja@nestmate.test', [
    ['A', 'Hi Sai Teja! Thanks for accepting. Which companies are you interviewing with near Gachibowli?'],
    ['B', 'Hey Karthik! Just joined a series-A startup near Financial District. Really excited to move nearby.'],
    ['A', 'Nice! I am working on LLMs nearby. We could easily share a 2BHK in Kondapur or Madhapur.'],
    ['B', 'Kondapur would be awesome. Budget around 10k-12k per person?'],
    ['A', 'Yes, exactly what I was targeting. I also have high-speed router gear we can set up immediately for gaming.'],
    ['B', 'Bro that is perfect. I play Valorant on weekend nights, hope the noise won’t be an issue.'],
    ['A', 'Not at all, I have noise cancelling headphones and stay up late too haha.'],
    ['B', 'Haha match made in heaven. Found this listing near Botanical Garden, sending you the link.'],
    ['A', 'Checking it right now, looks solid!', false]
  ]);

  // Pair 6: Varun Aggarwal & Raghav Chawla (9 messages)
  addConvo('varun.aggarwal@nestmate.test', 'raghav.chawla@nestmate.test', [
    ['A', 'Hey Raghav! Great connecting with you. Are you working in Cyber City itself?'],
    ['B', 'Hi Varun! Yes, building 10B. I can literally walk if we find a place in DLF Phase 2 or 5.'],
    ['A', 'Same here, I am on Golf Course Road. Looking at premium 2BHKs around Phase 5.'],
    ['B', 'Nice. My budget caps around 18k-19k, so a 35k-38k 2BHK would be ideal.'],
    ['A', 'There are a few well-maintained apartments near Sector 54 Rapid Metro. Fully furnished with 100% power backup.'],
    ['B', 'Power backup is non-negotiable with Gurgaon summers! Are guests okay on weekends?'],
    ['A', 'Yeah absolutely, friends visiting for dinner or match screenings is totally cool.'],
    ['B', 'Sweet. Let me call the host today and ask if we can visit on Thursday evening.'],
    ['A', 'Thursday 6:30 PM works great for me.', false]
  ]);

  // Pair 7: Shweta Patil & Aishwarya Shinde (8 messages)
  addConvo('shweta.patil@nestmate.test', 'aishwarya.shinde@nestmate.test', [
    ['A', 'Hi Aishwarya! Thrilled to connect. Your beagle must keep you on your toes!'],
    ['B', 'Hello Shweta! He really does, but he is such a cuddle bug. Will it be okay with your study routine?'],
    ['A', 'Oh completely! Animals actually help me de-stress after long research sprints.'],
    ['B', 'That is such a relief to hear! I saw a 2BHK in Viman Nagar with a lovely balcony garden.'],
    ['A', 'Viman Nagar is lovely. Wide pavements for walking the pup too.'],
    ['B', 'Yes! The society is completely pet-friendly and the rent is 24k total.'],
    ['A', '12k each is well within both our budgets. Let us schedule a viewing soon.'],
    ['B', 'I will message the owner right now and confirm for Saturday.', false]
  ]);

  // Pair 8: Harini Reddy & Deepa Rao (8 messages)
  addConvo('harini.reddy@nestmate.test', 'deepa.rao@nestmate.test', [
    ['A', 'Hello Deepa! So glad we connected. How is Mittens doing?'],
    ['B', 'Hi Harini! Mittens is doing great, mostly lounging on the windowsill. How are you?'],
    ['A', 'Doing well! I work in Madhapur and prefer clean, minimalist spaces with lots of natural light.'],
    ['B', 'Same here. I cannot stand clutter in common areas. Are you okay with vegetarian cooking at home?'],
    ['A', 'Yes, I am strictly vegetarian anyway! That makes kitchen sharing so much simpler.'],
    ['B', 'That is such a plus. I shortlisted a 2BHK in Kavuri Hills near Durgam Cheruvu.'],
    ['A', 'Kavuri Hills is so peaceful and green. Rent around 28k?'],
    ['B', 'Yes, 14k each including maintenance. Let us go check it out this Friday evening!', false]
  ]);

  return msgs;
}

// 4 extra reports so admin dashboard has realistic content
// Reasons: scam, fake, inappropriate
export function getNewReportsData(users, existingUsers, listings) {
  const getUid = (em) => {
    const all = [...users, ...Object.values(existingUsers)];
    return all.find((x) => x.email === em)._id;
  };

  return [
    {
      reporter: getUid('rahul.verma@nestmate.test'),
      targetType: 'listing',
      targetListing: listings[14]._id,
      reason: 'scam',
      details: 'Host insisted on an advance payment of ₹10,000 via Google Pay before showing the flat, stating multiple applicants were waiting.',
      status: 'open'
    },
    {
      reporter: getUid('riya.sen@nestmate.test'),
      targetType: 'user',
      targetUser: getUid('siddharth.kapoor@nestmate.test'),
      reason: 'inappropriate',
      details: 'User repeatedly sent unwelcome messages demanding private phone numbers and personal social media handles after being declined.',
      status: 'open'
    },
    {
      reporter: getUid('nikhil.kulkarni@nestmate.test'),
      targetType: 'listing',
      targetListing: listings[28]._id,
      reason: 'fake',
      details: 'The listing states location is prime Baner near high street, but upon calling the host admitted the property is in a remote village 18km away.',
      status: 'resolved',
      adminNote: 'Verified misleading address with host. Listing details corrected and warning issued.',
      resolvedBy: existingUsers.admin._id
    },
    {
      reporter: getUid('simran.kaur@nestmate.test'),
      targetType: 'user',
      targetUser: getUid('aman.gupta@nestmate.test'),
      reason: 'fake',
      details: 'Profile uses generic downloaded stock photography for display and was promoting third-party commercial brokerage services.',
      status: 'dismissed',
      adminNote: 'User clarified profile ownership and agreed to adhere to community personal guidelines.'
    }
  ];
}

// Assign 2-4 favorites to 12 users
export async function seedUserFavorites(users, existingUsers, listings) {
  const allUsers = [...users, ...Object.values(existingUsers)];
  const userMap = Object.fromEntries(allUsers.map((u) => [u.email, u]));

  const favMap = {
    'ananya@nestmate.test': [listings[0]._id, listings[2]._id, listings[9]._id],
    'rohan@nestmate.test': [listings[1]._id, listings[3]._id, listings[5]._id],
    'meera@nestmate.test': [listings[4]._id, listings[7]._id],
    'aditya.nair@nestmate.test': [listings[0]._id, listings[1]._id, listings[2]._id],
    'kavya.krishnan@nestmate.test': [listings[0]._id, listings[2]._id, listings[11]._id],
    'sneha.rao@nestmate.test': [listings[5]._id, listings[7]._id, listings[1]._id],
    'aryan.malhotra@nestmate.test': [listings[12]._id, listings[15]._id, listings[21]._id],
    'riya.sen@nestmate.test': [listings[12]._id, listings[14]._id, listings[16]._id],
    'nikhil.kulkarni@nestmate.test': [listings[24]._id, listings[26]._id, listings[30]._id],
    'shweta.patil@nestmate.test': [listings[25]._id, listings[27]._id, listings[33]._id],
    'karthik.varma@nestmate.test': [listings[36]._id, listings[37]._id, listings[40]._id],
    'simran.kaur@nestmate.test': [listings[48]._id, listings[49]._id, listings[57]._id]
  };

  for (const [email, fList] of Object.entries(favMap)) {
    const u = userMap[email];
    if (u) {
      await User.findByIdAndUpdate(u._id, { favorites: fList });
    }
  }
}

// Master function to seed all extended data
export async function seedExtendedData({ existingUsers, existingListings, soon, mk }) {
  console.log('Seeding 40 extended users...');
  const newUsers = [];
  for (const u of newUsersList) {
    const { moveInDateOffset, ...rest } = u;
    const doc = await mk({
      ...rest,
      moveInDate: moveInDateOffset ? soon(moveInDateOffset) : undefined
    });
    newUsers.push(doc);
  }

  console.log('Seeding 60 extended listings...');
  const listingsPayload = getNewListingsData(newUsers, existingUsers, soon);
  const newListings = await Listing.insertMany(listingsPayload);
  const allListings = [...existingListings, ...newListings];

  console.log('Seeding 25 roommate requests...');
  const requestsPayload = getNewRequestsData(newUsers, existingUsers);
  await RoommateRequest.insertMany(requestsPayload);

  console.log('Seeding chat messages across accepted pairs...');
  const messagesPayload = getNewMessagesData(newUsers, existingUsers);
  await Message.insertMany(messagesPayload);

  console.log('Assigning favorites to several users...');
  await seedUserFavorites(newUsers, existingUsers, allListings);

  console.log('Seeding extra admin reports...');
  const reportsPayload = getNewReportsData(newUsers, existingUsers, allListings);
  await Report.insertMany(reportsPayload);

  return {
    usersCount: newUsers.length,
    listingsCount: newListings.length,
    requestsCount: requestsPayload.length,
    messagesCount: messagesPayload.length,
    reportsCount: reportsPayload.length
  };
}
