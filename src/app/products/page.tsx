"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Heart, ArrowLeft, MapPin, Sparkles, Users, ShoppingBag } from 'lucide-react';
import Header from '../../components/homepage/header';
import Footer from '../../components/homepage/Footer';
import HeroCarousel from '../../components/ExplorePage/HeroCarousel';
import StateCard from '../../components/ExplorePage/StateCard';
import CategoryAccordion from '../../components/ExplorePage/CategoryAccordion';
import ProductDetailModal from '../../components/ExplorePage/ProductDetailModal';
import InfoModal from '../../components/ExplorePage/InfoModal';
import CategoryDetail from '../../components/ExplorePage/CategoryDetail';

const ExplorePage = () => {

  const [expandedState, setExpandedState] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState([]);
    const [showMap, setShowMap] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);
    const [heroImageIndex, setHeroImageIndex] = useState(0);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [cartOpen, setCartOpen] = useState(false);
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    
    
      const addToCart = (product) => {
        setCart([...cart, product]);
      };
      const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
      };
    
      // Hero images for the carousel
      const heroImages = [
        { src: "/images/weavers/poch.webp", alt: "Handloom artisan weaving traditional Pochampally Ikat", title: "Discover Pochampally Ikat" },
        { src: "/images/weavers/ban.webp", alt: "Artisan creating intricate Banarasi silk patterns", title: "Explore Banarasi Silk" },
        { src: "/images/weavers/muga.jpg", alt: "Golden Muga silk being woven in Assam", title: "Experience Muga Silk" },
        { src: "/images/weavers/chan.webp", alt: "Chanderi weaving traditions in Madhya Pradesh", title: "Celebrate Chanderi" }
      ];
      
      // Auto-rotate hero images
      useEffect(() => {
        const interval = setInterval(() => {
          setHeroImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
        }, 5000);
        
        return () => clearInterval(interval);
      }, []);
    
      // Simulate loading state
      useEffect(() => {
        const timer = setTimeout(() => {
          setIsLoading(false);
        }, 1000);
        
        return () => clearTimeout(timer);
      }, []);
    
      const states = [
        {
          name: "TELANGANA",
          image: "/images/weavers/tel.webp",
          spotlight: true,
          categories: [
            {
              name: "Pochampally Ikat",
              description: "Pochampally sari, or Pochampalli Ikat, from Bhoodan Pochampally in Telangana's Yadadri Bhuvanagiri district, is famous for its intricate double ikat weaving. Made from cotton, silk, and sico, it is globally renowned and part of UNESCO's tentative heritage list. Over 10,000 weaving families in 100 villages contribute to its ₹100 crore annual yarn business.",
              featuredImage: "/images/sarees/pochampally-ikkar-saree.png",
              weaverCount: 10000,
              heritage: "UNESCO tentative heritage list",
              products: [
                { id: 1, name: "Pure Silk Pochampally Ikat Saree", price: 8500, weaver: "Ramesh Goud", image: "/images/sarees/pochampalli-1.png", isFeatured: true, rating: 4.8, reviews: 24, inStock: true },
                { id: 2, name: "Cotton Pochampally Dupatta", price: 2200, weaver: "Lakshmi Devi", image: "/images/sarees/dup.png", isFeatured: false, rating: 4.6, reviews: 18, inStock: true },
                { id: 3, name: "Pochampally Silk Dress Material", price: 4200, weaver: "Anand Kumar", image: "/images/sarees/dress.jpeg", isFeatured: false, rating: 4.5, reviews: 12, inStock: false },
                { id: 4, name: "Pochampally Cotton Saree", price: 3500, weaver: "Savitri Bai", image: "/images/sarees/cot.webp", isFeatured: false, rating: 4.7, reviews: 31, inStock: true }
              ]
            },
            {
              name: "Gadwal Sarees",
              description: "Woven in Gadwal village, Mahabubnagar district of Telangana, Gadwal silk sarees are renowned for their intricate zari borders. Featuring a cotton body, silk border, and zari pallu, these lightweight weaves, also called Sico saris, can even fit in a matchbox. Notably, Tirupati Brahmotsavam begins with the deity adorned in a Gadwal saree.",
              featuredImage: "/images/sarees/gadwal-2.png",
              weaverCount: 5000,
              heritage: "Traditional temple attire",
              products: [
                { id: 5, name: "Traditional Gadwal Silk Saree", price: 12000, weaver: "Venkatesh Rao", image: "/images/sarees/gadwal-1.png", isFeatured: true, rating: 4.9, reviews: 42, inStock: true },
                { id: 6, name: "Gadwal Cotton-Silk Mixed Saree", price: 7500, weaver: "Padma Reddy", image: "/images/sarees/gad.jpg", isFeatured: false, rating: 4.7, reviews: 28, inStock: true },
                { id: 7, name: "Gadwal Pure Zari Border Saree", price: 15000, weaver: "Narayan Swamy", image: "/images/sarees/g.png", isFeatured: false, rating: 4.8, reviews: 15, inStock: true },
                { id: 8, name: "Lightweight Festival Gadwal Saree", price: 9000, weaver: "Kumari Devi", image: "/images/sarees/light.webp", isFeatured: false, rating: 4.6, reviews: 23, inStock: false }
              ]
            }
          ]
        },
        {
          name: "TAMIL NADU",
          image: "/images/sarees/kanchipuram-silk.png",
          spotlight: false,
          categories: [
            {
              name: "Kanchipuram Silk Saree",
              description: "The Kanchipuram silk sari, or Kanjeevaram, is a traditional silk weave from the Kanchipuram region in Tamil Nadu, India, worn for weddings and special occasions in South India. Made with pure mulberry silk and zari sourced from South India, it is crafted using three shuttles, with the body and border woven separately and interlocked so securely that even if the sari tears, the border remains intact. Inspired by temple art and nature, its rich designs often depict Raja Ravi Varma's paintings and epics like the Mahabharata and Ramayana.",
              featuredImage: "/images/sarees/kanchipuram-silk.png",
              weaverCount: 8000,
              heritage: "Cultural heritage of Tamil Nadu",
              products: [
                { id: 9, name: "Bridal Kanchipuram Silk Saree", price: 35000, weaver: "Murugan Pillai", image: "/images/sarees/brid.webp", isFeatured: true, rating: 5.0, reviews: 56, inStock: true },
                { id: 10, name: "Temple Design Kanjeevaram", price: 22000, weaver: "Selvi Annamalai", image: "/images/sarees/temple.png", isFeatured: false, rating: 4.9, reviews: 38, inStock: true },
                { id: 11, name: "Peacock Motif Kanchipuram Saree", price: 28000, weaver: "Raman Iyer", image: "/images/sarees/pea.png", isFeatured: false, rating: 4.8, reviews: 45, inStock: false },
                { id: 12, name: "Lightweight Kanchipuram Silk", price: 18500, weaver: "Meenakshi Sundaram", image: "/images/sarees/kanchipuram-2.png", isFeatured: false, rating: 4.7, reviews: 29, inStock: true }
              ]
            }
          ]
        },
        {
          name: "UTTAR PRADESH",
          image: "/images/weavers/up.jpg",
          spotlight: true,
          categories: [
            {
              name: "Banarasi Silks",
              description: "A Banarasi sari, made in Varanasi in the Bhojpur-Purvanchal region, is among India's finest weaves, known for its rich gold and silver brocade (zari), fine silk, and intricate embroidery. These saris are finely woven with elaborate engravings, making them relatively heavy. The traditional Banarasi sari is crafted through a vast cottage industry, supporting around 1.2 million people directly or indirectly.",
              featuredImage: "/images/weavers/ban.webp",
              weaverCount: 120000,
              heritage: "Cultural heritage of Uttar Pradesh",
              products: [
                { id: 13, name: "Pure Silk Banarasi Saree", price: 25000, weaver: "Abdul Kalam", image: "/images/sarees/one.png", isFeatured: true, rating: 4.9, reviews: 78, inStock: true },
                { id: 14, name: "Banarasi Silk Lehenga", price: 42000, weaver: "Mohammed Salim", image: "/images/sarees/leh.png", isFeatured: false, rating: 4.8, reviews: 52, inStock: true },
                { id: 15, name: "Banarasi Dupatta", price: 8500, weaver: "Fareed Ahmad", image: "/images/sarees/dp.png", isFeatured: false, rating: 4.6, reviews: 36, inStock: true },
                { id: 16, name: "Banarasi Dress Material", price: 12000, weaver: "Nazma Begum", image: "/images/sarees/mat.png", isFeatured: false, rating: 4.7, reviews: 41, inStock: false }
              ]
            }
          ]
        },
        {
          name: "ASSAM",
          image: "/api/placeholder/300/200",
          spotlight: false,
          categories: [
            {
              name: "Muga Silk",
              description: "Muga silk, exclusive to Assam, India, is known for its natural golden hue and exceptional durability. Produced by the Antheraea assamensis silkworm, it becomes glossier with each wash and is primarily used in traditional Assamese attire like Mekhela Chador and sarees.",
              featuredImage: "/images/weavers/muga.jpg",
              weaverCount: 7500,
              heritage: "Cultural heritage of Assam",
              products: [
                { id: 17, name: "Traditional Mekhela Chador", price: 18000, weaver: "Protima Devi", image: "/images/sarees/cha.jpg", isFeatured: true, rating: 4.8, reviews: 32, inStock: true },
                { id: 18, name: "Muga Silk Saree", price: 21000, weaver: "Bhupen Hazarika", image: "/images/sarees/muga-silk2.png", isFeatured: false, rating: 4.7, reviews: 28, inStock: true },
                { id: 19, name: "Golden Muga Silk Stole", price: 6500, weaver: "Jayanta Gogoi", image: "/images/sarees/muga-silk1.png", isFeatured: false, rating: 4.6, reviews: 19, inStock: true },
                { id: 20, name: "Assamese Muga Gamosa", price: 4200, weaver: "Bhabesh Baruah", image: "/images/sarees/muga-silk1.png", isFeatured: false, rating: 4.5, reviews: 24, inStock: false }
              ]
            }
          ]
        },
        {
          name: "MADHYA PRADESH",
          image: "/api/placeholder/300/200",
          spotlight: false,
          categories: [
            {
              name: "Chanderi",
              description: "Chanderi silk, from Chanderi in Madhya Pradesh, is known for its lightweight texture, sheer quality, and rich zari work. Woven from silk, cotton, and zari, it features intricate motifs inspired by nature and traditional art, making it popular for festive and bridal wear.",
              featuredImage: "/images/weavers/chan.webp",
              weaverCount: 5000,
              heritage: "Cultural heritage of Madhya Pradesh",
              products: [
                { id: 21, name: "Chanderi Cotton-Silk Saree", price: 7500, weaver: "Prakash Sharma", image: "/images/sarees/chanderi-1.png", isFeatured: true, rating: 4.7, reviews: 42, inStock: true },
                { id: 22, name: "Zari Border Chanderi Dupatta", price: 3800, weaver: "Geeta Malviya", image: "/images/sarees/chanderi-2.png", isFeatured: false, rating: 4.6, reviews: 28, inStock: true },
                { id: 23, name: "Floral Motif Chanderi Saree", price: 8900, weaver: "Mohan Lal", image: "/images/sarees/fl.png", isFeatured: false, rating: 4.8, reviews: 33, inStock: false },
                { id: 24, name: "Pure Silk Chanderi Dress Material", price: 6200, weaver: "Rajni Bai", image: "/images/sarees/dr.png", isFeatured: false, rating: 4.5, reviews: 19, inStock: true }
              ]
            }
          ]
        }
      ];
    
      const toggleState = (stateName) => {
        if (expandedState === stateName) {
          setExpandedState('');
        } else {
          setExpandedState(stateName);
          setSelectedCategory(null);
        }
      };
    
      const selectCategory = (stateIndex, categoryIndex) => {
        setSelectedCategory({
          state: stateIndex,
          category: categoryIndex
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
    
      const goBack = () => {
        setSelectedCategory(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
    
      const toggleFavorite = (productId) => {
        if (favorites.includes(productId)) {
          setFavorites(favorites.filter(id => id !== productId));
        } else {
          setFavorites([...favorites, productId]);
        }
      };
    
      const toggleFilter = (filter) => {
        if (activeFilters.includes(filter)) {
          setActiveFilters(activeFilters.filter(f => f !== filter));
        } else {
          setActiveFilters([...activeFilters, filter]);
        }
      };
    
      const handleSearch = (e) => {
        setSearchQuery(e.target.value);
      };
    
      const openProductDetail = (product) => {
        setSelectedProduct(product);
        document.body.style.overflow = 'hidden';
      };
    
      const closeProductDetail = () => {
        setSelectedProduct(null);
        document.body.style.overflow = 'auto';
      };
    
      const toggleInfoModal = () => {
        setShowInfoModal(!showInfoModal);
      };
      // Get filtered products when a category is selected
      const getFilteredProducts = () => {
        if (!selectedCategory) return [];
        
        let products = states[selectedCategory.state].categories[selectedCategory.category].products;
        

        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          products = products.filter(product => 
            product.name.toLowerCase().includes(query) || 
            product.weaver.toLowerCase().includes(query)
          );
        }
        
        if (activeFilters.includes('inStock')) {
          products = products.filter(product => product.inStock);
        }
        if (activeFilters.includes('featured')) {
          products = products.filter(product => product.isFeatured);
        }
        
        return products;
      };
    
  
  return (
    <div className="min-h-screen bg-gray-50">
      {isLoading && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
          <div className="w-24 h-24 border-t-4 border-orange-500 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-700">Discovering handloom treasures...</p>
        </div>
      )}

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          closeProductDetail={closeProductDetail}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          addToCart={addToCart}
        />
      )}

      {showInfoModal && <InfoModal toggleInfoModal={toggleInfoModal} />}

      <Header cartItems={cartItems} setCartOpen={setCartOpen} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <Link href="/home" className="text-gray-500 hover:text-gray-700">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2 text-gray-500" />
          <span className="text-gray-900 font-medium">Explore</span>
        </div>

        {selectedCategory === null ? (
          <div>
            <HeroCarousel
              heroImages={heroImages}
              heroImageIndex={heroImageIndex}
              setHeroImageIndex={setHeroImageIndex}
            />

            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Explore India's Handloom Heritage</h2>
              <div className="flex items-center">
                <button
                  onClick={() => setShowMap(!showMap)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${showMap ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {showMap ? 'Hide Map' : 'Show Map'}
                </button>
              </div>
            </div>
            
            {showMap && (
              <div className="mb-8 bg-white p-4 rounded-lg shadow-md relative h-96">
                <div className="overflow-y-auto h-full">
                  <div className="relative w-full" style={{ height: 'auto', minHeight: '100%' }}>
                    <Image
                      src="/images/weavers/map.jpg"
                      alt="Map of India showing handloom regions"
                      layout="responsive"
                      width={100}
                      height={100}
                      objectFit="contain"
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-orange-500" />
                Spotlight Regions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {states.filter(state => state.spotlight).map((state) => (
                  <StateCard key={state.name} state={state} toggleState={toggleState} />
                ))}
              </div>
            </div>

            <CategoryAccordion
              states={states}
              expandedState={expandedState}
              toggleState={toggleState}
              selectCategory={selectCategory}
            />
          </div>
        ) : (
          <CategoryDetail
            states={states}
            selectedCategory={selectedCategory}
            goBack={goBack}
            activeFilters={activeFilters}
            toggleFilter={toggleFilter}
            getFilteredProducts={getFilteredProducts}
            openProductDetail={openProductDetail}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            setSearchQuery={setSearchQuery}
            setActiveFilters={setActiveFilters}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ExplorePage;