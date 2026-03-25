<template>
  <div>
    <!-- 搜索 -->
    <el-card>
      <el-form :inline="true">
        <el-form-item label="关键词"><el-input v-model="keyword" placeholder="搜索知识条目..." clearable style="width:280px" /></el-form-item>
        <el-form-item label="分类">
          <el-select v-model="category" clearable placeholder="全部">
            <el-option label="文档知识库" value="doc" />
            <el-option label="结构化知识库" value="struct" />
            <el-option label="动态知识库" value="dynamic" />
          </el-select>
        </el-form-item>
        <el-form-item><el-button type="primary"><el-icon><Search /></el-icon>搜索</el-button></el-form-item>
      </el-form>
    </el-card>

    <el-tabs v-model="activeTab" class="mt16">
      <!-- 文档知识库 -->
      <el-tab-pane label="📄 文档知识库" name="doc">
        <el-table :data="docList" stripe>
          <el-table-column prop="name" label="文档名称" />
          <el-table-column prop="type" label="类型" width="100" />
          <el-table-column prop="period" label="期间" width="100" />
          <el-table-column prop="chunks" label="分片数" width="90" align="right" />
          <el-table-column prop="updateTime" label="更新时间" width="120" />
          <el-table-column label="操作" width="150">
            <template #default>
              <el-button type="primary" link size="small">预览</el-button>
              <el-button type="warning" link size="small">重新分片</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 结构化知识库 -->
      <el-tab-pane label="📊 结构化知识库" name="struct">
        <el-row :gutter="16">
          <el-col :span="8" v-for="item in structList" :key="item.title">
            <el-card shadow="hover" class="struct-card">
              <div class="struct-icon"><el-icon :size="24" :color="item.color"><component :is="item.icon" /></el-icon></div>
              <h4>{{ item.title }}</h4>
              <p>{{ item.desc }}</p>
              <div class="struct-meta"><span>共 {{ item.count }} 条记录</span><el-button type="primary" link size="small">管理</el-button></div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>

      <!-- 动态知识库 -->
      <el-tab-pane label="🔔 动态知识库" name="dynamic">
        <el-table :data="dynamicList" stripe>
          <el-table-column prop="title" label="政策/法规标题" />
          <el-table-column prop="source" label="来源" width="120" />
          <el-table-column prop="publishDate" label="发布日期" width="120" />
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template #default="{row}"><el-tag :type="row.status==='已入库'?'success':'warning'" size="small">{{ row.status }}</el-tag></template>
          </el-table-column>
          <el-table-column label="操作" width="100"><template #default><el-button type="primary" link size="small">查看</el-button></template></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const keyword = ref('')
const category = ref('')
const activeTab = ref('doc')
const docList = ref([
  { name:'2020-2024年增值税政策汇编', type:'PDF', period:'2020-2024', chunks:1245, updateTime:'2026-03-01' },
  { name:'企业所得税汇算清缴指南（2025版）', type:'Word', period:'2025', chunks:386, updateTime:'2026-02-15' },
  { name:'河南省税收优惠政策全集', type:'PDF', period:'2023-2025', chunks:876, updateTime:'2026-03-10' },
  { name:'重点行业税收风险防控案例集', type:'PDF', period:'2021-2025', chunks:562, updateTime:'2026-01-20' },
  { name:'发票管理规范手册', type:'Word', period:'2024', chunks:234, updateTime:'2025-12-08' },
  { name:'税务稽查工作指引', type:'PDF', period:'2025', chunks:445, updateTime:'2026-03-05' },
])
const structList = ref([
  { title:'指标口径说明', desc:'增值税税负率、所得税贡献率等核心指标的计算口径和统计口径', icon:'DataAnalysis', color:'#1a56db', count:156 },
  { title:'行业基准值', desc:'各行业税收指标基准值、预警阈值和历史分位数', icon:'TrendCharts', color:'#059669', count:428 },
  { title:'预警规则库', desc:'异常判断规则、风险评分模型和触发条件配置', icon:'Warning', color:'#d97706', count:89 },
  { title:'行业分类标准', desc:'国民经济行业分类与税务征管行业对照表', icon:'Grid', color:'#7c3aed', count:1488 },
  { title:'预设阈值库', desc:'各维度指标的动态阈值和敏感度参数', icon:'Setting', color:'#6b7280', count:234 },
  { title:'参考案例库', desc:'历史同类型企业的处理案例和解决方案', icon:'FolderOpened', color:'#0891b2', count:567 },
])
const dynamicList = ref([
  { title:'关于进一步支持小微企业发展的税收优惠政策通知', source:'财政部', publishDate:'2026-03-18', status:'已入库' },
  { title:'2026年增值税改革试点方案', source:'税务总局', publishDate:'2026-03-15', status:'已入库' },
  { title:'数字经济税收征管指导意见', source:'国务院', publishDate:'2026-03-10', status:'待分片' },
  { title:'新能源产业税收优惠延续公告', source:'税务总局', publishDate:'2026-03-05', status:'已入库' },
  { title:'关于规范跨区域涉税事项管理的通知', source:'税务总局', publishDate:'2026-02-28', status:'已入库' },
  { title:'房地产税收调控新规解读', source:'财政部', publishDate:'2026-02-20', status:'待分片' },
])
</script>

<style scoped>
.mt16 { margin-top:16px; }
.struct-card { margin-bottom:16px; }
.struct-card h4 { margin:10px 0 6px; color:#1f2937; }
.struct-card p { color:#6b7280; font-size:13px; line-height:1.5; }
.struct-icon { width:44px; height:44px; border-radius:10px; background:#f0f5ff; display:flex; align-items:center; justify-content:center; }
.struct-meta { display:flex; justify-content:space-between; align-items:center; margin-top:10px; color:#9ca3af; font-size:12px; }
</style>
