# Swell Agent Toolbox

个人智能体工具箱：收集可复用的 Skills、MCP 连接和工作流，配套一个定制化的中文文档与展示网站。

基于 React、Next.js、Fumadocs 和 Tailwind CSS，静态导出，可部署到 GitHub Pages。

## 开始使用

需要 Node.js 22.22+。安装技能不需要先安装网站依赖：

```bash
git clone https://github.com/18355166248/swell-agent-toolbox.git
cd swell-agent-toolbox
npm run skill:install -- comic-translate
```

默认安装到个人 Codex 技能目录；可用 `--client claude` 或 `--target <目录>` 选择位置。
目标已存在时停止，不覆盖本地修改。用 `--dry-run` 预览；依赖框架、模型、MCP 服务需另外安装。

## 仓库结构

```text
skills/           技能与自身脚本，保留标准 SKILL.md
mcp/configs/      第三方 MCP 配置示例
mcp/servers/      后续自有服务的源码位置
workflows/        多个能力组合的流程
registry.json     工具展示与依赖的唯一目录来源
content/docs/     中文使用文档
app/              定制首页与文档站
scripts/          目录生成、校验与本地安装
```

## 网站维护

```bash
npm ci
npm run dev
npm run check
npm run build
```

预览 `http://localhost:3000`。添加条目时同步源文件、registry 与对应文档；首页和公开目录数据自动生成。
网站支持关键词搜索、类型/标签筛选、卡片/列表视图及明暗主题。文档全文搜索使用静态索引。

`main` 分支推送后，GitHub Actions 检查并构建站点，再发布到 GitHub Pages；仓库的 Pages 来源需选择 **GitHub Actions**。
部署到项目路径时设置 `SITE_BASE_PATH=/swell-agent-toolbox`，独立域名或根目录部署时置空。

漫画翻译技能需要单独安装配套框架，使用 `CTT_REPO` 或 `--repo` 指定位置。公开仓库不包含私人漫画、对白、运行结果、密钥或机器专用配置。

源代码和本仓库原创技能使用 MIT 许可证；链接到的第三方工具遵循其各自许可证。
