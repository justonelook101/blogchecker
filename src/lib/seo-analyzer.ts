import * as cheerio from 'cheerio';
import nlp from 'compromise';
import { 
  SEOAnalysisResult, 
  AnalysisInput, 
  KeywordAnalysis, 
  LinkAnalysis,
  MetaAnalysis,
  ContentQualityAnalysis,
  ImageVideoAnalysis,
  TechnicalSEOAnalysis,
  AIOptimizationAnalysis,
  SERPAnalysis,
  KeywordIdeaAnalysis,
  TitleAnalysis,
  SEOChecklist,
  SocialPreview,
  SEOScore,
  Recommendation,
  AnchorTextAnalysis,
  ContentAnalysisDetail
} from '@/types/seo';

export class SEOAnalyzer {
  private readonly HIGH_AUTHORITY_DOMAINS = [
    'wikipedia.org', 'google.com', 'apple.com', 'microsoft.com',
    'amazon.com', 'facebook.com', 'twitter.com', 'linkedin.com',
    'github.com', 'stackoverflow.com', 'medium.com', 'forbes.com',
    'nytimes.com', 'bbc.com', 'cnn.com', 'reuters.com', 'wsj.com',
    'techcrunch.com', 'mashable.com', 'wired.com', 'harvard.edu',
    'stanford.edu', 'mit.edu', 'nih.gov', 'cdc.gov', 'gov.uk'
  ];

  private readonly LSI_KEYWORD_MAP: Record<string, string[]> = {
    'seo': ['search engine optimization', 'google ranking', 'keywords', 'backlinks', 'content marketing'],
    'marketing': ['digital marketing', 'social media', 'advertising', 'branding', 'promotion'],
    'technology': ['software', 'programming', 'development', 'innovation', 'digital'],
    'business': ['entrepreneur', 'startup', 'strategy', 'growth', 'revenue'],
    'health': ['wellness', 'fitness', 'nutrition', 'medical', 'healthcare'],
    'finance': ['money', 'investment', 'banking', 'financial', 'economy']
  };

  private readonly POWER_WORDS = [
    'ultimate', 'complete', 'definitive', 'comprehensive', 'exclusive', 'secret',
    'proven', 'guaranteed', 'amazing', 'incredible', 'extraordinary', 'phenomenal',
    'free', 'instant', 'quick', 'easy', 'simple', 'effortless',
    'best', 'top', 'leading', 'premium', 'professional', 'expert',
    'breakthrough', 'revolutionary', 'innovative', 'cutting-edge', 'advanced'
  ];

  private readonly EMOTIONAL_WORDS = [
    'love', 'hate', 'fear', 'surprise', 'anger', 'joy', 'trust', 'anticipation',
    'exciting', 'thrilling', 'shocking', 'devastating', 'heartbreaking', 'inspiring',
    'motivating', 'empowering', 'transformative', 'life-changing', 'mind-blowing'
  ];

  private readonly CHECKLIST_ITEMS = [
    { id: 'title-keyword', category: 'keywords' as const, title: 'Keyword in Title', description: 'Primary keyword appears in page title', importance: 'critical' as const },
    { id: 'meta-description', category: 'technical' as const, title: 'Meta Description', description: 'Meta description is present and optimized', importance: 'high' as const },
    { id: 'h1-tag', category: 'content' as const, title: 'Single H1 Tag', description: 'Page has exactly one H1 tag', importance: 'high' as const },
    { id: 'internal-links', category: 'links' as const, title: 'Internal Links', description: 'Content includes relevant internal links', importance: 'medium' as const },
    { id: 'external-links', category: 'links' as const, title: 'External Authority Links', description: 'Links to high-authority external sources', importance: 'medium' as const },
    { id: 'alt-text', category: 'technical' as const, title: 'Image Alt Text', description: 'All images have descriptive alt text', importance: 'high' as const },
    { id: 'mobile-friendly', category: 'technical' as const, title: 'Mobile Responsive', description: 'Page is mobile-friendly', importance: 'critical' as const },
    { id: 'page-speed', category: 'technical' as const, title: 'Page Speed', description: 'Page loads quickly', importance: 'high' as const },
    { id: 'social-meta', category: 'social' as const, title: 'Social Media Tags', description: 'Open Graph and Twitter Card tags present', importance: 'medium' as const },
    { id: 'readability', category: 'content' as const, title: 'Content Readability', description: 'Content is easy to read and understand', importance: 'high' as const }
  ];

  async analyze(input: AnalysisInput): Promise<SEOAnalysisResult> {
    const $ = cheerio.load(input.content);
    const textContent = $('body').text() || $('*').text();
    
    const keywords = this.analyzeKeywords(input.content, textContent, input.targetKeyword, input.url);
    const links = this.analyzeLinks($, input.url);
    const anchorText = this.analyzeAnchorText($);
    const meta = this.analyzeMeta($, keywords.primaryKeyword, input.url);
    const content = this.analyzeContentQuality(textContent, $);
    const images = this.analyzeImagesAndVideos($);
    const technical = this.analyzeTechnicalSEO($);
    const aiOptimization = this.analyzeAIOptimization($, textContent);
    
    // Enhanced content analysis with detailed breakdown
    const contentDetails = this.analyzeContentDetails($, textContent, keywords.primaryKeyword);
    
    // Prepare your content data for SERP comparison
    const yourContentData = {
      wordCount: textContent.split(/\s+/).length,
      imageCount: $('img').length,
      headingCount: $('h1, h2, h3, h4, h5, h6').length,
      keywordDensity: this.countKeywordOccurrences(textContent, keywords.primaryKeyword) / textContent.split(/\s+/).length * 100,
      readabilityScore: content.readability.fleschScore
    };
    
    // New advanced features
    const serp = await this.analyzeSERP(keywords.primaryKeyword, yourContentData);
    const keywordIdeas = await this.generateKeywordIdeas(keywords.primaryKeyword);
    const titleAnalysis = this.analyzeTitle(meta.title.present ? $('title').text() : '', keywords.primaryKeyword);
    const checklist = this.generateSEOChecklist(keywords, links, meta, content, images, technical);
    const socialPreview = this.generateSocialPreview($, meta);
    
    const score = this.calculateScore(keywords, links, meta, content, anchorText, images, technical, aiOptimization);
    const recommendations = this.generateEnhancedRecommendations(
      keywords, links, meta, content, anchorText, images, technical, aiOptimization, contentDetails
    );

    return {
      keywords,
      links,
      anchorText,
      meta,
      content,
      images,
      technical,
      aiOptimization,
      serp,
      keywordIdeas,
      titleAnalysis,
      checklist,
      socialPreview,
      score,
      recommendations,
      contentDetails
    };
  }

  private analyzeKeywords(htmlContent: string, textContent: string, targetKeyword?: string, url?: string): KeywordAnalysis {
    const $ = cheerio.load(htmlContent);
    const doc = nlp(textContent);
    
    // Extract potential keywords
    const words: any = {}; // Simplified for now
    const phrases = doc.match('#Noun+ #Noun+').out('array');
    
    // Determine primary keyword
    let primaryKeyword = targetKeyword || '';
    if (!primaryKeyword) {
      // Use most frequent meaningful phrase or word
      const meaningfulPhrases = phrases.filter((phrase: string) => 
        phrase.length > 3 && phrase.split(' ').length >= 2
      );
      primaryKeyword = meaningfulPhrases[0] || 'content' || '';
    }

    // Calculate keyword density
    const wordCount = textContent.split(/\s+/).length;
    const keywordOccurrences = this.countKeywordOccurrences(textContent, primaryKeyword);
    const density = (keywordOccurrences / wordCount) * 100;

    // Check keyword placement
    const title = $('title, h1').first().text().toLowerCase();
    const firstParagraph = $('p').first().text().toLowerCase();
    const headings = $('h1, h2, h3, h4, h5, h6').text().toLowerCase();
    const metaDescription = $('meta[name="description"]').attr('content')?.toLowerCase() || '';
    const urlText = (url || '').toLowerCase();

    // Check natural integration (keyword density should be between 0.5-2.5% for natural integration)
    const naturalIntegration = density >= 0.5 && density <= 2.5;

    const placement = {
      inTitle: title.includes(primaryKeyword.toLowerCase()),
      inFirstParagraph: firstParagraph.includes(primaryKeyword.toLowerCase()),
      inHeadings: headings.includes(primaryKeyword.toLowerCase()),
      inMetaDescription: metaDescription.includes(primaryKeyword.toLowerCase()),
      inUrl: urlText.includes(primaryKeyword.toLowerCase().replace(/\s+/g, '-')),
      naturalIntegration
    };

    // Detect keyword stuffing (density > 3% is considered stuffing)
    const stuffingAlert = density > 3;

    // Generate LSI keywords
    const lsiKeywords = this.extractLSIKeywords(textContent, primaryKeyword);
    const suggestedLsiKeywords = this.suggestLSIKeywords(primaryKeyword);

    // Extract secondary keywords
    const secondaryKeywords = phrases
      .filter((phrase: string) => phrase !== primaryKeyword)
      .slice(0, 5);

    // Analyze keyword research factors
    const keywordResearch = this.analyzeKeywordResearch(primaryKeyword);

    return {
      primaryKeyword,
      secondaryKeywords,
      density: Math.round(density * 100) / 100,
      placement,
      stuffingAlert,
      lsiKeywords,
      suggestedLsiKeywords,
      keywordResearch
    };
  }

  private analyzeLinks($: any, baseUrl?: string): LinkAnalysis {
    const internalLinks: any[] = [];
    const externalLinks: any[] = [];

    $('a[href]').each((index: number, element: any) => {
      const href = $(element).attr('href');
      const anchorText = $(element).text().trim();
      
      if (!href || href.startsWith('#')) return;

      const isInternal = this.isInternalLink(href, baseUrl);
      const linkData = {
        url: href,
        anchorText,
        position: index
      };

      if (isInternal) {
        internalLinks.push({
          ...linkData,
          isRelevant: this.isRelevantLink(anchorText, href)
        });
      } else {
        const domain = this.extractDomain(href);
        externalLinks.push({
          ...linkData,
          domain,
          isHighAuthority: this.isHighAuthorityDomain(domain),
          isRelevant: this.isRelevantLink(anchorText, href)
        });
      }
    });

    // Generate suggestions for internal links
    const suggestions = this.generateInternalLinkSuggestions($);

    // Find missing citations
    const missingCitations = this.findMissingCitations($);

    return {
      internal: {
        count: internalLinks.length,
        links: internalLinks,
        suggestions
      },
      external: {
        count: externalLinks.length,
        links: externalLinks,
        highAuthorityCount: externalLinks.filter(link => link.isHighAuthority).length,
        missingCitations
      }
    };
  }

