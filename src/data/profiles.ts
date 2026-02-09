export interface ProfileLink {
  href: string;
  icon: string;
  label: string;
}

export interface ProfileSection {
  id: string;
  title: string;
  description: string;
  links: ProfileLink[];
}

export const identity = {
  name: "Benjamin Jesuiter",
  tagline: "Make the web the best place it can be!",
  imageAlt: "Profile Picture for Benjamin Jesuiter",
};

export const profileSections: ProfileSection[] = [
  {
    id: "dev",
    title: "Meine persönlichen Dev Accounts",
    description:
      "Du interessierst dich für meine Seite als enthusiastischer Fullstack- & Web Builder? Nice - hier entlang!",
    links: [
      {
        href: "https://github.com/bjesuiter",
        icon: "bxl:github",
        label: "github: bjesuiter",
      },
      {
        href: "https://www.npmjs.com/~bjesuiter",
        icon: "ion:logo-npm",
        label: "npm: bjesuiter",
      },
      {
        href: "https://bsky.app/profile/bjesuiter.de",
        icon: "simple-icons:bluesky",
        label: "bluesky: bjesuiter.de",
      },
      {
        href: "https://x.com/jesuiterb",
        icon: "ph:x-logo-fill",
        label: "x: jesuiterb",
      },
    ],
  },
  {
    id: "codemonument",
    title: "CodeMonument: Meine englische Dev-Identität",
    description:
      "Für ernsthaftere OSS-Abenteuer, die ich auf best-effort Basis maintaine, gibt es den englischen Auftritt als CodeMonument.",
    links: [
      {
        href: "https://github.com/codemonument",
        icon: "bxl:github",
        label: "github: codemonument",
      },
      {
        href: "https://x.com/codemonument",
        icon: "ph:x-logo-fill",
        label: "x: codemonument",
      },
      {
        href: "https://www.npmjs.com/org/codemonument",
        icon: "ion:logo-npm",
        label: "npm: codemonument",
      },
      {
        href: "https://jsr.io/@codemonument",
        icon: "simple-icons:jsr",
        label: "jsr: @codemonument",
      },
    ],
  },
  {
    id: "business",
    title: "Meine Business-Profile",
    description:
      "Auch Business-Kontakte sind willkommen. Dort antworte ich allerdings deutlich seltener.",
    links: [
      {
        href: "https://www.linkedin.com/in/bjesuiter/",
        icon: "ph:linkedin-logo-fill",
        label: "linkedin: bjesuiter",
      },
      {
        href: "https://www.xing.com/profile/Benjamin_Jesuiter/cv",
        icon: "ion:logo-xing",
        label: "xing: bjesuiter",
      },
    ],
  },
  {
    id: "private",
    title: "Mehr Privates",
    description:
      "Privat hier? Sehr cool. Ein paar Instagram-Spuren aus Foto- und Food-Projekten.",
    links: [
      {
        href: "https://www.instagram.com/bjesuiterphotography/",
        icon: "ph:instagram-logo",
        label: "instagram: bjesuiterphotography",
      },
      {
        href: "https://www.instagram.com/foodyprn.de/",
        icon: "ph:instagram-logo",
        label: "instagram: foodyprn.de",
      },
      {
        href: "https://www.instagram.com/bjesuiter",
        icon: "ph:instagram-logo",
        label: "instagram: bjesuiter",
      },
    ],
  },
];
