export interface KeywordAnalysis {
  primaryKeyword: string;
  secondaryKeywords: string[];
  density: number;
  placement: {
    inTitle: boolean;
    inFirstParagraph: boolean;
    inHeadings: boolean;
    inMetaDescription: boolean;
    inUrl: boolean;
    naturalIntegration: boolean;
  };
  stuffingAlert: boolean;
  lsiKeywords: string[];
  suggestedLsiKeywords: string[];
  keywordResearch: {
    searchVolume: 'high' | 'medium' | 'low' | 'unknown';
    difficulty: 'easy' | 'medium' | 'hard' | 'unknown';
    userIntent: 'informational' | 'navigational' | 'transactional' | 'commercial' | 'unknown';
  };
}

export interface LinkAnalysis {
  internal: {
    count: number;
    links: InternalLink[];
    suggestions: string[];
  };
  external: {
    count: number;
    links: ExternalLink[];
    highAuthorityCount: number;
    missingCitations: string[];
  };
}

export interface InternalLink {
  url: string;
  anchorText: string;
  isRelevant: boolean;
  position: number;
}

export interface ExternalLink {
  url: string;
  anchorText: string;
  domain: string;
  isHighAuthority: boolean;
  isRelevant: boolean;
  position: number;
}

export interface AnchorTextAnalysis {
  diversity: number;
  types: {
    exactMatch: number;
    brandName: number;
    generic: number;
    descriptive: number;
  };
  recommendations: string[];
}

export interface MetaAnalysis {
  title: {
    present: boolean;
    length: number;
    hasKeyword: boolean;
    keywordPosition: 'beginning' | 'middle' | 'end' | 'none';
    brandName: boolean;
    recommendations: string[];
  };
  description: {
    present: boolean;
    length: number;
    hasKeyword: boolean;
    hasCTA: boolean;
    recommendations: string[];
  };
  url: {
    isSeoFriendly: boolean;
    hasKeyword: boolean;
    length: number;
    hasStopWords: boolean;
    recommendations: string[];
  };
  canonicalTag: boolean;
  schemaMarkup: {
    present: boolean;
    type: string | null;
    recommendations: string[];
  };
  headingStructure: {
    h1Count: number;
    h2Count: number;
    h3Count: number;
    properHierarchy: boolean;
    keywordsInHeadings: boolean;
  };
}

export interface ContentQualityAnalysis {
  readability: {
    score: number;
    level: string;
    avgSentenceLength: number;
    avgParagraphLength: number;
    fleschScore: number;
    fleschKincaidGrade: number;
    smogIndex: number;
    daleChallScore: number;
    complexSentences: string[];
    recommendations: string[];
  };
  structure: {
    hasIntroduction: boolean;
    hasConclusion: boolean;
    paragraphCount: number;
    listCount: number;
    subheadingCount: number;
    shortParagraphs: number;
    longParagraphs: number;
    wallsOfText: number;
    scannabilityScore: number;
    headingHierarchy: {
      h1Count: number;
      h2Count: number;
      h3Count: number;
      properOrder: boolean;
      logicalStructure: boolean;
    };
    recommendations: string[];
  };
  citations: {
    quotesWithAttribution: number;
    totalQuotes: number;
    missingCitations: string[];
    recommendations: string[];
  };
  comprehensiveness: {
    wordCount: number;
    topicCoverage: 'comprehensive' | 'moderate' | 'basic';
    uniqueValue: boolean;
    evergreenContent: boolean;
    recommendations: string[];
  };
  visualElements: {
    imageCount: number;
    videoCount: number;
    listsCount: number;
    chartsInfographics: number;
    boldingUsage: number;
    italicsUsage: number;
    recommendations: string[];
  };
}

export interface SEOScore {
  overall: number;
  seo: number;
  readability: number;
  authority: number;
  technical: number;
  aiOptimization: number;
  breakdown: {
    keywords: number;
    links: number;
    meta: number;
    content: number;
    citations: number;
    images: number;
    technical: number;
    eeat: number;
    aiReadiness: number;
  };
}

export interface SEOAnalysisResult {
  keywords: KeywordAnalysis;
  links: LinkAnalysis;
  anchorText: AnchorTextAnalysis;
  meta: MetaAnalysis;
  content: ContentQualityAnalysis;
  images: ImageVideoAnalysis;
  technical: TechnicalSEOAnalysis;
  aiOptimization: AIOptimizationAnalysis;
  serp: SERPAnalysis;
  keywordIdeas: KeywordIdeaAnalysis;
  titleAnalysis: TitleAnalysis;
  checklist: SEOChecklist;
  socialPreview: SocialPreview;
  score: SEOScore;
  recommendations: Recommendation[];
  contentDetails: ContentAnalysisDetail;
}

export interface Recommendation {
  type: 'critical' | 'important' | 'suggestion';
  category: 'seo' | 'readability' | 'authority' | 'technical' | 'images' | 'ai-optimization';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  specificAction?: string;
  whereToImplement?: string;
  exampleText?: string;
  targetElement?: string;
  position?: 'beginning' | 'middle' | 'end' | 'after-paragraph' | 'in-heading';
}

