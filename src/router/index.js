import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('../views/Dashboard.vue') },
  { path: '/invoice', component: () => import('../views/InvoiceAnalysis.vue') },
  { path: '/taxsource', component: () => import('../views/TaxSourceAnalysis.vue') },
  { path: '/knowledge', component: () => import('../views/KnowledgeBase.vue') },
  { path: '/settings', component: () => import('../views/Settings.vue') },
]

export default createRouter({ history: createWebHistory(), routes })
