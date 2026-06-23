import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    axios.get(`${API}/products`).then(res => {
      setFeaturedProducts(res.data.slice(0, 6));
    }).catch(() => {});
  }, []);

  return (
    <main style={{ marginTop: 80 }}>
      {/* Hero Section */}
      <section className="section hero" id="hero-section">
        <div className="hero-content section-inner">
          <div className="hero-text">
            <h1 className="text-display-lg" style={{ marginBottom: 24, color: 'var(--color-on-background)' }}>
              Empowering Local Hands, <br />
              <span className="text-primary italic">Celebrating Indian Craft.</span>
            </h1>
            <p className="text-body-lg" style={{ color: 'var(--color-on-surface-variant)', marginBottom: 40, maxWidth: 520 }}>
              Discover unique handmade products directly from India's master artisans. Bridging the gap between heritage and the modern marketplace.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              <Link to="/marketplace" className="btn btn-primary btn-lg" id="shop-now-btn" style={{ boxShadow: 'var(--shadow-md)' }}>
                Shop Now
              </Link>
              <Link to="/register" className="btn btn-secondary-outline btn-lg" id="start-selling-btn">
                Start Selling
              </Link>
            </div>
          </div>

          <div className="hero-image">
            <div className="hero-image-box">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAndF1kRpqqXBBhS-ImefugcDp8zXj3MdRBIgGPE5F4wGwKTUqgFQZN32z66w9wfng03kBp1pQMWVRy1kOFaqTNrpFWIcs1Z0-6LyH_caqAug9ZN2R6sZN0TiQedakCUUnqM5HMPInCH6VAvbDqqXdqG4HOrOjmFwHitotJotrbpgjegZnv2nsP7Z97fdMS7WCn4LnPXmEEkbZOwiK2SBoQjb3D0onRwdIljrFHGEdfTFd10xc-OpcW6fI28WROIhcBy76DfmrGXfk"
                alt="Master artisan hands working on traditional Indian textile"
              />
            </div>
            <div className="hero-badge">
              <div className="hero-badge-icon">
                <span className="material-symbols-outlined filled">verified</span>
              </div>
              <div>
                <p className="text-label-md">Verified Artisans</p>
                <p className="text-caption" style={{ color: 'var(--color-on-surface-variant)' }}>1,200+ Master Craftsmen</p>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-accent"></div>
      </section>

      {/* Explore Heritage - Bento Grid */}
      <section className="section section-bg-low" id="categories-section">
        <div className="section-inner">
          <div style={{ marginBottom: 48 }}>
            <h2 className="text-headline-lg" style={{ marginBottom: 16 }}>Explore Heritage</h2>
            <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
              Handpicked categories showcasing the finest of Indian craftsmanship.
            </p>
          </div>

          <div className="bento-grid">
            <Link to="/marketplace?category=Textiles" className="bento-item bento-large" id="cat-textiles">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCemNZN0B3kwK9Rgm0T37Y2U9Vxie1a7_kvAMjM7W0cMAkSiJaNFRlVynlYfzfgipgryy4dQkuryAKEtNs_wWUP445aYKsGn43Q7rA-GWQxLrjJaFyTmDTDyOT32fPuQ21FiJCFi6t_kVHQscb1_JRhXOoQ-Owcqdt8HH5YOWEYTrLxYUQfzmULmqti4VITXqHYBGP8y88nnwiOlRIu7bHw7FcGL3bvzmCE6K5gMWjE3K3vdX_yx9YcZTqk7vjTkj3-m6g2jiQgLr4" alt="Hand-woven Textiles" />
              <div className="bento-overlay">
                <span className="bento-tag text-label-md">Heritage Craft</span>
                <h3 className="text-headline-md">Hand-woven Textiles</h3>
              </div>
            </Link>

            <Link to="/marketplace?category=Pottery" className="bento-item" id="cat-pottery">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvOcJE5TXZg-Om4dUtOVWu1oRxppLVtZOyKrRwcUS1nS8h7vxaTlmi0uvVNDco9bVRsio8HlfNBm1gq9IBMgioYVS2_vsrmu-bQcRvEbmMMHeyqJgnkKkD5_sA32EG_vTtKJusn7-BGmNbJYmsHNGiY-OA9hgG2Rd4XizY0BozX7G7br_r0DTV8JZnbsqYnqAXq21XDGICkByigG1s4r8FS4P2u-UQYJB0ClsR7S8jmQhHWsSwde33gymGmKdrG3mBPm86tvVDjJo" alt="Terracotta Pottery" />
              <div className="bento-overlay">
                <h3 className="text-label-md">Terracotta Pottery</h3>
              </div>
            </Link>

            <Link to="/marketplace?category=Paintings" className="bento-item" id="cat-paintings">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaWi46FsoASleiN7VtVIO1bwHRk4hoTNECFlPjShaID0wXkqZUFeq1ZME-eLRW5m-aYdoBuPmvDv48sU-2rdUTKp0rOCjw5yCMfh-JZRP86ayHzhVJWranEPmsFETOoLGKvnWSZljskm5iSPmuvJfqsLf489NpW2AJebmCi7XEfE9gZ5bdosIUiFWJHsyWD_rN7rvbfLA_C54DDANRijR7T89KnbEKs5aZpNXKDsAi4BFGXqsjzicxl4eGavyr2DBc21Qz-Zcharc" alt="Hand-painted Art" />
              <div className="bento-overlay">
                <h3 className="text-label-md">Hand-painted Art</h3>
              </div>
            </Link>

            <Link to="/marketplace?category=Woodwork" className="bento-item bento-wide" id="cat-woodwork">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDhF8SrTZDo2msZbaoCJ6mx5XQrNE5JbXSdVNdDSnasYBw1JvE3_EWZBEQeDK_Ig7UwJgrHaNPRi68QC0_NiQawreesMnR6fvBpvzqwNlA21Yysr9RmGS1nSqmSsT68uEPjcTFcyxrl1k4FiLCMIapIUQa_9EY8Wx_ZBZXaIakE58cq1_iC0Jhokxc-1Cktj5J2XQ2-sAl5D0N1q_8QeS9vcyIxqGplf8nATS1ncGaunhN9NDdaYlHfbqpjSURLehDUt78CpXWyVU" alt="Intricate Woodwork" />
              <div className="bento-overlay">
                <h3 className="text-headline-md">Intricate Woodwork</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section" id="how-it-works">
        <div className="section-inner">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 className="text-headline-lg" style={{ marginBottom: 16 }}>Empowering the Artisan Path</h2>
            <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)', maxWidth: 640, margin: '0 auto' }}>
              Connecting you directly with the source of India's finest crafts through a transparent and ethical marketplace.
            </p>
          </div>

          <div className="grid-3">
            <div className="hiw-card" id="hiw-discover">
              <div className="hiw-icon" style={{ background: 'var(--color-primary-fixed)', color: 'var(--color-on-primary-fixed)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 28 }}>search</span>
              </div>
              <h3 className="text-headline-md" style={{ marginBottom: 12 }}>Discover</h3>
              <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
                Browse our curated collection of verified authentic crafts from diverse regions of India.
              </p>
            </div>

            <div className="hiw-card" id="hiw-connect">
              <div className="hiw-icon" style={{ background: 'var(--color-secondary-fixed)', color: 'var(--color-on-secondary-fixed, #002116)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 28 }}>handshake</span>
              </div>
              <h3 className="text-headline-md" style={{ marginBottom: 12 }}>Connect</h3>
              <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
                Learn the story behind every piece and connect directly with the master artisan who created it.
              </p>
            </div>

            <div className="hiw-card" id="hiw-support">
              <div className="hiw-icon" style={{ background: 'var(--color-tertiary-fixed)', color: 'var(--color-on-tertiary-fixed, #390c00)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 28 }}>volunteer_activism</span>
              </div>
              <h3 className="text-headline-md" style={{ marginBottom: 12 }}>Support</h3>
              <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
                Your purchase provides fair wages and ensures the survival of ancient craft traditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section" id="services">
        <div className="section-inner">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 className="text-headline-lg" style={{ marginBottom: 16 }}>Custom Services & Repairs</h2>
            <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)', maxWidth: 640, margin: '0 auto' }}>
              Need something custom made or repaired? Book our expert artisans for personalized services directly through the platform.
            </p>
          </div>
          <div className="grid-3">
            <div className="card">
              <div className="card-body" style={{ textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 32 }}>cut</span>
                </div>
                <h3 className="text-headline-md" style={{ marginBottom: 12 }}>Custom Tailoring</h3>
                <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)', marginBottom: 24 }}>Get traditional garments stitched to your exact measurements by local master tailors.</p>
                <Link to="/marketplace?tab=services" className="btn btn-secondary-outline">Book Service</Link>
              </div>
            </div>
            <div className="card">
              <div className="card-body" style={{ textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, background: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 32 }}>build</span>
                </div>
                <h3 className="text-headline-md" style={{ marginBottom: 12 }}>Shoe Repair</h3>
                <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)', marginBottom: 24 }}>Restore your favorite footwear with authentic cobbler services using high-quality leather.</p>
                <Link to="/marketplace?tab=services" className="btn btn-secondary-outline">Book Service</Link>
              </div>
            </div>
            <div className="card">
              <div className="card-body" style={{ textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, background: 'var(--color-tertiary-container)', color: 'var(--color-on-tertiary-container)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 32 }}>format_paint</span>
                </div>
                <h3 className="text-headline-md" style={{ marginBottom: 12 }}>Custom Artwork</h3>
                <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)', marginBottom: 24 }}>Commission personalized paintings, pottery, or woodwork directly from the artists.</p>
                <Link to="/marketplace?tab=services" className="btn btn-secondary-outline">Book Service</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Master Artisans */}
      <section className="section section-bg-container" id="artisans-section">
        <div className="section-inner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
            <div>
              <h2 className="text-headline-lg" style={{ marginBottom: 8 }}>Master Artisans</h2>
              <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>Meet the creators behind the magic.</p>
            </div>
            <a href="#" style={{ display: 'none', alignItems: 'center', gap: 8, color: 'var(--color-primary)', fontWeight: 600, fontSize: 14 }} className="md-flex">
              View All Artisans <span className="material-symbols-outlined">arrow_forward</span>
            </a>
          </div>

          <div className="grid-3">
            {[
              {
                name: 'Ananya Sharma', badge: 'Terracotta Expert', quote: '"Preserving the clay traditions of West Bengal for three generations."',
                sales: '850+', rating: '4.9',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBz3A1EmVaS2PctdS3uyQRR7lvOqKGqAjVjXpsqBXPD0MQu7BU1upilOJqP4wzrSYzrU4uXyEAxaLoTaHuEA3329qQIsnn57lLzdJG1vz4pY5UxJEMIEnUi11xyqfOkpbv_gYceJe6GAKQ8fac6QCz8I4mX9fK5kRYkiQuGEL9aTjtqR8mpU9m70Q1E2WbNBhqHyo3Nzx0Rj_Htsk4-NjW1IPwA36fl-SgZuJBURf1GjDfu_TBWhSgyW_ZiAEQU8jj95KwbEO3xrn4'
              },
              {
                name: 'Rajesh Kumar', badge: 'Master Woodworker', quote: '"Bringing Saharanpur\'s heritage of wood carving to the digital world."',
                sales: '1,200+', rating: '5.0',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZlV1vXzQ71iMO4G2ZNbRarGV-hlCTUC2W5puZYhFFde-cm7lsfYcSqw2gzOGoK68M4yupSl7nyC1vzFEAaogYe45voSY9jFvlKPuV5N_67GQHJTWWEujF8k7clfDrdUEbUpSB3YFKxVfsGMyP2y8V9JlPXHGAyKFYZncx9Y4Rv6sp4O6cuFDc_dgAfNgPITqK4EaTHKgIC3JUXNkvYTXYHo1P_YyvIAFpyADDdtQk385dYMCmz5ISqtQpAej1TB4DFIz4JptoNgs'
              },
              {
                name: 'Meera Devi', badge: 'Mithila Artist', quote: '"Painting the folklore of Bihar on modern canvases."',
                sales: '420+', rating: '4.8',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIsW0b0e0I128hR47H2AxYNbmR6rY6BIuENfzwuk1ry5ebqsA4PHZo3oLg-bIPOixGsLsp_NTguCJs-jy1WNc8QoqHb7CWHG3TQ0u8pvPDEx-vJ3ABCmy3fbTG5X6LX5v7RoAfsxnF3aWc4w3z40p52j2ohO09CfHoZxWdAS687fO9EoFx4WYChIqpf2DpYC3uI5ckLExruQaqn46LG1x_HyR9R67PzRyD_fCXvtscDyz5rD3aJ2NqS5RiJ8tYwurxMEUzzQlhIOw'
              }
            ].map((artisan, i) => (
              <div className="artisan-card" key={i} id={`artisan-card-${i}`}>
                <div className="artisan-header">
                  <div className="avatar-xl">
                    <img src={artisan.img} alt={artisan.name} />
                  </div>
                  <div>
                    <h4 className="text-headline-md">{artisan.name}</h4>
                    <span className="badge badge-category">{artisan.badge}</span>
                  </div>
                </div>
                <p className="text-body-md italic" style={{ color: 'var(--color-on-surface-variant)', marginBottom: 24 }}>
                  {artisan.quote}
                </p>
                <div className="artisan-footer">
                  <div>
                    <p className="text-caption" style={{ color: 'var(--color-on-surface-variant)' }}>Sales</p>
                    <p className="text-label-md text-primary">{artisan.sales}</p>
                  </div>
                  <div>
                    <p className="text-caption" style={{ color: 'var(--color-on-surface-variant)' }}>Rating</p>
                    <div style={{ display: 'flex', alignItems: 'center', color: 'var(--color-primary-container)' }}>
                      <span className="material-symbols-outlined filled" style={{ fontSize: 14 }}>star</span>
                      <span className="text-label-md" style={{ marginLeft: 4 }}>{artisan.rating}</span>
                    </div>
                  </div>
                  <button className="text-label-md text-secondary" style={{ cursor: 'pointer' }}>View Shop</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section" id="our-story">
        <div className="section-inner" style={{ display: 'flex', flexDirection: 'column', gap: 48, alignItems: 'center' }}>
          <div style={{ textAlign: 'center', maxWidth: 800 }}>
            <h2 className="text-headline-lg" style={{ marginBottom: 24 }}>Our Story</h2>
            <p className="text-body-lg" style={{ color: 'var(--color-on-surface-variant)', marginBottom: 24, lineHeight: 1.8 }}>
              HunarHub was born from a simple observation: India's rich heritage of craftsmanship was slowly fading as local artisans struggled to reach modern consumers. The master weavers, potters, cobblers, and tailors who hold generations of knowledge were being left behind in the digital age.
            </p>
            <p className="text-body-lg" style={{ color: 'var(--color-on-surface-variant)', lineHeight: 1.8 }}>
              We built this platform to bridge that gap. By providing micro-entrepreneurs with a direct, transparent connection to global buyers, we are ensuring that traditional skills are not just preserved, but empowered to thrive. Every purchase or service booked here directly supports an artisan's livelihood and family.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', padding: '24px 48px', background: 'var(--color-surface-container-low)', borderRadius: 'var(--radius-xl)' }}>
              <h3 className="text-display-lg text-primary">1.2k+</h3>
              <p className="text-label-md">Artisans Empowered</p>
            </div>
            <div style={{ textAlign: 'center', padding: '24px 48px', background: 'var(--color-surface-container-low)', borderRadius: 'var(--radius-xl)' }}>
              <h3 className="text-display-lg text-primary">₹5M+</h3>
              <p className="text-label-md">Generated for Creators</p>
            </div>
            <div style={{ textAlign: 'center', padding: '24px 48px', background: 'var(--color-surface-container-low)', borderRadius: 'var(--radius-xl)' }}>
              <h3 className="text-display-lg text-primary">15+</h3>
              <p className="text-label-md">Crafts Preserved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section" id="cta-section">
        <div className="section-inner">
          <div className="cta-section">
            <div className="cta-inner">
              <h2 className="text-display-lg" style={{ marginBottom: 24 }}>Become part of the craft revolution.</h2>
              <p className="text-body-lg" style={{ marginBottom: 40, opacity: 0.9 }}>
                Join our newsletter to receive artisan stories, early access to new collections, and exclusive discounts.
              </p>
              <div className="cta-input-row">
                <input className="cta-input" type="email" placeholder="Enter your email" id="newsletter-email" />
                <button className="cta-btn" id="newsletter-subscribe">Subscribe</button>
              </div>
            </div>
            <div className="cta-blur-1"></div>
            <div className="cta-blur-2"></div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
