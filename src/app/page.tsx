'use client';

import { useState } from 'react';
import { SEOAnalyzer } from '@/lib/seo-analyzer';
import { SEOAnalysisResult } from '@/types/seo';
import { Search, FileText, TrendingUp, Shield, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const SAMPLE_CONTENT = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Complete Guide to SEO Optimization for Beginners</title>
    <meta name="description" content="Learn essential SEO optimization techniques to improve your website ranking on Google. This comprehensive guide covers keyword research, on-page SEO, and link building strategies.">
    <link rel="canonical" href="https://example.com/seo-guide">
</head>
<body>
    <h1>Complete Guide to SEO Optimization for Beginners</h1>
    
    <p>Search Engine Optimization (SEO) is crucial for improving your website's visibility on search engines like Google. This comprehensive guide will teach you the fundamentals of SEO optimization and help you rank higher in search results.</p>
    
    <h2>What is SEO Optimization?</h2>
    <p>SEO optimization involves various techniques and strategies designed to improve your website's ranking in search engine results pages (SERPs). According to recent studies, websites on the first page of Google receive 95% of web traffic.</p>
    
    <h2>Keyword Research and Analysis</h2>
    <p>Effective SEO optimization starts with thorough keyword research. You need to identify the terms your target audience uses when searching for content related to your business.</p>
    
    <ul>
        <li>Use keyword research tools like Google Keyword Planner</li>
        <li>Analyze competitor keywords</li>
        <li>Focus on long-tail keywords for better conversion rates</li>
        <li>Consider search intent behind keywords</li>
    </ul>
    
    <h2>On-Page SEO Techniques</h2>
    <p>On-page SEO optimization includes optimizing individual web pages to rank higher and earn more relevant traffic. Here are the essential elements:</p>
    
    <h3>Title Tags and Meta Descriptions</h3>
    <p>Your title tag should include your primary keyword and be under 60 characters. The meta description should provide a compelling summary of your content in under 160 characters.</p>
    
    <h3>Header Structure</h3>
    <p>Use a logical header structure (H1, H2, H3) to organize your content. This helps both users and search engines understand your content hierarchy.</p>
    
    <h2>Link Building Strategies</h2>
    <p>Quality backlinks from authoritative websites significantly impact your SEO performance. Focus on earning links from reputable sources in your industry.</p>
    
    <blockquote cite="https://moz.com/blog/seo-guide">
        "Content is king, but links are queen, and the queen rules the house" - SEO Expert John Mueller
    </blockquote>
    
    <p>Research from <a href="https://backlinko.com/search-engine-ranking">Backlinko</a> shows that the number one result on Google has an average of 3.8x more backlinks than positions 2-10.</p>
    
    <h2>Technical SEO Considerations</h2>
    <p>Technical SEO optimization ensures that search engines can crawl and index your website effectively. Key factors include:</p>
    
    <ol>
        <li>Page loading speed optimization</li>
        <li>Mobile-friendly responsive design</li>
        <li>SSL certificate implementation</li>
        <li>XML sitemap creation</li>
        <li>Robot.txt file optimization</li>
    </ol>
    
    <h2>Content Quality and User Experience</h2>
    <p>High-quality, valuable content is the foundation of successful SEO optimization. Your content should address user queries comprehensively and provide actionable insights.</p>
    
    <p>Statistics show that longer content tends to rank better, with the average first-page result containing 1,890 words. However, quality always trumps quantity.</p>
    
    <h2>Measuring SEO Success</h2>
    <p>Track your SEO optimization efforts using tools like <a href="https://analytics.google.com">Google Analytics</a> and <a href="https://search.google.com/search-console">Google Search Console</a>. Monitor key metrics such as:</p>
    
    <ul>
        <li>Organic traffic growth</li>
        <li>Keyword ranking positions</li>
        <li>Click-through rates (CTR)</li>
        <li>Bounce rate and time on page</li>
        <li>Conversion rates from organic traffic</li>
    </ul>
    
    <h2>Conclusion</h2>
    <p>SEO optimization is an ongoing process that requires patience, consistency, and continuous learning. By implementing the strategies outlined in this guide, you'll be well on your way to improving your website's search engine visibility and driving more organic traffic.</p>
    
    <p>Remember that SEO optimization takes time to show results. Most experts agree that it takes 3-6 months to see significant improvements in your search rankings when implementing proper SEO techniques.</p>
    
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Complete Guide to SEO Optimization for Beginners",
        "author": {
            "@type": "Person",
            "name": "SEO Expert"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Example Company"
        },
        "datePublished": "2024-01-15",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://example.com/seo-guide"
        }
    }
    </script>