  private analyzeAnchorText($: any): AnchorTextAnalysis {
    const anchorTexts: string[] = [];
    
    $('a[href]').each((_: number, element: any) => {
      const text = $(element).text().trim();
      if (text) anchorTexts.push(text.toLowerCase());
    });

    const types = {
      exactMatch: 0,
      brandName: 0,
      generic: 0,
      descriptive: 0
    };

    const genericTerms = ['click here', 'read more', 'learn more', 'here', 'this', 'link'];
    
    anchorTexts.forEach(text => {
      if (genericTerms.includes(text)) {
        types.generic++;
      } else if (text.length < 10) {
        types.brandName++;
      } else if (text.length > 20) {
        types.descriptive++;
      } else {
        types.exactMatch++;
      }
    });

    const totalLinks = anchorTexts.length;
    const diversity = totalLinks > 0 ? 
      (new Set(anchorTexts).size / totalLinks) * 100 : 0;

    const recommendations: string[] = [];
    
    if (types.generic / totalLinks > 0.3) {
      recommendations.push('Reduce generic anchor text like "click here" and "read more"');
    }
    
    if (diversity < 50) {
      recommendations.push('Improve anchor text diversity by using varied descriptive phrases');
    }

    return {
      diversity: Math.round(diversity),
      types,
      recommendations
    };
  }

  private analyzeMeta($: any, primaryKeyword: string, url?: string): MetaAnalysis {
    const title = $('title').text();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const canonicalTag = $('link[rel="canonical"]').length > 0;
    
    // Analyze keyword position in title
    const titleLower = title.toLowerCase();
    const keywordLower = primaryKeyword.toLowerCase();
    let keywordPosition: 'beginning' | 'middle' | 'end' | 'none' = 'none';
    if (titleLower.includes(keywordLower)) {
      const keywordIndex = titleLower.indexOf(keywordLower);
      const titleLength = titleLower.length;
      if (keywordIndex < titleLength * 0.3) keywordPosition = 'beginning';
      else if (keywordIndex > titleLength * 0.7) keywordPosition = 'end';
      else keywordPosition = 'middle';
    }

    // Check for brand name in title
    const brandName = this.detectBrandName(title);

    // Check for CTA in meta description
    const ctaWords = ['download', 'learn', 'discover', 'find out', 'get', 'try', 'start', 'join', 'sign up'];
    const hasCTA = ctaWords.some(word => metaDescription.toLowerCase().includes(word));

    // Analyze URL SEO-friendliness
    const urlAnalysis = this.analyzeURL(url, primaryKeyword);
    
    // Analyze schema markup
    const schemaScript = $('script[type="application/ld+json"]').html();
    let schemaMarkup = { present: false, type: null as string | null, recommendations: [] as string[] };
    
    if (schemaScript) {
      try {
        const schema = JSON.parse(schemaScript);
        schemaMarkup = {
          present: true,
          type: schema['@type'] || null,
          recommendations: []
        };
      } catch (e) {
        schemaMarkup.recommendations.push('Fix invalid JSON-LD schema markup');
      }
    } else {
      schemaMarkup.recommendations.push('Add schema markup for better search engine understanding');
    }

    // Analyze heading structure
    const h1Count = $('h1').length;
    const h2Count = $('h2').length;
    const h3Count = $('h3').length;
    
    // Check if keywords appear in headings
    const allHeadings = $('h1, h2, h3, h4, h5, h6').text().toLowerCase();
    const keywordsInHeadings = allHeadings.includes(keywordLower);
    
    const headingStructure = {
      h1Count,
      h2Count,
      h3Count,
      properHierarchy: h1Count === 1 && h2Count > 0,
      keywordsInHeadings
    };

    return {
      title: {
        present: title.length > 0,
        length: title.length,
        hasKeyword: titleLower.includes(keywordLower),
        keywordPosition,
        brandName,
        recommendations: this.getTitleRecommendations(title, primaryKeyword, keywordPosition)
      },
      description: {
        present: metaDescription.length > 0,
        length: metaDescription.length,
        hasKeyword: metaDescription.toLowerCase().includes(keywordLower),
        hasCTA,
        recommendations: this.getMetaDescriptionRecommendations(metaDescription, primaryKeyword, hasCTA)
      },
      url: urlAnalysis,
      canonicalTag,
      schemaMarkup,
      headingStructure
    };
  }

  private analyzeContentQuality(textContent: string, $: any): ContentQualityAnalysis {
    // Enhanced readability analysis with multiple algorithms
    const sentences = textContent.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = textContent.split(/\s+/).filter(w => w.length > 0);
    const paragraphs = $('p').length;
    
    const avgSentenceLength = words.length / sentences.length;
    const avgParagraphLength = words.length / paragraphs;
    
    // Calculate multiple readability scores
    const syllableCount = this.countSyllables(textContent);
    const avgSyllablesPerWord = syllableCount / words.length;
    
    // Flesch Reading Ease
    const fleschScore = Math.max(0, Math.min(100, 
      206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllablesPerWord
    ));
    
    // Flesch-Kincaid Grade Level
    const fleschKincaidGrade = 0.39 * avgSentenceLength + 11.8 * avgSyllablesPerWord - 15.59;
    
    // SMOG Index (requires 30+ sentences)
    const smogIndex = sentences.length >= 30 ? 
      1.0430 * Math.sqrt(this.countPolysyllables(textContent) * (30 / sentences.length)) + 3.1291 : 0;
    
    // Dale-Chall Readability Score (simplified)
    const daleChallScore = this.calculateDaleChallScore(words, sentences.length);
    
    // Find complex sentences (over 20 words)
    const complexSentences = sentences
      .filter(sentence => sentence.trim().split(/\s+/).length > 20)
      .slice(0, 3)
      .map(sentence => sentence.substring(0, 100) + '...');
    
    const readabilityLevel = this.getReadabilityLevel(fleschScore);

    // Enhanced structure analysis
    const hasIntroduction = $('p').first().text().length > 100;
    const hasConclusion = $('p').last().text().length > 100;
    const listCount = $('ul, ol').length;
    const subheadingCount = $('h2, h3, h4, h5, h6').length;
    
    // Analyze paragraph lengths and walls of text
    let shortParagraphs = 0;
    let longParagraphs = 0;
    let wallsOfText = 0;
    
    $('p').each((_: number, el: any) => {
      const paragraphLength = $(el).text().split(/\s+/).length;
      if (paragraphLength <= 50) shortParagraphs++;
      if (paragraphLength > 150) longParagraphs++;
      if (paragraphLength > 300) wallsOfText++;
    });
    
    // Heading hierarchy analysis
    const h1Count = $('h1').length;
    const h2Count = $('h2').length;
    const h3Count = $('h3').length;
    
    // Check logical heading order
    const headings: number[] = [];
    $('h1, h2, h3, h4, h5, h6').each((_: number, el: any) => {
      const level = parseInt($(el).prop('tagName').substring(1));
      headings.push(level);
    });
    
    const properOrder = this.checkHeadingOrder(headings);
    const logicalStructure = h1Count === 1 && h2Count > 0;
    
    // Calculate scannability score
    const boldingUsage = $('strong, b').length;
    const italicsUsage = $('em, i').length;
    const scannabilityScore = this.calculateScannabilityScore(
      paragraphs, listCount, subheadingCount, boldingUsage, italicsUsage, wallsOfText
    );

    // Citation analysis (existing)
    const quotes = $('blockquote').length;
    const quotesWithAttribution = $('blockquote cite, blockquote footer').length;
    const missingCitations = this.findStatementsNeedingCitation($);

    // Comprehensiveness analysis (existing)
    const wordCount = words.length;
    let topicCoverage: 'comprehensive' | 'moderate' | 'basic' = 'basic';
    if (wordCount >= 2000) topicCoverage = 'comprehensive';
    else if (wordCount >= 1000) topicCoverage = 'moderate';

    // Check for unique value indicators
    const uniqueValueIndicators = ['case study', 'original research', 'personal experience', 'step-by-step', 'tutorial'];
    const uniqueValue = uniqueValueIndicators.some(indicator => 
      textContent.toLowerCase().includes(indicator)
    );

    // Check for evergreen content indicators
    const timeSpecificWords = ['today', 'this year', 'currently', 'now', 'recently'];
    const evergreenContent = !timeSpecificWords.some(word => 
      textContent.toLowerCase().includes(word)
    );

    // Visual elements analysis (enhanced)
    const imageCount = $('img').length;
    const videoCount = $('video, iframe[src*="youtube"], iframe[src*="vimeo"]').length;
    const listsCount = $('ul, ol').length;
    const chartsInfographics = $('svg, canvas, .chart, .infographic').length;

    return {
      readability: {
        score: Math.round(fleschScore),
        level: readabilityLevel,
        avgSentenceLength: Math.round(avgSentenceLength),
        avgParagraphLength: Math.round(avgParagraphLength),
        fleschScore: Math.round(fleschScore),
        fleschKincaidGrade: Math.round(fleschKincaidGrade * 10) / 10,
        smogIndex: Math.round(smogIndex * 10) / 10,
        daleChallScore: Math.round(daleChallScore * 10) / 10,
        complexSentences,
        recommendations: this.getReadabilityRecommendations(avgSentenceLength, avgParagraphLength, fleschScore)
      },
      structure: {
        hasIntroduction,
        hasConclusion,
        paragraphCount: paragraphs,
        listCount,
        subheadingCount,
        shortParagraphs,
        longParagraphs,
        wallsOfText,
        scannabilityScore,
        headingHierarchy: {
          h1Count,
          h2Count,
          h3Count,
          properOrder,
          logicalStructure
        },
        recommendations: this.getStructureRecommendations(hasIntroduction, hasConclusion, listCount, subheadingCount, shortParagraphs, longParagraphs)
      },
      citations: {
        quotesWithAttribution,
        totalQuotes: quotes,
        missingCitations,
        recommendations: this.getCitationRecommendations(quotes, quotesWithAttribution, missingCitations.length)
      },
      comprehensiveness: {
        wordCount,
        topicCoverage,
        uniqueValue,
        evergreenContent,
        recommendations: this.getComprehensivenessRecommendations(wordCount, topicCoverage, uniqueValue, evergreenContent)
      },
      visualElements: {
        imageCount,
        videoCount,
        listsCount,
        chartsInfographics,
        boldingUsage,
        italicsUsage,
        recommendations: this.getVisualElementsRecommendations(imageCount, videoCount, listsCount, chartsInfographics)
      }
    };
  }

