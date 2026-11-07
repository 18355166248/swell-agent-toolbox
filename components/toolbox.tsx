'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { ArrowDown, ArrowRight, ArrowUpRight, Box, Check, ChevronRight, Copy, GitFork as Github, Grid2X2, Languages, List, Moon, Plug, Search, Sparkles, Sun, Terminal, Workflow, X } from 'lucide-react';
import catalog from '@/lib/catalog.generated.json';
import { asset, repositoryUrl } from '@/lib/paths';

const icons = { languages: Languages, box: Box, plug: Plug, workflow: Workflow };
const kinds = { skill: 'Skills', mcp: 'MCP', workflow: 'Workflows' };
const sections = ['全部工具', 'Skills', 'MCP', 'Workflows'];

function Brand() {
  return <Link className="brand" href="/" aria-label="Swell 首页"><span className="brand-symbol"><Sparkles size={22} strokeWidth={1.6} /></span><span>swell<span className="brand-slash">/</span><small>agent toolbox</small></span></Link>;
}

export function Toolbox() {
  const [section, setSection] = useState('全部工具');
  const [tag, setTag] = useState('全部领域');
  const [query, setQuery] = useState('');
  const [view, setView] = useState('grid');
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const searchRef = useRef<HTMLInputElement>(null);
  const tags = ['全部领域', ...new Set(catalog.flatMap((tool) => tool.tags))];
  const result = useMemo(() => catalog.filter((tool) =>
    (section === '全部工具' || kinds[tool.kind as keyof typeof kinds] === section) &&
    (tag === '全部领域' || tool.tags.includes(tag)) &&
    `${tool.title} ${tool.id} ${tool.summary} ${tool.tags.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase())), [section, tag, query]);
  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
        searchRef.current?.focus({ preventScroll: true });
      }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, []);
  async function copy() {
    try {
      await navigator.clipboard.writeText('npm run skill:install -- comic-translate');
      setCopied(true); setCopyFailed(false);
      window.setTimeout(() => setCopied(false), 2000);
    } catch { setCopyFailed(true); }
  }
  function select(value: string) {
    setSection(value); setTag('全部领域');
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
  }

  return <div className="toolbox-site">
    <a className="skip-link" href="#collection">跳到工具目录</a>
    <header className="site-header"><div className="header-inner">
      <Brand />
      <nav className="desktop-nav" aria-label="主导航">
        <a className="nav-active" href="#collection">工具集<span className="tiny-count">{catalog.length}</span></a>
        <Link href="/docs">使用文档</Link>
        <Link href="/docs/changelog">更新记录</Link>
      </nav>
      <div className="header-actions">
        <button className="icon-button theme-button" aria-label="切换明暗主题" onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}><Sun className="sun-icon" size={18}/><Moon className="moon-icon" size={18}/></button>
        <a className="github-link" href={repositoryUrl} target="_blank" rel="noreferrer"><Github size={18}/><span>GitHub</span><ArrowUpRight size={13}/></a>
      </div>
    </div></header>

    <main>
      <section className="hero page-width">
        <div className="hero-copy">
          <div className="eyebrow"><span className="live-dot"/> SWELL'S PERSONAL COLLECTION <span className="edition">VOL. 001</span></div>
          <h1>让好用的能力，<br/><span className="accent-text">不止用一次。</span><span className="heading-spark">✳</span></h1>
          <p className="hero-description">把日常实践里的 Skills、MCP 和工作流，<br className="desktop-break"/>收进一个持续生长的工具箱。找到它，理解它，再用起来。</p>
          <div className="hero-actions"><a href="#collection" className="button-primary">探索工具箱 <ArrowDown size={16}/></a><Link className="button-text" href="/docs">从这里开始 <ArrowRight size={16}/></Link></div>
          <div className="hero-footnote"><span className="avatar-mark">S</span><span>Built & curated by <b>Swell</b></span><span className="footnote-divider"/>持续整理，认真复用</div>
        </div>
        <div className="hero-visual" aria-label="技能、连接与工作流组成个人工具箱的示意图">
          <div className="visual-grid"/>
          <span className="visual-label">SMALL TOOLS. BIG POSSIBILITIES.</span>
          <div className="floating-note note-top"><span className="note-dot"/> ideas → capabilities</div>
          <div className="tool-stack stack-back"/><div className="tool-stack stack-middle"/>
          <div className="tool-stack stack-front">
            <div className="stack-title"><span className="stack-mark"><Sparkles size={18}/></span><span>MY AGENT TOOLBOX</span><span className="stack-counter">01—{String(catalog.length).padStart(2, '0')}</span></div>
            <div className="stack-row"><span className="stack-icon orange"><Languages size={21}/></span><div><strong>Skills</strong><small>把经验写成可复用的能力</small></div><span className="file-label">SKILL.md</span></div>
            <div className="stack-row"><span className="stack-icon green"><Plug size={21}/></span><div><strong>MCP</strong><small>连接真实的工具与数据</small></div><span className="file-label">↗ connect</span></div>
            <div className="stack-row"><span className="stack-icon blue"><Workflow size={21}/></span><div><strong>Workflows</strong><small>让多个能力一起完成任务</small></div><span className="file-label">→ compose</span></div>
            <div className="stack-bottom"><span className="live-dot"/> ready when you are<span>⌘ + curiosity</span></div>
          </div>
          <div className="floating-note note-bottom"><span className="handwritten">a little more capable, every day.</span><ArrowUpRight size={25}/></div>
          <span className="visual-cross cross-one">+</span><span className="visual-cross cross-two">+</span>
        </div>
      </section>

      <section className="collection-summary page-width" aria-label="工具箱统计">
        <div className="summary-intro"><span className="mini-overline">THE COLLECTION</span><span>各有所长，也能相互连接。</span></div>
        {(['skill', 'mcp', 'workflow'] as const).map((kind) => <button key={kind} onClick={() => select(kinds[kind])}><b>{String(catalog.filter(t => t.kind === kind).length).padStart(2,'0')}</b><span>{kinds[kind]}</span><ArrowUpRight size={15}/></button>)}
        <Link className="summary-more" href="/docs/contributing">一起让它更好 <ArrowUpRight size={15}/></Link>
      </section>

      <section className="catalog-section page-width" id="collection">
        <div className="section-heading"><div><div className="eyebrow muted">FIND YOUR NEXT SUPERPOWER</div><h2>顺手的工具，都在这里<span>。</span></h2></div><p>按场景寻找，按需取用。</p></div>
        <div className="catalog-toolbar">
          <div className="type-tabs" role="group" aria-label="工具类型">{sections.map((item) => <button key={item} aria-pressed={section === item} className={section === item ? 'selected' : ''} onClick={() => {setSection(item); setTag('全部领域');}}>{item}<span>{item === '全部工具' ? catalog.length : catalog.filter(t => kinds[t.kind as keyof typeof kinds] === item).length}</span></button>)}</div>
          <label className="catalog-search"><Search size={17}/><input ref={searchRef} value={query} onChange={e=>setQuery(e.target.value)} placeholder="搜索工具、能力或关键词…" aria-label="搜索工具"/>{query ? <button aria-label="清空搜索" onClick={()=>setQuery('')}><X size={15}/></button> : <kbd>⌘ K</kbd>}</label>
        </div>
        <div className="catalog-subtoolbar"><div className="tag-list" role="group" aria-label="领域筛选">{tags.map(item=><button key={item} aria-pressed={tag===item} onClick={()=>setTag(item)} className={tag===item?'tag-selected':''}>{item}</button>)}</div><div className="view-toggle" role="group" aria-label="显示方式"><button aria-label="卡片视图" aria-pressed={view==='grid'} onClick={()=>setView('grid')}><Grid2X2 size={16}/></button><button aria-label="列表视图" aria-pressed={view==='list'} onClick={()=>setView('list')}><List size={17}/></button></div></div>
        <div className={`tool-cards ${view==='list'?'list-view':''}`}>
          {result.map((tool)=>{
            const Icon = icons[tool.icon as keyof typeof icons] || Box;
            return <Link className={`tool-card card-${tool.accent}`} key={tool.id} href={tool.docs}>
              <div className="card-top"><span className={`tool-icon ${tool.accent}`}><Icon size={25} strokeWidth={1.6}/></span><span className="kind-label">{kinds[tool.kind as keyof typeof kinds]}</span><ArrowUpRight className="card-arrow" size={19}/></div>
              <div className="card-content"><div className="card-title-row"><h3>{tool.title}</h3>{tool.featured && <span className="featured-badge"><Sparkles size={10}/> 精选</span>}</div><span className="tool-id">{tool.id}</span><p>{tool.summary}</p><div className="card-tags">{tool.tags.map(t=><span key={t}>{t}</span>)}</div></div>
              <div className="card-bottom"><span><i className={tool.status==='可使用'?'status-dot':'status-dot example-dot'}/>{tool.status}</span><span>查看使用方式 <ArrowRight size={13}/></span></div>
            </Link>;
          })}
        </div>
        {result.length===0 && <div className="empty-state"><Search size={28}/><h3>暂时没有匹配的工具</h3><p>换个关键词，或者看看全部工具。</p><button onClick={()=>{setQuery('');setTag('全部领域');setSection('全部工具');}}>重置筛选 <ArrowRight size={14}/></button></div>}
        <div className="catalog-count" aria-live="polite">展示 {result.length} / {catalog.length} 个条目<span>保持小巧，持续生长 <span className="small-spark">✳</span></span></div>
      </section>

      <section className="getting-started page-width">
        <div className="getting-copy"><div className="eyebrow">LESS SETUP, MORE DOING</div><h2>找到喜欢的，<br/>就从这一个开始。</h2><p>克隆仓库，选择需要的技能。<br/>每个工具都有自己的使用说明和依赖清单。</p><Link href="/docs/getting-started">阅读安装指南 <ArrowUpRight size={15}/></Link></div>
        <div className="terminal-card"><div className="terminal-top"><div><i/><i/><i/></div><span>your next small upgrade</span><Terminal size={15}/></div><div className="terminal-body"><span className="terminal-comment"># 01 取回工具箱</span><code><span>❯</span> git clone {repositoryUrl}.git</code><code><span>❯</span> cd swell-agent-toolbox</code><span className="terminal-comment"># 02 安装一个技能</span><div className="copy-line"><code><span>❯</span> npm run skill:install -- comic-translate</code><button onClick={copy} aria-label="复制技能安装命令">{copied?<Check size={16}/>:<Copy size={16}/>}</button></div><div className="terminal-hint" role="status">{copyFailed?'请选中上方命令手动复制。':copied?'安装命令已复制。':'在你的智能体客户端中，开始使用 $comic-translate。'}</div></div></div>
      </section>
      <section className="closing page-width"><span className="closing-mark">✳</span><div><h2>工具会越来越多，<br className="mobile-break"/>好奇心也是。</h2><p>这里记录的是实践，也是下一次灵感的起点。</p></div><a href={repositoryUrl} target="_blank" rel="noreferrer">在 GitHub 一起构建 <ArrowUpRight size={17}/></a></section>
    </main>
    <footer className="site-footer page-width"><Brand/><span>Made with intention, by Swell.</span><div><Link href="/docs">文档</Link><a href={asset('/catalog.json')}>目录数据 <ChevronRight size={12}/></a><span>© 2026</span></div></footer>
  </div>;
}
