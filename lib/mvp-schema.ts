export type InputMode = "text" | "image" | "mixed";
export type TaskStatus = "draft" | "processing" | "completed" | "failed";
export type ContrastStatus = "pass" | "watch";
export type ImageReadabilityStatus = "safe" | "watch";

export type RawTaskInput = {
  title?: string;
  themeText?: string;
  descriptionText?: string;
  styleKeywords?: string | string[];
  toneKeywords?: string | string[];
};

export type TaskInput = {
  title?: string;
  themeText: string;
  descriptionText: string;
  styleKeywords: string[];
  toneKeywords: string[];
};

export type AssetRecord = {
  assetId: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  palette: string[];
  subjectHint: string;
  aspectHint: string;
  imageDensity: "low" | "medium" | "high";
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
    hasImage: boolean;
    assetSummary: string;
    palette: string[];
    overlayRecommendation: string;
    overlayOpacity: string;
    textOnImageRecommendation: string;
    recommendedTextColor: string;
    borderRecommendation: string;
    placementRecommendation: string;
    safeTextRegion: string;
    cautionZone: string;
  };
  accessibility: {
    contrastRatio: number;
    contrastStatus: ContrastStatus;
    contrastAlert: string;
    readabilityStatus: ImageReadabilityStatus;
    readabilityAlert: string;
    stateGuidance: string;
  };
  exportSnippets: {
    cssVariables: string;
    tailwindSnippet: string;
  };
};

export type CreateTaskResponse = {
  taskId: string;
  status: TaskStatus;
  inputMode: InputMode;
  task: {
    title: string;
    createdAt: string;
  };
};

export type UploadAssetResponse = {
  taskId: string;
  status: TaskStatus;
  asset: AssetRecord;
};

export type AnalyzeResponse = {
  taskId: string;
  status: TaskStatus;
  task: {
    title: string;
    inputMode: InputMode;
    createdAt: string;
    updatedAt: string;
  };
  input: TaskInput;
  asset: AssetRecord | null;
  result: AnalysisResult;
  generatedAt: string;
};

export type TaskDetailResponse = AnalyzeResponse;

type PalettePreset = {
  id: string;
  matchTerms: string[];
  styleTags: string[];
  iconDirection: string;
  textureDirection: string;
  moodPrompt: string;
  visualStrategy: string;
  overlayRecommendation: string;
  textOnImageRecommendation: string;
  borderRecommendation: string;
  placementRecommendation: string;
  safeTextRegion: string;
  cautionZone: string;
  stateGuidance: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    surface: string;
    text: string;
  };
};

const fallbackKeywords = ["warm", "clear", "usable"];
const filePaletteBank = [
  "#C85F2B",
  "#2F7A6A",
  "#F4C95D",
  "#2E4057",
  "#7C3AED",
  "#1D4ED8",
  "#0F766E",
  "#E2E8F0",
  "#D97706",
  "#B91C1C"
];

