import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Clock, CalendarBlank } from '@phosphor-icons/react';
import { SAMPLE_ARTICLES } from '../../data/articles';

export default function LatestInsights() {
  const articles = SAMPLE_ARTICLES.slice(0, 3);

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto text-left">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <span className="caption-2 font-bold tracking-wider uppercase text-[#C5A46D] mb-2 block flex items-center gap-1.5">
            <BookOpen size={14} weight="fill" />
            <span>Market intelligence</span>
          </span>
          <h2 className="heading-2 text-brand-navy font-bold tracking-tight">
            Property insights and guides
          </h2>
          <p className="body-4 text-slate-500 mt-2 max-w-xl">
            Authoritative RERA legal briefings, home financing guidelines, and metropolitan real estate appreciation trends.
          </p>
        </div>

        <Link
          to="/blog"
          className="self-start md:self-auto flex items-center gap-1.5 text-xs font-semibold text-brand-blue hover:text-brand-navy transition-colors group"
        >
          <span>View all articles</span>
          <ArrowRight size={14} weight="bold" className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <article
            key={article.id}
            className="group rounded-3xl bg-white overflow-hidden border-0 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Cover Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-brand-navy shadow-xs">
                  {article.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-2.5">
                  <span className="flex items-center gap-1">
                    <CalendarBlank size={12} />
                    <span>{article.publishedDate}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{article.readTime}</span>
                  </span>
                </div>

                <h3 className="heading-4 text-brand-navy font-bold group-hover:text-brand-blue transition-colors line-clamp-2 mb-2">
                  <Link to={`/blog/${article.slug}`}>
                    {article.title}
                  </Link>
                </h3>

                <p className="body-5 text-slate-500 line-clamp-2 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>
            </div>

            {/* Read CTA */}
            <div className="p-6 pt-0 mt-auto">
              <Link
                to={`/blog/${article.slug}`}
                className="text-xs font-semibold text-brand-navy group-hover:text-brand-blue flex items-center gap-1 transition-colors"
              >
                <span>Read article</span>
                <ArrowRight size={13} weight="bold" className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </article>
        ))}
      </div>

    </section>
  );
}
