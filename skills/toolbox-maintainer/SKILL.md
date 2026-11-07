---
name: toolbox-maintainer
description: 在 swell-agent-toolbox 中新增或维护技能、MCP 配置、工作流与对应文档，并检查目录和网站构建。当用户要把工具收进工具箱、更新使用说明或修复工具目录时使用。
---

# 工具箱维护

在当前 swell-agent-toolbox 仓库工作；从目录和 package.json 确认位置，不猜测另一个同名仓库。

- 新增条目前检查 `registry.json`，保持 id 唯一，目录位于 `skills/`、`mcp/` 或 `workflows/`，不修改无关工具。
- 技能使用 `skills/<id>/SKILL.md`，name 与 id 一致，脚本和参考文件放在技能自身目录。按需要使用技能创建器，不复制机器上的全部第三方技能。
- MCP 区分可运行的自有服务和第三方配置示例。写清启动命令、依赖、权限范围及客户端格式；示例不能被标成已运行服务。
- 添加对应的 `content/docs/<kind>/<id>.mdx`，说明用途、安装、调用、依赖、限制和来源。把目录展示字段集中写入 registry；不要手改 catalog.generated.json。
- 导入已有工具时先检查许可证、绝对本地路径、凭据和私有样本。公开版本用环境变量与示例配置，保留原始作者及许可证要求；工作副本和用户配置不覆盖。
- 执行 `npm run catalog:generate` 与 `npm run types:check`，有逻辑变更时运行相关测试，最后运行 `npm run build`。检查新增链接和静态导出路径。
- 发布或推送仅在当前任务授权范围内进行；有用户待提交改动时先识别边界。最终报告改动、验证结果和仍未解决的依赖。
