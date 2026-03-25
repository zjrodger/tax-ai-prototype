<template>
  <el-container style="height:100vh">
    <!-- 左侧导航 -->
    <el-aside width="220px" class="sidebar">
      <div class="logo-area">
        <el-icon :size="28" color="#4da6ff"><Monitor /></el-icon>
        <span class="logo-text">税务AI智能体</span>
      </div>
      <el-menu :default-active="route.path" router background-color="#0d1b3e" text-color="#a0b4d0" active-text-color="#4da6ff" class="sidebar-menu">
        <el-menu-item index="/"><el-icon><DataBoard /></el-icon><span>工作台</span></el-menu-item>
        <el-menu-item index="/invoice"><el-icon><Document /></el-icon><span>发票税务分析</span></el-menu-item>
        <el-menu-item index="/taxsource"><el-icon><OfficeBuilding /></el-icon><span>重点税源分析</span></el-menu-item>
        <el-menu-item index="/knowledge"><el-icon><Collection /></el-icon><span>知识库管理</span></el-menu-item>
        <el-menu-item index="/settings"><el-icon><Setting /></el-icon><span>系统设置</span></el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <!-- 顶部栏 -->
      <el-header class="header">
        <div class="header-left">
          <span class="header-title">河南省税务局 · 税务AI智能体平台</span>
        </div>
        <div class="header-right">
          <el-badge :value="3" :max="99">
            <el-icon :size="20"><Bell /></el-icon>
          </el-badge>
          <el-divider direction="vertical" />
          <el-dropdown>
            <span class="user-info"><el-avatar :size="32" style="background:#1a56db">张</el-avatar><span style="margin-left:8px">张三 · 稽查科</span></span>
            <template #dropdown>
              <el-dropdown-menu><el-dropdown-item>个人中心</el-dropdown-item><el-dropdown-item divided>退出登录</el-dropdown-item></el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 主内容 -->
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family: 'Microsoft YaHei', sans-serif; background:#f0f2f5; }
.sidebar { background: #0d1b3e; overflow-y:auto; }
.sidebar .logo-area { display:flex; align-items:center; padding:20px 16px; gap:10px; border-bottom:1px solid #1a2d5a; }
.logo-text { color:#fff; font-size:16px; font-weight:bold; }
.sidebar-menu { border-right:none; }
.sidebar-menu .el-menu-item { height:50px; line-height:50px; }
.sidebar-menu .el-menu-item:hover { background:#152952 !important; }
.header { background:#fff; display:flex; align-items:center; justify-content:space-between; box-shadow:0 1px 4px rgba(0,0,0,0.08); z-index:10; }
.header-title { color:#333; font-size:15px; font-weight:500; }
.header-right { display:flex; align-items:center; gap:16px; }
.user-info { display:flex; align-items:center; cursor:pointer; color:#333; }
.main-content { padding:20px; background:#f0f2f5; overflow-y:auto; }
</style>
