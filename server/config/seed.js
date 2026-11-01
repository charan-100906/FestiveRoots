require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const ArtisanProfile = require('../models/ArtisanProfile');
const Category = require('../models/Category');
const Festival = require('../models/Festival');
const Region = require('../models/Region');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Fulfilment = require('../models/Fulfilment');
const Review = require('../models/Review');
const Wishlist = require('../models/Wishlist');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/festiveroots';
    console.log(`[Seed Script] Connecting to MongoDB: ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    console.log('[Seed Script] Clearing previous collections...');
    await Promise.all([
      User.deleteMany(),
      ArtisanProfile.deleteMany(),
      Category.deleteMany(),
      Festival.deleteMany(),
      Region.deleteMany(),
      Product.deleteMany(),
      Order.deleteMany(),
      Fulfilment.deleteMany(),
      Review.deleteMany(),
      Wishlist.deleteMany()
    ]);

    console.log('[Seed Script] Creating Admin and Seed Users...');

    // 1. Admin
    const adminUser = await User.create({
      name: 'FestiveRoots Administrator',
      email: 'admin@festiveroots.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '+91 98765 43210'
    });

    // 2. Customer
    const customerUser = await User.create({
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      password: 'Customer@123',
      role: 'customer',
      phone: '+91 91234 56789',
      address: {
        street: '42 Heritage Villa, Banjara Hills Road No. 12',
        city: 'Hyderabad',
        state: 'Telangana',
        postalCode: '500034',
        country: 'India'
      }
    });

    // 3. Artisans
    const artisanUser1 = await User.create({
      name: 'Ramesh Varma',
      email: 'ramesh.kondapalli@festiveroots.com',
      password: 'Artisan@123',
      role: 'artisan',
      phone: '+91 98480 12345'
    });

    const artisanProfile1 = await ArtisanProfile.create({
      user: artisanUser1._id,
      businessName: 'Kondapalli Traditional Softwood Toy Cluster',
      craftSpecialization: 'Kondapalli Wooden Carving & Dolls',
      state: 'Andhra Pradesh',
      district: 'Krishna',
      townVillage: 'Kondapalli',
      bio: 'Master craftsman carrying forward four generations of Tella Poniki softwood toy making. Our Kondapalli dolls feature traditional vegetable dyes and celebrate festive Telugu folklore.',
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80',
      claimedTraditionHistory: 'Our family has preserved the 400-year-old tradition of Kondapalli Bommala carving, historically patronized by regional kings.',
      verificationStatus: 'VERIFIED',
      verifiedAt: new Date(),
      ratingAverage: 4.8,
      numReviews: 24
    });

    const artisanUser2 = await User.create({
      name: 'Meera Devi',
      email: 'meera.jaipur@festiveroots.com',
      password: 'Artisan@123',
      role: 'artisan',
      phone: '+91 94140 23456'
    });

    const artisanProfile2 = await ArtisanProfile.create({
      user: artisanUser2._id,
      businessName: 'Jaipur Heritage Blue Pottery Studio',
      craftSpecialization: 'Traditional Glazed Blue Pottery',
      state: 'Rajasthan',
      district: 'Jaipur',
      townVillage: 'Kot Jewar',
      bio: 'Dedicated artisan crafting authentic low-fire blue pottery made of Egyptian paste, quartz powder, and natural cobalt oxide pigments without clay.',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80',
      claimedTraditionHistory: 'Reviving traditional Persian-influenced Turko-Persian glazed pottery introduced to Rajasthan in the 17th century.',
      verificationStatus: 'VERIFIED',
      verifiedAt: new Date(),
      ratingAverage: 4.9,
      numReviews: 32
    });

    const artisanUser3 = await User.create({
      name: 'Ananya Mukherjee',
      email: 'ananya.bengal@festiveroots.com',
      password: 'Artisan@123',
      role: 'artisan',
      phone: '+91 98300 34567'
    });

    const artisanProfile3 = await ArtisanProfile.create({
      user: artisanUser3._id,
      businessName: 'Bankura Terracotta & Dokra Collective',
      craftSpecialization: 'Terracotta Pottery & Dokra Bell Metal',
      state: 'West Bengal',
      district: 'Bankura',
      townVillage: 'Bishnupur',
      bio: 'Representing a cooperative of 18 village artisans specializing in high-fired red earthenware and 4,000-year-old lost-wax dokra casting.',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80',
      claimedTraditionHistory: 'Bishnupur terracotta heritage dates to the 16th-century Malla dynasty temples.',
      verificationStatus: 'VERIFIED',
      verifiedAt: new Date(),
      ratingAverage: 4.7,
      numReviews: 19
    });

    // Artisan 4: Pending Verification
    const artisanUser4 = await User.create({
      name: 'Suresh Gowda',
      email: 'suresh.toys@festiveroots.com',
      password: 'Artisan@123',
      role: 'artisan',
      phone: '+91 98450 45678'
    });

    await ArtisanProfile.create({
      user: artisanUser4._id,
      businessName: 'Channapatna Lacquer Craft Guild',
      craftSpecialization: 'Natural Lac-Turned Wooden Toys',
      state: 'Karnataka',
      district: 'Ramanagara',
      townVillage: 'Channapatna',
      bio: 'Artisan specializing in ivory wood turning coated with natural lac and non-toxic plant dyes.',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80',
      verificationStatus: 'PENDING'
    });

    console.log('[Seed Script] Creating Categories...');
    const categories = await Category.create([
      {
        name: 'Wooden Crafts & Toys',
        description: 'Authentic hand-carved woodware, lacquer toys, and folk figurines crafted from native timber.',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80',
        sortOrder: 1
      },
      {
        name: 'Terracotta & Clayware',
        description: 'Pooja diyas, earthen cookware, and sculptural terracotta kiln-fired by rural potters.',
        image: 'https://images.unsplash.com/photo-1605007493699-ce65834f8a00?w=800&q=80',
        sortOrder: 2
      },
      {
        name: 'Festive Decor & Pooja Essentials',
        description: 'Traditional torans, brass ritual utensils, aarti thalis, and sacred festive decorations.',
        image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800&q=80',
        sortOrder: 3
      },
      {
        name: 'Traditional Handlooms & Textiles',
        description: 'Pure silk dupattas, handwoven sarees, and block-printed ethnic festive apparel.',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
        sortOrder: 4
      },
      {
        name: 'Metal Crafts & Brass Idols',
        description: 'Lost-wax cast Dokra art, engraved brass oil lamps, and handcrafted deity idols.',
        image: 'https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?w=800&q=80',
        sortOrder: 5
      },
      {
        name: 'Folk Paintings & Wall Art',
        description: 'Hand-painted Madhubani, Pattachitra, Warli, and Kalamkari folklore art pieces.',
        image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80',
        sortOrder: 6
      }
    ]);

    console.log('[Seed Script] Creating Festivals...');
    const festivals = await Festival.create([
      {
        name: 'Diwali',
        description: 'The Festival of Lights celebrating the victory of light over darkness and prosperity.',
        approximateMonth: 'October / November',
        image: 'https://images.unsplash.com/photo-1605007493699-ce65834f8a00?w=800&q=80'
      },
      {
        name: 'Sankranti / Pongal',
        description: 'The auspicious harvest festival honoring the Sun God and agricultural bounties.',
        approximateMonth: 'January',
        image: 'https://images.unsplash.com/photo-1611095973763-414019e72400?w=800&q=80'
      },
      {
        name: 'Ganesh Chaturthi',
        description: 'Grand celebration welcoming Lord Ganesha with handmade clay idols and decorative pandals.',
        approximateMonth: 'August / September',
        image: 'https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?w=800&q=80'
      },
      {
        name: 'Durga Puja',
        description: 'Spectacular Bengali festival celebrating Divine Motherhood, craftsmanship, and culture.',
        approximateMonth: 'September / October',
        image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80'
      },
      {
        name: 'Ugadi / Gudi Padwa',
        description: 'Traditional lunar new year celebrated across Deccan India with festive torans and treats.',
        approximateMonth: 'March / April',
        image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800&q=80'
      },
      {
        name: 'Christmas & Winter Festivities',
        description: 'Handmade wooden nativity ornaments, paper-mache bells, and regional artisan gifts.',
        approximateMonth: 'December',
        image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&q=80'
      }
    ]);

    console.log('[Seed Script] Creating Regions...');
    await Region.create([
      {
        state: 'Andhra Pradesh',
        district: 'Krishna',
        townVillage: 'Kondapalli',
        craftHeritage: 'Kondapalli Bommalu & Etikoppaka Lacquer Toys',
        description: 'Famous for 400-year-old light softwood toy carving using Tella Poniki wood and vegetable colors.',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80'
      },
      {
        state: 'Rajasthan',
        district: 'Jaipur',
        townVillage: 'Kot Jewar',
        craftHeritage: 'Jaipur Blue Pottery & Hand Block Printing',
        description: 'Renowned for Egyptian paste-glazed blue pottery and royal court crafts of the Pink City.',
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80'
      },
      {
        state: 'West Bengal',
        district: 'Bankura',
        townVillage: 'Bishnupur',
        craftHeritage: 'Bankura Terracotta Horses & Dokra Bell Metal',
        description: 'Home of the iconic elongated-ear terracotta horses and ancient non-ferrous lost-wax metal craft.',
        image: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=800&q=80'
      },
      {
        state: 'Karnataka',
        district: 'Ramanagara',
        townVillage: 'Channapatna',
        craftHeritage: 'Channapatna Lacquer Woodware & Toys',
        description: 'Celebrated as Gombegala Ooru (Toy Town), known for smooth organic wooden toys tinted with turmeric and indigo.',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80'
      },
      {
        state: 'Uttar Pradesh',
        district: 'Varanasi',
        townVillage: 'Ramnagar',
        craftHeritage: 'Banarasi Zari Brocade & Wooden Lacquerware',
        description: 'Ancient sacred spiritual center famed for rich gold and silver thread brocade and turned wood idols.',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80'
      },
      {
        state: 'Tamil Nadu',
        district: 'Thanjavur',
        townVillage: 'Thanjavur',
        craftHeritage: 'Thanjavur Bobblehead Dolls & Gold Foil Paintings',
        description: 'Historic cultural capital renowned for roly-poly dancing dolls and 22-carat gold foil relief paintings.',
        image: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=800&q=80'
      }
    ]);

    console.log('[Seed Script] Creating Products...');

    const products = await Product.create([
      {
        name: 'Handcrafted Kondapalli Raja-Rani Dancing Dolls',
        description: 'Exquisitely hand-carved dancing king and queen dolls with delicate balancing heads. Made from sustainably sourced Tella Poniki softwood and painted with non-toxic natural water-based pigments.',
        price: 1850,
        originalPrice: 2200,
        images: [
          'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80',
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80'
        ],
        artisan: artisanProfile1._id,
        artisanUser: artisanUser1._id,
        category: categories[0]._id, // Wooden Crafts
        categoryName: categories[0].name,
        festival: festivals[1]._id, // Sankranti
        festivalName: festivals[1].name,
        state: 'Andhra Pradesh',
        district: 'Krishna',
        townVillage: 'Kondapalli',
        craftType: 'Softwood Carving & Natural Pigments',
        claimedOrigin: 'Kondapalli Village, Krishna District, Andhra Pradesh',
        originVerificationStatus: 'INDEPENDENTLY_VERIFIED',
        originVerificationDetails: 'Verified under Andhra Pradesh State Handicrafts Development Corporation Artisan Registry.',
        stock: 12,
        isMadeToOrder: false,
        preparationTimeDays: 2,
        estimatedDispatchDays: 4,
        approvalStatus: 'APPROVED',
        approvedAt: new Date(),
        isActive: true,
        ratingAverage: 4.9,
        numReviews: 14
      },
      {
        name: 'Traditional Terracotta Hand-Poured Diwali Diyas (Set of 12)',
        description: 'Authentic riverbed clay diyas hand-molded on the traditional potters wheel, kiln-fired at optimal temperatures and finished with organic geru terracotta wash. Ideal for festive illumination and temple poojas.',
        price: 499,
        originalPrice: 650,
        images: [
          'https://images.unsplash.com/photo-1605007493699-ce65834f8a00?w=800&q=80',
          'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800&q=80'
        ],
        artisan: artisanProfile3._id,
        artisanUser: artisanUser3._id,
        category: categories[1]._id, // Terracotta
        categoryName: categories[1].name,
        festival: festivals[0]._id, // Diwali
        festivalName: festivals[0].name,
        state: 'West Bengal',
        district: 'Bankura',
        townVillage: 'Bishnupur',
        craftType: 'Wheel-Thrown Terracotta Earthenware',
        claimedOrigin: 'Bishnupur Clay Potter Cluster, Bankura, West Bengal',
        originVerificationStatus: 'INDEPENDENTLY_VERIFIED',
        originVerificationDetails: 'Verified master potter cluster documentation on file with FestiveRoots regional coordinators.',
        stock: 45,
        isMadeToOrder: false,
        preparationTimeDays: 1,
        estimatedDispatchDays: 3,
        approvalStatus: 'APPROVED',
        approvedAt: new Date(),
        isActive: true,
        ratingAverage: 4.8,
        numReviews: 28
      },
      {
        name: 'Jaipur Persian Floral Cobalt Blue Pottery Decorative Plate (10")',
        description: 'Mesmerizing cobalt blue and turquoise hand-painted ceramic decorative wall plate featuring Mughal botanical motifs. Formed without clay from ground quartz stone, Fuller’s earth, and katira gond.',
        price: 1650,
        originalPrice: 1950,
        images: [
          'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80',
          'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80'
        ],
        artisan: artisanProfile2._id,
        artisanUser: artisanUser2._id,
        category: categories[1]._id, // Terracotta / Clayware
        categoryName: categories[1].name,
        festival: festivals[0]._id, // Diwali
        festivalName: festivals[0].name,
        state: 'Rajasthan',
        district: 'Jaipur',
        townVillage: 'Kot Jewar',
        craftType: 'Quartz-Paste Glazed Blue Pottery',
        claimedOrigin: 'Kot Jewar Blue Pottery Artisan Guild, Jaipur, Rajasthan',
        originVerificationStatus: 'INDEPENDENTLY_VERIFIED',
        originVerificationDetails: 'Verified geographic GI cluster origin inspected by Rajasthan Craft Council representatives.',
        stock: 8,
        isMadeToOrder: true,
        preparationTimeDays: 5,
        estimatedDispatchDays: 7,
        approvalStatus: 'APPROVED',
        approvedAt: new Date(),
        isActive: true,
        ratingAverage: 5.0,
        numReviews: 9
      },
      {
        name: 'Ancient Dokra Lost-Wax Cast Bell Metal Elephant Figurine',
        description: 'Cast using the 4,000-year-old cire-perdue (lost wax) metal casting technique. Each piece is unique, featuring ornate concentric brass wirework patterns that symbolize royal strength and blessing.',
        price: 2450,
        originalPrice: 2899,
        images: [
          'https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?w=800&q=80',
          'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=800&q=80'
        ],
        artisan: artisanProfile3._id,
        artisanUser: artisanUser3._id,
        category: categories[4]._id, // Metal Crafts
        categoryName: categories[4].name,
        festival: festivals[2]._id, // Ganesh Chaturthi
        festivalName: festivals[2].name,
        state: 'West Bengal',
        district: 'Bankura',
        townVillage: 'Bikna',
        craftType: 'Lost-Wax Hollow Cast Bell Metal',
        claimedOrigin: 'Bikna Dokra Shilpa Samity, Bankura, West Bengal',
        originVerificationStatus: 'INDEPENDENTLY_VERIFIED',
        originVerificationDetails: 'Certified under National Awardee Dokra cooperative directory.',
        stock: 6,
        isMadeToOrder: false,
        preparationTimeDays: 3,
        estimatedDispatchDays: 6,
        approvalStatus: 'APPROVED',
        approvedAt: new Date(),
        isActive: true,
        ratingAverage: 4.9,
        numReviews: 12
      },
      {
        name: 'Handcrafted Kondapalli Dasavatara Ten Avatar Deity Set',
        description: 'Complete sacred ten incarnations of Lord Vishnu hand-carved in miniature scale by hereditary artisans. Treated with organic tamarind seed paste and vivid colors, cherished for Bommala Koluvu celebrations.',
        price: 3600,
        originalPrice: 4200,
        images: [
          'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=800&q=80',
          'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80'
        ],
        artisan: artisanProfile1._id,
        artisanUser: artisanUser1._id,
        category: categories[0]._id, // Wooden Crafts
        categoryName: categories[0].name,
        festival: festivals[4]._id, // Ugadi
        festivalName: festivals[4].name,
        state: 'Andhra Pradesh',
        district: 'Krishna',
        townVillage: 'Kondapalli',
        craftType: 'Sacred Softwood Toy Carving',
        claimedOrigin: 'Kondapalli, Krishna District, Andhra Pradesh',
        originVerificationStatus: 'INDEPENDENTLY_VERIFIED',
        originVerificationDetails: 'Authentic Kondapalli craft community record verified.',
        stock: 4,
        isMadeToOrder: true,
        preparationTimeDays: 7,
        estimatedDispatchDays: 9,
        approvalStatus: 'APPROVED',
        approvedAt: new Date(),
        isActive: true,
        ratingAverage: 4.7,
        numReviews: 7
      },
      {
        name: 'Bankura Terracotta Sacred Horse Figurine (12" Pair)',
        description: 'The world-famous Bankura terracotta horse with erect ears and arched neck, traditionally placed under sacred banyan groves in rural Bengal. High-fired red clay finished with subtle textured incisions.',
        price: 1450,
        originalPrice: 1750,
        images: [
          'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=800&q=80'
        ],
        artisan: artisanProfile3._id,
        artisanUser: artisanUser3._id,
        category: categories[1]._id, // Terracotta
        categoryName: categories[1].name,
        festival: festivals[3]._id, // Durga Puja
        festivalName: festivals[3].name,
        state: 'West Bengal',
        district: 'Bankura',
        townVillage: 'Panchmura',
        craftType: 'Panchmura Terracotta Sculpting',
        claimedOrigin: 'Panchmura Village, Bankura, West Bengal',
        originVerificationStatus: 'INDEPENDENTLY_VERIFIED',
        originVerificationDetails: 'Panchmura Geographical Indication cluster verification verified.',
        stock: 15,
        isMadeToOrder: false,
        preparationTimeDays: 2,
        estimatedDispatchDays: 4,
        approvalStatus: 'APPROVED',
        approvedAt: new Date(),
        isActive: true,
        ratingAverage: 4.8,
        numReviews: 16
      },
      {
        name: 'Jaipur Blue Pottery Ceramic Oil Diffuser & Aroma Burner',
        description: 'Hand-pierced ceramic aroma burner adorned with traditional indigo flower and vine tracery. Creates an enchanting play of light while diffusing floral festive oils such as mogra and sandalwood.',
        price: 890,
        originalPrice: 1100,
        images: [
          'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80'
        ],
        artisan: artisanProfile2._id,
        artisanUser: artisanUser2._id,
        category: categories[2]._id, // Festive Decor
        categoryName: categories[2].name,
        festival: festivals[0]._id, // Diwali
        festivalName: festivals[0].name,
        state: 'Rajasthan',
        district: 'Jaipur',
        townVillage: 'Kot Jewar',
        craftType: 'Hand-Pierced Glazed Pottery',
        claimedOrigin: 'Jaipur, Rajasthan',
        originVerificationStatus: 'DECLARED_BY_ARTISAN',
        originVerificationDetails: 'Crafted at Meera Devi Studio; verified batch production.',
        stock: 20,
        isMadeToOrder: false,
        preparationTimeDays: 2,
        estimatedDispatchDays: 4,
        approvalStatus: 'APPROVED',
        approvedAt: new Date(),
        isActive: true,
        ratingAverage: 4.6,
        numReviews: 8
      },
      {
        name: 'Etikoppaka Hand-Turned Lacquer Festive Kumkum & Sindoor Box',
        description: 'Smooth wooden sindoor container turned on traditional hand-lathes from Ankudu softwood. Colored with natural non-toxic shellac and tree resins for sacred married blessings.',
        price: 550,
        originalPrice: 699,
        images: [
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80'
        ],
        artisan: artisanProfile1._id,
        artisanUser: artisanUser1._id,
        category: categories[0]._id, // Wooden Crafts
        categoryName: categories[0].name,
        festival: festivals[4]._id, // Ugadi
        festivalName: festivals[4].name,
        state: 'Andhra Pradesh',
        district: 'Visakhapatnam',
        townVillage: 'Etikoppaka',
        craftType: 'Lac-Turned Woodcraft',
        claimedOrigin: 'Etikoppaka Village, Andhra Pradesh',
        originVerificationStatus: 'DECLARED_BY_ARTISAN',
        originVerificationDetails: 'Artisan cooperative self-declaration on file.',
        stock: 30,
        isMadeToOrder: false,
        preparationTimeDays: 1,
        estimatedDispatchDays: 3,
        approvalStatus: 'APPROVED',
        approvedAt: new Date(),
        isActive: true,
        ratingAverage: 4.9,
        numReviews: 11
      },
      // Pending Approval demonstration product
      {
        name: 'Handwoven Chanderi Festive Silk Dupatta with Gold Butis',
        description: 'Glistening handloom dupatta woven on pit looms with sheer silk-cotton blend and shimmering zari butis. Freshly submitted by new artisan collective; pending quality audit.',
        price: 2100,
        originalPrice: 2600,
        images: [
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80'
        ],
        artisan: artisanProfile1._id,
        artisanUser: artisanUser1._id,
        category: categories[3]._id, // Traditional Handlooms
        categoryName: categories[3].name,
        festival: festivals[0]._id, // Diwali
        festivalName: festivals[0].name,
        state: 'Madhya Pradesh',
        district: 'Ashoknagar',
        townVillage: 'Chanderi',
        craftType: 'Pit-Loom Zari Weaving',
        claimedOrigin: 'Chanderi, Madhya Pradesh',
        originVerificationStatus: 'DECLARED_BY_ARTISAN',
        originVerificationDetails: 'Self-declared origin submitted with sample photograph.',
        stock: 5,
        isMadeToOrder: true,
        preparationTimeDays: 6,
        estimatedDispatchDays: 8,
        approvalStatus: 'PENDING',
        isActive: true
      }
    ]);

    console.log('[Seed Script] Creating a Completed Sample Order & Fulfilment...');
    const sampleOrderNumber = 'FR-DEMO-2026-9081';
    const sampleOrder = await Order.create({
      orderNumber: sampleOrderNumber,
      customer: customerUser._id,
      customerName: customerUser.name,
      customerEmail: customerUser.email,
      customerPhone: customerUser.phone,
      shippingAddress: customerUser.address,
      orderItems: [
        {
          product: products[0]._id,
          name: products[0].name,
          image: products[0].images[0],
          price: products[0].price,
          quantity: 1,
          artisan: artisanProfile1._id,
          artisanName: artisanProfile1.businessName,
          craftType: products[0].craftType
        },
        {
          product: products[1]._id,
          name: products[1].name,
          image: products[1].images[0],
          price: products[1].price,
          quantity: 2,
          artisan: artisanProfile3._id,
          artisanName: artisanProfile3.businessName,
          craftType: products[1].craftType
        }
      ],
      paymentMethod: 'ONLINE_DEMO',
      paymentStatus: 'PAID',
      paymentDetails: {
        transactionId: 'TXN-DEMO-SEED-8899',
        gateway: 'FestiveRoots Simulated UPI',
        paidAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      },
      subtotal: products[0].price * 1 + products[1].price * 2,
      deliveryCharge: 0,
      totalAmount: products[0].price * 1 + products[1].price * 2,
      overallStatus: 'DELIVERED',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    });

    // Fulfilment 1: Artisan 1
    const f1 = await Fulfilment.create({
      order: sampleOrder._id,
      orderNumber: sampleOrder.orderNumber,
      artisan: artisanProfile1._id,
      artisanUser: artisanUser1._id,
      items: [sampleOrder.orderItems[0]],
      subtotal: products[0].price * 1,
      fulfilmentStatus: 'DELIVERED',
      simulatedTrackingCode: 'FR-SHIP-KONDAPALLI-01',
      trackingHistory: [
        { status: 'AWAITING_ARTISAN_CONFIRMATION', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), note: 'Order assigned to workshop.' },
        { status: 'CONFIRMED', timestamp: new Date(Date.now() - 4.5 * 24 * 60 * 60 * 1000), note: 'Artisan confirmed softwood inventory availability.' },
        { status: 'PREPARING', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), note: 'Carefully applying hand-painted lacquer finish.' },
        { status: 'READY_FOR_COLLECTION', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), note: 'Packed in eco-friendly protective box.' },
        { status: 'SHIPPED', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), note: 'Dispatched from Kondapalli cluster.' },
        { status: 'DELIVERED', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), note: 'Delivered safely to Hyderabad address.' }
      ]
    });

    // Fulfilment 2: Artisan 3
    const f2 = await Fulfilment.create({
      order: sampleOrder._id,
      orderNumber: sampleOrder.orderNumber,
      artisan: artisanProfile3._id,
      artisanUser: artisanUser3._id,
      items: [sampleOrder.orderItems[1]],
      subtotal: products[1].price * 2,
      fulfilmentStatus: 'DELIVERED',
      simulatedTrackingCode: 'FR-SHIP-BANKURA-02',
      trackingHistory: [
        { status: 'AWAITING_ARTISAN_CONFIRMATION', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), note: 'Order assigned to Bankura pottery workshop.' },
        { status: 'CONFIRMED', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), note: 'Artisan checked diya batch.' },
        { status: 'SHIPPED', timestamp: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000), note: 'Dispatched via regional parcel.' },
        { status: 'DELIVERED', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), note: 'Delivered to customer.' }
      ]
    });

    sampleOrder.orderItems[0].fulfilmentId = f1._id;
    sampleOrder.orderItems[1].fulfilmentId = f2._id;
    await sampleOrder.save();

    console.log('[Seed Script] Creating a Verified Purchase Customer Review...');
    await Review.create({
      product: products[0]._id,
      user: customerUser._id,
      userName: customerUser.name,
      order: sampleOrder._id,
      rating: 5,
      title: 'Remarkable craftsmanship and authenticity!',
      comment: 'The Kondapalli dolls are stunning! You can tell immediately they are genuine handmade crafts with natural dyes. The delicate head movement works like a charm. Wonderful packaging and speedy delivery.',
      isVerifiedPurchase: true
    });

    console.log('[Seed Script] Seeding successfully completed!');
    console.log('----------------------------------------------------');
    console.log('DEMO CREDENTIALS:');
    console.log('1. Admin:    admin@festiveroots.com       / Admin@123');
    console.log('2. Artisan:  ramesh.kondapalli@festiveroots.com / Artisan@123');
    console.log('3. Artisan:  meera.jaipur@festiveroots.com      / Artisan@123');
    console.log('4. Customer: priya.sharma@example.com     / Customer@123');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Script Error]:', error);
    process.exit(1);
  }
};

seedData();
