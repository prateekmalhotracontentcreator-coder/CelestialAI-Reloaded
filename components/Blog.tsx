import React, { useState } from 'react';
import { BLOG_POSTS } from '../constants';
import { BlogPost } from '../types';

const Blog: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(BLOG_POSTS.map(post => post.category)))];

  const filteredPosts = activeCategory === 'All' 
    ? BLOG_POSTS 
    : BLOG_POSTS.filter(post => post.category === activeCategory);

  const renderPostDetail = (post: BlogPost) => (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <button 
        onClick={() => setSelectedPost(null)}
        className="flex items-center text-gray-400 hover:text-divine-gold text-sm mb-6 transition-colors"
      >
        <i className="fa-solid fa-arrow-left mr-2"></i> Back to Insights
      </button>

      <article className="glass-panel rounded-xl overflow-hidden border border-divine-gold/20">
        {/* Header Image Placeholder */}
        <div className="h-64 bg-gradient-to-r from-space-dark to-gray-900 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <i className="fa-solid fa-book-open text-9xl"></i>
          </div>
          <div className="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-space-black via-space-black/80 to-transparent">
             <div className="flex items-center gap-3 mb-2">
                <span className="bg-divine-gold/20 text-divine-gold text-xs font-bold px-2 py-1 rounded border border-divine-gold/30 uppercase tracking-wider">
                  {post.category}
                </span>
                <span className="text-gray-400 text-xs flex items-center gap-1">
                  <i className="fa-regular fa-clock"></i> {post.readTime}
                </span>
             </div>
             <h1 className="text-3xl md:text-4xl font-serif text-white font-bold leading-tight">
               {post.title}
             </h1>
          </div>
        </div>

        <div className="p-8">
          <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-6">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-divine-gold flex items-center justify-center text-space-black font-bold font-serif">
                 {post.author.charAt(0)}
               </div>
               <div>
                 <p className="text-white text-sm font-medium">{post.author}</p>
                 <p className="text-gray-500 text-xs">{post.date}</p>
               </div>
             </div>
             <div className="flex items-center gap-4 text-gray-400">
               <button className="hover:text-red-500 transition-colors flex items-center gap-1">
                 <i className="fa-regular fa-heart"></i> {post.likes}
               </button>
               <button className="hover:text-blue-400 transition-colors">
                 <i className="fa-solid fa-share-nodes"></i>
               </button>
             </div>
          </div>

          <div className="prose prose-invert prose-gold max-w-none font-sans text-gray-300 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </div>
      </article>
    </div>
  );

  const renderPostList = () => (
    <>
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-serif text-divine-gold">Cosmic Insights</h2>
          <p className="text-gray-400 font-sans">
            Daily wisdom, transit updates, and spiritual guidance.
          </p>
        </div>
        
        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all whitespace-nowrap border ${
                activeCategory === cat 
                  ? 'bg-divine-gold text-space-black border-divine-gold' 
                  : 'bg-transparent text-gray-400 border-gray-700 hover:border-divine-gold hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map(post => (
          <div 
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="glass-panel rounded-xl overflow-hidden group cursor-pointer hover:border-divine-gold/50 transition-all hover:transform hover:-translate-y-1"
          >
            <div className="h-48 bg-gray-800 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-divine-gold/10 to-purple-900/20 group-hover:scale-105 transition-transform duration-500"></div>
               <div className="absolute inset-0 flex items-center justify-center opacity-30 text-6xl text-white/10 group-hover:text-white/20 transition-colors">
                  <i className="fa-solid fa-scroll"></i>
               </div>
               <div className="absolute top-4 left-4">
                 <span className="bg-black/50 backdrop-blur-md text-divine-gold text-[10px] font-bold px-2 py-1 rounded border border-divine-gold/20 uppercase tracking-wider">
                   {post.category}
                 </span>
               </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-center mb-3 text-xs text-gray-500">
                 <span>{post.date}</span>
                 <span className="flex items-center gap-1"><i className="fa-regular fa-clock"></i> {post.readTime}</span>
              </div>
              <h3 className="text-xl font-serif text-white font-bold mb-3 group-hover:text-divine-gold transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-gray-400 text-sm line-clamp-3 mb-4 font-sans leading-relaxed">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className="text-xs text-gray-400 font-medium">By {post.author}</span>
                <span className="text-divine-gold text-xs font-bold uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read <i className="fa-solid fa-arrow-right"></i>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24 md:pb-8">
      {selectedPost ? renderPostDetail(selectedPost) : renderPostList()}
    </div>
  );
};

export default Blog;