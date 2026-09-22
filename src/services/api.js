const BASE_URL = 'https://fakestoreapi.com'; 

export const wishlistService = {
  // 1. After login get all wishlist items from database(GET)
  async fetchAll(userId = 1) {
    const response = await fetch(`${BASE_URL}/carts/user/${userId}`);
    if (!response.ok) throw new Error('Issue in fecthing wishlist items from database');
    return await response.json();
  },

  // 2. Add new product in Database(POST)
  async add(userId = 1, product) {
    const response = await fetch(`${BASE_URL}/carts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        date: new Date().toISOString().split('T')[0],
        products: [{ productId: product.id, quantity: 1 }]
      }),
    });

    if (!response.ok) throw new Error('failed to add product to wishlist in database');
    return product; 
  },

  // 3. Remove from database(DELETE)
  async remove(productId) {
    const response = await fetch(`${BASE_URL}/carts/6`, { // Fake API Testing Mock ID 6
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('failed to remove product from wishlist in database');
    return productId; 
  }
};
