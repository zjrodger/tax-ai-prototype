<template>
  <div>
    <!-- 筛选区 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="query">
        <el-form-item label="企业名称"><el-input v-model="query.name" placeholder="输入企业名称" clearable /></el-form-item>
        <el-form-item label="行业分类">
          <el-select v-model="query.industry" placeholder="全部" clearable>
            <el-option v-for="i in industries" :key="i" :label="i" :value="i" />
          </el-select>
        </el-form-item>
        <el-form-item><el-button type="primary" @click="startAnalysis"><el-icon><MagicStick /></el-icon> 开始AI分析</el-button></el-form-item>
      </el-form>
    </el-card>

    <!-- 分析过程 -->
    <el-card class="mt16" v-if="analyzing">
      <template #header><span>AI 分析过程</span></template>
      <el-timeline>
        <el-timeline-item v-for="(step,i) in steps" :key="i" :type="i<currentStep?'success':i===currentStep?'primary':'info'" :hollow="i>currentStep">
          <strong>{{ step.title }}</strong>
          <p style="color:#6b7280;margin:4px 0 0">{{ step.desc }}</p>
          <el-progress v-if="i===currentStep" :percentage="progress" :stroke-width="6" style="margin-top:8px" />
        </el-timeline-item>
      </el-timeline>
    </el-card>

    <!-- 分析结果 -->
    <el-card class="mt16" v-if="showResult">
      <template #header><div class="card-header"><span>分析结果</span><el-button type="success" @click="genReport"><el-icon><Document /></el-icon> 生成报告</el-button></div></template>
      
      <el-row :gutter="16">
        <el-col :span="8">
          <div class="risk-card risk-high">
            <el-icon :size="36"><Warning /></el-icon>
            <div><div class="risk-label">高风险企业</div><div class="risk-num">3家</div></div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="risk-card risk-mid">
            <el-icon :size="36"><InfoFilled /></el-icon>
            <div><div class="risk-label">中风险企业</div><div class="risk-num">5家</div></div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="risk-card risk-low">
            <el-icon :size="36"><CircleCheck /></el-icon>
            <div><div class="risk-label">低风险企业</div><div class="risk-num">18家</div></div>
          </div>
        </el-col>
      </el-row>

      <el-card class="mt16" shadow="never" style="border:1px solid #fecaca;background:#fff5f5">
        <template #header><span style="color:#dc2626"><el-icon><Warning /></el-icon> 异常指标清单</span></template>
        <el-table :data="abnormalList" stripe size="small">
          <el-table-column prop="company" label="企业名称" />
          <el-table-column prop="indicator" label="异常指标" width="180" />
          <el-table-column prop="value" label="当前值" width="100" align="right" />
          <el-table-column prop="benchmark" label="基准值" width="100" align="right" />
          <el-table-column prop="risk" label="风险等级" width="100" align="center">
            <template #default="{row}"><el-tag :type="row.risk==='高'?'danger':'warning'" size="small">{{ row.risk }}</el-tag></template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-card class="mt16" shadow="never" style="border:1px solid #e0e7ff;background:#eef2ff">
        <template #header><span style="color:#1a56db"><el-icon><Document /></el-icon> AI风险原因分析</span></template>
        <div class="analysis-text">
          <p>1. <strong>河南中原建设集团</strong>：增值税税负率连续3个月低于行业基准1.5个百分点以上，且进项税额占比异常偏高（达88%），存在虚增进项风险。同时所得税贡献率同比下降32%，与行业趋势背离。</p>
          <p>2. <strong>南阳恒通制造有限公司</strong>：应收账款周转天数从45天延长至92天，但同期营业收入增长15%，存在关联方交易虚增收入嫌疑。存货周转率同比下降40%。</p>
          <p>3. <strong>平顶山永安矿业有限公司</strong>：资源税申报产量与电力消耗数据不匹配，偏差率超过25%。建议调取用电记录进行交叉验证。</p>
        </div>
      </el-card>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
const industries = ['制造业','批发零售业','建筑业','采矿业','交通运输业','房地产业','信息技术服务业','住宿餐饮业']
const query = ref({ name:'', industry:'' })
const analyzing = ref(false)
const showResult = ref(false)
const currentStep = ref(0)
const progress = ref(0)
const steps = [
  { title:'多源数据采集', desc:'采集税务数据、统计年鉴数据、发票数据...' },
  { title:'数据清洗与对齐', desc:'跨系统数据时间维度对齐、口径统一...' },
  { title:'行业基准对标', desc:'对标10+维度指标，与行业平均值比较...' },
  { title:'AI综合研判', desc:'大模型对每家企业进行多指标综合判断...' },
  { title:'风险分类汇总', desc:'按风险等级分类，生成异常清单...' },
  { title:'报告自动生成', desc:'生成《月度重点税源企业分析报告》...' },
]
const abnormalList = ref([
  { company:'河南中原建设集团', indicator:'增值税税负率', value:'6.2%', benchmark:'8.5%', risk:'高' },
  { company:'河南中原建设集团', indicator:'进项税额占比', value:'88%', benchmark:'72%', risk:'高' },
  { company:'河南中原建设集团', indicator:'所得税贡献率', value:'1.1%', benchmark:'1.8%', risk:'高' },
  { company:'南阳恒通制造有限公司', indicator:'应收账款周转天数', value:'92天', benchmark:'45天', risk:'中' },
  { company:'南阳恒通制造有限公司', indicator:'存货周转率', value:'2.1', benchmark:'3.5', risk:'中' },
  { company:'平顶山永安矿业有限公司', indicator:'产量用电匹配度', value:'75%', benchmark:'95%', risk:'高' },
  { company:'郑州天成贸易有限公司', indicator:'毛利率', value:'3.2%', benchmark:'8.5%', risk:'中' },
  { company:'安阳盛达房地产有限公司', indicator:'预收款占比', value:'62%', benchmark:'40%', risk:'中' },
])

const startAnalysis = () => {
  analyzing.value = true
  showResult.value = false
  currentStep.value = 0
  progress.value = 0
  let step = 0
  const timer = setInterval(() => {
    progress.value += 10
    if (progress.value >= 100) {
      progress.value = 0
      currentStep.value = ++step
      if (step >= steps.length) {
        clearInterval(timer)
        setTimeout(() => { analyzing.value = false; showResult.value = true }, 500)
      }
    }
  }, 200)
}
const genReport = () => ElMessage.success('报告生成成功！已保存到文件服务器。')
</script>

<style scoped>
.mt16 { margin-top:16px; }
.search-card .el-form-item { margin-bottom:0; }
.card-header { display:flex; justify-content:space-between; align-items:center; }
.risk-card { border-radius:12px; padding:20px; display:flex; align-items:center; gap:16px; }
.risk-high { background:linear-gradient(135deg,#fef2f2,#fee2e2); color:#dc2626; }
.risk-mid { background:linear-gradient(135deg,#fffbeb,#fef3c7); color:#d97706; }
.risk-low { background:linear-gradient(135deg,#f0fdf4,#dcfce7); color:#059669; }
.risk-label { font-size:14px; opacity:0.8; }
.risk-num { font-size:32px; font-weight:700; }
.analysis-text p { line-height:1.8; color:#374151; margin-bottom:8px; }
</style>
