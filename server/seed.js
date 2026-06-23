const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Product = require('./models/Product');
const Review = require('./models/Review');
const Order = require('./models/Order');
const Category = require('./models/Category');
const ServiceRequest = require('./models/ServiceRequest');

const connectDB = require('./config/db');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Review.deleteMany({});
    await Order.deleteMany({});
    await Category.deleteMany({});
    await ServiceRequest.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@hunarhub.com',
      password: 'password123',
      role: 'admin',
      avatar: '',
      city: 'New Delhi',
    });

    console.log('🔑 Created admin user');

    // Create sellers (with entrepreneur fields)
    const seller1 = await User.create({
      name: 'Kala Devi',
      email: 'kala@hunarhub.com',
      password: 'password123',
      role: 'seller',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBD6_COyY6Sn8XuG4a09pxV9TzrHrJyBVvHXIEYxfM-I5fhOP3n6dS5afzUBCf_fQaUQy8LKHX7IFhtfiDhrDlDHTTQ7ATeqYWr7foIvCZLdS70BPrCVXNnys166EqMfhALrGPinJQiLdNBJfd4q2R-azQe-ODEbZYrkrt7INaVViyfkI2DunppeT9jUed4_8KYqryI-5JP51-SyEI63E4COauF_nnMuh2gozR4G2E6Y7hMAXfnOSYXohyWOTWcUnJw9g7Z91tkpJY',
      city: 'Jaipur',
      shopName: 'Kala Kendra',
      bio: 'Preserving the clay traditions of Rajasthan for three generations.',
      skills: ['Blue Pottery', 'Terracotta', 'Ceramic Art'],
      experience: '20+ Years',
      availability: 'available',
      isApproved: true,
    });

    const seller2 = await User.create({
      name: 'Rajesh Kumar',
      email: 'rajesh@hunarhub.com',
      password: 'password123',
      role: 'seller',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZlV1vXzQ71iMO4G2ZNbRarGV-hlCTUC2W5puZYhFFde-cm7lsfYcSqw2gzOGoK68M4yupSl7nyC1vzFEAaogYe45voSY9jFvlKPuV5N_67GQHJTWWEujF8k7clfDrdUEbUpSB3YFKxVfsGMyP2y8V9JlPXHGAyKFYZncx9Y4Rv6sp4O6cuFDc_dgAfNgPITqK4EaTHKgIC3JUXNkvYTXYHo1P_YyvIAFpyADDdtQk385dYMCmz5ISqtQpAej1TB4DFIz4JptoNgs',
      city: 'Saharanpur',
      shopName: 'Kumar Woodcraft',
      bio: 'Bringing Saharanpur\'s heritage of wood carving to the digital world.',
      skills: ['Wood Carving', 'Furniture Making', 'Brass Work'],
      experience: '15+ Years',
      availability: 'available',
      isApproved: true,
    });

    // Create an unapproved seller for admin demo
    const seller3 = await User.create({
      name: 'Suman Devi',
      email: 'suman@hunarhub.com',
      password: 'password123',
      role: 'seller',
      avatar: '',
      city: 'Lucknow, UP',
      shopName: 'Chikan Craft House',
      bio: 'Traditional Chikankari embroidery artisan from Lucknow.',
      skills: ['Chikankari', 'Embroidery', 'Textile Art'],
      experience: '10+ Years',
      availability: 'available',
      isApproved: false,
    });

    const buyer = await User.create({
      name: 'Arjun Sharma',
      email: 'arjun@example.com',
      password: 'password123',
      role: 'buyer',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDz8z8mFpc-xlgMlpTPL0TRpSJgeeWupKQEyI8cYwHPnqqjwlJRwHmQSlVsrFa8U8a0mod2F2wdXNdCDW10RUCre5M6-ObpIBD74BBS2bw20CCZ7yKR1Gf3sdZ-8eE1wIY4Rjp1gGL0qMYTZYVlku3ytOx1UimS-LICr1Ceo4QDn8UUl4sdNjkYv6AlumgckvOno73ZXepOSJSPxTxVoFpKtU3pWOCmPn6UVoEgoZstSs3kKK8SENGeW02EBxNBbEbEW_g5HbRUheQ',
      city: 'New Delhi',
    });

    console.log('👥 Created users');

    // Create 5 Categories
    const categories = await Category.insertMany([
      { name: 'Cobbler', description: 'Shoe repair, leather work, and custom footwear', icon: 'steps' },
      { name: 'Potter', description: 'Pottery, ceramics, terracotta, and clay works', icon: 'palette' },
      { name: 'Tailor', description: 'Custom stitching, alterations, and garment making', icon: 'checkroom' },
      { name: 'Artisan', description: 'Handmade crafts, paintings, jewellery, and decorative arts', icon: 'brush' },
      { name: 'Vendor', description: 'General merchandise, food products, and local specialities', icon: 'storefront' },
    ]);

    console.log('📂 Created 5 categories');

    // Create 10 products
    const products = await Product.insertMany([
      {
        title: 'Hand-Carved Terracotta Vase',
        description: 'A traditional artisan-made vase from Rajasthan, featuring intricate floral patterns. Each piece is hand-carved by master potters using age-old techniques passed down through generations. This unique terracotta piece brings the warmth of the Indian desert directly into your modern home.',
        price: 1200,
        images: [
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBbvwij1tMxkacFRMUE3JIaZ6wg2jlkjzvlz262qjfElr80U3Vb474TEUaXchk7YZxXQzjyi2NDcRDCdPvx2yJQpdDw2DnvsHmFmE7uVuINRKOgLklpEtRB58QHaWMO5josszpjjaekUkuBp2QWyPuePD67yrTDxQbZgVAMYy8r23XVzD_79SazkUXhEj8s1_YwXor3QATWTCc3H2wG6-u0XGbwp3_Uw-VzRPT2DbS6XkWyjrxR19N9CFn2jLJdAxpaZngceUuNyaQ',
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDlV67swZz71HKvOyoaDNbZWRLBapph_Aak16C4XtAbMXUMxzAeBNv9RAtRCQ2rirtJUy8-huPqDPwMaNRMy42NzBE6Tib_AjTmXM3FIBiIQ_mP53Rd65ALhLZ_QOzg80R2rpVzElXYDvGqG6u9EVxvaysz-9lj-YqpWq43UI7zgO2yQ3S6-_iia4Xwx72vkeo0N5XOATJFrlY-0Qv7mG58qIN4Z5NEQniNdZrSaVUTf-n52amJvea7_HV_mUdT3U3zbjGas3vUCmY',
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDvqZ31z7v1MHLvUSj4rfG576s26Ys_y41jxmOuRzNmKS_jqHwSC6PgvXfpqX9c_nJohBlelJH9v0agsRBH3sXxtSGx-e5aX-OHvFTR72KmV6xbAA9XV1u2ZeN-8IlH3212lOkvZXZR0zUzWEP-8puRdrmSM1VyNhPXRDaufoPj0osfccsRJVZ4P7aRx0ybQA84H0Qs33PqQU7jVf-gldieMSgORYRLhHTIQkJXVu-liPPFmZDulw4b_tamNW7VjEgPjnc5-ZgJSYQ',
        ],
        category: 'Pottery',
        seller: seller1._id,
        artisanName: 'Kala Devi',
        location: 'Jaipur, Rajasthan',
        ratings: 4.8,
        numReviews: 48,
      },
      {
        title: 'Ajrakh Block-Print Silk Scarf',
        description: 'Hand-printed using traditional Ajrakh block-printing techniques from Kutch, Gujarat. Features complex geometric and floral motifs in deep indigo, created with natural dyes. A masterpiece of sustainable luxury.',
        price: 3450,
        images: [
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAtkHNqmvuplk0swkRktLgljznavyVu9sC0Ky0hGzq-qkPmAjoCWOMu9Ll1nH7_sgPcZfDVeMpv2I4--D34HOP_ZyC0RpvzYgX0NYfSwcBWdGiezS4wV9d-B1jMb6TOpdW1YsOGKk1DQ-dVCKZOhh1E6ycBUsFI9VfRGD4bdCt-C8Km79Kp7xfJabIN2r0vGWkCPb5bQQ7ea4fY0SMi0RV9GBwjRjPUM528XY-PH2kjf7CK_26RjQ17ld1s0O49vC4FE1uekZ5jmV0',
        ],
        category: 'Textiles',
        seller: seller1._id,
        artisanName: 'Ismail Khatri',
        location: 'Kutch, Gujarat',
        ratings: 4.9,
        numReviews: 32,
      },
      {
        title: 'Woven Natural Fiber Basket',
        description: 'Hand-woven basket crafted from natural reed with a unique asymmetric design. The intricate weaving pattern showcases the organic texture and precision of Manipuri artisan craftsmanship.',
        price: 850,
        images: [
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBTETI9RlRubrvv1nrhisXtgZ36QtoAYB9HxrndyIjUuhY-C5b3WQcxCldb4Awgn5WmNP5GNMYuknwUxGkxHSKs5PD8QKHfzNErUQxHvN2un3clxydk2xaJy4b2Flr1GVOSgGnQVpqbkI5-PptkQ3qxCqfODYurxpQ42X57ro0RfwrMWXcVTWCY9qaCcWlVenRtN3yvgY5stO7c7nPXqnbmX0AYYE5Uhk7Ea5FkTpb4fepzx1GzQnd_CVKBuyzbjKTyjLNN3JXVbUA',
        ],
        category: 'Home Decor',
        seller: seller2._id,
        artisanName: 'Sumi Devi',
        location: 'Manipur',
        ratings: 4.7,
        numReviews: 19,
      },
      {
        title: 'Silver-Inlaid Bidriware Jug',
        description: 'An exquisite piece of Bidriware — a black metal jug inlaid with fine silver floral patterns. The contrast between the deep matte black and the shining silver reflects centuries of Karnataka craftsmanship.',
        price: 7800,
        images: [
          'https://lh3.googleusercontent.com/aida-public/AB6AXuD3zrmbyJTuwvTMfqKdoJyKhdctInc8v-0pyzoHqbSPY3G2hivCoWYUh0fWhVdYcWJLiydcgv3jjEyYHSCWJFL8lmDdX_XQTVoL1GdRf-CRKF_DzZUaIlfInXQ1Bc-bfOye3JsEaaCptaPucLUZA_UMmMFYGNRRvXMnIRBVdHcxDltEaeFXOJFbO7dP8Q0SNjV-pW9FyFX8e6mc9ttu2b8jLiveLbj_bysaH2Jl23SG62Uz8tPttVBaX_1eJSN3HIHHJBRlhwV_8JY',
        ],
        category: 'Metal Art',
        seller: seller2._id,
        artisanName: 'Rahman Ali',
        location: 'Bidar, Karnataka',
        ratings: 5.0,
        numReviews: 27,
      },
      {
        title: "Madhubani 'Tree of Life' Art",
        description: 'A hand-painted Madhubani artwork depicting the sacred Tree of Life with intricate lines and bold natural colors. This piece celebrates Bihar\'s rich tradition of mythological storytelling through art.',
        price: 2100,
        images: [
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDm0ruJiGQaTk3MXqnQAl-fKvBZsX4t7JuY_xc3V5oPY3MZAa9DTcA08zC4F5ivYVIIgcFF-u7kCAYw_iGp6HH5ff7h1qsYo7Qc43ycgH0vFbW0NmyWNp85Sz0c6makc_IMxvBpIi5W1zM2OEwSnFlInYOOsejYRRNss5IAn4H9kqbMQrnOvLhGfGtqTjS2qS14lVupP4eltIDRMP1-j0uEz5UROzrgYYk3tAdHJg5RbDY4TfpqyP345ROYtPTDDhavv9d8vu27fME',
        ],
        category: 'Paintings',
        seller: seller1._id,
        artisanName: 'Pushpa Devi',
        location: 'Bihar',
        ratings: 4.6,
        numReviews: 15,
      },
      {
        title: 'Ceramic Turquoise Mug Set',
        description: 'A set of four hand-thrown ceramic mugs with a deep turquoise glaze and speckled texture. Each mug is uniquely shaped by master potter Ravi Prajapati from Khurja, UP.',
        price: 1550,
        images: [
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCCSrbAW7zLaQ2hhm9-9K4mMzo9UjMUTxUxYtUuxI8wDvKQ_gZLyJ555bV0V_p41MgbovnnXMm-psOyTKa9kUKSTC3lnH2AIhEzHTjr8m51tNowIeRDmbVLmjHfVER0_Eam64099eW3HmmuUOpkUUX3FrItAIpcG83CLDlAbtYsBVVHXyPy6c0iNIwRM1znGidzqVC89HxyUHzbC4o0SptLEdxdTdeZZ8rQxwIyCNE_Zn0tJSHlPKTIAeq2jYCqFH0jg3Xqn2uv25k',
        ],
        category: 'Pottery',
        seller: seller1._id,
        artisanName: 'Ravi Prajapati',
        location: 'Khurja, UP',
        ratings: 4.8,
        numReviews: 22,
      },
      {
        title: 'Jaipur Blue Pottery Vase',
        description: 'A handcrafted blue pottery vase from Jaipur featuring detailed floral cobalt blue patterns on a crisp white ceramic surface. A stunning piece that blends traditional Rajasthani art with modern home aesthetics.',
        price: 1850,
        images: [
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCPbmAK1GloU0jOMviHvTqNwws5PCAgv4eDFVrw0GQvIy9_GREytZCpHmSJ33w1uEDIfkIDXxKE0vAs7e0gsqDyPv4uTLQwRE4AbAer6T1RHaXKGZNeVvI2AzLMxJe89cT6OSpzBfU-fWkUZrmv2bbyzyFj0HZxE_MJnBf_r8uOFQVfR59Vr7hJ3gYZYl4LyHI9GZvJUAu72AiUWA-aayV9zDWanoJsHePKCIg9BEMmiY_ufSLBZqLo10r8BbUdMHZXW06VqH4vnQ4',
        ],
        category: 'Pottery',
        seller: seller1._id,
        artisanName: 'Kala Devi',
        location: 'Jaipur, Rajasthan',
        ratings: 4.9,
        numReviews: 35,
      },
      {
        title: 'Kashmiri Silk Shawl',
        description: 'A luxurious hand-embroidered silk shawl with intricate Zardosi work using golden metallic threads on deep emerald green fabric. A masterpiece from Kashmir reflecting centuries of textile heritage.',
        price: 4200,
        images: [
          'https://lh3.googleusercontent.com/aida-public/AB6AXuC7s74hMrgr5FXdM5MoiJZirq1WFOnukgFsC0zN4pq9t0qe_ySL854g8iw2FFpYzG4JM66VU6JvDAZdeFlCldM_XuTNnI9EGkgkOhbdew4dznM42pxqriXm3wXlCLh0xRY3PUL4MJF2BJCX4Tws-QzOpe1_QBZPXg68yTbdz_IRAfeIaH65BT0HXFinEq_I4bl1G_Y-Vo9lhy_zeXNYllhzpXIk56x5EToGBzca3Nh_DddnIVpT70LD7eBp_IqOLENCGpKI5tBcMaw',
        ],
        category: 'Textiles',
        seller: seller2._id,
        artisanName: 'Rajesh Kumar',
        location: 'Kashmir',
        ratings: 4.7,
        numReviews: 18,
      },
      {
        title: 'Traditional Gold Jhumka Earrings',
        description: 'Ornate gold jhumka earrings with pearl drops, handcrafted using traditional Indian techniques. The fine gold-work details reflect centuries of jewellery-making heritage.',
        price: 4200,
        images: [
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCXTgZLx3rclxpDdntxmJSllLZm-U2Y9MhGXrOjHWS_XJYK1Vu-C_80ZAFlLK5Utu71neuvnNuj49zacDQiznwRC0uq2M4Sq-bLb6RuiPOCaPteFmddtHByTzOc6wkY7ypxaIPQWu8uhMW5Mbx7p8N6zOxDHAMXC8fPvlMGyOchZcOa8YeiU4lsS_8XpTWfjRGQCkPW3bDIKguUEKebSZoni_Qa_X9we2qPVknZMfn5wNexYU-H7yZK7TSb73f-pzb91PPkRffzFVE',
        ],
        category: 'Jewellery',
        seller: seller1._id,
        artisanName: 'Meera Devi',
        location: 'Jaipur, Rajasthan',
        ratings: 4.9,
        numReviews: 41,
      },
      {
        title: 'Hand-beaten Brass Bowl',
        description: 'A hand-beaten brass bowl with warm amber glow revealing the hammered texture of the metal. Crafted in traditional style, this bowl balances Indian heritage with contemporary minimalist design.',
        price: 950,
        images: [
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCQ3bWspwvdNCEVB34Dppafm_AYpIsRx3v9Q8UMlgRGnqm1xrCOdmP0c2CzvUndo22D2V6OwvuRCN9kTj9BBEWNyHvej_St6eQfh8IOUtmz-W277aWFGHgwNEa0wEzYEy-BHOgGhnL-2cXj7CKmqFAqZGvXRJIW9HYT7ZRJzEKQru9sAO5_8Xk9jsOxhdP6FiAknSC-zHzEujIGsJlb8BZj7mJ0QRCQ6pfPIglqA_2NukO2vvM3OZZ1bDmkBNHMGubUWeO0cGsa-AI',
        ],
        category: 'Metal Art',
        seller: seller2._id,
        artisanName: 'Rajesh Kumar',
        location: 'Moradabad, UP',
        ratings: 4.5,
        numReviews: 12,
      },
    ]);

    console.log('📦 Created 10 products');

    // Create sample reviews
    await Review.insertMany([
      {
        user: buyer._id,
        product: products[0]._id,
        rating: 5,
        comment: 'The craftsmanship is absolutely breathtaking. You can feel the texture of the carving. It sits perfectly in my hallway!',
      },
      {
        user: buyer._id,
        product: products[1]._id,
        rating: 5,
        comment: 'Solid build and very authentic. It was packaged extremely well, not a single scratch on arrival. Highly recommended.',
      },
      {
        user: buyer._id,
        product: products[4]._id,
        rating: 4,
        comment: 'Beautiful piece. The floral pattern is even more detailed in person. Adds such a warm touch to the room.',
      },
    ]);

    console.log('⭐ Created sample reviews');

    // Create sample orders
    await Order.insertMany([
      {
        buyer: buyer._id,
        product: products[6]._id,
        seller: seller1._id,
        quantity: 1,
        totalPrice: 1850,
        status: 'delivered',
        shippingAddress: { address: '402, Heritage Residency', city: 'New Delhi', state: 'Delhi', pincode: '110017' },
      },
      {
        buyer: buyer._id,
        product: products[7]._id,
        seller: seller2._id,
        quantity: 1,
        totalPrice: 4200,
        status: 'shipped',
        shippingAddress: { address: '402, Heritage Residency', city: 'New Delhi', state: 'Delhi', pincode: '110017' },
      },
    ]);

    console.log('🛒 Created sample orders');

    // Create 5 sample ServiceRequests
    await ServiceRequest.insertMany([
      {
        customer: buyer._id,
        entrepreneur: seller1._id,
        category: categories[1]._id, // Potter
        description: 'Seeking approval for specialized blue pottery restoration services for a heritage collection.',
        requestedDate: new Date('2024-10-24'),
        preferredTime: 'Morning (10:00 AM - 1:00 PM)',
        location: 'Jaipur, Rajasthan',
        status: 'pending',
      },
      {
        customer: buyer._id,
        entrepreneur: seller2._id,
        category: categories[3]._id, // Artisan
        description: 'Wood carving service request for large-scale institutional furniture for a boutique hotel lobby.',
        requestedDate: new Date('2024-10-28'),
        preferredTime: 'Afternoon (2:00 PM - 5:00 PM)',
        location: 'Saharanpur, UP',
        status: 'accepted',
      },
      {
        customer: buyer._id,
        entrepreneur: seller1._id,
        category: categories[1]._id, // Potter
        description: 'Custom terracotta planters set of 12 for a rooftop garden project in New Delhi.',
        requestedDate: new Date('2024-11-05'),
        preferredTime: 'Morning (10:00 AM - 1:00 PM)',
        location: 'New Delhi',
        status: 'completed',
      },
      {
        customer: buyer._id,
        entrepreneur: seller2._id,
        category: categories[2]._id, // Tailor
        description: 'Traditional sherwani stitching with custom embroidery for a wedding function.',
        requestedDate: new Date('2024-11-15'),
        preferredTime: 'Evening (5:00 PM - 8:00 PM)',
        location: 'New Delhi',
        status: 'rejected',
      },
      {
        customer: buyer._id,
        entrepreneur: seller1._id,
        category: categories[3]._id, // Artisan
        description: 'Madhubani painting commission for office reception wall — 6ft x 4ft canvas.',
        requestedDate: new Date('2024-11-20'),
        preferredTime: 'Morning (10:00 AM - 1:00 PM)',
        location: 'New Delhi',
        status: 'pending',
      },
    ]);

    console.log('🔧 Created 5 sample service requests');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📧 Test Accounts:');
    console.log('   Admin:  admin@hunarhub.com / password123');
    console.log('   Seller: kala@hunarhub.com / password123');
    console.log('   Seller: rajesh@hunarhub.com / password123');
    console.log('   Seller (unapproved): suman@hunarhub.com / password123');
    console.log('   Buyer:  arjun@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed Error:', error);
    process.exit(1);
  }
};

seedData();
