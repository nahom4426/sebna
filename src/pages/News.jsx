import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { getLandingPosts } from '@/pages/admin/posts/api/PostsApi';
import brandLogo from '@/assets/logo.svg';
import { 
  ArrowLeftIcon,
  ArrowRightIcon,
  GlobeAltIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  CalendarDaysIcon,
  UserCircleIcon,
  XMarkIcon,
  NewspaperIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const News = () => {
  const navigate = useNavigate();
  const [newsFilter, setNewsFilter] = useState('all');
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [limit] = useState(12);
  const [totalElements, setTotalElements] = useState(0);
  const [last, setLast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());

  useEffect(() => {
    try {
      AOS.init({
        duration: 700,
        easing: 'ease-out-cubic',
        once: false,
        offset: 80,
      });
      AOS.refresh();
    } catch (e) {
      // ignore AOS errors
    }
  }, []);

  const displayCategory = (category) => {
    if (!category) return 'General';
    const normalized = String(category).toLowerCase();
    if (normalized.includes('investment')) return 'Investment';
    if (normalized.includes('market')) return 'Market';
    if (normalized.includes('company')) return 'Company';
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  };

  const getImageSrc = (post) => {
    if (!post) return '';
    if (post.imageUrl) return post.imageUrl;
    if (post.image) return post.image;
    if (post.imageBase64) {
      return post.imageBase64.startsWith('data:')
        ? post.imageBase64
        : `data:image/jpeg;base64,${post.imageBase64}`;
    }
    return '/img/4u2kdUqkvMAv.jpg';
  };

  const truncateText = (text, maxLength = 120) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getCategoryColor = (category) => {
    const cat = displayCategory(category).toLowerCase();
    switch (cat) {
      case 'investment': return 'from-blue-600 to-cyan-500';
      case 'market': return 'from-emerald-600 to-green-500';
      case 'company': return 'from-violet-600 to-purple-500';
      default: return 'from-slate-600 to-slate-500';
    }
  };

  const fetchNews = async ({ reset = false } = {}) => {
    setLoading(true);
    try {
      const currentPage = reset ? 0 : page;
      const res = await getLandingPosts({ category: newsFilter, page: currentPage, limit });
      if (res?.success) {
        const data = res.data;
        const content = data?.content || data?.posts || data?.response || data || [];
        const list = Array.isArray(content) ? content : [];
        setPosts(reset ? list : [...posts, ...list]);
        setTotalElements(Number(data?.totalElements ?? list.length));
        setLast(Boolean(data?.last));
        if (reset) {
          setPage(0);
        }
      } else if (reset) {
        setPosts([]);
        setTotalElements(0);
        setLast(true);
      }
    } catch (e) {
      if (reset) {
        setPosts([]);
        setTotalElements(0);
        setLast(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews({ reset: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newsFilter]);

  const handleLoadMore = () => {
    if (loading || last) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNews({ reset: false, page: nextPage });
  };

  const handleBack = () => {
    navigate('/');
  };

  const openPostModal = (post) => {
    if (!post) return;
    setSelectedPost(post);
    setPostModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closePostModal = () => {
    setPostModalOpen(false);
    setSelectedPost(null);
    document.body.style.overflow = 'unset';
  };

  const handleLike = (postId, e) => {
    e.stopPropagation();
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const NewsCardSkeleton = () => (
    <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-200/30 dark:border-slate-700/30 shadow-lg animate-pulse">
      <div className="h-56 w-full bg-slate-200/70 dark:bg-slate-700/50" />
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="h-4 w-28 rounded-full bg-slate-200/70 dark:bg-slate-700/50" />
          <div className="h-4 w-20 rounded-full bg-slate-200/70 dark:bg-slate-700/50" />
        </div>
        <div className="h-6 w-4/5 rounded-lg bg-slate-200/70 dark:bg-slate-700/50 mb-3" />
        <div className="space-y-2 mb-4">
          <div className="h-4 w-full rounded-lg bg-slate-200/70 dark:bg-slate-700/50" />
          <div className="h-4 w-11/12 rounded-lg bg-slate-200/70 dark:bg-slate-700/50" />
          <div className="h-4 w-3/4 rounded-lg bg-slate-200/70 dark:bg-slate-700/50" />
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50">
          <div className="h-4 w-24 rounded-full bg-slate-200/70 dark:bg-slate-700/50" />
          <div className="h-4 w-20 rounded-full bg-slate-200/70 dark:bg-slate-700/50" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-white">
      {/* Modern Header with Glass Effect */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/30 dark:border-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-3 items-center">
            <button
              onClick={handleBack}
              className="group flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg transition-all duration-300"
            >
              <ArrowLeftIcon className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline font-semibold text-slate-700 dark:text-slate-200">Back to Home</span>
            </button>

            <div className="flex items-center justify-center">
              <img
                src={brandLogo}
                alt="Sebna"
                className="h-9 sm:h-10 w-auto"
              />
            </div>

            <div className="flex items-center gap-2 justify-end">
              <NewspaperIcon className="w-8 h-8 text-sebna-orange" />
              <span className="text-xl font-bold bg-gradient-to-r from-sebna-navy to-sebna-orange bg-clip-text text-transparent">
                Sebna News
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-sebna-navy/10 via-sebna-orange/10 to-sebna-navy/10 rounded-3xl blur-3xl" />
          
          <div className="relative text-center" data-aos="fade-up">
            <div className="inline-flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-6 py-3 rounded-full mb-6 border border-slate-200/30 dark:border-slate-700/30">
              <GlobeAltIcon className="w-5 h-5 text-sebna-orange" />
              <span className="text-sm font-semibold tracking-wider uppercase text-slate-700 dark:text-slate-200">
                Latest Updates & Insights
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-sebna-navy via-sebna-orange to-sebna-navy bg-clip-text text-transparent">
                Newsroom
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Stay ahead with exclusive news, market analysis, and strategic insights from Sebna S.C.
            </p>
          </div>
        </div>

        {/* Modern Filter Tabs */}
        <div className="mb-12" data-aos="fade-up" data-aos-delay="100">
          <div className="flex justify-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-2 rounded-2xl border border-slate-200/30 dark:border-slate-700/30">
              {[
                { id: 'all', label: 'All News', icon: '📰' },
                { id: 'investment', label: 'Investment', icon: '📈' },
                { id: 'market', label: 'Market', icon: '💹' },
                { id: 'company', label: 'Company', icon: '🏢' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => {
                    setNewsFilter(filter.id);
                    setPage(0);
                  }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    newsFilter === filter.id
                      ? 'bg-gradient-to-r from-sebna-navy to-sebna-orange text-white shadow-lg'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <span>{filter.icon}</span>
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modern News Grid */}
        <div className="mb-12">
          {loading && posts.length === 0 && (
            <div className="py-8" data-aos="fade-up">
              <div className="mb-8 flex items-center justify-center">
                <div className="relative">
                  <div className="h-2 w-64 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-sebna-navy to-sebna-orange animate-loading-bar" />
                  </div>
                  <div className="mt-2 text-center text-sm font-semibold text-slate-600 dark:text-slate-300 animate-pulse">
                    Loading news...
                  </div>
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(12)].map((_, i) => (
                  <NewsCardSkeleton key={i} />
                ))}
              </div>
            </div>
          )}

          {loading && posts.length > 0 && (
            <div className="mb-6 flex items-center justify-center" data-aos="fade-up">
              <div className="relative">
                <div className="h-2 w-64 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-sebna-navy to-sebna-orange animate-loading-bar" />
                </div>
                <div className="mt-2 text-center text-sm font-semibold text-slate-600 dark:text-slate-300 animate-pulse">
                  Updating news...
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-aos="fade-up" data-aos-delay="150">
            {posts.map((post, idx) => (
              <article
                key={post.id || post.postId || idx}
                onClick={() => openPostModal(post)}
                className="group cursor-pointer bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-200/30 dark:border-slate-700/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 hover:border-sebna-orange/30"
              >
                {/* Image Container with Gradient Overlay */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={getImageSrc(post)}
                    alt={post.title || 'News'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getCategoryColor(post.category)} shadow-lg`}>
                      {displayCategory(post.category)}
                    </span>
                  </div>
                  
                  {/* Date Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <CalendarDaysIcon className="w-3 h-3" />
                      {post.createdAt ? formatDate(post.createdAt) : 'Recent'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <UserCircleIcon className="w-4 h-4" />
                      <span>{post.authorName || 'Sebna S.C'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <EyeIcon className="w-4 h-4" />
                        {post.views ?? 0}
                      </span>
                      <button
                        onClick={(e) => handleLike(post.id || idx, e)}
                        className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-red-500 transition-colors"
                      >
                        {likedPosts.has(post.id || idx) ? (
                          <HeartIconSolid className="w-4 h-4 text-red-500" />
                        ) : (
                          <HeartIcon className="w-4 h-4" />
                        )}
                        {post.likeCount ?? 0}
                      </button>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold mb-3 text-slate-800 dark:text-white group-hover:text-sebna-orange transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed line-clamp-3">
                    {truncateText(post.content || '', 140)}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      }) : ''}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-sebna-orange group-hover:gap-2 transition-all">
                      Read more
                      <ArrowRightIcon className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Empty State */}
          {!loading && posts.length === 0 && (
            <div className="text-center py-16" data-aos="fade-up">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
                <NewspaperIcon className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                No news available yet
              </h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                We're preparing exciting updates. Please check back soon for the latest news and insights.
              </p>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {!last && posts.length < totalElements && (
          <div className="flex justify-center mb-12" data-aos="fade-up">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-sebna-navy to-sebna-orange text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-sebna-orange/20 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-3">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    Load More Stories
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Modern Modal */}
      {postModalOpen && selectedPost && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div 
            className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200/30 dark:border-slate-700/30"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200/30 dark:border-slate-700/30">
              <div className="flex items-center gap-4">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r ${getCategoryColor(selectedPost.category)}`}>
                  {displayCategory(selectedPost.category)}
                </span>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {selectedPost.createdAt ? formatDate(selectedPost.createdAt) : 'Recent'}
                </div>
              </div>
              <button
                onClick={closePostModal}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Featured Image */}
              <div className="relative h-80 md:h-96">
                <img
                  src={getImageSrc(selectedPost)}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/10 dark:from-slate-900/10 via-transparent to-transparent" />
              </div>

              {/* Article Content */}
              <div className="px-8 py-8">
                <div className="max-w-3xl mx-auto">
                  {/* Title */}
                  <h1 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white leading-tight">
                    {selectedPost.title}
                  </h1>

                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-sebna-navy to-sebna-orange flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {selectedPost.authorName?.charAt(0) || 'S'}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {selectedPost.authorName || 'Sebna S.C'}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {selectedPost.createdAt ? new Date(selectedPost.createdAt).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : ''}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                          <EyeIcon className="w-5 h-5" />
                          <span className="font-semibold">{selectedPost.views ?? 0}</span>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">Views</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                          <HeartIcon className="w-5 h-5" />
                          <span className="font-semibold">{selectedPost.likeCount ?? 0}</span>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">Likes</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                          <ChatBubbleLeftIcon className="w-5 h-5" />
                          <span className="font-semibold">{selectedPost.commentCount ?? 0}</span>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">Comments</span>
                      </div>
                    </div>
                  </div>

                  {/* Article Body */}
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <div className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
                      {selectedPost.content}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex flex-wrap gap-2">
                      {selectedPost.tags?.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;