const palettePresets: PalettePreset[] = [
  {
    id: "hawker-warm",
    matchTerms: ["hawker", "food", "market", "community", "warm", "urban", "friendly", "singapore"],
    styleTags: ["editorial cards", "warm civic color", "soft glass surfaces", "welcoming product rhythm"],
    iconDirection: "Use rounded outline icons with one filled accent state for key actions.",
    textureDirection: "Light grain, market-grid geometry, and soft highlight edges feel more grounded than heavy illustration.",
    moodPrompt: "A polished community product with warmth, appetite, and urban order.",
    visualStrategy: "Anchor the interface with one food-adjacent warm primary, balance it with a teal secondary, and keep surfaces calm.",
    overlayRecommendation: "Use a charcoal-to-amber overlay between 28% and 40% to preserve atmosphere while making text legible.",
    textOnImageRecommendation: "Prefer warm-white or cream text over imagery, with short headlines and one quiet supporting line.",
    borderRecommendation: "Use soft warm-gray borders instead of saturated outlines so photography stays the hero.",
    placementRecommendation: "Hero banners, featured vendor cards, and category shelves suit this direction best.",
    safeTextRegion: "Look for top-left or bottom-left negative space before placing headlines.",
    cautionZone: "Avoid placing labels over plated food details, faces, or bright shop signs.",
    stateGuidance: "Pair color changes with icon fill or badge labels for selected and active states.",
    colors: {
      primary: "#C85F2B",
      secondary: "#2F7A6A",
      accent: "#F4C95D",
      surface: "#FFF9F3",
      text: "#16211F"
    }
  },
  {
    id: "care-calm",
    matchTerms: ["health", "medical", "care", "inclusive", "accessibility", "clinic", "service", "calm"],
    styleTags: ["calm spacing", "trust-building blue", "gentle rounded forms", "clear hierarchy"],
    iconDirection: "Use soft rounded line icons with consistent stroke width and very restrained fills.",
    textureDirection: "Use clean gradients and sparse dot patterns rather than decorative textures.",
    moodPrompt: "A calm service interface that feels trustworthy, human, and accessible.",
    visualStrategy: "Let a reliable blue lead, then add a muted green and low-contrast surface colors to keep the tone supportive.",
    overlayRecommendation: "Use a cool navy overlay around 24% to 32% and avoid adding saturated tint noise.",
    textOnImageRecommendation: "Use white or near-white copy, medium weight, and stronger spacing for instructional text.",
    borderRecommendation: "Use pale blue-gray dividers and avoid high-contrast card borders unless the section is critical.",
    placementRecommendation: "Best for service dashboards, appointment flows, and supportive onboarding screens.",
    safeTextRegion: "Reserve top or side gutters for text blocks; keep the center uncluttered.",
    cautionZone: "Do not place body copy over hands, faces, or medical devices.",
    stateGuidance: "Use labels, icon changes, and text feedback together for warnings or confirmations.",
    colors: {
      primary: "#2563EB",
      secondary: "#5B8C85",
      accent: "#7DD3FC",
      surface: "#F5FAFF",
      text: "#102033"
    }
  },
  {
    id: "transit-night",
    matchTerms: ["night", "traffic", "transport", "transit", "city", "screen", "navigation", "dark"],
    styleTags: ["high-contrast panels", "signal color accents", "compact data rhythm", "night-safe interfaces"],
    iconDirection: "Use geometric icons with strong strokes and minimal corner softness.",
    textureDirection: "Use glow edges, subtle grid lines, and low-noise gradients to support information density.",
    moodPrompt: "A navigational system that feels alert, legible, and urban after dark.",
    visualStrategy: "Start with a dark base, add one electric transit blue, and use amber only for high-priority calls and warnings.",
    overlayRecommendation: "Use a deep navy overlay between 36% and 52%, especially when route or map labels sit on top.",
    textOnImageRecommendation: "Use near-white text and reserve amber for route alerts or timing urgency only.",
    borderRecommendation: "Use low-glow borders or faint blue-gray strokes to frame dense cards.",
    placementRecommendation: "Ideal for station boards, wayfinding panels, and alert-heavy mobile surfaces.",
    safeTextRegion: "Favor strong dark bands or map margins instead of the image center.",
    cautionZone: "Avoid placing text on top of route lines, headlights, or dense signage clusters.",
    stateGuidance: "Combine color, iconography, and shape changes to communicate urgency and route status.",
    colors: {
      primary: "#2563EB",
      secondary: "#0F172A",
      accent: "#F59E0B",
      surface: "#E5EEF9",
      text: "#0B1220"
    }
  },
  {
    id: "civic-fresh",
    matchTerms: ["nature", "green", "civic", "park", "public", "service", "eco", "fresh"],
    styleTags: ["airy spacing", "fresh greens", "light civic surfaces", "simple modular composition"],
    iconDirection: "Use open icons and outlined badges with modest corner radii.",
    textureDirection: "Use sparse line textures and soft organic curves instead of heavy organic illustration.",
    moodPrompt: "A public-facing product that feels fresh, usable, and optimistic.",
    visualStrategy: "Let one fresh green set the tone, support it with a balanced blue, and keep the rest of the UI light and spacious.",
    overlayRecommendation: "Use a muted forest overlay between 24% and 34%, especially if imagery has bright daylight highlights.",
    textOnImageRecommendation: "Use off-white text with stronger weight and short line lengths.",
    borderRecommendation: "Use soft sage-gray borders and only one stronger green accent per module.",
    placementRecommendation: "Works well for civic portals, local discovery flows, and public service explainers.",
    safeTextRegion: "Use outer margins, open sky, or softly blurred greenery rather than high-detail focal points.",
    cautionZone: "Avoid placing labels on top of foliage clusters or people in motion.",
    stateGuidance: "Support state changes with text labels and icons, not hue shifts alone.",
    colors: {
      primary: "#15803D",
      secondary: "#2563EB",
      accent: "#84CC16",
      surface: "#F7FCF8",
      text: "#132A1B"
    }
  }
];

