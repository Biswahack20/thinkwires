import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import BlogHero from '../components/BlogComponents/BlogHero';
import BlogFilters from '../components/BlogComponents/BlogFilters';
import { CloseIcon, StarIcon } from '../admin/AdminIcons';

import {
  setSearchQuery,
  setSelectedCategory,
  setCurrentPage,
  toggleBookmark,
  fetchArticles,
  fetchFeaturedArticle,
  fetchResearchers,
  subscribeNewsletter,
} from '../store/slices/blogSlice';

const FeaturedArticle = lazy(
  () => import('../components/BlogComponents/FeaturedArticle')
);
const BlogGrid = lazy(() => import('../components/BlogComponents/BlogGrid'));
const BlogPagination = lazy(
  () => import('../components/BlogComponents/BlogPagination')
);
const ResearchCollective = lazy(
  () => import('../components/BlogComponents/ResearchCollective')
);
const NewsletterCTA = lazy(
  () => import('../components/BlogComponents/NewsletterCTA')
);
const ContactCTA = lazy(
  () => import('../components/BlogComponents/ContactCTA')
);

const ComponentLoader = () => (
  <div
    style={{
      textAlign: 'center',
      padding: '3rem 1.5rem',
      color: '#64748b',
      fontSize: '0.95rem',
    }}
  >
    Loading research section...
  </div>
);