</body>
</html>`;

export default function Home() {
  const [content, setContent] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [url, setUrl] = useState('');
  const [analysis, setAnalysis] = useState<SEOAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    
    setLoading(true);
    try {
      const analyzer = new SEOAnalyzer();
      const result = await analyzer.analyze({
        content,
        targetKeyword: targetKeyword || undefined,
        url: url || undefined
      });
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSampleContent = () => {
    setContent(SAMPLE_CONTENT);
    setTargetKeyword('SEO optimization');
    setUrl('https://example.com/seo-guide');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'critical': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'important': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default: return <CheckCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Search className="w-8 h-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">SEO Analyzer</h1>
            </div>
            <p className="text-sm text-gray-500">Comprehensive content analysis for better SEO</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Content Analysis</h2>
                <button
                  onClick={loadSampleContent}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Load Sample Content
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                    Website URL (optional)
                  </label>
                  <input
                    type="url"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
                    Target Keyword (optional)
                  </label>
                  <input
                    type="text"
                    id="keyword"
                    value={targetKeyword}
                    onChange={(e) => setTargetKeyword(e.target.value)}
                    placeholder="SEO optimization"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    HTML Content *
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste your HTML content here..."
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={loading || !content.trim()}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <FileText className="w-5 h-5 mr-2" />
                      Analyze Content
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {analysis && (
              <>
                {/* Overall Score */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Overall Score</h2>
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${getScoreColor(analysis.score.overall)} mb-2`}>
                      {analysis.score.overall}/100
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
                      <div className="text-center">
                        <div className={`text-xl font-semibold ${getScoreColor(analysis.score.seo)}`}>
                          {analysis.score.seo}
                        </div>
                        <div className="text-xs text-gray-600">SEO</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-xl font-semibold ${getScoreColor(analysis.score.readability)}`}>
                          {analysis.score.readability}
                        </div>
                        <div className="text-xs text-gray-600">Readability</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-xl font-semibold ${getScoreColor(analysis.score.authority)}`}>
                          {analysis.score.authority}
                        </div>
                        <div className="text-xs text-gray-600">Authority</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-xl font-semibold ${getScoreColor(analysis.score.technical)}`}>
                          {analysis.score.technical}
                        </div>
                        <div className="text-xs text-gray-600">Technical</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-xl font-semibold ${getScoreColor(analysis.score.aiOptimization)}`}>
                          {analysis.score.aiOptimization}
                        </div>
                        <div className="text-xs text-gray-600">AI Ready</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Detailed Breakdown</h2>
                  <div className="space-y-3">
                    {Object.entries(analysis.score.breakdown).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 capitalize">{key}</span>
                        <div className="flex items-center">
                          <div className={`w-16 h-2 rounded-full mr-2 ${getScoreBgColor(value)}`}>
                            <div 
                              className={`h-2 rounded-full ${value >= 80 ? 'bg-green-600' : value >= 60 ? 'bg-yellow-600' : 'bg-red-600'}`}
                              style={{ width: `${value}%` }}
                            ></div>
                          </div>
                          <span className={`text-sm font-semibold ${getScoreColor(value)}`}>{value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enhanced Keywords Analysis */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Enhanced Keywords Analysis
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Primary Keyword:</span>
                      <span className="ml-2 text-sm text-gray-900">{analysis.keywords.primaryKeyword || 'Not detected'}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">User Intent:</span>
                      <span className={`ml-2 text-sm font-semibold capitalize ${
                        analysis.keywords.keywordResearch.userIntent === 'informational' ? 'text-blue-600' :
                        analysis.keywords.keywordResearch.userIntent === 'transactional' ? 'text-green-600' :
                        analysis.keywords.keywordResearch.userIntent === 'commercial' ? 'text-purple-600' :
                        'text-gray-600'
                      }`}>
                        {analysis.keywords.keywordResearch.userIntent}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Density:</span>
                      <span className={`ml-2 text-sm font-semibold ${
                        analysis.keywords.stuffingAlert ? 'text-red-600' : 
                        analysis.keywords.density > 0.5 ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {analysis.keywords.density}%
                        {analysis.keywords.stuffingAlert && ' (Warning: Keyword stuffing detected)'}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Placement & Integration:</span>
                      <div className="mt-1 space-y-1">
                        {Object.entries(analysis.keywords.placement).map(([key, value]) => (
                          <div key={key} className="flex items-center text-sm">
                            {value ? (
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500 mr-2" />
                            )}
                            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Links Analysis */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Links Analysis
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{analysis.links.internal.count}</div>
                      <div className="text-sm text-gray-600">Internal Links</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{analysis.links.external.highAuthorityCount}</div>
                      <div className="text-sm text-gray-600">High Authority Links</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Anchor Text Diversity</div>
                    <div className={`text-lg font-semibold ${getScoreColor(analysis.anchorText.diversity)}`}>
                      {analysis.anchorText.diversity}%
                    </div>
                  </div>
                </div>

                {/* Content Quality & Structure */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Content Quality & Structure</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-lg font-bold text-blue-600">{analysis.content.comprehensiveness.wordCount}</div>
                      <div className="text-sm text-gray-600">Word Count</div>
                    </div>
                    <div>
                      <div className={`text-lg font-bold ${
                        analysis.content.comprehensiveness.topicCoverage === 'comprehensive' ? 'text-green-600' :
                        analysis.content.comprehensiveness.topicCoverage === 'moderate' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {analysis.content.comprehensiveness.topicCoverage}
                      </div>
                      <div className="text-sm text-gray-600">Topic Coverage</div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm">
                      {analysis.content.comprehensiveness.uniqueValue ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500 mr-2" />
                      )}
                      <span>Unique Value Added</span>
                    </div>
                    <div className="flex items-center text-sm">
                      {analysis.content.comprehensiveness.evergreenContent ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500 mr-2" />
                      )}
                      <span>Evergreen Content</span>
                    </div>
                  </div>
                </div>

                {/* Images & Media Analysis */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Images & Media Optimization</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{analysis.images.images.count}</div>
                      <div className="text-sm text-gray-600">Total Images</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {analysis.images.images.withAltText} with alt text
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{analysis.images.videos.count}</div>
                      <div className="text-sm text-gray-600">Videos</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {analysis.images.videos.withDescriptions} with descriptions
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical SEO Analysis */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Technical SEO & E-E-A-T</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Mobile Responsive</span>
                      {analysis.technical.mobileOptimization.isResponsive ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Page Speed</span>
                      <span className={`text-sm font-semibold ${
                        analysis.technical.pageSpeed.estimatedLoadTime === 'fast' ? 'text-green-600' :
                        analysis.technical.pageSpeed.estimatedLoadTime === 'moderate' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {analysis.technical.pageSpeed.estimatedLoadTime}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">E-E-A-T Signals: </span>
                      <span className="text-sm text-gray-600">
                        {analysis.technical.eeat.authoritySignals.length} signals detected
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Author Bio</span>
                      {analysis.technical.eeat.authorBio ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>

                {/* AI Optimization Analysis */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Search Optimization</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Key Points Upfront</span>
                      {analysis.aiOptimization.aiVisibility.keyPointsUpfront ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Comprehensive Coverage</span>
                      {analysis.aiOptimization.aiVisibility.comprehensiveTopicCoverage ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Featured Snippets Ready</span>
                      {analysis.aiOptimization.featuredSnippets.optimizedForSnippets ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Declarative Sentences: </span>
                      <span className="text-sm text-gray-600">
                        {analysis.aiOptimization.aiVisibility.declarativeSentences}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Concrete Answers: </span>
                      <span className="text-sm text-gray-600">
                        {analysis.aiOptimization.aiVisibility.concreteAnswers}
                      </span>
                    </div>
                  </div>
                </div>

                {/* SEO Checklist */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO Checklist</h2>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Completion</span>
                      <span className={`text-lg font-bold ${
                        analysis.checklist.completionPercentage >= 80 ? 'text-green-600' :
                        analysis.checklist.completionPercentage >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {analysis.checklist.completionPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          analysis.checklist.completionPercentage >= 80 ? 'bg-green-600' :
                          analysis.checklist.completionPercentage >= 60 ? 'bg-yellow-600' :
                          'bg-red-600'
                        }`}
                        style={{ width: `${analysis.checklist.completionPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {analysis.checklist.items.slice(0, 5).map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="flex items-center">
                          {item.completed ? (
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500 mr-2" />
                          )}
                          {item.title}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          item.importance === 'critical' ? 'bg-red-100 text-red-800' :
                          item.importance === 'high' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.importance}
                        </span>
                      </div>
                    ))}
                  </div>
                  {analysis.checklist.criticalIssues > 0 && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                      <div className="text-sm text-red-800">
                        <strong>{analysis.checklist.criticalIssues}</strong> critical issues need attention
                      </div>
                    </div>
                  )}
                </div>

                {/* Title Analysis */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Title Analysis</h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-lg font-bold text-blue-600">{analysis.titleAnalysis.length.characters}</div>
                      <div className="text-sm text-gray-600">Characters</div>
                      {analysis.titleAnalysis.length.isTruncated && (
                        <div className="text-xs text-red-600">May be truncated</div>
                      )}
                    </div>
                    <div>
                      <div className={`text-lg font-bold ${
                        analysis.titleAnalysis.clickworthiness >= 70 ? 'text-green-600' :
                        analysis.titleAnalysis.clickworthiness >= 50 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {analysis.titleAnalysis.clickworthiness}/100
                      </div>
                      <div className="text-sm text-gray-600">Clickworthiness</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      {analysis.titleAnalysis.powerWords.count > 0 ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500 mr-2" />
                      )}
                      <span>Power Words ({analysis.titleAnalysis.powerWords.count})</span>
                    </div>
                    <div className="flex items-center text-sm">
                      {analysis.titleAnalysis.structure.hasNumber ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500 mr-2" />
                      )}
                      <span>Contains Number</span>
                    </div>
                  </div>
                </div>

                {/* SERP Competitor Analysis */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">🎯 Competitor SERP Analysis</h2>
                  
                  {/* Your Blog vs Competitors */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <h3 className="text-md font-semibold text-blue-900 mb-3">📊 Your Competitive Position</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">#{analysis.serp.yourBlogAnalysis.competitivePosition}</div>
                        <div className="text-xs text-gray-600">Estimated Position</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${
                          analysis.serp.yourBlogAnalysis.rankingPotential === 'high' ? 'text-green-600' :
                          analysis.serp.yourBlogAnalysis.rankingPotential === 'medium' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {analysis.serp.yourBlogAnalysis.rankingPotential.toUpperCase()}
                        </div>
                        <div className="text-xs text-gray-600">Ranking Potential</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-600">{analysis.serp.yourBlogAnalysis.strengthsVsCompetitors.length}</div>
                        <div className="text-xs text-gray-600">Strengths</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{analysis.serp.yourBlogAnalysis.weaknessesVsCompetitors.length}</div>
                        <div className="text-xs text-gray-600">Weaknesses</div>
                      </div>
                    </div>
                    
                    {/* Improvement Areas */}
                    {analysis.serp.yourBlogAnalysis.improvementAreas.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900 mb-2">🎯 Priority Improvements:</h4>
                        <div className="space-y-2">
                          {analysis.serp.yourBlogAnalysis.improvementAreas.slice(0, 3).map((area, index) => (
                            <div key={index} className="flex items-start p-2 bg-white rounded border">
                              <span className={`inline-block w-2 h-2 rounded-full mt-2 mr-3 ${
                                area.priority === 'critical' ? 'bg-red-500' :
                                area.priority === 'high' ? 'bg-orange-500' :
                                area.priority === 'medium' ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`}></span>
                              <div className="flex-1">
                                <div className="font-medium text-sm text-gray-900">{area.area}</div>
                                <div className="text-xs text-gray-600 mt-1">{area.description}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Top Competitors Analysis */}
                  <div className="mb-6">
                    <h3 className="text-md font-semibold text-gray-900 mb-3">🏆 Top 5 Competitors</h3>
                    <div className="space-y-3">
                      {analysis.serp.topResults.slice(0, 5).map((result, index) => (
                        <div key={index} className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded mr-2">#{index + 1}</span>
                              <div className="text-sm font-medium text-gray-900 truncate">{result.title}</div>
                            </div>
                            <div className="text-xs text-gray-500">{result.contentScore}/100</div>
                          </div>
                          <div className="grid grid-cols-4 gap-2 text-xs text-gray-600">
                            <div>
                              <span className="font-medium">{result.wordCount.toLocaleString()}</span> words
                            </div>
                            <div>
                              <span className="font-medium">{result.imageCount}</span> images
                            </div>
                            <div>
                              <span className="font-medium">{result.domainAuthority}</span> DA
                            </div>
                            <div>
                              <span className="font-medium">{result.backlinks.toLocaleString()}</span> links
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-gray-600">
                            <span className="font-medium">Sections:</span> {result.headings.h2.slice(0, 3).join(', ')}
                            {result.headings.h2.length > 3 && ` +${result.headings.h2.length - 3} more`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Competitor Insights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">📈 Success Patterns:</h4>
                      <ul className="space-y-1 text-xs text-gray-600">
                        {analysis.serp.competitorInsights.successFactors.slice(0, 3).map((factor, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">🔍 Content Gaps:</h4>
                      <ul className="space-y-1 text-xs text-gray-600">
                        {analysis.serp.contentGaps.slice(0, 3).map((gap, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-orange-500 mr-2">•</span>
                            {gap}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Benchmarks */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-lg font-bold text-gray-700">{analysis.serp.averageWordCount.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Avg Words</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-lg font-bold text-gray-700">{analysis.serp.competitorInsights.averageImageCount}</div>
                      <div className="text-xs text-gray-600">Avg Images</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-lg font-bold text-gray-700">{analysis.serp.competitorInsights.averageHeadingCount}</div>
                      <div className="text-xs text-gray-600">Avg Headings</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-lg font-bold text-gray-700">{Math.round(analysis.serp.topResults.reduce((sum, r) => sum + r.domainAuthority, 0) / analysis.serp.topResults.length)}</div>
                      <div className="text-xs text-gray-600">Avg DA</div>
                    </div>
                  </div>

                  {/* People Also Ask & Related */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">💡 People Also Ask:</div>
                      <div className="space-y-1">
                        {analysis.serp.peopleAlsoAsk.slice(0, 4).map((question, index) => (
                          <div key={index} className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                            {question}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">🔍 Related Searches:</div>
                      <div className="flex flex-wrap gap-1">
                        {analysis.serp.relatedSearches.slice(0, 6).map((search, index) => (
                          <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {search}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h2>
                  <div className="space-y-3">
                    {analysis?.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start p-3 rounded-lg border border-gray-200">
                        {getRecommendationIcon(rec.type)}
                        <div className="ml-3 flex-1">
                          <div className="text-sm font-medium text-gray-900">{rec.title}</div>
                          <div className="text-sm text-gray-600 mt-1">{rec.description}</div>
                          <div className="flex items-center mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              rec.impact === 'high' ? 'bg-red-100 text-red-800' :
                              rec.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {rec.impact} impact
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ml-2 ${
                              rec.category === 'seo' ? 'bg-blue-100 text-blue-800' :
                              rec.category === 'readability' ? 'bg-purple-100 text-purple-800' :
                              rec.category === 'authority' ? 'bg-green-100 text-green-800' :
                              rec.category === 'technical' ? 'bg-orange-100 text-orange-800' :
                              rec.category === 'images' ? 'bg-pink-100 text-pink-800' :
                              rec.category === 'ai-optimization' ? 'bg-indigo-100 text-indigo-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {rec.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {!analysis && (
              <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Analyze</h3>
                <p className="text-gray-600">Paste your HTML content and click "Analyze Content" to get detailed SEO insights and recommendations.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
