"""Build the reviewed Markdown article into static, dependency-free HTML."""
from pathlib import Path
import re,json,html
ROOT=Path(__file__).resolve().parents[1]
slug='wordpress-vs-custom-website'
base='https://ahtashamfarooq.netlify.app'
source=(ROOT/'content/drafts'/f'{slug}.md').read_text(encoding='utf-8')
body=source.split('---',2)[2].strip()
lines=body.splitlines(); toc=[];out=[];i=0
esc=lambda s:html.escape(s,quote=True)
def inline(s):
 s=esc(s)
 s=re.sub(r'\[([^\]]+)\]\(([^)]+)\)',lambda m:f'<a href="{m[2]}">{m[1]}</a>',s)
 s=re.sub(r'\*\*([^*]+)\*\*',r'<strong>\1</strong>',s)
 return s
def anchor(s):return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
while i<len(lines):
 line=lines[i].strip()
 if not line or line.startswith('# ') or line.startswith('![') or line.startswith('*Illustrative'): i+=1;continue
 if line.startswith('## '):
  text=line[3:];key=anchor(text);toc.append((key,text));out.append(f'<h2 id="{key}">{inline(text)}</h2>');i+=1;continue
 if line.startswith('### '):out.append(f'<h3>{inline(line[4:])}</h3>');i+=1;continue
 if line.startswith('|'):
  rows=[]
  while i<len(lines) and lines[i].strip().startswith('|'):
   rows.append([c.strip() for c in lines[i].strip().strip('|').split('|')]);i+=1
  out.append('<div class="table-scroll" role="region" aria-label="Website options comparison" tabindex="0"><table><caption>WordPress and custom websites at a glance</caption><thead><tr>'+''.join('<th scope="col">'+inline(c)+'</th>' for c in rows[0])+'</tr></thead><tbody>')
  for row in rows[2:]:out.append('<tr><th scope="row">'+inline(row[0])+'</th>'+''.join('<td>'+inline(c)+'</td>' for c in row[1:])+'</tr>')
  out.append('</tbody></table></div>');continue
 if line.startswith('- ') or re.match(r'\d+\. ',line):
  ordered=bool(re.match(r'\d+\. ',line));tag='ol' if ordered else 'ul';out.append('<'+tag+'>')
  while i<len(lines) and (re.match(r'\d+\. ',lines[i]) if ordered else lines[i].startswith('- ')):
   out.append('<li>'+inline(re.sub(r'^(?:- |\d+\. )','',lines[i]))+'</li>');i+=1
  out.append('</'+tag+'>');continue
 out.append('<p>'+inline(line)+'</p>');i+=1
article='\n'.join(out)
# Folder-relative links work both on the static host and a local file preview.
def relative(markup,prefix):
 return re.sub(r'(href|src)="/(?!/)([^"]*)"',lambda m:m[1]+'="'+prefix+m[2]+'"',markup)
home=(ROOT/'index.html').read_text(encoding='utf-8')
footer=re.search(r'<footer\b[\s\S]*?</footer>',home).group()
if 'href="insights/index.html"' not in footer:footer=footer.replace('<h3>Explore</h3>','<h3>Explore</h3><a href="insights/index.html">Insights</a>')
def footer_at(prefix):return re.sub(r'href="(?!https?:|mailto:|tel:|#)([^"]+)"',lambda m:'href="'+prefix+m[1]+'"',footer)
image='public/insights/wordpress-vs-custom-website.webp'
title='WordPress vs Custom Website: Small Business Guide'
desc='Compare WordPress and custom websites for your small business. Explore costs, maintenance, SEO and flexibility to choose what fits your goals.'
headline='WordPress vs Custom Website for a Small Business'
def shell(title,desc,url,content,prefix,schema):
 return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{esc(title)}</title><meta name="description" content="{esc(desc)}"><meta name="author" content="Ahtasham Farooq"><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="{base+url}"><meta property="og:type" content="{'article' if schema.get('@type')=='BlogPosting' else 'website'}"><meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(desc)}"><meta property="og:url" content="{base+url}"><meta property="og:image" content="{base+'/'+image}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="632"><meta property="og:image:alt" content="Conceptual content editor and custom-coded website comparison"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{esc(title)}"><meta name="twitter:description" content="{esc(desc)}"><meta name="twitter:image" content="{base+'/'+image}"><meta name="theme-color" content="#090c10"><link rel="icon" href="{prefix}favicon.ico"><link rel="stylesheet" href="{prefix}style.css?v=studio-2"><link rel="stylesheet" href="{prefix}insights/insights.css"><script type="application/ld+json">{json.dumps(schema)}</script></head><body class="insights-page"><a class="skip-link" href="#main-content">Skip to article</a><header class="insights-nav"><a class="insights-brand" href="{prefix}index.html">Ahtasham<span>.dev</span></a><div><a href="{prefix}projects.html">Work</a><a href="{prefix}insights/index.html">Insights</a><a class="nav-contact" href="{prefix}index.html#contact">Let's talk <span aria-hidden="true">↗</span></a></div></header>{content}{footer_at(prefix)}<script src="{prefix}insights/insights.js" defer></script></body></html>'''
