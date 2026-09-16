import React, { useEffect, useMemo, useState } from 'react';
import { Sidebar, ProductCard, SkeletonCard } from '../components';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/testSlice'; 
import useDebounce from '../hooks/useDebounce';

export default function HomePage({ isSidebarOpen, setIsSidebarOpen, searchQuery }) {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const dispatch = useDispatch();

    // Filters & Pagination State Variables
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [sortOrder, setSortOrder] = useState(''); 
    const [visibleItemsCount, setVisibleItemsCount] = useState(9);

    const debouncedSearchQuery = useDebounce(searchQuery, 400);

    // 1. Data Fetching API Request Effect Block
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

    // 2. Infinite Scroll Event Listener Window Handler Effect Block
    useEffect(() => {
    const handleScroll = () => {
    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.documentElement.offsetHeight - 100;

    if (scrollPosition >= threshold) {
    setVisibleItemsCount((prevCount) => prevCount + 9);
    }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Toggle checklist values handler
    const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
        setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
        setSelectedCategories([...selectedCategories, category]);
    }
    };

    // 3. Performance Optimization: Memoizing sorting computational grids
    const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // 🔍 A. Apply filtering from our debounced search string hook
    if (debouncedSearchQuery.trim() !== '') {
        result = result.filter(product => 
          product.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase().trim())
        );
      }

    if (selectedCategories.length > 0) {
        result = result.filter(product => {
        return selectedCategories.includes(product.category.toLowerCase().trim());
        });
    }

    if (sortOrder === 'lowToHigh') {
        result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'highToLow') {
        result.sort((a, b) => b.price - a.price);
    }

    return result;
    }, [products, debouncedSearchQuery, selectedCategories, sortOrder]);

    // Slicing data mapping array segments for active infinite lazy-loading count bounds
    const visibleProducts = filteredAndSortedProducts.slice(0, visibleItemsCount);

    return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
        
        {/* Sidebar Controls Context Link */}
        <Sidebar 
            isOpen={isSidebarOpen}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
            onClose={() => setIsSidebarOpen(false)} 
        />

        {/* Content Layout Display Pipeline */}
        <main className="flex-1 py-8">
            <div className="mb-6 flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Trending Products</h1>
            <p className="text-sm text-slate-500">
                {isLoading ? 'Loading...' : `Showing ${visibleProducts.length} of ${filteredAndSortedProducts.length} results`}
            </p>
            </div>

            {/* Error Message Layout Frame */}
            {!isLoading && !error && visibleProducts.length === 0 && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700">
                <p className="font-semibold">{error}</p>
                <p className="text-sm mt-1">Please Check Internet issue</p>
            </div>
            )}

            {/* Placeholders Mapping Skeleton Grid Box */}
            {isLoading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                <SkeletonCard key={index} />
                ))}
            </div>
            )}

            {/* Empty Matching Items Fallback Container Screen */}
            {!isLoading && !error && filteredAndSortedProducts.length === 0 && (
            <div className="text-center py-12 text-slate-500 bg-white border border-slate-200 rounded-xl">
                No products found. Please clear or change your filters.
            </div>
            )}

            {/* Success Active Elements Generation Render Mapping Area */}
            {!isLoading && !error && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {visibleProducts.map((product) => (
                <ProductCard
                    key={product.id}
                    title={product.title}
                    price={product.price}
                    image={product.image}
                    category={product.category}
                    rating={product.rating?.rate || 0}
                    inStock={product.inStock}
                    onAddToCart={() => dispatch(addToCart(product))}
                />
                ))}
            </div>
            )}
            
        </main>
        </div>
    </div>
    );
}
