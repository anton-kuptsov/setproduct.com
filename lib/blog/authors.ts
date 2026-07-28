import type { Author } from "../../types/blog";

export type { Author };

export const AUTHORS: Record<string, Author> = {
  "roman-kamushken": {
    slug: "roman-kamushken",
    name: "Roman Kamushken",
    avatar: "/blog/authors/roman-kamushken.webp",
  },
  "jamshed-kasimov": {
    slug: "jamshed-kasimov",
    name: "Jamshed Kasimov",
    avatar: "/blog/authors/jamshed-kasimov.webp",
  },
  "kari-nelson": {
    slug: "kari-nelson",
    name: "Kari Nelson",
    avatar: "/blog/authors/kari-nelson.webp",
  },
  "nick-rybak": {
    slug: "nick-rybak",
    name: "Nick Rybak",
    avatar: "/blog/authors/nick-rybak.webp",
  },
  "jeff-flipper": {
    slug: "jeff-flipper",
    name: "Jeff Flipper",
    avatar: "/blog/authors/jeff-flipper.webp",
  },
  "connor-patterson": {
    slug: "connor-patterson",
    name: "Connor Patterson",
    avatar: "/blog/authors/connor-patterson.webp",
  },
  "elen-mesropyan": {
    slug: "elen-mesropyan",
    name: "Elen Mesropyan",
    avatar: "/blog/authors/elen-mesropyan.webp",
  },
  "jamichael-mitchell": {
    slug: "jamichael-mitchell",
    name: "JaMichael Mitchell",
    avatar: "/blog/authors/jamichael-mitchell.webp",
  },
  "stan-suboticki": {
    slug: "stan-suboticki",
    name: "Stan Suboticki",
    avatar: "/blog/authors/stan-suboticki.webp",
  },
  "william-james": {
    slug: "william-james",
    name: "William James",
    avatar: "/blog/authors/william-james.webp",
  },
};

const FALLBACK_AUTHOR: Author = {
  slug: "setproduct-team",
  name: "Setproduct Team",
  avatar: "/blog/authors/setproduct-team.webp",
};

export function getAuthor(slugOrName: string): Author {
  const normalized = slugOrName.toLowerCase().replace(/\s+/g, "-");
  return AUTHORS[normalized] ?? AUTHORS[slugOrName] ?? FALLBACK_AUTHOR;
}

/**
 * True when the given author slug or name resolves to a registered AUTHORS
 * entry (i.e. not the Setproduct Team fallback). Drives whether the byline
 * links to an author page.
 */
export function isRegisteredAuthor(slugOrName: string): boolean {
  const normalized = slugOrName.toLowerCase().replace(/\s+/g, "-");
  return Boolean(AUTHORS[normalized] ?? AUTHORS[slugOrName]);
}
