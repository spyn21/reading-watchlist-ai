import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default function PublicProfile() {
  const { username } = useParams();
  const [contentList, setContentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserContent = async () => {
      if (!username) return;
      
      try {
        setLoading(true);
        setError('');
        
        // First try: Query for content with matching username
        let q = query(
          collection(db, "watchlist"), 
          where("username", "==", username)
        );
        
        let snapshot = await getDocs(q);
        let items = snapshot.docs.map((doc) => doc.data());
        
        // If no results, try searching by email prefix (fallback)
        if (items.length === 0) {
          q = query(
            collection(db, "watchlist"), 
            where("user", "==", `${username}@example.com`)
          );
          
          snapshot = await getDocs(q);
          items = snapshot.docs.map((doc) => doc.data());
        }
        
        // If still no results, try partial username match
        if (items.length === 0) {
          // Get all documents and filter client-side
          const allSnapshot = await getDocs(collection(db, "watchlist"));
          items = allSnapshot.docs
            .map((doc) => doc.data())
            .filter((item) => 
              item.username?.toLowerCase().includes(username.toLowerCase()) ||
              item.user?.toLowerCase().includes(username.toLowerCase())
            );
        }
        
        setContentList(items);
      } catch (err) {
        console.error('Failed to fetch user content:', err);
        setError('Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserContent();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 text-black p-6">
        <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
            <span>Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 text-black p-6">
        <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">⚠️ {error}</p>
            <Link to="/" className="text-blue-600 underline hover:text-blue-800">
              Go back home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-black p-6">
      <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
              {username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">
                {username}'s Reading & Watch List
              </h1>
              <div className="flex items-center text-gray-600 text-sm">
                <span className="mr-4">📚 {contentList.length} items</span>
                <span className="mr-4">📄 {contentList.filter(item => item.type === 'article').length} articles</span>
                <span>🎬 {contentList.filter(item => item.type === 'video').length} videos</span>
              </div>
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            Discover what {username} has been reading and watching
          </p>
          <div className="flex items-center">
            <Link 
              to="/" 
              className="inline-block text-blue-600 underline hover:text-blue-800"
            >
              ← Back to Home
            </Link>
            
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Profile link copied to clipboard!');
              }}
              className="ml-4 inline-flex items-center px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm text-gray-700 transition-colors"
            >
              📋 Share Profile
            </button>
          </div>
        </div>

        {contentList.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              {username} hasn't added any content yet.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Check back later for updates!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {contentList.map((item, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2 flex items-center">
                      {item.title}
                      <span className="ml-2 text-lg">
                        {item.type === "article" ? "📄" : "🎬"}
                      </span>
                    </h2>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span className="capitalize">{item.type}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(item.timestamp?.toDate?.() || Date.now()).toLocaleDateString()}</span>
                    </div>
                    
                    {item.summary && (
                      <p className="text-gray-700 mb-3 leading-relaxed">
                        {item.summary}
                      </p>
                    )}
                    
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 underline"
                    >
                      Visit {item.type === "article" ? "Article" : "Video"}
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm mb-2">
            Want to create your own reading list? 
          </p>
          <Link 
            to="/signup" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            🚀 Sign up for WatchListAI
          </Link>
        </div>
      </div>
    </div>
  );
}