<template>
  <div>
    <el-row :gutter="16" class="stat-row">
      <el-col :span="6" v-for="item in stats" :key="item.label">
        <div class="stat-card" :style="{ background: item.bg }">
          <div class="stat-icon">
            <el-icon :size="32" :color="item.color"><component :is="item.icon" /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value" :style="{ color: item.color }">{{ item.value }}</div>
            <div class="stat-label">{{ item.label }}</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-card class="mt16">
      <template #header>
        <div class="card-header">
          <span>最近分析任务</span>
          <el-button type="primary" size="small" plain>查看全部</el-button>
        </div>
      </template>
      <el-table :data="tasks" stripe>
        <el-table-column prop="id" label="任务编号" width="120" />
        <el-table-column prop="company" label="企业名称" />
        <el-table-column prop="type" label="分析类型" width="160" />
        <el-table-column prop="time" label="执行时间" width="170" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="taskStatusTypeMap[row.status] ?? 'info'" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default><el-button type="primary" link size="small">查看</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-row :gutter="16" class="mt16">
      <el-col :span="6" v-for="item in quickActions" :key="item.label">
        <el-card shadow="hover" class="quick-card" @click="$router.push(item.path)">
          <el-icon :size="28" :color="item.color"><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
const taskStatusTypeMap = {
  已完成: 'success',
  进行中: 'warning',
  异常: 'danger',
}

const stats = [
  { label: '本月分析企业', value: '128', icon: 'OfficeBuilding', color: '#1a56db', bg: 'linear-gradient(135deg,#e8f0fe,#d4e4ff)' },
  { label: '生成报告数', value: '45', icon: 'Document', color: '#059669', bg: 'linear-gradient(135deg,#d1fae5,#a7f3d0)' },
  { label: '异常预警数', value: '12', icon: 'Warning', color: '#dc2626', bg: 'linear-gradient(135deg,#fee2e2,#fecaca)' },
  { label: '政策更新数', value: '8', icon: 'Bell', color: '#7c3aed', bg: 'linear-gradient(135deg,#ede9fe,#ddd6fe)' },
]

const tasks = [
  { id:'A20260301', company:'河南中原建设集团', type:'发票税务历史分析', time:'2026-03-01 09:30', status:'已完成' },
  { id:'A20260302', company:'南阳恒通制造有限公司', type:'重点税源企业分析', time:'2026-03-02 14:20', status:'已完成' },
  { id:'A20260303', company:'郑州天成贸易有限公司', type:'发票税务历史分析', time:'2026-03-05 10:15', status:'进行中' },
  { id:'A20260304', company:'洛阳华联科技有限公司', type:'重点税源企业分析', time:'2026-03-06 16:40', status:'已完成' },
  { id:'A20260305', company:'平顶山永安矿业有限公司', type:'发票税务历史分析', time:'2026-03-08 08:50', status:'异常' },
  { id:'A20260306', company:'新乡大通物流有限公司', type:'重点税源企业分析', time:'2026-03-10 11:30', status:'已完成' },
]

const quickActions = [
  { label:'新建分析', icon:'Plus', color:'#1a56db', path:'/invoice' },
  { label:'查看报告', icon:'Document', color:'#059669', path:'/taxsource' },
  { label:'政策知识库', icon:'Collection', color:'#7c3aed', path:'/knowledge' },
  { label:'系统设置', icon:'Setting', color:'#6b7280', path:'/settings' },
]
</script>

<style scoped>
.mt16 { margin-top:16px; }
.stat-row { margin-bottom:16px; }
.stat-card { border-radius:12px; padding:20px; display:flex; align-items:center; gap:16px; }
.stat-icon { width:56px; height:56px; border-radius:12px; background:#fff; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 8px rgba(0,0,0,0.06); }
.stat-value { font-size:28px; font-weight:700; }
.stat-label { font-size:13px; color:#6b7280; margin-top:2px; }
.card-header { display:flex; justify-content:space-between; align-items:center; }
.quick-card { cursor:pointer; text-align:center; padding:20px; }
.quick-card .el-icon { margin-bottom:8px; }
.quick-card span { display:block; font-size:14px; color:#374151; margin-top:8px; }
</style>
