# Changelog

All notable changes to this project will be documented in this file.

## [3.6.0] - 2025-05-19

### Features

- 重构选项页面，新增 BasicConfig 页面整合代理服务器、按需代理设置（GFWList 开关、代理域名）和全局代理设置（直连域名、绕过私有网络）
- 新增绕过私有网络功能：在全局代理模式下，私有 IP 地址段及 localhost/*.local 自动绕过代理
- 改进无代理服务器时的用户体验
  - Popup：显示专用空状态页面（图标 + 提示文字 + 跳转设置链接），取代之前的警告 tooltip
  - 代理服务器列表：为空时居中显示提示文字
- 新增代理服务器添加弹窗按 Enter 键提交支持

### Documentation

- 优化直连域名列表描述文案，对齐代理域名列表描述风格，补充仅匹配域名说明和 `*.cn` 示例

### Technical Improvements

- 添加 `STORAGE_BYPASS_PRIVATE_NETWORKS` 存储键及对应配置读写函数
- PAC 脚本增强：支持 `isInNet`/`shExpMatch` 绕过私有网络
- Popup 区分加载状态（`null`）与空列表状态（`[]`）
- 提取 `NewServerPopup` 的 `handleSubmit` 函数，避免重复逻辑
- 新增 i18n 消息（英文 + 中文）
- VSCode 设置：添加 import 自动排序

### Chore

- gitignore 添加 `*.zip`
- 版本号升级至 3.6.0

## [3.5.0] - 2025-05-15

### Features

- 重命名代理模式，提升可理解性
  - 黑名单模式 → 按需代理 (On-Demand)
  - 白名单模式 → 全局代理 (Global)
- 重命名域名列表
  - 黑名单 → 代理域名列表 (Proxy Domains)
  - 白名单 → 直连域名列表 (Bypass Domains)
- 更新代理模式图标
  - 按需代理：FilterAltOutlined
  - 全局代理：Language

### Technical Improvements

- 添加历史数据迁移逻辑，兼容旧版黑名单/白名单配置
- 更新所有 i18n 文案（英文 + 中文）
- 重命名组件文件：BlackList → ProxyDomains, WhiteList → BypassDomains

## [3.4.0] - 2025-05-27

### Features

- 集成 GFWList 功能到代理设置
  - 添加启用/禁用 GFWList 的选项
  - 支持刷新 GFWList 内容
  - 在 PAC 脚本生成中集成 GFWList 检查
  - 更新 UI 组件以管理 GFWList 设置，支持 Snackbar 通知
  - 为 GFWList 功能添加英文和中文本地化消息

### Technical Improvements

- 新增 GFWList 服务模块 (`src/utils/gfwlist.ts`)
- 增强代理配置以支持 GFWList 集成
- 优化黑名单和白名单管理界面
- 完善多语言支持

## [3.3.0] - 2025-02-08

### Features

- 增加黑白名单导入导出功能
- 使用 @tanstack/react-virtual 替换 react-virtualized，提升性能

### Bug Fixes

- 剔除无用文件

### Documentation

- 新增项目贡献指南 (CONTRIBUTING.md)
- 新增隐私政策文件 (PRIVACY.md)

### Chore

- 添加 @types/node 依赖
- 创建自定义 Vite 插件用于监视 public 目录

## [3.2.0] - 2024-02-08

[点击查看详情](https://github.com/jinzhenzu/simple_proxy/releases/tag/v3.2.0)