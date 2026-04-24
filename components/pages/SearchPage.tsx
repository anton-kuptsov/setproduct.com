"use client";

import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Fuse from "fuse.js";
import type { FuseResult } from "fuse.js";
import SiteHeader from "../layout/SiteHeader";
import SiteFooter from "../layout/SiteFooter";
import ScrollUpButton from "../layout/ScrollUpButton";
import Breadcrumbs from "../sections/Breadcrumbs";
import TemplateShowcase from "../sections/TemplateShowcase";
import { PAGE_META } from "../../data/pages-meta";
import { PAGE_BREADCRUMBS } from "../../data/breadcrumbs";
import {
  SEARCHABLE_TYPE_LABELS,
  SEARCHABLE_TYPE_ORDER,
  type SearchableItem,
  type SearchableType,
} from "../../lib/search/types";

const SLUG = "search";
const MAX_RESULTS_PER_GROUP = 8;

type Props = {
  items: SearchableItem[];
};

function groupResults(results: SearchableItem[]): Record<SearchableType, SearchableItem[]> {
  const grouped = {
    product: [],
    template: [],
    bundle: [],
    freebie: [],
    dashboard: [],
    blog: [],
  } as Record<SearchableType, SearchableItem[]>;

  for (const item of results) {
    grouped[item.type].push(item);
  }
  return grouped;
}