const BlogPage = () => {
  const dispatch = useDispatch();
  const {
    articles,
    featuredArticle,
    researchers,
    searchQuery,
    selectedCategory,
    currentPage,
    itemsPerPage,
    newsletterSubmitted,
    bookmarkedArticles,
    status,
  } = useSelector((state) => state.blog);

  const [activeArticleModal, setActiveArticleModal] = useState(null);

  useEffect(() => {
    dispatch(fetchArticles({ q: searchQuery, category: selectedCategory }));
    dispatch(fetchFeaturedArticle());
    dispatch(fetchResearchers());
  }, [dispatch, searchQuery, selectedCategory]);

  // Filter articles dynamically
  const filteredArticles = articles.filter((art) => {
    if (art.featured) return false;
    const matchesCategory =
      selectedCategory === 'all' ||
      selectedCategory === 'All' ||
      selectedCategory === 'All Insights' ||
      selectedCategory.startsWith('All Insights') ||
      art.category === selectedCategory ||
      art.badge === selectedCategory;

    const matchesSearch =
      searchQuery.trim() === '' ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.author?.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalInsightsCount = articles.filter((art) => !art.featured).length;

  return (
    <div className="BlogPage-wrapper">
      <Navbar />

      <main className="BlogPage-main">
        {/* 1. Hero Section */}
        <BlogHero />

        <Suspense fallback={<ComponentLoader />}>
          {/* 2. Featured Flagship Paper */}
          <FeaturedArticle
            article={featuredArticle}
            isBookmarked={bookmarkedArticles.includes(featuredArticle?.id)}
            onBookmarkToggle={(id) => dispatch(toggleBookmark(id))}
            onReadClick={(art) => setActiveArticleModal(art)}
          />

          {/* 3. Figma Category Filter Bar */}
          <BlogFilters
            searchQuery={searchQuery}
            setSearchQuery={(q) => dispatch(setSearchQuery(q))}
            selectedCategory={selectedCategory}
            setSelectedCategory={(cat) => dispatch(setSelectedCategory(cat))}
            totalResults={filteredArticles.length}
            totalArticles={totalInsightsCount}
          />

          {/* 4. Articles Grid & Pagination */}
          <section className="BlogPage-gridSection blog-container">
            <BlogGrid
              articles={paginatedArticles}
              isLoading={status === 'loading'}
              bookmarkedArticles={bookmarkedArticles}
              onBookmarkToggle={(id) => dispatch(toggleBookmark(id))}
              onReadClick={(art) => setActiveArticleModal(art)}
              onResetFilters={() => {
                dispatch(setSearchQuery(''));
                dispatch(setSelectedCategory('all'));
              }}
            />

            <BlogPagination
              currentPage={currentPage}
              totalItems={filteredArticles.length}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => dispatch(setCurrentPage(page))}
            />
          </section>

          {/* 5. Our Research Collective */}
          <ResearchCollective researchers={researchers} />

          <NewsletterCTA
            isSubmitted={newsletterSubmitted}
            onSubmit={(data) => dispatch(subscribeNewsletter(data))}
          />

          {/* 7. Industry Trend Contact Banner */}
          <ContactCTA />
        </Suspense>
      </main>

      {/* 8. Footer */}
      <Footer />

      {/* Reader Modal */}
      {activeArticleModal && (
        <div
          className="BlogPage-modalOverlay"
          onClick={() => setActiveArticleModal(null)}
        >
          <div
            className="BlogPage-modalContent"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveArticleModal(null)}
              className="BlogPage-modalCloseBtn"
              aria-label="Close reader"
            >
              <CloseIcon size={16} />
            </button>
            <div className="BlogPage-modalHeader">
              <span className="BlogPage-modalCategory">
                {activeArticleModal.badge || activeArticleModal.category}
              </span>
              <h2>{activeArticleModal.title}</h2>
              <div className="BlogPage-modalAuthor">
                {activeArticleModal.author?.avatar ? (
                  <img
                    src={activeArticleModal.author.avatar}
                    alt={activeArticleModal.author.name}
                  />
                ) : (
                  <div className="FigmaBlogCard-initialsBubble">
                    {activeArticleModal.author?.initials || 'TW'}
                  </div>
                )}
                <div>
                  <strong>{activeArticleModal.author?.name}</strong> •{' '}
                  {activeArticleModal.subCategory}
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--color-outline)',
                    }}
                  >
                    Published on {activeArticleModal.publishedAt} •{' '}
                    {activeArticleModal.readTime}
                  </div>
                </div>
              </div>
            </div>
            <div className="BlogPage-modalBody">
              {activeArticleModal.content ? (
                <>
                  {activeArticleModal.excerpt && (
                    <p
                      style={{
                        fontSize: '1.1rem',
                        fontWeight: '500',
                        color: 'var(--color-on-surface)',
                        lineHeight: '1.7',
                        marginBottom: '1.5rem',
                      }}
                    >
                      {activeArticleModal.excerpt}
                    </p>
                  )}
                  {typeof activeArticleModal.content === 'string' ? (
                    activeArticleModal.content
                      .split('\n\n')
                      .filter((p) => p.trim() !== '')
                      .map((paragraph, idx) => (
                        <p
                          key={idx}
                          style={{
                            lineHeight: '1.8',
                            color: 'var(--color-on-surface-variant)',
                            marginBottom: '1rem',
                            whiteSpace: 'pre-line',
                          }}
                        >
                          {paragraph}
                        </p>
                      ))
                  ) : (
                    <p
                      style={{
                        lineHeight: '1.8',
                        color: 'var(--color-on-surface-variant)',
                      }}
                    >
                      {String(activeArticleModal.content)}
                    </p>
                  )}
                </>
              ) : activeArticleModal.excerpt ? (
                <p
                  style={{
                    lineHeight: '1.8',
                    color: 'var(--color-on-surface-variant)',
                    fontSize: '1.05rem',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {activeArticleModal.excerpt}
                </p>
              ) : (
                <p
                  style={{
                    lineHeight: '1.8',
                    color: 'var(--color-on-surface-variant)',
                    fontStyle: 'italic',
                  }}
                >
                  No content available for this article.
                </p>
              )}
            </div>
            <div className="BlogPage-modalFooter">
              <button
                onClick={() => dispatch(toggleBookmark(activeArticleModal.id))}
                className="BlogPage-modalBookmarkBtn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <StarIcon
                  size={14}
                  filled={bookmarkedArticles.includes(activeArticleModal.id)}
                  color="currentColor"
                />
                <span>
                  {bookmarkedArticles.includes(activeArticleModal.id)
                    ? 'Bookmarked'
                    : 'Bookmark Article'}
                </span>
              </button>
              <button
                onClick={() => setActiveArticleModal(null)}
                className="BlogPage-modalDoneBtn"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
