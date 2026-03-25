<template>
  <div>
    <el-card class="search-card">
      <el-form :inline="true" :model="query">
        <el-form-item label="统计期间">
          <el-date-picker v-model="query.period" type="month" placeholder="选择月份" format="YYYY-MM" value-format="YYYY-MM" />
        </el-form-item>
        <el-form-item label="纳税人名称">
          <el-input v-model="query.name" placeholder="输入企业名称" clearable />
        </el-form-item>
        <el-form-item label="行业类别">
          <el-select v-model="query.industry" placeholder="全部" clearable>
            <el-option v-for="i in industries" :key="i" :label="i" :value="i" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"><el-icon><Search /></el-icon>查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="mt16">
      <template #header>
        <div class="card-header">
          <span>发票税务历史数据分析</span>
          <el-button type="primary" @click="openAiDialog"><el-icon><MagicStick /></el-icon> AI智能分析</el-button>
        </div>
      </template>
      <el-table :data="paginatedTableData" stripe highlight-current-row @row-click="showDetail">
        <el-table-column prop="company" label="纳税人名称" min-width="200" />
        <el-table-column prop="industry" label="行业类别" width="130" />
        <el-table-column prop="invoiceCount" label="发票份数" width="100" align="right" />
        <el-table-column prop="invoiceAmount" label="发票金额(万)" width="130" align="right">
          <template #default="{row}">{{ row.invoiceAmount.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="taxAmount" label="税额合计(万)" width="130" align="right">
          <template #default="{row}">{{ row.taxAmount.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="taxRate" label="税负率" width="90" align="right">
          <template #default="{row}">{{ row.taxRate }}%</template>
        </el-table-column>
        <el-table-column prop="avgRate" label="行业平均" width="90" align="right">
          <template #default="{row}">{{ row.avgRate }}%</template>
        </el-table-column>
        <el-table-column prop="deviation" label="偏差率" width="90" align="right">
          <template #default="{row}">
            <span :style="{ color: Math.abs(row.deviation) > 1 ? '#dc2626' : '#059669', fontWeight: 'bold' }">
              {{ row.deviation > 0 ? '+' : '' }}{{ row.deviation }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="90" align="center">
          <template #default="{row}">
            <el-tag :type="row.status === '正常' ? 'success' : 'danger'" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrap mt16">
        <el-pagination
          v-model:current-page="currentPage"
          background
          layout="total, prev, pager, next"
          :total="filteredTableData.length"
          :page-size="pageSize"
        />
      </div>
    </el-card>

    <el-dialog v-model="aiDialog" title="AI 智能分析" width="600px" top="5vh" @closed="resetAiState">
      <div class="ai-process">
        <div v-for="(step, i) in aiSteps" :key="step.title" class="ai-step" :class="{ active: i <= activeStep, done: i < activeStep }">
          <div class="step-num"><el-icon v-if="i < activeStep"><Check /></el-icon><span v-else>{{ i + 1 }}</span></div>
          <div class="step-content"><strong>{{ step.title }}</strong><p>{{ step.desc }}</p></div>
        </div>
      </div>
      <div v-if="activeStep >= aiSteps.length" class="ai-result">
        <el-alert title="分析完成" type="success" show-icon :closable="false" />
        <p class="ai-result-text">
          共检测到 <strong class="ai-result-highlight">3家</strong> 企业税负率异常偏低，建议重点关注：平顶山永安矿业有限公司（偏差-2.3%）、南阳恒通制造（偏差-1.8%）、周口鑫源贸易（偏差-1.5%）。完整报告已生成。
        </p>
      </div>
      <template #footer>
        <el-button @click="aiDialog = false">关闭</el-button>
        <el-button type="primary" :loading="isAiRunning" @click="runAI" :disabled="isAiRunning || activeStep >= aiSteps.length">开始分析</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="detailDialog" title="企业详情" width="700px">
      <el-descriptions :column="2" border v-if="selectedRow">
        <el-descriptions-item label="纳税人名称">{{ selectedRow.company }}</el-descriptions-item>
        <el-descriptions-item label="行业类别">{{ selectedRow.industry }}</el-descriptions-item>
        <el-descriptions-item label="发票份数">{{ selectedRow.invoiceCount }}</el-descriptions-item>
        <el-descriptions-item label="发票金额">{{ selectedRow.invoiceAmount }}万元</el-descriptions-item>
        <el-descriptions-item label="税额合计">{{ selectedRow.taxAmount }}万元</el-descriptions-item>
        <el-descriptions-item label="税负率">{{ selectedRow.taxRate }}%</el-descriptions-item>
        <el-descriptions-item label="行业平均税负">{{ selectedRow.avgRate }}%</el-descriptions-item>
        <el-descriptions-item label="偏差率"><span :style="{color: selectedRow.deviation<-1?'#dc2626':'#059669'}">{{ selectedRow.deviation }}%</span></el-descriptions-item>
        <el-descriptions-item label="分析状态">{{ selectedRow.status }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { industryOptions } from '../constants/app'

const defaultQuery = () => ({ period: '2026-02', name: '', industry: '' })

const industries = industryOptions
const query = ref(defaultQuery())
const currentPage = ref(1)
const pageSize = 10
const tableData = [
  { company:'河南中原建设集团', industry:'建筑业', invoiceCount:1256, invoiceAmount:58320, taxAmount:5248.8, taxRate:9.0, avgRate:8.5, deviation:0.5, status:'正常' },
  { company:'郑州天成贸易有限公司', industry:'批发零售业', invoiceCount:3420, invoiceAmount:28650, taxAmount:2578.5, taxRate:9.0, avgRate:8.8, deviation:0.2, status:'正常' },
  { company:'洛阳华联科技有限公司', industry:'信息技术服务业', invoiceCount:892, invoiceAmount:15680, taxAmount:940.8, taxRate:6.0, avgRate:5.8, deviation:0.2, status:'正常' },
  { company:'南阳恒通制造有限公司', industry:'制造业', invoiceCount:2156, invoiceAmount:42100, taxAmount:3031.2, taxRate:7.2, avgRate:9.0, deviation:-1.8, status:'异常' },
  { company:'平顶山永安矿业有限公司', industry:'采矿业', invoiceCount:567, invoiceAmount:89200, taxAmount:5946.6, taxRate:6.7, avgRate:9.0, deviation:-2.3, status:'异常' },
  { company:'新乡大通物流有限公司', industry:'交通运输业', invoiceCount:1890, invoiceAmount:23400, taxAmount:2106, taxRate:9.0, avgRate:8.6, deviation:0.4, status:'正常' },
  { company:'周口鑫源贸易有限公司', industry:'批发零售业', invoiceCount:2678, invoiceAmount:19850, taxAmount:1469.8, taxRate:7.4, avgRate:8.9, deviation:-1.5, status:'异常' },
  { company:'安阳盛达房地产有限公司', industry:'房地产业', invoiceCount:145, invoiceAmount:125000, taxAmount:12250, taxRate:9.8, avgRate:9.5, deviation:0.3, status:'正常' },
]

const filteredTableData = computed(() => {
  const nameKeyword = query.value.name.trim()

  return tableData.filter((row) => {
    const matchesName = !nameKeyword || row.company.includes(nameKeyword)
    const matchesIndustry = !query.value.industry || row.industry === query.value.industry
    return matchesName && matchesIndustry
  })
})

const paginatedTableData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredTableData.value.slice(start, start + pageSize)
})

