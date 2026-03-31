export type TaskInput = {
  title?: string;
  themeText: string;
  descriptionText?: string;
  styleKeywords?: string;
  toneKeywords?: string;
  imageName?: string;
};

export type ColorToken = {
  label: string;
  tokenName: string;
  hex: string;
  role: string;
  usage: string;
};

export type AnalysisResult = {
  summary: {
    title: string;
    themeSummary: string;
    visualStrategy: string;
    keywords: string[];
  };
  moodboard: {
    styleTags: string[];
    iconDirection: string;
    textureDirection: string;
    moodPrompt: string;
  };
  colorSystem: ColorToken[];
  imageAdaptation: {
    overlayRecommendation: string;
    textOnImageRecommendation: string;
    borderRecommendation: string;
    safeTextRegion: string;
    cautionZone: string;
  };
  accessibility: {
    contrastAlert: string;
    readabilityAlert: string;
    stateGuidance: string;
  };
  exportSnippets: {
    cssVariables: string;
    tailwindSnippet: string;
  };
};

const fallbackKeywords = ["warm", "urban", "welcoming"];

export function buildMockResult(input: TaskInput): AnalysisResult {
  const theme = input.themeText || "Design language demo";
  const title = input.title?.trim() || theme;
  const keywords = input.styleKeywords
    ? input.styleKeywords
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean)
        .slice(0, 4)
    : fallbackKeywords;

  const primary = "#C85F2B";
  const secondary = "#2F7A6A";
  const surface = "#FFF9F3";
  const text = "#16211F";

  return {
    summary: {
      title,
      themeSummary: `${theme} translated into a grounded product direction with warm civic energy and high visual clarity.`,
      visualStrategy: "Use one warm brand color, one balancing green, and soft neutral surfaces to keep the demo polished but believable.",
      keywords
    },
    moodboard: {
      styleTags: ["modular cards", "soft translucency", "editorial labels", "human-centered warmth"],
      iconDirection: "Rounded outline icons with restrained fills for emphasis states only.",
      textureDirection: "Use subtle grain or light geometric patterning rather than dense illustration.",
      moodPrompt: "A calm but distinctive product surface that feels branded without looking over-designed."
    },
    colorSystem: [
      {
        label: "Primary",
        tokenName: "--color-primary",
        hex: primary,
        role: "primary",
        usage: "Use for primary CTA, highlights, and key brand moments."
      },
      {
        label: "Secondary",
        tokenName: "--color-secondary",
        hex: secondary,
        role: "secondary",
        usage: "Use for supporting navigation, status accents, and balancing warmer areas."
      },
      {
        label: "Surface",
        tokenName: "--color-surface",
        hex: surface,
        role: "surface",
        usage: "Use for cards, panels, and content containers."
      },
      {
        label: "Text",
        tokenName: "--color-text-primary",
        hex: text,
        role: "text",
        usage: "Use for body copy and high-legibility labels."
      }
    ],
    imageAdaptation: {
      overlayRecommendation: input.imageName
        ? `Use a soft charcoal-to-warm overlay over ${input.imageName} so white or cream text remains readable.`
        : "If an image is introduced later, start with a dark translucent overlay at 24% to 36%.",
      textOnImageRecommendation: "Prefer off-white headline text with one solid text backing or gradient veil.",
      borderRecommendation: "Use a low-contrast warm-gray border, not a saturated outline.",
      safeTextRegion: "Favor upper-left or lower-left calm areas with less texture density.",
      cautionZone: "Avoid placing text directly over faces, signage, or high-contrast subject areas."
    },
    accessibility: {
      contrastAlert: "Keep headline and CTA contrast above accessible thresholds when layered on imagery.",
      readabilityAlert: "If the image becomes busy, raise overlay opacity before changing the main text color.",
      stateGuidance: "Do not rely on color alone for selection or status; pair with icon or label changes."
    },
    exportSnippets: {
      cssVariables: `:root {\n  --color-primary: ${primary};\n  --color-secondary: ${secondary};\n  --color-surface: ${surface};\n  --color-text-primary: ${text};\n}`,
      tailwindSnippet: `theme: {\n  extend: {\n    colors: {\n      primary: "${primary}",\n      secondary: "${secondary}",\n      surface: "${surface}",\n      text: "${text}"\n    }\n  }\n}`
    }
  };
}

export const fallbackResult = buildMockResult({
  title: "Singapore Hawker App",
  themeText: "Singapore hawker culture",
  styleKeywords: "warm, urban, friendly"
});

