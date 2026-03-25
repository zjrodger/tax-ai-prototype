<template>
  <el-container class="app-layout">
    <el-aside width="220px" class="sidebar">
      <div class="logo-area">
        <el-icon :size="28" color="#4da6ff"><Monitor /></el-icon>
        <span class="logo-text">税务AI智能体</span>
      </div>
      <el-menu
        :default-active="route.path"
        router
        background-color="#0d1b3e"
        text-color="#a0b4d0"
        active-text-color="#4da6ff"
        class="sidebar-menu"
      >
        <el-menu-item
          v-for="item in navigationItems"
          :key="item.path"
          :index="item.path"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
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

      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { navigationItems } from './constants/app'

const route = useRoute()
</script>

<style>
.app-layout { height: 100vh; }
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
