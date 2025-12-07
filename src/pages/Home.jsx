import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Home() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        setLoading(true);
        const snapshot = await getDocs(collection(db, "watchlist"));
        const items = snapshot.docs.map((doc) => doc.data());
        
        // Group by username
        const userMap = {};
        items.forEach(item => {
          const username = item.username || item.user?.split('@')[0] || 'unknown';
          if (!userMap[username]) {
            userMap[username] = [];
          }
          userMap[username].push(item);
        });
        
        // Convert to array and sort by content count (most active users first)
        const userArray = Object.entries(userMap)
          .sort(([, a], [, b]) => b.length - a.length);
        
        setAllUsers(userArray);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            WatchListAI
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Discover what people are reading and watching around the world
          </p>
          <div className="space-y-4 md:space-y-0 md:space-x-4">
            <Link 
              to="/signup" 
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Your Reading List
            </Link>
            <Link 
              to="/login" 
              className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {allUsers.length}
              </div>
              <div className="text-gray-600">Active Readers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {allUsers.reduce((total, [, items]) => total + items.length, 0)}
              </div>
              <div className="text-gray-600">Articles & Videos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {allUsers.reduce((total, [, items]) => total + items.filter(item => item.type === 'article').length, 0)}
              </div>
              <div className="text-gray-600">Articles Shared</div>
            </div>
          </div>
        </div>
      </div>

      {/* User Profiles Section */}
      <div className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Discover Amazing Content
            </h2>
            <p className="text-gray-600 text-lg">
              Explore reading lists from our community of curious minds
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading amazing content...</p>
            </div>
          ) : allUsers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Be the First to Share!
              </h3>
              <p className="text-gray-600 mb-6">
                No content has been shared yet. Start the community by adding your first article or video.
              </p>
              <Link 
                to="/signup" 
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allUsers.map(([username, items]) => (
                <div key={username} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                        {username?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">
                          {username}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {items.length} {items.length === 1 ? 'item' : 'items'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <span className="mr-2">
                            {item.type === "article" ? "📄" : "🎬"}
                          </span>
                          <span className="text-gray-700 truncate">
                            {item.title}
                          </span>
                        </div>
                      ))}
                      {items.length > 3 && (
                        <p className="text-sm text-gray-500">
                          +{items.length - 3} more items
                        </p>
                      )}
                    </div>
                    
                    <Link 
                      to={`/profile/${username}`}
                      className="block w-full text-center bg-blue-50 text-blue-600 py-2 rounded-md hover:bg-blue-100 transition-colors font-medium"
                    >
                      View Full Profile →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white border-t py-12">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Ready to Share Your Reading Journey?
          </h2>
          <p className="text-gray-600 mb-8">
            Join our community and start building your public reading list today.
          </p>
          <Link 
            to="/signup" 
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Create Your Profile
          </Link>
        </div>
      </div>
    </div>
  );
}