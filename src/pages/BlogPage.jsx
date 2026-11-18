import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  User, 
  ArrowRight, 
  MagnifyingGlass, 
  X, 
  ShieldCheck, 
  Sparkle,
  CaretLeft,
  CaretRight
} from '@phosphor-icons/react';
import { SAMPLE_ARTICLES, BLOG_CATEGORIES, getFeaturedArticle } from '../data/articles';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import Breadcrumbs from '../components/shared/Breadcrumbs';

const ARTICLES_PER_PAGE = 6;

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const featuredArticle = useMemo(() => getFeaturedArticle(), []);

  // Filtered Articles based on search & category
  const filteredArticles = useMemo(() => {
    return SAMPLE_ARTICLES.filter((article) => {
      // 1. Category Filter
      if (selectedCategory !== 'All categories' && article.category !== selectedCategory) {
        return false;
      }

      // 2. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = article.title.toLowerCase().includes(q);
        const inExcerpt = article.excerpt.toLowerCase().includes(q);
        const inAuthor = article.author?.name?.toLowerCase().includes(q);
        const inCategory = article.category.toLowerCase().includes(q);
        if (!inTitle && !inExcerpt && !inAuthor && !inCategory) return false;
      }

      return true;
    });
  }, [selectedCategory, searchQuery]);

  // Pagination computations
  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE) || 1;
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ARTICLES_PER_PAGE;
    return filteredArticles.slice(start, start + ARTICLES_PER_PAGE);
  }, [filteredArticles, currentPage]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedCategory('All categories');
    setSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left w-full space-y-12">
      
      {/* =========================================================================
          1. HEADER & BREADCRUMBS
         ========================================================================= */}
      <section className="space-y-4">
        <Breadcrumbs 
          items={[
            { label: 'Blog and property guides' }
          ]} 
          className="mb-2" 
        />

        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-semibold">
            <BookOpen size={15} weight="fill" />
            <span>EstateOne editorial and market intelligence</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
            <ShieldCheck size={14} weight="fill" />
            <span>RERA compliant advisory</span>
          </span>
        </div>

        <div className="max-w-3xl space-y-3">
          <h1 className="heading-1 text-brand-navy tracking-tight">
            Real estate guides and market insights.
          </h1>
          <p className="body-3 text-slate-500 leading-relaxed">
            Authoritative guides on RERA legal rights, home loan calculations, infrastructure corridors, and Indian property markets written by licensed counsel and private wealth advisors.
          </p>
        </div>
      </section>

      {/* =========================================================================
          2. FEATURED ARTICLE SPOTLIGHT (HERO CARD)
         ========================================================================= */}
      {selectedCategory === 'All categories' && !searchQuery && featuredArticle && (
        <section>
          <Card className="rounded-3xl bg-white shadow-xs border-0 overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              
              {/* Featured Image */}
              <div className="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-slate-100">
                <img
                  src={featuredArticle.coverImage}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-brand-navy/90 text-brand-gold text-[11px] font-bold uppercase tracking-wider shadow-xs flex items-center gap-1.5">
                    <Sparkle size={13} weight="fill" />
                    <span>Featured spotlight</span>
                  </span>
                </div>
              </div>

              {/* Featured Details */}
              <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                    <Badge variant="outline" className="text-brand-blue border-brand-blue/30 text-[11px] font-semibold">
                      {featuredArticle.category}
                    </Badge>
                    <span className="flex items-center gap-1">
                      <Clock size={14} className="text-slate-400" />
                      <span>{featuredArticle.readTime}</span>
                    </span>
                    <span>•</span>
                    <span>{featuredArticle.publishedDate}</span>
                  </div>

                  <h2 className="heading-2 text-brand-navy font-bold hover:text-brand-blue transition-colors">
                    <Link to={`/blog/${featuredArticle.slug}`}>
                      {featuredArticle.title}
                    </Link>
                  </h2>

                  <p className="body-4 text-slate-500 leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <img
                      src={featuredArticle.author.avatar}
                      alt={featuredArticle.author.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                    <div>
                      <span className="caption-1 font-bold text-brand-navy block">
                        {featuredArticle.author.name}
                      </span>
                      <span className="caption-3 text-slate-400">
                        {featuredArticle.author.role}
                      </span>
                    </div>
                  </div>

                  <Link to={`/blog/${featuredArticle.slug}`}>
                    <Button
                      type="button"
                      className="px-5 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <span>Read guide</span>
                      <ArrowRight size={14} weight="bold" />
                    </Button>
                  </Link>
                </div>

              </div>

            </div>
          </Card>
        </section>
      )}

      {/* =========================================================================
          3. CATEGORY FILTERS & SEARCH CONTROL BAR
         ========================================================================= */}
      <section className="space-y-4">
        
        {/* Search Bar & Active Count */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search guides by keyword, topic, or author..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-9 pr-9 h-11 rounded-2xl bg-white border-slate-200 text-xs text-brand-navy focus-visible:ring-brand-blue"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-navy cursor-pointer"
                title="Clear search"
              >
                <X size={13} weight="bold" />
              </button>
            )}
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-brand-navy">{filteredArticles.length}</strong> {filteredArticles.length === 1 ? 'article' : 'articles'}
            {(selectedCategory !== 'All categories' || searchQuery) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="ml-2 text-brand-blue font-semibold hover:underline cursor-pointer"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* Category Pill Filters (7 PRD Categories + All) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {BLOG_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-brand-navy text-white shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

      </section>

      {/* =========================================================================
          4. ARTICLES GRID & PAGINATION
         ========================================================================= */}
      <section className="space-y-10">
        {paginatedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedArticles.map((article) => (
              <article
                key={article.id}
                className="group bg-white rounded-3xl overflow-hidden border-0 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between text-left"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-brand-navy/90 text-white text-[10px] font-bold tracking-wide shadow-xs">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock size={13} />
                        <span>{article.readTime}</span>
                      </span>
                      <span>•</span>
                      <span>{article.publishedDate}</span>
                    </div>

                    <h3 className="title-1 font-bold text-brand-navy group-hover:text-brand-blue transition-colors line-clamp-2">
                      <Link to={`/blog/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h3>

                    <p className="caption-1 text-slate-500 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={article.author.avatar}
                      alt={article.author.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="caption-3 font-semibold text-brand-navy truncate max-w-[130px]">
                      {article.author.name}
                    </span>
                  </div>

                  <Link
                    to={`/blog/${article.slug}`}
                    className="caption-2 font-semibold text-brand-blue hover:text-brand-navy flex items-center gap-1 transition-colors"
                  >
                    <span>Read guide</span>
                    <ArrowRight size={13} weight="bold" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border-0 shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <BookOpen size={32} />
            </div>
            <h3 className="title-2 text-brand-navy font-bold">No articles found</h3>
            <p className="caption-1 text-slate-500 max-w-md mx-auto">
              No property guides matched your search or category selection. Try searching with different keywords or clearing your active filters.
            </p>
            <Button
              type="button"
              onClick={handleResetFilters}
              className="mt-2 px-6 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-semibold cursor-pointer"
            >
              Reset all filters
            </Button>
          </div>
        )}

        {/* Pagination Navigation */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6">
            <Button
              type="button"
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="rounded-xl px-3 h-9 text-xs font-semibold cursor-pointer"
            >
              <CaretLeft size={14} weight="bold" />
              <span className="ml-1 hidden sm:inline">Previous</span>
            </Button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const page = idx + 1;
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    currentPage === page
                      ? 'bg-brand-navy text-white shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <Button
              type="button"
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-xl px-3 h-9 text-xs font-semibold cursor-pointer"
            >
              <span className="mr-1 hidden sm:inline">Next</span>
              <CaretRight size={14} weight="bold" />
            </Button>
          </div>
        )}
      </section>

      {/* =========================================================================
          5. TOPIC DISCOVERY & RELATED CATEGORIES
         ========================================================================= */}
      <section className="p-8 sm:p-10 rounded-3xl bg-slate-50 border border-slate-100 space-y-4">
        <div>
          <h3 className="title-2 text-brand-navy font-bold">
            Explore property topics by focus area
          </h3>
          <p className="caption-2 text-slate-500 mt-0.5">
            Quickly navigate to verified guides on regulatory protections, loan math, and micro market analytics.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap pt-2">
          {BLOG_CATEGORIES.filter((c) => c !== 'All categories').map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryChange(cat)}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-brand-navy transition-colors cursor-pointer"
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

    </div>
  );
}
