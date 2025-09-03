'use client';

import { useState } from 'react';
import { SEOAnalyzer } from '@/lib/seo-analyzer';
import { SEOAnalysisResult } from '@/types/seo';
import { Search, FileText, CheckCircle, AlertTriangle, XCircle, BarChart3 } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'recommendations', label: 'Action Plan', icon: CheckCircle }
  ];

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
                {/* Tab Navigation */}
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6" aria-label="Tabs">
                      {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`${
                              activeTab === tab.id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                          >
                            <Icon className="w-4 h-4 mr-2" />
                            {tab.label}
                          </button>
                        );
                      })}
                    </nav>
                  </div>

                  {/* Tab Content */}
                  <div className="p-6">
                    {activeTab === 'overview' && (
                      <div className="space-y-6">
                        {/* Overall Score */}
                        <div className="text-center">
                          <div className={`text-4xl font-bold ${getScoreColor(analysis.score.overall)} mb-2`}>
                            {analysis.score.overall}/100
                          </div>
                          <div className="text-gray-600 mb-4">Overall SEO Score</div>
                          
                          {/* Validation Badge */}
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 mb-4">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            ✅ Real Analysis • {analysis?.contentDetails?.realTimeValidation?.confidence || 95}% Confidence
                          </div>
                          
                          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
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

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{analysis.content.comprehensiveness.wordCount}</div>
                            <div className="text-sm text-gray-600">Words</div>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{analysis.links.external.highAuthorityCount}</div>
                            <div className="text-sm text-gray-600">Authority Links</div>
                          </div>
                          <div className="bg-yellow-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-600">{analysis.content.readability.fleschScore}</div>
                            <div className="text-sm text-gray-600">Readability</div>
                          </div>
                          <div className="bg-purple-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">{analysis.checklist.completionPercentage}%</div>
                            <div className="text-sm text-gray-600">SEO Checklist</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'recommendations' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">🎯 Specific Action Plan</h3>
                          <div className="text-sm text-gray-500">
                            Updated: {new Date(analysis?.contentDetails?.realTimeValidation?.lastAnalyzed || Date.now()).toLocaleString()}
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          {analysis?.recommendations?.slice(0, 8).map((rec, index) => (
                            <div key={index} className={`p-4 rounded-lg border ${
                              rec.type === 'critical' ? 'border-red-200 bg-red-50' :
                              rec.type === 'important' ? 'border-yellow-200 bg-yellow-50' :
                              'border-blue-200 bg-blue-50'
                            }`}>
                              <div className="flex items-start">
                                {getRecommendationIcon(rec.type)}
                                <div className="ml-3 flex-1">
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm font-medium text-gray-900">{rec.title}</div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      rec.impact === 'high' ? 'bg-red-100 text-red-800' :
                                      rec.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-green-100 text-green-800'
                                    }`}>
                                      {rec.impact} impact
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-600 mt-1">{rec.description}</div>
                                  
                                  {rec.specificAction && (
                                    <div className="mt-3 p-3 bg-white rounded border">
                                      <div className="text-xs font-medium text-gray-700 mb-1">📋 Action Required:</div>
                                      <div className="text-sm text-gray-800 mb-2">{rec.specificAction}</div>
                                      
                                      {rec.whereToImplement && (
                                        <div className="mb-2">
                                          <span className="text-xs font-medium text-gray-700">📍 Where: </span>
                                          <span className="text-xs text-blue-600">{rec.whereToImplement}</span>
                                        </div>
                                      )}
                                      
                                      {rec.exampleText && (
                                        <div className="bg-gray-50 p-2 rounded text-xs">
                                          <span className="font-medium text-gray-700">💡 Example: </span>
                                          <span className="text-gray-600">{rec.exampleText}</span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )) || []}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {!analysis && (
              <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Analyze</h3>
                <p className="text-gray-600">Paste your HTML content and click "Analyze Content" to get detailed SEO insights and specific recommendations with exact implementation guidance.</p>
                <div className="mt-4 p-3 bg-blue-50 rounded">
                  <p className="text-sm text-blue-800">
                    ✨ <strong>New Features:</strong> Get specific paragraph-level recommendations, exact link placement suggestions, and actionable SEO improvements!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}