  private calculateScore(
    keywords: KeywordAnalysis,
    links: LinkAnalysis,
    meta: MetaAnalysis,
    content: ContentQualityAnalysis,
    anchorText: AnchorTextAnalysis,
    images: ImageVideoAnalysis,
    technical: TechnicalSEOAnalysis,
    aiOptimization: AIOptimizationAnalysis
  ): SEOScore {
    // Keyword score (0-100)
    let keywordScore = 0;
    if (keywords.primaryKeyword) keywordScore += 20;
    if (keywords.placement.inTitle) keywordScore += 25;
    if (keywords.placement.inFirstParagraph) keywordScore += 15;
    if (keywords.placement.inHeadings) keywordScore += 15;
    if (keywords.density > 0.5 && keywords.density < 3) keywordScore += 15;
    if (!keywords.stuffingAlert) keywordScore += 10;

    // Links score (0-100)
    let linkScore = 0;
    linkScore += Math.min(40, links.internal.count * 5);
    linkScore += Math.min(30, links.external.highAuthorityCount * 10);
    linkScore += Math.min(30, (links.external.count - links.external.missingCitations.length) * 5);

    // Meta score (0-100)
    let metaScore = 0;
    if (meta.title.present && meta.title.hasKeyword) metaScore += 25;
    if (meta.description.present && meta.description.hasKeyword) metaScore += 25;
    if (meta.canonicalTag) metaScore += 15;
    if (meta.schemaMarkup.present) metaScore += 20;
    if (meta.headingStructure.properHierarchy) metaScore += 15;

    // Content score (0-100)
    let contentScore = 0;
    contentScore += Math.min(40, content.readability.score * 0.4);
    if (content.structure.hasIntroduction) contentScore += 15;
    if (content.structure.hasConclusion) contentScore += 15;
    contentScore += Math.min(20, content.structure.listCount * 5);
    contentScore += Math.min(10, content.structure.subheadingCount * 2);

    // Citation score (0-100)
    let citationScore = 0;
    if (content.citations.totalQuotes > 0) {
      citationScore += (content.citations.quotesWithAttribution / content.citations.totalQuotes) * 50;
    }
    citationScore += Math.max(0, 50 - content.citations.missingCitations.length * 10);

    // Images score (0-100)
    let imageScore = 0;
    if (images.images.count > 0) {
      imageScore += (images.images.withAltText / images.images.count) * 40;
      imageScore += Math.min(30, images.images.optimizedFileNames * 5);
      imageScore += Math.max(0, 30 - images.images.largeFileSize * 10);
    }

    // Technical SEO score (0-100)
    let technicalScore = 0;
    if (technical.mobileOptimization.isResponsive) technicalScore += 25;
    if (technical.mobileOptimization.viewportMeta) technicalScore += 15;
    if (technical.pageSpeed.estimatedLoadTime === 'fast') technicalScore += 30;
    else if (technical.pageSpeed.estimatedLoadTime === 'moderate') technicalScore += 20;
    if (technical.eeat.authorBio) technicalScore += 15;
    technicalScore += Math.min(15, technical.eeat.authoritySignals.length * 5);

    // AI Optimization score (0-100)
    let aiScore = 0;
    if (aiOptimization.aiVisibility.keyPointsUpfront) aiScore += 25;
    if (aiOptimization.aiVisibility.comprehensiveTopicCoverage) aiScore += 25;
    aiScore += Math.min(25, aiOptimization.aiVisibility.declarativeSentences * 2);
    if (aiOptimization.featuredSnippets.optimizedForSnippets) aiScore += 25;

    // E-E-A-T score (0-100)
    let eeatScore = 0;
    if (technical.eeat.authorBio) eeatScore += 25;
    eeatScore += Math.min(25, technical.eeat.expertQuotes * 5);
    eeatScore += Math.min(25, technical.eeat.originalPhotos * 3);
    eeatScore += Math.min(25, technical.eeat.authoritySignals.length * 5);

    // Weighted overall score
    const seoScore = Math.round((keywordScore + linkScore + metaScore) / 3);
    const readabilityScore = Math.round(contentScore);
    const authorityScore = Math.round((linkScore + citationScore) / 2);
    const technicalSEOScore = Math.round(technicalScore);
    const aiOptimizationScore = Math.round(aiScore);
    const overallScore = Math.round(
      (seoScore * 0.25 + readabilityScore * 0.2 + authorityScore * 0.2 + technicalSEOScore * 0.2 + aiOptimizationScore * 0.15)
    );

    return {
      overall: overallScore,
      seo: seoScore,
      readability: readabilityScore,
      authority: authorityScore,
      technical: technicalSEOScore,
      aiOptimization: aiOptimizationScore,
      breakdown: {
        keywords: Math.round(keywordScore),
        links: Math.round(linkScore),
        meta: Math.round(metaScore),
        content: Math.round(contentScore),
        citations: Math.round(citationScore),
        images: Math.round(imageScore),
        technical: Math.round(technicalScore),
        eeat: Math.round(eeatScore),
        aiReadiness: Math.round(aiScore)
      }
    };
  }

  // Helper methods
  private countKeywordOccurrences(text: string, keyword: string): number {
    const regex = new RegExp(keyword, 'gi');
    return (text.match(regex) || []).length;
  }

  private analyzeImagesAndVideos($: any): ImageVideoAnalysis {
    const images = $('img');
    const videos = $('video, iframe[src*="youtube"], iframe[src*="vimeo"]');
    
    let withAltText = 0;
    let optimizedFileNames = 0;
    let largeFileSize = 0;
    
    images.each((_: number, img: any) => {
      const altText = $(img).attr('alt');
      const src = $(img).attr('src') || '';
      
      if (altText && altText.trim().length > 0) withAltText++;
      
      // Check for descriptive file names
      const fileName = src.split('/').pop() || '';
      if (fileName.length > 10 && !fileName.startsWith('img') && !fileName.includes('_')) {
        optimizedFileNames++;
      }
      
      // Estimate large file size based on extension (simplified)
      if (src.includes('.png') || src.includes('.bmp')) {
        largeFileSize++;
      }
    });
    
    let embedded = 0;
    let standalone = 0;
    let withDescriptions = 0;
    
    videos.each((_: number, video: any) => {
      const tagName = $(video).prop('tagName').toLowerCase();
      if (tagName === 'iframe') {
        embedded++;
      } else {
        standalone++;
      }
      
      // Check for descriptions (title, aria-label, or nearby text)
      const title = $(video).attr('title');
      const ariaLabel = $(video).attr('aria-label');
      if (title || ariaLabel) withDescriptions++;
    });
    
    return {
      images: {
        count: images.length,
        withAltText,
        missingAltText: images.length - withAltText,
        optimizedFileNames,
        largeFileSize,
        recommendations: this.getImageRecommendations(images.length, withAltText, optimizedFileNames, largeFileSize)
      },
      videos: {
        count: videos.length,
        embedded,
        standalone,
        withDescriptions,
        recommendations: this.getVideoRecommendations(videos.length, withDescriptions)
      }
    };
  }

  private analyzeTechnicalSEO($: any): TechnicalSEOAnalysis {
    // Mobile optimization analysis
    const viewportMeta = $('meta[name="viewport"]').length > 0;
    const isResponsive = viewportMeta; // Simplified check
    
    // Page speed analysis (simplified)
    const imageCount = $('img').length;
    const cssLinks = $('link[rel="stylesheet"]').length;
    const scripts = $('script').length;
    
    let estimatedLoadTime: 'fast' | 'moderate' | 'slow' = 'fast';
    if (imageCount > 20 || cssLinks > 10 || scripts > 15) {
      estimatedLoadTime = 'slow';
    } else if (imageCount > 10 || cssLinks > 5 || scripts > 8) {
      estimatedLoadTime = 'moderate';
    }
    
    // E-E-A-T analysis
    const authorBio = $('author, .author, #author').length > 0;
    const expertQuotes = $('blockquote cite, blockquote footer').length;
    const originalPhotos = $('img[src*="original"], img[src*="photo"]').length;
    
    const authoritySignals = [];
    if ($('link[rel="author"]').length > 0) authoritySignals.push('Author attribution');
    if ($('.credentials, .bio').length > 0) authoritySignals.push('Author credentials');
    if ($('cite, .citation').length > 0) authoritySignals.push('Source citations');
    
    return {
      mobileOptimization: {
        isResponsive,
        viewportMeta,
        recommendations: this.getMobileOptimizationRecommendations(isResponsive, viewportMeta)
      },
      pageSpeed: {
        estimatedLoadTime,
        imageOptimization: imageCount < 15,
        cssOptimization: cssLinks < 8,
        recommendations: this.getPageSpeedRecommendations(estimatedLoadTime, imageCount, cssLinks)
      },
      userExperience: {
        navigationClarity: $('nav, .navigation').length > 0,
        bounceRateIndicators: this.getBounceRateIndicators($),
        taskCompletionFactors: this.getTaskCompletionFactors($),
        recommendations: this.getUXRecommendations($)
      },
      eeat: {
        authorBio,
        expertQuotes,
        originalPhotos,
        authoritySignals,
        recommendations: this.getEEATRecommendations(authorBio, expertQuotes, originalPhotos, authoritySignals.length)
      }
    };
  }

  private analyzeAIOptimization($: any, textContent: string): AIOptimizationAnalysis {
    // Analyze declarative sentences
    const sentences = textContent.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const declarativePatterns = [/^[A-Z].*\.$/, /^The.*\.$/, /^This.*\.$/, /^These.*\.$/, /^That.*\.$/];
    const declarativeSentences = sentences.filter(sentence => 
      declarativePatterns.some(pattern => pattern.test(sentence.trim()))
    ).length;
    
    // Check if key points are upfront
    const firstParagraph = $('p').first().text();
    const keyPointsUpfront = firstParagraph.length > 50 && 
      (firstParagraph.includes(':') || firstParagraph.includes('•') || firstParagraph.includes('1.'));
    
    // Count concrete answers
    const answerPatterns = ['the answer is', 'the result is', 'the solution is', 'in summary', 'to summarize'];
    const concreteAnswers = answerPatterns.filter(pattern => 
      textContent.toLowerCase().includes(pattern)
    ).length;
    
    // Check comprehensive topic coverage
    const comprehensiveTopicCoverage = textContent.length > 3000 && 
      $('h2, h3').length >= 5;
    
    // Featured snippets optimization
    const faqStructure = $('h3:contains("?"), .faq, [class*="faq"]').length > 0;
    const howToStructure = $('ol, .steps, [class*="step"]').length > 0 && 
      (textContent.toLowerCase().includes('how to') || textContent.toLowerCase().includes('step'));
    const optimizedForSnippets = faqStructure || howToStructure;
    
    // Brand mentions analysis
    const brandMentions = this.countBrandMentions(textContent);
    const positiveContext = this.analyzePositiveContext(textContent);
    
    return {
      aiVisibility: {
        declarativeSentences,
        keyPointsUpfront,
        concreteAnswers,
        comprehensiveTopicCoverage,
        recommendations: this.getAIVisibilityRecommendations(declarativeSentences, keyPointsUpfront, concreteAnswers, comprehensiveTopicCoverage)
      },
      featuredSnippets: {
        optimizedForSnippets,
        faqStructure,
        howToStructure,
        recommendations: this.getFeaturedSnippetsRecommendations(optimizedForSnippets, faqStructure, howToStructure)
      },
      brandMentions: {
        brandPresence: brandMentions,
        positiveContext,
        recommendations: this.getBrandMentionsRecommendations(brandMentions, positiveContext)
      }
    };
  }