function normalizeText(value: string | undefined) {
  return value?.trim() ?? "";
}

export function normalizeKeywords(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter(Boolean);
  }

  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function normalizeTaskInput(raw: RawTaskInput): TaskInput {
  return {
    title: normalizeText(raw.title),
    themeText: normalizeText(raw.themeText),
    descriptionText: normalizeText(raw.descriptionText),
    styleKeywords: normalizeKeywords(raw.styleKeywords),
    toneKeywords: normalizeKeywords(raw.toneKeywords)
  };
}

export function getInputModeFromInput(input: TaskInput, hasImage: boolean): InputMode {
  if (hasImage && input.themeText) {
    return "mixed";
  }

  if (hasImage) {
    return "image";
  }

  return "text";
}

function hashString(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
}

export function buildAssetRecord(file: File): AssetRecord {
  const seed = hashString(`${file.name}:${file.type}:${file.size}`);
  const start = seed % filePaletteBank.length;
  const palette = [0, 3, 6].map((offset) => filePaletteBank[(start + offset) % filePaletteBank.length]);
  const imageDensity = file.size > 1_600_000 ? "high" : file.size > 700_000 ? "medium" : "low";
  const aspectHint =
    imageDensity === "high"
      ? "Likely a richer hero image that can support a banner layout."
      : imageDensity === "medium"
        ? "Likely best for feature cards or split hero modules."
        : "Likely better for cards, sections, or supporting visual modules.";

  return {
    assetId: crypto.randomUUID(),
    fileName: file.name,
    mimeType: file.type || "application/octet-stream",
    fileSize: file.size,
    palette,
    subjectHint: "Assume one dominant visual subject and keep key labels out of the central focus zone.",
    aspectHint,
    imageDensity
  };
}

function choosePreset(input: TaskInput) {
  const source = [input.themeText, input.descriptionText, ...input.styleKeywords, ...input.toneKeywords].join(" ").toLowerCase();

  let selected = palettePresets[0];
  let bestScore = -1;

  for (const preset of palettePresets) {
    const score = preset.matchTerms.reduce((total, term) => (source.includes(term) ? total + 1 : total), 0);
    if (score > bestScore) {
      selected = preset;
      bestScore = score;
    }
  }

  return selected;
}

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const value = normalized.length === 3
    ? normalized
        .split("")
        .map((item) => item + item)
        .join("")
    : normalized;

  const numeric = Number.parseInt(value, 16);
  return {
    r: (numeric >> 16) & 255,
    g: (numeric >> 8) & 255,
    b: numeric & 255
  };
}

function channelToLinear(channel: number) {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hex: string) {
  const rgb = hexToRgb(hex);
  return 0.2126 * channelToLinear(rgb.r) + 0.7152 * channelToLinear(rgb.g) + 0.0722 * channelToLinear(rgb.b);
}