export interface ContentAnalysisDetail {
  paragraphs: {
    index: number;
    text: string;
    wordCount: number;
    readabilityScore: number;
    hasKeyword: boolean;
    suggestions: string[];
    needsImprovement: boolean;
    linkOpportunities: {
      type: 'internal' | 'external';
      suggestedAnchor: string;
      suggestedTarget: string;
      reason: string;
    }[];
  }[];
  headings: {
    level: number;
    text: string;
    hasKeyword: boolean;
    suggestions: string[];
    index: number;
  }[];
  sentences: {
    text: string;
    length: number;
    complexity: 'simple' | 'moderate' | 'complex';
    paragraphIndex: number;
    needsSimplification: boolean;
  }[];
  realTimeValidation: {
    isAnalyzing: boolean;
    dataSource: 'live-analysis' | 'cached' | 'simulated';
    lastAnalyzed: string;
    confidence: number;
  };
}

export interface AnalysisInput {
  content: string;
  url?: string;
  targetKeyword?: string;
}

export interface ImageVideoAnalysis {
  images: {
    count: number;
    withAltText: number;
    missingAltText: number;
    optimizedFileNames: number;
    largeFileSize: number;
    recommendations: string[];
  };
  videos: {
    count: number;
    embedded: number;
    standalone: number;
    withDescriptions: number;
    recommendations: string[];
  };
}

export interface TechnicalSEOAnalysis {
  mobileOptimization: {
    isResponsive: boolean;
    viewportMeta: boolean;
    recommendations: string[];
  };
  pageSpeed: {
    estimatedLoadTime: 'fast' | 'moderate' | 'slow';
    imageOptimization: boolean;
    cssOptimization: boolean;
    recommendations: string[];
  };
  userExperience: {
    navigationClarity: boolean;
    bounceRateIndicators: string[];
    taskCompletionFactors: string[];
    recommendations: string[];
  };
  eeat: {
    authorBio: boolean;
    expertQuotes: number;
    originalPhotos: number;
    authoritySignals: string[];
    recommendations: string[];
  };
}

export interface AIOptimizationAnalysis {
  aiVisibility: {
    declarativeSentences: number;
    keyPointsUpfront: boolean;
    concreteAnswers: number;
    comprehensiveTopicCoverage: boolean;
    recommendations: string[];
  };
  featuredSnippets: {
    optimizedForSnippets: boolean;
    faqStructure: boolean;
    howToStructure: boolean;
    recommendations: string[];
  };
  brandMentions: {
    brandPresence: number;
    positiveContext: boolean;
    recommendations: string[];
  };
}

export interface SERPAnalysis {
  topResults: {
    url: string;
    title: string;
    wordCount: number;
    imageCount: number;
    headings: {
      h1: string[];
      h2: string[];
      h3: string[];
    };
    backlinks: number;
    domainAuthority: number;
    contentScore: number;
  }[];
  yourBlogAnalysis: {
    competitivePosition: number;
    strengthsVsCompetitors: string[];
    weaknessesVsCompetitors: string[];
    contentGaps: string[];
    rankingPotential: 'high' | 'medium' | 'low';
    improvementAreas: {
      priority: 'critical' | 'high' | 'medium' | 'low';
      area: string;
      description: string;
      impact: string;
    }[];
  };
  peopleAlsoAsk: string[];
  relatedSearches: string[];
  averageWordCount: number;
  contentGaps: string[];
  competitorInsights: {
    commonKeywords: string[];
    averageHeadingCount: number;
    averageImageCount: number;
    contentPatterns: string[];
    successFactors: string[];
  };
  recommendations: string[];
}

export interface KeywordIdeaAnalysis {
  autocompleteKeywords: string[];
  relatedKeywords: string[];
  longtailSuggestions: string[];
  questionKeywords: string[];
  searchVolumeTrends: 'rising' | 'stable' | 'declining' | 'unknown';
  competitorKeywords: string[];
}

export interface TitleAnalysis {
  length: {
    characters: number;
    pixels: number;
    isTruncated: boolean;
  };
  powerWords: {
    count: number;
    words: string[];
    emotionalWords: string[];
  };
  structure: {
    hasNumber: boolean;
    isQuestion: boolean;
    hasYear: boolean;
    hasBrackets: boolean;
  };
  clickworthiness: number;
  recommendations: string[];
}

export interface SEOChecklist {
  items: {
    id: string;
    category: 'technical' | 'content' | 'keywords' | 'links' | 'social';
    title: string;
    description: string;
    completed: boolean;
    importance: 'critical' | 'high' | 'medium' | 'low';
    automatedCheck: boolean;
  }[];
  completionPercentage: number;
  criticalIssues: number;
}

export interface SocialPreview {
  google: {
    title: string;
    description: string;
    url: string;
    isTruncated: boolean;
  };
  facebook: {
    title: string;
    description: string;
    image: string;
    isTruncated: boolean;
  };
  twitter: {
    title: string;
    description: string;
    image: string;
    cardType: 'summary' | 'summary_large_image';
    isTruncated: boolean;
  };
  recommendations: string[];
}