const handleReset = () => {
  query.value = defaultQuery()
  currentPage.value = 1
}

const aiDialog = ref(false)
const detailDialog = ref(false)
const selectedRow = ref(null)
const showDetail = (row) => {
  selectedRow.value = row
  detailDialog.value = true
}

const activeStep = ref(-1)
const isAiRunning = ref(false)
let aiTimer = null

const aiSteps = [
  { title:'数据采集', desc:'自动采集全省发票数据...' },
  { title:'数据预处理', desc:'含税数据同口径转换...' },
  { title:'RAG知识检索', desc:'检索历史案例和政策...' },
  { title:'AI模型推理', desc:'大模型综合分析研判...' },
  { title:'报告生成', desc:'生成标准化分析报告...' },
  { title:'质量校验', desc:'自动校验报告准确性...' },
]

const clearAiTimer = () => {
  if (aiTimer) {
    clearInterval(aiTimer)
    aiTimer = null
  }
}

const resetAiState = () => {
  clearAiTimer()
  activeStep.value = -1
  isAiRunning.value = false
}

const openAiDialog = () => {
  resetAiState()
  aiDialog.value = true
}

const runAI = () => {
  if (isAiRunning.value) {
    return
  }

  clearAiTimer()
  activeStep.value = 0
  isAiRunning.value = true
  aiTimer = setInterval(() => {
    activeStep.value++
    if (activeStep.value >= aiSteps.length) {
      clearAiTimer()
      isAiRunning.value = false
    }
  }, 1200)
}

watch(filteredTableData, () => {
  currentPage.value = 1
})

watch(aiDialog, (visible) => {
  if (!visible) {
    clearAiTimer()
    isAiRunning.value = false
  }
})

onBeforeUnmount(() => {
  clearAiTimer()
})
</script>

<style scoped>
.mt16 { margin-top:16px; }
.card-header { display:flex; justify-content:space-between; align-items:center; }
.search-card .el-form-item { margin-bottom:0; }
.pagination-wrap { text-align:right; }
.ai-step { display:flex; gap:14px; align-items:flex-start; padding:12px 0; opacity:0.4; transition:all 0.3s; }
.ai-step.active { opacity:1; }
.ai-step.done .step-num { background:#059669; }
.step-num { width:28px; height:28px; border-radius:50%; background:#1a56db; color:#fff; display:flex; align-items:center; justify-content:center; font-size:13px; flex-shrink:0; }
.step-content strong { display:block; margin-bottom:2px; }
.step-content p { color:#6b7280; font-size:13px; margin:0; }
.ai-result { margin-top:12px; }
.ai-result-text { margin-top:12px; color:#374151; }
.ai-result-highlight { color:#dc2626; }
</style>