export function getContrastRatio(foreground: string, background: string) {
  const first = relativeLuminance(foreground);
  const second = relativeLuminance(background);
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

function buildCssVariables(tokens: ColorToken[]) {
  const lines = tokens.map((token) => `  ${token.tokenName}: ${token.hex};`);
  return [":root {", ...lines, "}"].join("\n");
}

function buildTailwindSnippet(tokens: ColorToken[]) {
  const lines = tokens.map((token) => `      ${token.role}: "${token.hex}",`);
  return ["theme: {", "  extend: {", "    colors: {", ...lines, "    }", "  }", "}"].join("\n");
}

export function buildAnalysisResult(input: TaskInput, asset: AssetRecord | null): AnalysisResult {
  const preset = choosePreset(input);
  const title = input.title || input.themeText || "Design language assistant";
  const keywordPool = [...input.styleKeywords, ...input.toneKeywords, ...fallbackKeywords];
  const uniqueKeywords = Array.from(new Set(keywordPool)).slice(0, 5);
  const contrastRatio = getContrastRatio(preset.colors.text, preset.colors.surface);
  const contrastStatus: ContrastStatus = contrastRatio >= 4.5 ? "pass" : "watch";
  const readabilityStatus: ImageReadabilityStatus = asset?.imageDensity === "high" ? "watch" : "safe";
  const recommendedTextColor = contrastRatio >= 7 ? "#FFFFFF" : "#F8FAFC";
  const overlayOpacity = asset
    ? asset.imageDensity === "high"
      ? "40% to 52%"
      : asset.imageDensity === "medium"
        ? "32% to 40%"
        : "24% to 32%"
    : "24% to 32%";

  const colorSystem: ColorToken[] = [
    {
      label: "Primary",
      tokenName: "--color-primary",
      hex: preset.colors.primary,
      role: "primary",
      usage: "Use for primary actions, key moments, and the strongest brand accent."
    },
    {
      label: "Secondary",
      tokenName: "--color-secondary",
      hex: preset.colors.secondary,
      role: "secondary",
      usage: "Use for supporting hierarchy, navigation moments, and balancing the primary hue."
    },
    {
      label: "Accent",
      tokenName: "--color-accent",
      hex: preset.colors.accent,
      role: "accent",
      usage: "Use sparingly for chips, highlights, or status emphasis rather than large surfaces."
    },
    {
      label: "Surface",
      tokenName: "--color-surface",
      hex: preset.colors.surface,
      role: "surface",
      usage: "Use for cards, content panels, and large background planes."
    },
    {
      label: "Text",
      tokenName: "--color-text-primary",
      hex: preset.colors.text,
      role: "text",
      usage: "Use for body text, labels, and high-legibility content blocks."
    }
  ];

  return {
    summary: {
      title,
      themeSummary: `${input.themeText} is translated into a ${preset.id.replace(/-/g, " ")} direction with enough structure to build a believable MVP demo.`,
      visualStrategy: preset.visualStrategy,
      keywords: uniqueKeywords
    },
    moodboard: {
      styleTags: preset.styleTags,
      iconDirection: preset.iconDirection,
      textureDirection: preset.textureDirection,
      moodPrompt: preset.moodPrompt
    },
    colorSystem,
    imageAdaptation: {
      hasImage: Boolean(asset),
      assetSummary: asset
        ? `${asset.fileName} (${asset.mimeType || "image"}, ${Math.max(1, Math.round(asset.fileSize / 1024))} KB) is attached as the current reference asset.`
        : "No image uploaded yet. These recommendations are generated from the theme and tone inputs only.",
      palette: asset?.palette ?? [preset.colors.primary, preset.colors.secondary, preset.colors.accent],
      overlayRecommendation: asset ? preset.overlayRecommendation : "Start with a 24% to 32% neutral overlay and increase only if the image becomes busy.",
      overlayOpacity,
      textOnImageRecommendation: preset.textOnImageRecommendation,
      recommendedTextColor,
      borderRecommendation: preset.borderRecommendation,
      placementRecommendation: asset ? `${preset.placementRecommendation} ${asset.aspectHint}` : preset.placementRecommendation,
      safeTextRegion: preset.safeTextRegion,
      cautionZone: asset ? `${preset.cautionZone} ${asset.subjectHint}` : preset.cautionZone
    },
    accessibility: {
      contrastRatio,
      contrastStatus,
      contrastAlert:
        contrastStatus === "pass"
          ? `Surface and primary text currently meet a strong contrast baseline at ${contrastRatio}:1.`
          : `Surface and primary text only reach ${contrastRatio}:1, so darken text or lighten the surface before shipping.`,
      readabilityStatus,
      readabilityAlert: asset
        ? readabilityStatus === "watch"
          ? `This image likely has higher visual density, so keep text shorter and increase overlay strength before adding more decoration.`
          : `This image looks safe enough for headings if you respect the suggested text region and overlay range.`
        : "When you add an image later, protect headline readability before adjusting the text color itself.",
      stateGuidance: preset.stateGuidance
    },
    exportSnippets: {
      cssVariables: buildCssVariables(colorSystem),
      tailwindSnippet: buildTailwindSnippet(colorSystem)
    }
  };
}

export const fallbackResult = buildAnalysisResult(
  normalizeTaskInput({
    title: "Singapore Hawker App",
    themeText: "Singapore hawker culture",
    descriptionText: "A polished demo for a community-first food discovery experience.",
    styleKeywords: "warm, urban, friendly",
    toneKeywords: "inclusive, vibrant"
  }),
  null
);
