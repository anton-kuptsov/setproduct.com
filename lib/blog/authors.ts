export type Author = {
  name: string;
  avatar: string;
  slug: string;
};

export const AUTHORS: Record<string, Author> = {
  "roman-kamushken": {
    slug: "roman-kamushken",
    name: "Roman Kamushken",
    avatar: "/blog/authors/roman-kamushken.avif",
  },
  "jamshed-kasimov": {
    slug: "jamshed-kasimov",
    name: "Jamshed Kasimov",
    avatar: "/blog/authors/jamshed-kasimov.avif",
  },
  "kari-nelson": {
    slug: "kari-nelson",
    name: "Kari Nelson",
    avatar: "/blog/authors/kari-nelson.avif",
  },
  "nick-rybak": {
    slug: "nick-rybak",
    name: "Nick Rybak",
    avatar: "/blog/authors/nick-rybak.avif",
  },
  "jeff-flipper": {
    slug: "jeff-flipper",
    name: "Jeff Flipper",
    avatar: "/blog/authors/jeff-flipper.png",
  },
  "connor-patterson": {
    slug: "connor-patterson",
    name: "Connor Patterson",
    avatar: "/blog/authors/connor-patterson.avif",
  },
  "elen-mesropyan": {
    slug: "elen-mesropyan",
    name: "Elen Mesropyan",
    avatar: "/blog/authors/elen-mesropyan.avif",
  },
  "jamichael-mitchell": {
    slug: "jamichael-mitchell",
    name: "JaMichael Mitchell",
    avatar: "/blog/authors/jamichael-mitchell.jpg",
  },
  "stan-suboticki": {
    slug: "stan-suboticki",
    name: "Stan Suboticki",
    avatar: "/blog/authors/stan-suboticki.avif",
  },
  "william-james": {
    slug: "william-james",
    name: "William James",
    avatar: "/blog/authors/william-james.jpg",
  },
};

const FALLBACK_AUTHOR: Author = {
  slug: "setproduct-team",
  name: "Setproduct Team",
  avatar: "/blog/authors/setproduct-team.avif",
};

export function getAuthor(slugOrName: string): Author {
  const normalized = slugOrName.toLowerCase().replace(/\s+/g, "-");
  return AUTHORS[normalized] ?? AUTHORS[slugOrName] ?? FALLBACK_AUTHOR;
}
