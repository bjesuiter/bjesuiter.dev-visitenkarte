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

export interface Identity {
  name: string;
  tagline: string;
  imageAlt: string;
}

export interface SupportCtaContent {
  ariaLabel: string;
  title: string;
  description: string;
  linkLabel: string;
}

export interface LocalizedProfileContent {
  identity: Identity;
  profileSections: ProfileSection[];
  supportCta: SupportCtaContent;
}

export type SupportedLocale = "de" | "en";

const identityDe: Identity = {
  name: "Benjamin Jesuiter",
  tagline: "Make the web the best place it can be!",
  imageAlt: "Profile Picture for Benjamin Jesuiter",
};

const identityEn: Identity = {
  name: "Benjamin Jesuiter",
  tagline: "Make the web the best place it can be!",
  imageAlt: "Profile picture of Benjamin Jesuiter",
};

const profileSectionsDe: ProfileSection[] = [
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
        href: "https://bsky.app/profile/codemonument.com",
        icon: "simple-icons:bluesky",
        label: "bluesky: @codemonument.com",
      },
      {
        href: "https://github.com/codemonument",
        icon: "bxl:github",
        label: "github: codemonument",
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
      {
        href: "https://x.com/codemonument",
        icon: "ph:x-logo-fill",
        label: "x: codemonument",
      },
    ],
  },
  {
    id: "freelancing",
    title: "Freelancing",
    description:
      "Ich biete digitale Klarheit für Ihr Unternehmen. Kontaktieren Sie mich!",
    links: [
      {
        href: "https://consulting.jesuiter.com/",
        icon: "ph:globe-fill",
        label: "consulting.jesuiter.com",
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

const profileSectionsEn: ProfileSection[] = [
  {
    id: "dev",
    title: "My personal dev accounts",
    description:
      "Interested in my work as a full-stack and web builder? Great, start here.",
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
    title: "CodeMonument: My English dev identity",
    description:
      "For more serious OSS work that I maintain on a best-effort basis, I use my English profile under CodeMonument.",
    links: [
      {
        href: "https://bsky.app/profile/codemonument.com",
        icon: "simple-icons:bluesky",
        label: "bluesky: @codemonument.com",
      },
      {
        href: "https://github.com/codemonument",
        icon: "bxl:github",
        label: "github: codemonument",
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
      {
        href: "https://x.com/codemonument",
        icon: "ph:x-logo-fill",
        label: "x: codemonument",
      },
    ],
  },
  {
    id: "freelancing",
    title: "Freelancing",
    description: "I bring digital clarity to teams and products.",
    links: [
      {
        href: "https://consulting.jesuiter.com/",
        icon: "ph:globe-fill",
        label: "consulting.jesuiter.com",
      },
    ],
  },
  {
    id: "business",
    title: "My business profiles",
    description:
      "Business contacts are welcome. Response times are usually slower there.",
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
    title: "More private",
    description: "Here are a few Instagram trails from photo and food projects.",
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

const supportCtaDe: SupportCtaContent = {
  ariaLabel: "Unterstützung",
  title: "Unterstütze meine Arbeit",
  description:
    "Wenn dir meine Arbeit hilft oder gefällt, freue ich mich über Support. Auf der nächsten Seite findest du die Optionen.",
  linkLabel: "Jetzt unterstützen",
};

const supportCtaEn: SupportCtaContent = {
  ariaLabel: "Support",
  title: "Support my work",
  description:
    "If my work is useful to you, I appreciate your support. You will find all options on the next page.",
  linkLabel: "Support now",
};

export const localizedProfileContent: Record<SupportedLocale, LocalizedProfileContent> =
  {
    de: {
      identity: identityDe,
      profileSections: profileSectionsDe,
      supportCta: supportCtaDe,
    },
    en: {
      identity: identityEn,
      profileSections: profileSectionsEn,
      supportCta: supportCtaEn,
    },
  };

export function getLocalizedProfileContent(
  locale: SupportedLocale = "de",
): LocalizedProfileContent {
  return localizedProfileContent[locale];
}

export const identity = localizedProfileContent.de.identity;
export const profileSections = localizedProfileContent.de.profileSections;