links=''.join(f'<li><a href="#{key}">{esc(text)}</a></li>' for key,text in toc)
minutes=max(1,round(len(body.split())/220))
content=f'''<main id="main-content"><header class="article-hero"><div class="article-breadcrumb"><a href="../index.html">Insights</a><span>/</span><span>Website strategy</span></div><p class="article-kicker">THE SMALL BUSINESS GUIDE</p><h1>WordPress vs Custom Website<br><span>for a Small Business</span></h1><p class="article-deck">A practical comparison of costs, content editing and long-term upkeep, so you can choose your next website with confidence.</p><div class="article-byline"><img src="../../public/ahtasham-farooq-author.jpg" width="42" height="42" alt="Ahtasham Farooq"><div><a href="../../index.html#about">Ahtasham Farooq</a><span>Software Engineer &amp; Full Stack Developer</span></div><span class="reading-time">{minutes} min read</span></div></header><figure class="article-cover"><img src="../../{image}" width="1200" height="632" alt="Conceptual content editor and custom-coded business website shown side by side" fetchpriority="high"><figcaption>Conceptual illustration, not screenshots of client projects.</figcaption></figure><div class="article-layout"><aside class="article-sidebar"><details open><summary>On this page</summary><ol>{links}</ol></details><a class="sidebar-contact" href="../../index.html#contact">Planning a website? <span>Let's discuss your requirements ↗</span></a></aside><article class="article-prose" aria-label="{headline}"><div class="article-takeaway"><span>THE SHORT ANSWER</span><p>Start with your editing needs and business workflows. Compare the complete scope and maintenance plan before choosing a platform.</p></div>{relative(article,'../../')}<div class="article-author"><img src="../../public/ahtasham-farooq-author.jpg" width="64" height="64" alt="Ahtasham Farooq" loading="lazy"><div><strong>Written by Ahtasham Farooq</strong><p>Web, Flutter and WordPress development for remote clients worldwide.</p><a href="../../index.html#about">More about the author ↗</a></div></div><a class="back-insights" href="../index.html">← All insights</a></article></div></main>'''
schema={'@context':'https://schema.org','@type':'BlogPosting','headline':headline,'description':desc,'image':[base+'/'+image],'author':{'@type':'Person','name':'Ahtasham Farooq','url':base+'/#about','@id':base+'/#person'},'mainEntityOfPage':base+'/insights/'+slug+'/','inLanguage':'en'}
# Publication dates are intentionally absent until the deployment date is known.
html_article=shell(title,desc,'/insights/'+slug+'/',content,'../../',schema)
crumb={'@context':'https://schema.org','@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':'Home','item':base+'/'},{'@type':'ListItem','position':2,'name':'Insights','item':base+'/insights/'},{'@type':'ListItem','position':3,'name':headline,'item':base+'/insights/'+slug+'/'}]}
html_article=html_article.replace('</head>','<script type="application/ld+json">'+json.dumps(crumb)+'</script></head>')
(ROOT/'insights'/slug/'index.html').write_text(html_article,encoding='utf-8')
hub=f'''<main id="main-content" class="insights-hub"><p class="article-kicker">NOTES FOR BETTER DIGITAL DECISIONS</p><h1>Practical insights.<br><span>Clearer next steps.</span></h1><p class="article-deck">Guides on choosing, building and maintaining a website that works for your business.</p><a class="insight-card" href="{slug}/index.html"><img src="../{image}" width="1200" height="632" alt="WordPress and custom website comparison" fetchpriority="high"><div><p class="article-kicker">WEBSITE STRATEGY · {minutes} MIN READ</p><h2>{headline}</h2><p>Understand the trade-offs in costs, editing and maintenance before commissioning your website.</p><span class="read-guide">Read the guide ↗</span></div></a></main>'''
(ROOT/'insights/index.html').write_text(shell('Website Insights for Small Businesses | Ahtasham Farooq','Practical guides to website platforms, development and maintenance for small businesses working with a remote developer.','/insights/',hub,'../',{'@context':'https://schema.org','@type':'CollectionPage','name':'Website Insights','url':base+'/insights/'}),encoding='utf-8')
print('Built Insights hub and article.')