export default function SearchPage({ items }: Props) {
  const meta = PAGE_META[SLUG];
  const breadcrumbs = PAGE_BREADCRUMBS[SLUG] ?? [];
  const router = useRouter();

  const initialQuery =
    typeof router.query.query === "string" ? router.query.query : "";
  const [inputValue, setInputValue] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    const q = typeof router.query.query === "string" ? router.query.query : "";
    setInputValue(q);
    setQuery(q);
  }, [router.query.query]);

  useEffect(() => {
    const id = setTimeout(() => setQuery(inputValue), 180);
    return () => clearTimeout(id);
  }, [inputValue]);

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: [
          { name: "title", weight: 3 },
          { name: "description", weight: 1 },
          { name: "category", weight: 2 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
        includeScore: true,
        minMatchCharLength: 2,
      }),
    [items],
  );

  const results = useMemo<FuseResult<SearchableItem>[]>(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return [];
    return fuse.search(trimmed, { limit: 120 });
  }, [fuse, query]);

  const grouped = useMemo(
    () => groupResults(results.map((r) => r.item)),
    [results],
  );

  const totalFound = results.length;
  const showEmptyState = query.trim().length < 2;
  const showNoResults = !showEmptyState && totalFound === 0;

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = inputValue.trim();
    setQuery(trimmed);
    const nextQuery = { ...router.query };
    if (trimmed) {
      nextQuery.query = trimmed;
    } else {
      delete nextQuery.query;
    }
    router.replace(
      { pathname: router.pathname, query: nextQuery },
      undefined,
      { shallow: true, scroll: false },
    );
  };

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta content={meta.description} name="description" />
        <meta content="noindex" name="robots" />
        <meta content={meta.title} property="og:title" />
        <meta content={meta.title} property="twitter:title" />
        <link href={meta.canonical} rel="canonical" />
      </Head>
      <SiteHeader />
      <main className="mt-22.5">
        {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
        <div className="section">
          <div className="section-padding top-80 bottom-80">
            <div className="container">
              <div className="freebies_rich-text-component">
                <h1 className="heading-style-h1">Search results</h1>
                <div className="spacer-40" />
                <form
                  action="/search"
                  className="search w-form"
                  onSubmit={onSubmit}
                >
                  <input
                    autoComplete="off"
                    className="text-input is-nav-search is-page-search w-input"
                    id="search"
                    maxLength={256}
                    name="query"
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Search…"
                    required
                    type="search"
                    value={inputValue}
                  />
                  <input
                    className="hide w-button"
                    type="submit"
                    value="Search"
                  />
                  <div className="search-icon-wr">
                    <img
                      alt=""
                      className="search-icon"
                      loading="lazy"
                      src="/images/search.svg"
                    />
                  </div>
                </form>
                <div className="spacer-40" />

                {showEmptyState && (
                  <div>
                    <p className="text-size-regular is-mob-14">
                      Type at least 2 characters to search across{" "}
                      {items.length} items: UI kits, templates, freebies, bundles,
                      and {items.filter((i) => i.type === "blog").length} blog posts.
                    </p>
                    <div className="spacer-24" />
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "12px",
                      }}
                    >
                      {["dashboards", "charts", "mobile", "icons", "react", "figma"].map(
                        (suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => {
                              setInputValue(suggestion);
                              setQuery(suggestion);
                            }}
                            className="blog_list-filters-item"
                            style={{ cursor: "pointer" }}
                          >
                            <span className="text-size-regular">{suggestion}</span>
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {showNoResults && (
                  <div>
                    <p className="text-size-regular is-mob-14">
                      No matching results for <strong>&ldquo;{query}&rdquo;</strong>.
                    </p>
                    <div className="spacer-16" />
                    <p className="text-size-small">
                      Try different keywords, or browse{" "}
                      <Link href="/all">all products</Link>,{" "}
                      <Link href="/blog">the blog</Link>, or{" "}
                      <Link href="/freebies">freebies</Link>.
                    </p>
                  </div>
                )}

                {!showEmptyState && !showNoResults && (
                  <div>
                    <p className="text-size-regular is-mob-14">
                      Found <strong>{totalFound}</strong> result
                      {totalFound === 1 ? "" : "s"} for{" "}
                      <strong>&ldquo;{query}&rdquo;</strong>
                    </p>
                    <div className="spacer-40" />

                    {SEARCHABLE_TYPE_ORDER.map((type) => {
                      const group = grouped[type];
                      if (!group || group.length === 0) return null;
                      const visible = group.slice(0, MAX_RESULTS_PER_GROUP);
                      const hidden = group.length - visible.length;

                      return (
                        <section key={type} style={{ marginBottom: "48px" }}>
                          <h2
                            className="heading-style-h5"
                            style={{ marginBottom: "16px" }}
                          >
                            {SEARCHABLE_TYPE_LABELS[type]}{" "}
                            <span
                              className="text-size-small"
                              style={{ opacity: 0.6, fontWeight: 400 }}
                            >
                              ({group.length})
                            </span>
                          </h2>
                          <ul
                            style={{
                              listStyle: "none",
                              padding: 0,
                              margin: 0,
                              display: "grid",
                              gap: "20px",
                            }}
                          >
                            {visible.map((item) => (
                              <li key={`${item.type}-${item.slug}`}>
                                <Link
                                  href={item.url}
                                  style={{
                                    display: "flex",
                                    gap: "16px",
                                    alignItems: "flex-start",
                                    textDecoration: "none",
                                    color: "inherit",
                                  }}
                                >
                                  {item.image && (
                                    <img
                                      alt=""
                                      loading="lazy"
                                      src={item.image}
                                      style={{
                                        width: "96px",
                                        height: "72px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                        flexShrink: 0,
                                      }}
                                    />
                                  )}
                                  <div style={{ minWidth: 0 }}>
                                    <div
                                      style={{
                                        display: "flex",
                                        gap: "8px",
                                        alignItems: "center",
                                        marginBottom: "4px",
                                      }}
                                    >
                                      {item.category && (
                                        <span
                                          className="text-size-tiny text-weight-semibold"
                                          style={{ opacity: 0.7 }}
                                        >
                                          {item.category}
                                        </span>
                                      )}
                                      {item.price && (
                                        <span
                                          className="text-size-tiny text-weight-semibold"
                                          style={{ opacity: 0.7 }}
                                        >
                                          · {item.price}
                                        </span>
                                      )}
                                    </div>
                                    <p
                                      className="heading-style-h6 text-style-2lines"
                                      style={{ margin: 0 }}
                                    >
                                      {item.title}
                                    </p>
                                    <p
                                      className="text-size-small text-style-2lines"
                                      style={{ margin: "4px 0 0", opacity: 0.8 }}
                                    >
                                      {item.description}
                                    </p>
                                  </div>
                                </Link>
                              </li>
                            ))}
                          </ul>
                          {hidden > 0 && (
                            <p
                              className="text-size-small"
                              style={{ marginTop: "12px", opacity: 0.6 }}
                            >
                              +{hidden} more in {SEARCHABLE_TYPE_LABELS[type]}
                            </p>
                          )}
                        </section>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <TemplateShowcase />
      </main>
      <SiteFooter />
      <ScrollUpButton />
    </>
  );
}
