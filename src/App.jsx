import React, { useEffect, useState } from 'react';
import { Navbar, Sidebar, ProductCard, SkeletonCard } from './components';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from './store/testSlice'; 


// Dummy Data Mocking API Response
import { MOCK_PRODUCTS } from './data/productsData';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

   // Redux Setup
   const dispatch = useDispatch();
   // Extracting cart items to calculate the total quantity dynamically
   const cartItems = useSelector((state) => state.cart.cartItems);
   const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);


  // API call
 useEffect(() => {
  // const fetchProducts = async () =>{
  //   try {
  //     setIsLoading (true);
  //     setError (null)
  //     const res = await fetch('https://fakestoreapi.com/products')
  //     if(!res.ok){
  //       throw new Error
  //     }
  //     const data = await res.json();

  //     // adding custom instock in the api array
  //     const formatedData = data.map((item) => ({...item, inStock:true}))
  //     setProducts(formatedData);

  //   } catch (error) {
  //     setError(error.message);
  //   } finally{
  //     setIsLoading(false);
  //   }
  // }
 
  const fetchProducts = () =>{
    setIsLoading(true);
    setError(null);
    fetch ('https://fakestoreapi.com/products')
    .then((res) => {
        return res.json();
      })
    .then((data)=>{
        const formatedData  = data.map((item) => ({...item, inStock : true }))
        setProducts(formatedData)
      })
    .catch((error) =>{
        setError(error.message)
      })
    .finally(()=> {
      setIsLoading(false);
    })
  }

  fetchProducts();
 },[])

// Pass the full product payload to Redux
const handleAddToCart = (product) => {
  dispatch(addToCart(product));
};


  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
      {/* 1. Navbar */}
      <Navbar 
        onToggleSidebar={() => setIsSidebarOpen(true)} 
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          
          {/* 2. Sidebar Filter */}
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
          />

          {/* 3. Product List Main Grid Content Area */}
          <main className="flex-1 py-8">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">Trending Products</h1>
              <p className="text-sm text-slate-500">Showing {MOCK_PRODUCTS.length} results</p>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700">
                <p className="font-semibold">{error}</p>
                <p className="text-sm mt-1">Please Check Internet issue</p>
              </div>
            )}

            {/* LOADING STATE (for skelaton cards in loop) */}
            {isLoading && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            )}

            {/* Grid Layout mapping list data inside ProductCard wrapper */}
            
            {!isLoading && !error &&(
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  title={product.title}
                  price={product.price}
                  image={product.image}
                  category={product.category}
                  rating={product.rating?.rate || 0}
                  inStock={product.inStock}
                  onAddToCart={() => handleAddToCart(product)}
                />
              ))}
            </div>
            )}
            
          </main>

        </div>
      </div>
    </div>
  );
}