  private isInternalLink(href: string, baseUrl?: string): boolean {
    if (href.startsWith('/') || href.startsWith('./') || href.startsWith('../')) return true;
    if (baseUrl && href.includes(baseUrl)) return true;
    return false;
  }

  private extractDomain(url: string): string {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return '';
    }
  }

  private isHighAuthorityDomain(domain: string): boolean {
    return this.HIGH_AUTHORITY_DOMAINS.some(authDomain => 
      domain.includes(authDomain) || authDomain.includes(domain)
    );
  }

  private isRelevantLink(anchorText: string, href: string): boolean {
    // Simple relevance check based on anchor text length and descriptiveness
    return anchorText.length > 3 && !['here', 'click', 'link'].includes(anchorText.toLowerCase());
  }

  private extractLSIKeywords(text: string, primaryKeyword: string): string[] {
    const doc = nlp(text);
    const topics = doc.topics().out('array');
    return topics.slice(0, 10);
  }

  private suggestLSIKeywords(primaryKeyword: string): string[] {
    const lowerKeyword = primaryKeyword.toLowerCase();
    for (const [key, keywords] of Object.entries(this.LSI_KEYWORD_MAP)) {
      if (lowerKeyword.includes(key)) {
        return keywords;
      }
    }
    return [];
  }

  private generateInternalLinkSuggestions($: any): string[] {
    const headings = $('h2, h3').map((_: number, el: any) => $(el).text()).get();
    return headings.slice(0, 5).map((heading: string) => `Consider linking to "${heading}" section`);
  }

  private findMissingCitations($: any): string[] {
    const missing: string[] = [];
    $('p').each((_: number, el: any) => {
      const text = $(el).text();
      const hasStatistic = /\d+%|\d+\s*(percent|million|billion|thousand)/.test(text);
      const hasLink = $(el).find('a').length > 0;
      
      if (hasStatistic && !hasLink) {
        missing.push(text.substring(0, 100) + '...');
      }
    });
    return missing.slice(0, 5);
  }

  private findStatementsNeedingCitation($: any): string[] {
    const statements: string[] = [];
    const claimWords = ['research shows', 'studies indicate', 'according to', 'experts say', 'data reveals'];
    
    $('p').each((_: number, el: any) => {
      const text = $(el).text().toLowerCase();
      const hasClaim = claimWords.some(word => text.includes(word));
      const hasLink = $(el).find('a').length > 0;
      
      if (hasClaim && !hasLink) {
        statements.push($(el).text().substring(0, 100) + '...');
      }
    });
    return statements.slice(0, 5);
  }

  private countSyllables(text: string): number {
    // Simple syllable counting algorithm
    const words = text.toLowerCase().split(/\s+/);
    let totalSyllables = 0;
    
    words.forEach(word => {
      word = word.replace(/[^a-z]/g, '');
      if (word.length <= 3) {
        totalSyllables += 1;
      } else {
        const syllables = word.match(/[aeiouy]+/g) || [];
        totalSyllables += Math.max(1, syllables.length);
      }
    });
    
    return totalSyllables;
  }

  private getReadabilityLevel(score: number): string {
    if (score >= 90) return 'Very Easy';
    if (score >= 80) return 'Easy';
    if (score >= 70) return 'Fairly Easy';
    if (score >= 60) return 'Standard';
    if (score >= 50) return 'Fairly Difficult';
    if (score >= 30) return 'Difficult';
    return 'Very Difficult';
  }

  private getTitleRecommendations(title: string, primaryKeyword: string, keywordPosition: string): string[] {
    const recommendations: string[] = [];
    
    if (!title) recommendations.push('Add a page title');
    if (title.length > 60) recommendations.push('Shorten title to under 60 characters');
    if (title.length < 30) recommendations.push('Expand title to at least 30 characters');
    if (!title.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      recommendations.push(`Include primary keyword "${primaryKeyword}" in title`);
    }
    if (keywordPosition !== 'beginning') {
      recommendations.push('Place primary keyword at the beginning of the title for better SEO');
    }
    if (!title.includes('|') && !title.includes('-')) {
      recommendations.push('Consider adding brand name at the end of the title');
    }
    
    return recommendations;
  }

  private getMetaDescriptionRecommendations(description: string, primaryKeyword: string, hasCTA: boolean): string[] {
    const recommendations: string[] = [];
    
    if (!description) recommendations.push('Add a meta description');
    if (description.length > 160) recommendations.push('Shorten meta description to under 160 characters');
    if (description.length < 120) recommendations.push('Expand meta description to at least 120 characters');
    if (!description.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      recommendations.push(`Include primary keyword "${primaryKeyword}" in meta description`);
    }
    if (!hasCTA) {
      recommendations.push('Add a compelling call-to-action to improve click-through rates');
    }
    
    return recommendations;
  }

  private getReadabilityRecommendations(avgSentenceLength: number, avgParagraphLength: number, fleschScore: number): string[] {
    const recommendations: string[] = [];
    
    if (avgSentenceLength > 20) recommendations.push('Break up long sentences (aim for under 20 words)');
    if (avgParagraphLength > 150) recommendations.push('Split long paragraphs into shorter ones');
    if (fleschScore < 60) recommendations.push('Use simpler language and shorter sentences to improve readability');
    if (fleschScore < 30) recommendations.push('Content is very difficult to read - consider major simplification');
    
    return recommendations;
  }

  private getStructureRecommendations(
    hasIntroduction: boolean, 
    hasConclusion: boolean, 
    listCount: number, 
    subheadingCount: number,
    shortParagraphs: number,
    longParagraphs: number
  ): string[] {
    const recommendations: string[] = [];
    
    if (!hasIntroduction) recommendations.push('Add a clear introduction paragraph');
    if (!hasConclusion) recommendations.push('Add a conclusion section');
    if (listCount === 0) recommendations.push('Consider adding bullet points or numbered lists');
    if (subheadingCount < 3) recommendations.push('Add more subheadings to improve scannability');
    if (longParagraphs > 3) recommendations.push('Break up long paragraphs (over 150 words) into shorter ones');
    if (shortParagraphs < 2) recommendations.push('Use some short paragraphs (3-4 sentences) for better readability');
    
    return recommendations;
  }

  private getCitationRecommendations(quotes: number, quotesWithAttribution: number, missingCount: number): string[] {
    const recommendations: string[] = [];
    
    if (quotes > quotesWithAttribution) {
      recommendations.push('Attribute all quotes to their sources');
    }
    if (missingCount > 0) {
      recommendations.push('Add citations for statistical claims and research references');
    }
    
    return recommendations;
  }

  private generateRecommendations(
    keywords: KeywordAnalysis,
    links: LinkAnalysis,
    meta: MetaAnalysis,
    content: ContentQualityAnalysis,
    anchorText: AnchorTextAnalysis,
    images: ImageVideoAnalysis,
    technical: TechnicalSEOAnalysis,
    aiOptimization: AIOptimizationAnalysis
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Critical recommendations
    if (!keywords.primaryKeyword) {
      recommendations.push({
        type: 'critical',
        category: 'seo',
        title: 'Missing Primary Keyword',
        description: 'Define a primary keyword for your content to improve SEO targeting.',
        impact: 'high'
      });
    }

    if (keywords.stuffingAlert) {
      recommendations.push({
        type: 'critical',
        category: 'seo',
        title: 'Keyword Stuffing Detected',
        description: 'Reduce keyword density to avoid search engine penalties.',
        impact: 'high'
      });
    }

    // Important recommendations
    if (!meta.title.present || !meta.title.hasKeyword) {
      recommendations.push({
        type: 'important',
        category: 'seo',
        title: 'Optimize Page Title',
        description: 'Include your primary keyword in the page title for better SEO.',
        impact: 'high'
      });
    }

    if (links.external.highAuthorityCount < 2) {
      recommendations.push({
        type: 'important',
        category: 'authority',
        title: 'Add High-Authority Links',
        description: 'Link to reputable sources to increase content credibility.',
        impact: 'medium'
      });
    }

    // Suggestions
    if (content.readability.fleschScore < 60) {
      recommendations.push({
        type: 'suggestion',
        category: 'readability',
        title: 'Improve Readability',
        description: 'Use shorter sentences and simpler language to improve readability.',
        impact: 'medium'
      });
    }

    // New recommendations for enhanced features
    if (!meta.url.isSeoFriendly) {
      recommendations.push({
        type: 'important',
        category: 'seo',
        title: 'Optimize URL Structure',
        description: 'Create SEO-friendly URLs that are short, descriptive, and include keywords.',
        impact: 'medium'
      });
    }

    if (images.images.missingAltText > 0) {
      recommendations.push({
        type: 'important',
        category: 'images',
        title: 'Add Alt Text to Images',
        description: `Add descriptive alt text to ${images.images.missingAltText} images for better accessibility and SEO.`,
        impact: 'medium'
      });
    }

    if (!technical.mobileOptimization.isResponsive) {
      recommendations.push({
        type: 'critical',
        category: 'technical',
        title: 'Mobile Optimization Required',
        description: 'Ensure your website is mobile-friendly as Google prioritizes mobile-first indexing.',
        impact: 'high'
      });
    }

    if (!aiOptimization.aiVisibility.keyPointsUpfront) {
      recommendations.push({
        type: 'suggestion',
        category: 'ai-optimization',
        title: 'Optimize for AI Search',
        description: 'Place key points at the beginning of your content for better AI visibility.',
        impact: 'medium'
      });
    }

    if (!technical.eeat.authorBio) {
      recommendations.push({
        type: 'important',
        category: 'authority',
        title: 'Add Author Bio for E-E-A-T',
        description: 'Include author credentials and bio to establish expertise and trustworthiness.',
        impact: 'medium'
      });
    }

    if (content.comprehensiveness.wordCount < 1000) {
      recommendations.push({
        type: 'suggestion',
        category: 'seo',
        title: 'Expand Content Length',
        description: 'Consider expanding content to 1,000+ words for better ranking potential.',
        impact: 'medium'
      });
    }

    return recommendations;
  }

  // Additional helper methods for enhanced functionality
  private getComprehensivenessRecommendations(wordCount: number, topicCoverage: string, uniqueValue: boolean, evergreenContent: boolean): string[] {
    const recommendations: string[] = [];
    
    if (wordCount < 1000) recommendations.push('Consider expanding content to at least 1,000 words for better ranking potential');
    if (wordCount < 1500) recommendations.push('Aim for 1,500-2,400 words for comprehensive topic coverage');
    if (topicCoverage === 'basic') recommendations.push('Expand content to cover the topic more comprehensively');
    if (!uniqueValue) recommendations.push('Add unique insights, original research, or personal experiences');
    if (!evergreenContent) recommendations.push('Consider making content more evergreen by reducing time-specific references');
    
    return recommendations;
  }

  private getVisualElementsRecommendations(imageCount: number, videoCount: number, listsCount: number, chartsInfographics: number): string[] {
    const recommendations: string[] = [];
    
    if (imageCount === 0) recommendations.push('Add relevant images to break up text and enhance engagement');
    if (imageCount < 3) recommendations.push('Consider adding more high-quality, relevant images');
    if (videoCount === 0) recommendations.push('Consider adding video content to improve engagement');
    if (listsCount < 2) recommendations.push('Use more bullet points and numbered lists to improve scannability');
    if (chartsInfographics === 0) recommendations.push('Consider adding charts or infographics for data visualization');
    
    return recommendations;
  }

  private getImageRecommendations(imageCount: number, withAltText: number, optimizedFileNames: number, largeFileSize: number): string[] {
    const recommendations: string[] = [];
    
    if (withAltText < imageCount) {
      recommendations.push(`Add descriptive alt text to ${imageCount - withAltText} images`);
    }
    if (optimizedFileNames < imageCount / 2) {
      recommendations.push('Use more descriptive file names for images (e.g., "seo-tips.jpg" instead of "img123.jpg")');
    }
    if (largeFileSize > 0) {
      recommendations.push('Optimize image file sizes - convert large PNGs to JPG or WebP format');
    }
    if (imageCount > 0 && withAltText === imageCount) {
      recommendations.push('Great job! All images have alt text');
    }
    
    return recommendations;
  }

  private getVideoRecommendations(videoCount: number, withDescriptions: number): string[] {
    const recommendations: string[] = [];
    
    if (videoCount > 0 && withDescriptions < videoCount) {
      recommendations.push('Add descriptive titles and descriptions to all videos');
    }
    if (videoCount === 0) {
      recommendations.push('Consider adding video content to increase engagement and dwell time');
    }
    
    return recommendations;
  }

  private getMobileOptimizationRecommendations(isResponsive: boolean, viewportMeta: boolean): string[] {
    const recommendations: string[] = [];
    
    if (!viewportMeta) recommendations.push('Add viewport meta tag for mobile optimization');
    if (!isResponsive) recommendations.push('Ensure website is responsive and mobile-friendly');
    
    return recommendations;
  }

  private getPageSpeedRecommendations(loadTime: string, imageCount: number, cssLinks: number): string[] {
    const recommendations: string[] = [];
    
    if (loadTime === 'slow') {
      recommendations.push('Optimize page loading speed - critical for SEO and user experience');
    }
    if (imageCount > 15) {
      recommendations.push('Reduce number of images or implement lazy loading');
    }
    if (cssLinks > 8) {
      recommendations.push('Minimize CSS files and combine where possible');
    }
    
    return recommendations;
  }

  private getBounceRateIndicators($: any): string[] {
    const indicators: string[] = [];
    
    if ($('p').first().text().length < 100) indicators.push('Short introduction paragraph');
    if ($('h2, h3').length < 3) indicators.push('Limited content structure');
    if ($('ul, ol').length === 0) indicators.push('No lists for easy scanning');
    
    return indicators;
  }

  private getTaskCompletionFactors($: any): string[] {
    const factors: string[] = [];
    
    if ($('nav, .navigation').length > 0) factors.push('Clear navigation present');
    if ($('button, .cta, [href*="contact"]').length > 0) factors.push('Action elements available');
    if ($('search, [type="search"]').length > 0) factors.push('Search functionality available');
    
    return factors;
  }

  private getUXRecommendations($: any): string[] {
    const recommendations: string[] = [];
    
    if ($('nav, .navigation').length === 0) {
      recommendations.push('Add clear navigation to improve user experience');
    }
    if ($('search, [type="search"]').length === 0) {
      recommendations.push('Consider adding search functionality');
    }
    
    return recommendations;
  }

  private getEEATRecommendations(authorBio: boolean, expertQuotes: number, originalPhotos: number, authoritySignals: number): string[] {
    const recommendations: string[] = [];
    
    if (!authorBio) recommendations.push('Add author bio to establish expertise and trustworthiness');
    if (expertQuotes < 2) recommendations.push('Include quotes from industry experts or authorities');
    if (originalPhotos === 0) recommendations.push('Add original photos to demonstrate first-hand experience');
    if (authoritySignals < 2) recommendations.push('Add more authority signals (credentials, citations, author links)');
    
    return recommendations;
  }

  private getAIVisibilityRecommendations(declarativeSentences: number, keyPointsUpfront: boolean, concreteAnswers: number, comprehensiveTopicCoverage: boolean): string[] {
    const recommendations: string[] = [];
    
    if (declarativeSentences < 5) {
      recommendations.push('Use more declarative sentences for better AI understanding');
    }
    if (!keyPointsUpfront) {
      recommendations.push('Start with key points upfront for AI overviews and featured snippets');
    }
    if (concreteAnswers < 2) {
      recommendations.push('Provide more concrete, direct answers to questions');
    }
    if (!comprehensiveTopicCoverage) {
      recommendations.push('Expand content to cover topic comprehensively for AI search');
    }
    
    return recommendations;
  }

  private getFeaturedSnippetsRecommendations(optimizedForSnippets: boolean, faqStructure: boolean, howToStructure: boolean): string[] {
    const recommendations: string[] = [];
    
    if (!optimizedForSnippets) {
      recommendations.push('Structure content for featured snippets with clear questions and answers');
    }
    if (!faqStructure) {
      recommendations.push('Consider adding FAQ section for better snippet optimization');
    }
    if (!howToStructure) {
      recommendations.push('Use numbered lists for step-by-step instructions');
    }
    
    return recommendations;
  }

  private getBrandMentionsRecommendations(brandMentions: number, positiveContext: boolean): string[] {
    const recommendations: string[] = [];
    
    if (brandMentions === 0) {
      recommendations.push('Include brand mentions naturally throughout the content');
    }
    if (!positiveContext) {
      recommendations.push('Ensure brand mentions appear in positive, authoritative contexts');
    }
    
    return recommendations;
  }

  private countBrandMentions(text: string): number {
    // Simplified brand mention counting
    const brandKeywords = ['company', 'brand', 'business', 'organization', 'team'];
    return brandKeywords.filter(keyword => text.toLowerCase().includes(keyword)).length;
  }

  private analyzePositiveContext(text: string): boolean {
    const positiveWords = ['expert', 'leading', 'trusted', 'professional', 'quality', 'excellent', 'proven'];
    return positiveWords.some(word => text.toLowerCase().includes(word));
  }

  // New advanced analysis methods
  
  private async analyzeSERP(keyword: string, yourContent?: { wordCount: number; imageCount: number; headingCount: number; keywordDensity: number; readabilityScore: number }): Promise<SERPAnalysis> {
    // Simulate comprehensive SERP analysis (in production, this would scrape Google)
    // Enhanced to provide detailed competitor insights and your blog comparison
    const topResults = [
      {
        url: 'https://example1.com/ultimate-guide',
        title: `Ultimate Guide to ${keyword} - Complete Tutorial`,
        wordCount: 2800,
        imageCount: 12,
        backlinks: 847,
        domainAuthority: 78,
        contentScore: 92,
        headings: {
          h1: [`Ultimate ${keyword} Guide`],
          h2: ['What is ' + keyword, 'Why Important', 'Step-by-Step Process', 'Best Practices', 'Common Mistakes', 'Tools & Resources'],
          h3: ['Getting Started', 'Advanced Tips', 'Case Studies', 'FAQ']
        }
      },
      {
        url: 'https://authority-site.com/complete-tutorial',
        title: `Complete ${keyword} Tutorial for Beginners`,
        wordCount: 2200,
        imageCount: 8,
        backlinks: 523,
        domainAuthority: 65,
        contentScore: 88,
        headings: {
          h1: [`${keyword} Tutorial`],
          h2: ['Introduction', 'Benefits', 'How to Start', 'Examples', 'Troubleshooting'],
          h3: ['Quick Start', 'Pro Tips', 'Resources']
        }
      },
      {
        url: 'https://expert-blog.com/best-practices',
        title: `${keyword} Best Practices: Expert Tips`,
        wordCount: 1900,
        imageCount: 6,
        backlinks: 392,
        domainAuthority: 72,
        contentScore: 85,
        headings: {
          h1: [`${keyword} Best Practices`],
          h2: ['Expert Strategies', 'Implementation', 'Optimization', 'Measuring Success'],
          h3: ['Quick Wins', 'Advanced Techniques']
        }
      },
      {
        url: 'https://industry-leader.com/comprehensive-guide',
        title: `The Definitive ${keyword} Guide`,
        wordCount: 3200,
        imageCount: 15,
        backlinks: 1205,
        domainAuthority: 85,
        contentScore: 95,
        headings: {
          h1: [`Definitive ${keyword} Guide`],
          h2: ['Fundamentals', 'Advanced Concepts', 'Implementation', 'Case Studies', 'Future Trends'],
          h3: ['Basics', 'Intermediate', 'Expert Level', 'Real Examples']
        }
      },
      {
        url: 'https://popular-blog.com/how-to-guide',
        title: `How to Master ${keyword} in 2024`,
        wordCount: 2100,
        imageCount: 9,
        backlinks: 334,
        domainAuthority: 58,
        contentScore: 82,
        headings: {
          h1: [`Master ${keyword}`],
          h2: ['2024 Updates', 'Step-by-Step', 'Tools', 'Mistakes to Avoid'],
          h3: ['Getting Started', 'Optimization']
        }
      }
    ];

    // Analyze competitor patterns
    const averageWordCount = Math.round(topResults.reduce((sum, result) => sum + result.wordCount, 0) / topResults.length);
    const averageImageCount = Math.round(topResults.reduce((sum, result) => sum + result.imageCount, 0) / topResults.length);
    const averageHeadingCount = Math.round(topResults.reduce((sum, result) => {
      return sum + result.headings.h2.length + result.headings.h3.length;
    }, 0) / topResults.length);

    // Extract common keywords and patterns
    const commonKeywords = this.extractCommonKeywords(topResults, keyword);
    const contentPatterns = this.analyzeContentPatterns(topResults);
    const successFactors = this.identifySuccessFactors(topResults);

    // Analyze your blog vs competitors (if content provided)
    let yourBlogAnalysis = {
      competitivePosition: 0,
      strengthsVsCompetitors: [] as string[],
      weaknessesVsCompetitors: [] as string[],
      contentGaps: [] as string[],
      rankingPotential: 'medium' as 'high' | 'medium' | 'low',
      improvementAreas: [] as {
        priority: 'critical' | 'high' | 'medium' | 'low';
        area: string;
        description: string;
        impact: string;
      }[]
    };

    if (yourContent) {
      yourBlogAnalysis = this.compareWithCompetitors(yourContent, topResults, averageWordCount, averageImageCount, averageHeadingCount);
    }

    return {
      topResults,
      yourBlogAnalysis,
      peopleAlsoAsk: [
        `What is ${keyword} and why is it important?`,
        `How to get started with ${keyword}?`,
        `Best ${keyword} practices for beginners`,
        `Common ${keyword} mistakes to avoid`,
        `${keyword} vs alternatives comparison`,
        `How long does it take to see ${keyword} results?`
      ],
      relatedSearches: [
        `${keyword} tutorial`,
        `${keyword} guide 2024`,
        `${keyword} best practices`,
        `${keyword} for beginners`,
        `${keyword} tools`,
        `${keyword} examples`,
        `how to improve ${keyword}`,
        `${keyword} mistakes`
      ],
      averageWordCount,
      contentGaps: this.identifyContentGaps(topResults, keyword),
      competitorInsights: {
        commonKeywords,
        averageHeadingCount,
        averageImageCount,
        contentPatterns,
        successFactors
      },
      recommendations: this.generateSERPRecommendations(topResults, yourBlogAnalysis, averageWordCount, averageImageCount)
    };
  }

  private async generateKeywordIdeas(keyword: string): Promise<KeywordIdeaAnalysis> {
    // Simulate keyword idea generation (in production, this would use APIs or scraping)
    const baseKeyword = keyword.toLowerCase();
    
    return {
      autocompleteKeywords: [
        `${baseKeyword} tutorial`,
        `${baseKeyword} guide`,
        `${baseKeyword} tips`,
        `${baseKeyword} for beginners`,
        `${baseKeyword} best practices`
      ],
      relatedKeywords: [
        `how to ${baseKeyword}`,
        `${baseKeyword} examples`,
        `${baseKeyword} tools`,
        `${baseKeyword} strategy`,
        `${baseKeyword} techniques`
      ],
      longtailSuggestions: [
        `best ${baseKeyword} tools for small business`,
        `how to improve ${baseKeyword} quickly`,
        `${baseKeyword} mistakes to avoid`,
        `advanced ${baseKeyword} techniques`
      ],
      questionKeywords: [
        `what is ${baseKeyword}`,
        `why is ${baseKeyword} important`,
        `how does ${baseKeyword} work`,
        `when to use ${baseKeyword}`
      ],
      searchVolumeTrends: 'stable',
      competitorKeywords: [
        `${baseKeyword} alternatives`,
        `${baseKeyword} comparison`,
        `${baseKeyword} review`
      ]
    };
  }

  private analyzeTitle(title: string, keyword: string): TitleAnalysis {
    if (!title) {
      return {
        length: { characters: 0, pixels: 0, isTruncated: false },
        powerWords: { count: 0, words: [], emotionalWords: [] },
        structure: { hasNumber: false, isQuestion: false, hasYear: false, hasBrackets: false },
        clickworthiness: 0,
        recommendations: ['Add a compelling title']
      };
    }

    const characters = title.length;
    // Rough pixel calculation (average character width ~6px)
    const pixels = characters * 6;
    const isTruncated = characters > 60 || pixels > 600;

    // Find power words and emotional words
    const titleLower = title.toLowerCase();
    const foundPowerWords = this.POWER_WORDS.filter(word => titleLower.includes(word));
    const foundEmotionalWords = this.EMOTIONAL_WORDS.filter(word => titleLower.includes(word));

    // Analyze structure
    const hasNumber = /\d+/.test(title);
    const isQuestion = title.includes('?');
    const hasYear = /20\d{2}/.test(title);
    const hasBrackets = /[\[\(]/.test(title);

    // Calculate clickworthiness score (0-100)
    let clickworthiness = 50; // Base score
    if (foundPowerWords.length > 0) clickworthiness += 15;
    if (foundEmotionalWords.length > 0) clickworthiness += 10;
    if (hasNumber) clickworthiness += 10;
    if (titleLower.includes(keyword.toLowerCase())) clickworthiness += 15;
    if (characters >= 30 && characters <= 60) clickworthiness += 10;
    if (isTruncated) clickworthiness -= 20;

    const recommendations: string[] = [];
    if (isTruncated) recommendations.push('Shorten title to avoid truncation in search results');
    if (foundPowerWords.length === 0) recommendations.push('Add power words like "ultimate", "complete", or "best"');
    if (!hasNumber && !isQuestion) recommendations.push('Consider adding a number for listicle-style appeal');
    if (!titleLower.includes(keyword.toLowerCase())) recommendations.push('Include your target keyword in the title');

    return {
      length: { characters, pixels, isTruncated },
      powerWords: { count: foundPowerWords.length, words: foundPowerWords, emotionalWords: foundEmotionalWords },
      structure: { hasNumber, isQuestion, hasYear, hasBrackets },
      clickworthiness: Math.min(100, Math.max(0, clickworthiness)),
      recommendations
    };
  }

  private generateSEOChecklist(
    keywords: KeywordAnalysis,
    links: LinkAnalysis,
    meta: MetaAnalysis,
    content: ContentQualityAnalysis,
    images: ImageVideoAnalysis,
    technical: TechnicalSEOAnalysis
  ): SEOChecklist {
    const items = this.CHECKLIST_ITEMS.map(item => {
      let completed = false;
      
      switch (item.id) {
        case 'title-keyword':
          completed = meta.title.hasKeyword;
          break;
        case 'meta-description':
          completed = meta.description.present && meta.description.length >= 120;
          break;
        case 'h1-tag':
          completed = meta.headingStructure.h1Count === 1;
          break;
        case 'internal-links':
          completed = links.internal.count >= 3;
          break;
        case 'external-links':
          completed = links.external.highAuthorityCount >= 2;
          break;
        case 'alt-text':
          completed = images.images.missingAltText === 0;
          break;
        case 'mobile-friendly':
          completed = technical.mobileOptimization.isResponsive;
          break;
        case 'page-speed':
          completed = technical.pageSpeed.estimatedLoadTime !== 'slow';
          break;
        case 'social-meta':
          completed = false; // Would check for og: and twitter: tags
          break;
        case 'readability':
          completed = content.readability.fleschScore >= 60;
          break;
      }
      
      return {
        ...item,
        completed,
        automatedCheck: true
      };
    });

    const completedItems = items.filter(item => item.completed).length;
    const completionPercentage = Math.round((completedItems / items.length) * 100);
    const criticalIssues = items.filter(item => item.importance === 'critical' && !item.completed).length;

    return {
      items,
      completionPercentage,
      criticalIssues
    };
  }

  private generateSocialPreview($: any, meta: MetaAnalysis): SocialPreview {
    const title = $('title').text() || '';
    const description = $('meta[name="description"]').attr('content') || '';
    const ogTitle = $('meta[property="og:title"]').attr('content') || title;
    const ogDescription = $('meta[property="og:description"]').attr('content') || description;
    const ogImage = $('meta[property="og:image"]').attr('content') || '';
    const twitterTitle = $('meta[name="twitter:title"]').attr('content') || ogTitle;
    const twitterDescription = $('meta[name="twitter:description"]').attr('content') || ogDescription;
    const twitterImage = $('meta[name="twitter:image"]').attr('content') || ogImage;
    const twitterCard = $('meta[name="twitter:card"]').attr('content') || 'summary';

    const recommendations: string[] = [];
    if (!ogTitle) recommendations.push('Add Open Graph title tag');
    if (!ogDescription) recommendations.push('Add Open Graph description tag');
    if (!ogImage) recommendations.push('Add Open Graph image tag');
    if (!twitterCard) recommendations.push('Add Twitter Card meta tags');

    return {
      google: {
        title: title.length > 60 ? title.substring(0, 60) + '...' : title,
        description: description.length > 160 ? description.substring(0, 160) + '...' : description,
        url: 'example.com/your-article',
        isTruncated: title.length > 60 || description.length > 160
      },
      facebook: {
        title: ogTitle.length > 100 ? ogTitle.substring(0, 100) + '...' : ogTitle,
        description: ogDescription.length > 300 ? ogDescription.substring(0, 300) + '...' : ogDescription,
        image: ogImage,
        isTruncated: ogTitle.length > 100 || ogDescription.length > 300
      },
      twitter: {
        title: twitterTitle.length > 70 ? twitterTitle.substring(0, 70) + '...' : twitterTitle,
        description: twitterDescription.length > 200 ? twitterDescription.substring(0, 200) + '...' : twitterDescription,
        image: twitterImage,
        cardType: twitterCard as 'summary' | 'summary_large_image',
        isTruncated: twitterTitle.length > 70 || twitterDescription.length > 200
      },
      recommendations
    };
  }

  // Helper methods for enhanced SERP analysis
  private extractCommonKeywords(topResults: any[], primaryKeyword: string): string[] {
    const allTitles = topResults.map(result => result.title.toLowerCase()).join(' ');
    const keywords = new Set<string>();
    
    // Extract common words from titles (excluding the primary keyword)
    const words = allTitles.split(/\s+/).filter(word => 
      word.length > 3 && 
      !word.includes(primaryKeyword.toLowerCase()) &&
      !['the', 'and', 'for', 'with', 'your', 'how', 'best', 'top'].includes(word)
    );
    
    // Count frequency and return most common
    const wordCount = new Map<string, number>();
    words.forEach(word => {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    });
    
    return Array.from(wordCount.entries())
      .filter(([_, count]) => count >= 2)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 8)
      .map(([word, _]) => word);
  }

  private analyzeContentPatterns(topResults: any[]): string[] {
    const patterns: string[] = [];
    
    const avgH2Count = topResults.reduce((sum, result) => sum + result.headings.h2.length, 0) / topResults.length;
    const avgH3Count = topResults.reduce((sum, result) => sum + result.headings.h3.length, 0) / topResults.length;
    
    if (avgH2Count >= 5) patterns.push('Comprehensive structure with 5+ main sections');
    if (avgH3Count >= 3) patterns.push('Detailed subsections for better organization');
    
    // Check for common heading patterns
    const commonHeadings = ['introduction', 'benefits', 'how to', 'best practices', 'examples', 'conclusion'];
    const headingFreq = new Map<string, number>();
    
    topResults.forEach(result => {
      result.headings.h2.forEach((heading: string) => {
        const lowerHeading = heading.toLowerCase();
        commonHeadings.forEach(pattern => {
          if (lowerHeading.includes(pattern)) {
            headingFreq.set(pattern, (headingFreq.get(pattern) || 0) + 1);
          }
        });
      });
    });
    
    Array.from(headingFreq.entries())
      .filter(([_, count]) => count >= 3)
      .forEach(([pattern, _]) => {
        patterns.push(`Most articles include "${pattern}" section`);
      });
    
    return patterns;
  }

  private identifySuccessFactors(topResults: any[]): string[] {
    const factors: string[] = [];
    
    // Analyze word count patterns
    const wordCounts = topResults.map(result => result.wordCount);
    const avgWordCount = wordCounts.reduce((sum, count) => sum + count, 0) / wordCounts.length;
    
    if (avgWordCount > 2500) {
      factors.push('Long-form content (2500+ words) dominates rankings');
    }
    
    // Analyze authority patterns
    const avgAuthority = topResults.reduce((sum, result) => sum + result.domainAuthority, 0) / topResults.length;
    if (avgAuthority > 70) {
      factors.push('High domain authority (70+) is crucial for ranking');
    }
    
    // Analyze content quality patterns
    const avgContentScore = topResults.reduce((sum, result) => sum + result.contentScore, 0) / topResults.length;
    if (avgContentScore > 85) {
      factors.push('High-quality, comprehensive content is essential');
    }
    
    // Analyze visual content
    const avgImages = topResults.reduce((sum, result) => sum + result.imageCount, 0) / topResults.length;
    if (avgImages > 8) {
      factors.push('Rich visual content with 8+ images performs well');
    }
    
    return factors;
  }

  private compareWithCompetitors(
    yourContent: { wordCount: number; imageCount: number; headingCount: number; keywordDensity: number; readabilityScore: number },
    topResults: any[],
    avgWordCount: number,
    avgImageCount: number,
    avgHeadingCount: number
  ) {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const contentGaps: string[] = [];
    const improvementAreas: any[] = [];
    
    // Compare word count
    if (yourContent.wordCount >= avgWordCount) {
      strengths.push(`Good content length (${yourContent.wordCount} vs avg ${avgWordCount})`);
    } else {
      weaknesses.push(`Content too short (${yourContent.wordCount} vs avg ${avgWordCount})`);
      improvementAreas.push({
        priority: 'high' as const,
        area: 'Content Length',
        description: `Expand content to at least ${Math.round(avgWordCount)} words`,
        impact: 'Longer content typically ranks better for competitive keywords'
      });
    }
    
    // Compare images
    if (yourContent.imageCount >= avgImageCount) {
      strengths.push(`Good visual content (${yourContent.imageCount} vs avg ${avgImageCount})`);
    } else {
      weaknesses.push(`Needs more images (${yourContent.imageCount} vs avg ${avgImageCount})`);
      improvementAreas.push({
        priority: 'medium' as const,
        area: 'Visual Content',
        description: `Add ${Math.ceil(avgImageCount - yourContent.imageCount)} more relevant images`,
        impact: 'Visual content improves engagement and user experience'
      });
    }
    
    // Compare structure
    if (yourContent.headingCount >= avgHeadingCount) {
      strengths.push(`Well-structured content (${yourContent.headingCount} vs avg ${avgHeadingCount} headings)`);
    } else {
      weaknesses.push(`Needs better structure (${yourContent.headingCount} vs avg ${avgHeadingCount} headings)`);
      improvementAreas.push({
        priority: 'high' as const,
        area: 'Content Structure',
        description: 'Add more subheadings to improve readability and SEO',
        impact: 'Better structure helps search engines understand content hierarchy'
      });
    }
    
    // Analyze readability
    if (yourContent.readabilityScore < 60) {
      weaknesses.push('Content readability needs improvement');
      improvementAreas.push({
        priority: 'medium' as const,
        area: 'Readability',
        description: 'Simplify language and use shorter sentences',
        impact: 'Better readability improves user engagement and rankings'
      });
    } else {
      strengths.push('Good content readability');
    }
    
    // Identify content gaps based on competitor analysis
    const competitorHeadings = topResults.flatMap(result => [...result.headings.h2, ...result.headings.h3]);
    const commonTopics = this.findCommonTopics(competitorHeadings);
    
    commonTopics.forEach(topic => {
      contentGaps.push(`Consider adding section about "${topic}" (found in ${competitorHeadings.filter(h => h.toLowerCase().includes(topic)).length} competitors)`);
    });
    
    // Calculate competitive position
    const yourScore = this.calculateCompetitiveScore(yourContent, avgWordCount, avgImageCount, avgHeadingCount);
    const competitivePosition = Math.max(1, Math.min(10, Math.round(11 - (yourScore / 10))));
    
    // Determine ranking potential
    let rankingPotential: 'high' | 'medium' | 'low' = 'medium';
    if (yourScore >= 80) rankingPotential = 'high';
    else if (yourScore < 60) rankingPotential = 'low';
    
    return {
      competitivePosition,
      strengthsVsCompetitors: strengths,
      weaknessesVsCompetitors: weaknesses,
      contentGaps,
      rankingPotential,
      improvementAreas
    };
  }

  private calculateCompetitiveScore(
    yourContent: { wordCount: number; imageCount: number; headingCount: number; keywordDensity: number; readabilityScore: number },
    avgWordCount: number,
    avgImageCount: number,
    avgHeadingCount: number
  ): number {
    let score = 50; // Base score
    
    // Word count scoring
    const wordCountRatio = yourContent.wordCount / avgWordCount;
    if (wordCountRatio >= 1) score += 20;
    else if (wordCountRatio >= 0.8) score += 15;
    else if (wordCountRatio >= 0.6) score += 10;
    else score -= 10;
    
    // Image count scoring
    const imageRatio = yourContent.imageCount / Math.max(1, avgImageCount);
    if (imageRatio >= 1) score += 15;
    else if (imageRatio >= 0.7) score += 10;
    else score -= 5;
    
    // Structure scoring
    const headingRatio = yourContent.headingCount / Math.max(1, avgHeadingCount);
    if (headingRatio >= 1) score += 15;
    else if (headingRatio >= 0.8) score += 10;
    else score -= 5;
    
    // Readability scoring
    if (yourContent.readabilityScore >= 70) score += 10;
    else if (yourContent.readabilityScore >= 60) score += 5;
    else score -= 5;
    
    // Keyword density scoring
    if (yourContent.keywordDensity >= 0.5 && yourContent.keywordDensity <= 2.5) score += 10;
    else score -= 5;
    
    return Math.max(0, Math.min(100, score));
  }

  private findCommonTopics(headings: string[]): string[] {
    const topics = ['benefits', 'examples', 'tools', 'tips', 'mistakes', 'best practices', 'case studies', 'faq'];
    return topics.filter(topic => 
      headings.some(heading => heading.toLowerCase().includes(topic))
    );
  }

  private identifyContentGaps(topResults: any[], keyword: string): string[] {
    const gaps: string[] = [];
    
    // Analyze what competitors have that might be missing
    const allHeadings = topResults.flatMap(result => [...result.headings.h2, ...result.headings.h3]);
    
    // Check for common content types
    const hasExamples = allHeadings.some(h => h.toLowerCase().includes('example'));
    const hasCaseStudies = allHeadings.some(h => h.toLowerCase().includes('case study'));
    const hasTools = allHeadings.some(h => h.toLowerCase().includes('tool'));
    const hasFAQ = allHeadings.some(h => h.toLowerCase().includes('faq') || h.includes('?'));
    
    if (hasExamples) gaps.push('Add practical examples and case studies');
    if (hasTools) gaps.push('Include recommended tools and resources');
    if (hasFAQ) gaps.push('Add FAQ section addressing common questions');
    if (hasCaseStudies) gaps.push('Include real-world case studies and success stories');
    
    // Check for missing advanced content
    const hasAdvanced = allHeadings.some(h => h.toLowerCase().includes('advanced'));
    if (hasAdvanced) gaps.push('Add advanced techniques section');
    
    return gaps;
  }

  private generateSERPRecommendations(topResults: any[], yourBlogAnalysis: any, avgWordCount: number, avgImageCount: number): string[] {
    const recommendations: string[] = [];
    
    recommendations.push(`Target ${avgWordCount}+ words to match competitor content length`);
    recommendations.push(`Include ${avgImageCount}+ high-quality images like top performers`);
    
    if (yourBlogAnalysis.rankingPotential === 'low') {
      recommendations.push('Focus on critical improvements first: content length and structure');
    }
    
    if (yourBlogAnalysis.improvementAreas.length > 0) {
      const criticalAreas = yourBlogAnalysis.improvementAreas
        .filter((area: any) => area.priority === 'critical' || area.priority === 'high')
        .map((area: any) => area.area);
      
      if (criticalAreas.length > 0) {
        recommendations.push(`Priority improvements: ${criticalAreas.join(', ')}`);
      }
    }
    
    // Add specific competitor insights
    const topPerformer = topResults[0];
    if (topPerformer) {
      recommendations.push(`Study top performer structure: ${topPerformer.headings.h2.length} main sections`);
      recommendations.push(`Analyze why "${topPerformer.title}" ranks #1 - ${topPerformer.contentScore}/100 content score`);
    }
    
    return recommendations;
  }
  
  private countPolysyllables(text: string): number {
    const words = text.toLowerCase().split(/\s+/);
    let polysyllableCount = 0;
    
    words.forEach(word => {
      word = word.replace(/[^a-z]/g, '');
      if (word.length > 0) {
        const syllables = this.countSyllablesInWord(word);
        if (syllables >= 3) polysyllableCount++;
      }
    });
    
    return polysyllableCount;
  }

  private countSyllablesInWord(word: string): number {
    if (word.length <= 3) return 1;
    const syllables = word.match(/[aeiouy]+/g) || [];
    return Math.max(1, syllables.length);
  }

  private calculateDaleChallScore(words: string[], sentenceCount: number): number {
    // Simplified Dale-Chall calculation
    const avgSentenceLength = words.length / sentenceCount;
    const difficultWords = words.filter(word => word.length > 6).length;
    const percentDifficultWords = (difficultWords / words.length) * 100;
    
    return 0.1579 * percentDifficultWords + 0.0496 * avgSentenceLength;
  }

  private checkHeadingOrder(headings: number[]): boolean {
    for (let i = 1; i < headings.length; i++) {
      if (headings[i] > headings[i - 1] + 1) {
        return false; // Skipped a level
      }
    }
    return true;
  }

  private calculateScannabilityScore(
    paragraphs: number,
    lists: number,
    subheadings: number,
    bolding: number,
    italics: number,
    wallsOfText: number
  ): number {
    let score = 50; // Base score
    
    // Positive factors
    score += Math.min(25, lists * 5); // Up to 25 points for lists
    score += Math.min(20, subheadings * 2); // Up to 20 points for subheadings
    score += Math.min(10, bolding * 1); // Up to 10 points for bolding
    score += Math.min(5, italics * 0.5); // Up to 5 points for italics
    
    // Negative factors
    score -= wallsOfText * 10; // Penalty for walls of text
    
    return Math.max(0, Math.min(100, score));
  }

  // Enhanced content analysis for detailed recommendations
  private analyzeContentDetails($: any, textContent: string, primaryKeyword: string): ContentAnalysisDetail {
    const paragraphs: any[] = [];
    const headings: any[] = [];
    const sentences: any[] = [];
    
    // Analyze each paragraph
    $('p').each((index: number, element: any) => {
      const paragraphText = $(element).text().trim();
      if (paragraphText.length > 20) {
        const words = paragraphText.split(/\s+/);
        const wordCount = words.length;
        const hasKeyword = paragraphText.toLowerCase().includes(primaryKeyword.toLowerCase());
        
        // Calculate paragraph-level readability
        const sentences = paragraphText.split(/[.!?]+/).filter((s: string) => s.trim().length > 0);
        const avgSentenceLength = words.length / Math.max(sentences.length, 1);
        const readabilityScore = Math.max(0, Math.min(100, 206.835 - 1.015 * avgSentenceLength));
        
        const suggestions: string[] = [];
        const linkOpportunities: any[] = [];
        
        // Generate specific suggestions
        if (wordCount < 30) {
          suggestions.push('Consider expanding this paragraph for better depth');
        }
        if (wordCount > 200) {
          suggestions.push('Break this long paragraph into smaller chunks');
        }
        if (!hasKeyword && index < 3) {
          suggestions.push(`Consider naturally including "${primaryKeyword}" in this early paragraph`);
        }
        if (readabilityScore < 50) {
          suggestions.push('Simplify sentence structure for better readability');
        }
        
        // Identify link opportunities
        if (paragraphText.toLowerCase().includes('research') || paragraphText.toLowerCase().includes('study')) {
          linkOpportunities.push({
            type: 'external' as const,
            suggestedAnchor: 'research study',
            suggestedTarget: 'Link to authoritative research source',
            reason: 'Claims should be backed by credible sources'
          });
        }
        
        if (paragraphText.toLowerCase().includes('guide') || paragraphText.toLowerCase().includes('tutorial')) {
          linkOpportunities.push({
            type: 'internal' as const,
            suggestedAnchor: 'comprehensive guide',
            suggestedTarget: 'Link to related internal content',
            reason: 'Internal linking improves site structure and user experience'
          });
        }
        
        paragraphs.push({
          index,
          text: paragraphText.substring(0, 200) + (paragraphText.length > 200 ? '...' : ''),
          wordCount,
          readabilityScore: Math.round(readabilityScore),
          hasKeyword,
          suggestions,
          needsImprovement: suggestions.length > 0,
          linkOpportunities
        });
      }
    });
    
    // Analyze headings
    $('h1, h2, h3, h4, h5, h6').each((index: number, element: any) => {
      const headingText = $(element).text().trim();
      const level = parseInt($(element).prop('tagName').substring(1));
      const hasKeyword = headingText.toLowerCase().includes(primaryKeyword.toLowerCase());
      
      const suggestions: string[] = [];
      
      if (level === 1 && !hasKeyword) {
        suggestions.push(`Include "${primaryKeyword}" in your main heading`);
      }
      if (level === 2 && headingText.length < 20) {
        suggestions.push('Consider making this subheading more descriptive');
      }
      if (headingText.length > 60) {
        suggestions.push('Shorten heading for better readability');
      }
      
      headings.push({
        level,
        text: headingText,
        hasKeyword,
        suggestions,
        index
      });
    });
    
    // Analyze sentences
    const allSentences = textContent.split(/[.!?]+/).filter(s => s.trim().length > 10);
    allSentences.forEach((sentence, index) => {
      const words = sentence.trim().split(/\s+/);
      const length = words.length;
      let complexity: 'simple' | 'moderate' | 'complex' = 'simple';
      
      if (length > 25) complexity = 'complex';
      else if (length > 15) complexity = 'moderate';
      
      // Find which paragraph this sentence belongs to
      const paragraphIndex = Math.floor(index / 3); // Rough estimation
      
      sentences.push({
        text: sentence.trim().substring(0, 100) + (sentence.length > 100 ? '...' : ''),
        length,
        complexity,
        paragraphIndex: Math.min(paragraphIndex, paragraphs.length - 1),
        needsSimplification: complexity === 'complex'
      });
    });
    
    return {
      paragraphs: paragraphs.slice(0, 10), // Limit to first 10 paragraphs
      headings,
      sentences: sentences.slice(0, 15), // Limit to first 15 sentences
      realTimeValidation: {
        isAnalyzing: false,
        dataSource: 'live-analysis',
        lastAnalyzed: new Date().toISOString(),
        confidence: 95
      }
    };
  }
  
  // Enhanced recommendations with specific actions
  private generateEnhancedRecommendations(
    keywords: KeywordAnalysis,
    links: LinkAnalysis,
    meta: MetaAnalysis,
    content: ContentQualityAnalysis,
    anchorText: AnchorTextAnalysis,
    images: ImageVideoAnalysis,
    technical: TechnicalSEOAnalysis,
    aiOptimization: AIOptimizationAnalysis,
    contentDetails: ContentAnalysisDetail
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Critical keyword recommendations with specific actions
    if (!keywords.primaryKeyword) {
      recommendations.push({
        type: 'critical',
        category: 'seo',
        title: 'Missing Primary Keyword',
        description: 'Define a primary keyword for your content to improve SEO targeting.',
        impact: 'high',
        specificAction: 'Choose a primary keyword based on your content topic',
        whereToImplement: 'Content strategy phase',
        exampleText: 'Example: "SEO optimization" for an SEO guide'
      });
    }

    if (keywords.stuffingAlert) {
      recommendations.push({
        type: 'critical',
        category: 'seo',
        title: 'Keyword Stuffing Detected',
        description: `Keyword density is ${keywords.density}%. Reduce to 1-2% to avoid penalties.`,
        impact: 'high',
        specificAction: 'Remove excessive keyword repetitions and use synonyms',
        whereToImplement: 'Throughout content, especially in paragraphs with high keyword concentration',
        exampleText: `Instead of repeating "${keywords.primaryKeyword}" use variations like "search engine optimization" or "SEO techniques"`
      });
    }

    // Title optimization with exact suggestions
    if (!meta.title.present || !meta.title.hasKeyword) {
      recommendations.push({
        type: 'important',
        category: 'seo',
        title: 'Optimize Page Title',
        description: 'Include your primary keyword in the page title for better SEO.',
        impact: 'high',
        specificAction: `Add "${keywords.primaryKeyword}" to your page title`,
        whereToImplement: 'HTML <title> tag or page settings',
        targetElement: '<title>',
        position: 'beginning',
        exampleText: `"${keywords.primaryKeyword}: Complete Guide for Beginners"`
      });
    }

    // Content structure recommendations
    const firstParagraph = contentDetails.paragraphs[0];
    if (firstParagraph && !firstParagraph.hasKeyword) {
      recommendations.push({
        type: 'important',
        category: 'seo',
        title: 'Add Keyword to Introduction',
        description: 'Include your primary keyword in the first paragraph to establish topic relevance.',
        impact: 'medium',
        specificAction: `Naturally incorporate "${keywords.primaryKeyword}" in your opening paragraph`,
        whereToImplement: 'First paragraph of your content',
        targetElement: 'p:first-of-type',
        position: 'beginning',
        exampleText: `"${keywords.primaryKeyword} is essential for..." or "Understanding ${keywords.primaryKeyword} helps..."`
      });
    }

    // Specific link building recommendations
    if (links.external.highAuthorityCount < 2) {
      const linkOpportunities = contentDetails.paragraphs
        .filter(p => p.linkOpportunities.some(lo => lo.type === 'external'))
        .slice(0, 3);
      
      linkOpportunities.forEach((paragraph, index) => {
        const opportunity = paragraph.linkOpportunities.find(lo => lo.type === 'external');
        if (opportunity) {
          recommendations.push({
            type: 'important',
            category: 'authority',
            title: `Add External Link in Paragraph ${paragraph.index + 1}`,
            description: opportunity.reason,
            impact: 'medium',
            specificAction: `Add a link to an authoritative source`,
            whereToImplement: `Paragraph ${paragraph.index + 1}`,
            targetElement: `p:nth-of-type(${paragraph.index + 1})`,
            exampleText: `Link text: "${opportunity.suggestedAnchor}" → Target: High-authority site like Wikipedia, .edu, or industry leader`
          });
        }
      });
    }

    return recommendations.slice(0, 12); // Limit to top 12 most important recommendations
  }

  // New helper methods for enhanced functionality
  private analyzeKeywordResearch(keyword: string) {
    // Simplified analysis - in a real app, this would use actual keyword tools
    const keywordLength = keyword.split(' ').length;
    
    return {
      searchVolume: keywordLength <= 2 ? 'high' : 'medium' as 'high' | 'medium' | 'low' | 'unknown',
      difficulty: keywordLength <= 1 ? 'hard' : 'medium' as 'easy' | 'medium' | 'hard' | 'unknown',
      userIntent: this.detectUserIntent(keyword)
    };
  }

  private detectUserIntent(keyword: string): 'informational' | 'navigational' | 'transactional' | 'commercial' | 'unknown' {
    const lowerKeyword = keyword.toLowerCase();
    
    if (lowerKeyword.includes('how to') || lowerKeyword.includes('what is') || lowerKeyword.includes('why')) {
      return 'informational';
    }
    if (lowerKeyword.includes('buy') || lowerKeyword.includes('price') || lowerKeyword.includes('purchase')) {
      return 'transactional';
    }
    if (lowerKeyword.includes('best') || lowerKeyword.includes('review') || lowerKeyword.includes('compare')) {
      return 'commercial';
    }
    if (lowerKeyword.includes('login') || lowerKeyword.includes('website') || lowerKeyword.includes('official')) {
      return 'navigational';
    }
    return 'informational'; // Default
  }

  private detectBrandName(title: string): boolean {
    // Simple brand detection - looks for capitalized words at the end
    const words = title.split(' ');
    const lastWord = words[words.length - 1];
    return !!(lastWord && lastWord[0] === lastWord[0].toUpperCase() && lastWord.length > 2);
  }

  private analyzeURL(url: string | undefined, keyword: string) {
    if (!url) {
      return {
        isSeoFriendly: false,
        hasKeyword: false,
        length: 0,
        hasStopWords: false,
        recommendations: ['URL not provided for analysis']
      };
    }

    const urlPath = url.split('/').pop() || '';
    const stopWords = ['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const hasStopWords = stopWords.some(word => urlPath.includes(word));
    const hasKeyword = urlPath.toLowerCase().includes(keyword.toLowerCase().replace(/\s+/g, '-'));
    const isSeoFriendly = urlPath.length < 100 && !hasStopWords && !urlPath.includes('?') && !urlPath.includes('&');
    
    const recommendations: string[] = [];
    if (!isSeoFriendly) recommendations.push('Make URL more SEO-friendly: short, descriptive, no stop words');
    if (!hasKeyword) recommendations.push('Include target keyword in URL slug');
    if (urlPath.length > 100) recommendations.push('Shorten URL length');
    if (hasStopWords) recommendations.push('Remove stop words from URL');
    
    return {
      isSeoFriendly,
      hasKeyword,
      length: urlPath.length,
      hasStopWords,
      recommendations
    };
  }
}