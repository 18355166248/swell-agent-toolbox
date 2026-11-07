# Filesystem MCP 配置示例

使用官方 `@modelcontextprotocol/server-filesystem`，将 config.example.json 的目录占位符替换成明确的工作目录，再按客户端的 MCP 配置方式导入。

这个仓库提供配置示例，不包含该第三方服务器源码，也没有自动安装或启动它。该服务包含写入能力；仅授予需要的工作目录，使用客户端的工具确认机制管理写操作。不要将整块硬盘作为默认范围。

来源：https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem
