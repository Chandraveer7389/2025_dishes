import { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import Auth from './Auth';
import './App.css';

const DUMMY_DISHES = [
  { id: 1, name: "Paneer Butter Masala", price: 250, category: "Veg", rating: 4.5, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop" },
  { id: 2, name: "Chicken Biryani", price: 350, category: "Non-Veg", rating: 4.8, image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&auto=format&fit=crop" },
  { id: 3, name: "Masala Dosa", price: 120, category: "Veg", rating: 4.2, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop" },
  { id: 4, name: "Mutton Rogan Josh", price: 450, category: "Non-Veg", rating: 4.9, image: "https://images.unsplash.com/photo-1545231027-63b6f2a75ad0?w=500&auto=format&fit=crop" },
  { id: 5, name: "Veg Hakka Noodles", price: 180, category: "Veg", rating: 4.0, image: "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=500&auto=format&fit=crop" },
  { id: 6, name: "Grilled Fish", price: 400, category: "Non-Veg", rating: 4.6, image: "https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=500&auto=format&fit=crop" },
];

function App() {
  const [user, setUser] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Handle Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Dishes
  useEffect(() => {
    const fetchDishes = async () => {
      if (user) {
        try {
          const querySnapshot = await getDocs(collection(db, "dishes"));
          const dishData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          
          if (dishData.length > 0) {
            setDishes(dishData);
          } else {
            setDishes(DUMMY_DISHES);
          }
        } catch (error) {
          console.error("Error fetching dishes:", error);
          setDishes(DUMMY_DISHES);
        }
      }
    };
    fetchDishes();
  }, [user]);

  const handleSort = (criteria) => {
    let sorted = [...dishes];
    if (criteria === "low") sorted.sort((a, b) => a.price - b.price);
    if (criteria === "high") sorted.sort((a, b) => b.price - a.price);
    if (criteria === "rating") sorted.sort((a, b) => b.rating - a.rating);
    setDishes(sorted);
  };

  const displayedDishes = dishes.filter(dish => {
    const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || dish.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (!user) return <Auth />;

  return (
    <div className="app-container">
      <nav className="navbar">
        <h2 className="logo">DishApp</h2>
        <div className="user-info">
          <span>{user.email}</span>
          <button className="logout-btn" onClick={() => signOut(auth)}>Logout</button>
        </div>
      </nav>

      <div className="main-content">
        <div className="controls">
          <input 
            type="text" 
            placeholder="Search for dishes..." 
            className="search-bar"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select className="sort-dropdown" onChange={(e) => handleSort(e.target.value)}>
            <option value="">Sort By ▾</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        <div className="category-filters">
          <button className={activeCategory === "All" ? "active" : ""} onClick={() => setActiveCategory("All")}>All Dishes</button>
          <button className={activeCategory === "Veg" ? "active-veg" : ""} onClick={() => setActiveCategory("Veg")}>Veg Only</button>
          <button className={activeCategory === "Non-Veg" ? "active-nonveg" : ""} onClick={() => setActiveCategory("Non-Veg")}>Non-Veg</button>
        </div>

        <div className="dish-grid">
          {displayedDishes.map(dish => (
            <div key={dish.id} className="dish-card">
              <div className="image-container">
                <img 
                  src={dish.image} 
                  alt={dish.name} 
                  onError={(e) => e.target.src="https://placehold.co/400x300?text=No+Image"}
                />
                <span className={`indicator ${dish.category === "Veg" ? "veg-dot" : "nonveg-dot"}`}></span>
              </div>
              <div className="card-info">
                <h3>{dish.name}</h3>
                <div className="meta">
                  <span className="price">₹{dish.price}</span>
                  <span className="rating-badge">⭐ {dish.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;