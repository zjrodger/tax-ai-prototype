import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'dashboard', component: () => import('../views/Dashboard.vue') },
  { path: '/invoice', name: 'invoice', component: () => import('../views/InvoiceAnalysis.vue') },
  { path: '/taxsource', name: 'taxsource', component: () => import('../views/TaxSourceAnalysis.vue') },
  { path: '/knowledge', name: 'knowledge', component: () => import('../views/KnowledgeBase.vue') },
  { path: '/settings', name: 'settings', component: () => import('../views/Settings.vue') },
]

export default createRouter({ history: createWebHistory(), routes })
