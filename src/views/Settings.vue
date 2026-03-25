<template>
  <div>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="🔗 数据源配置" name="datasource">
        <el-card>
          <el-table :data="dataSources" stripe>
            <el-table-column prop="name" label="数据源名称" />
            <el-table-column prop="type" label="类型" width="120" />
            <el-table-column prop="status" label="状态" width="100" align="center">
              <template #default="{row}"><el-tag :type="row.status==='已连接'?'success':'danger'" size="small">{{ row.status }}</el-tag></template>
            </el-table-column>
            <el-table-column prop="lastSync" label="最近同步" width="140" />
            <el-table-column prop="frequency" label="同步频率" width="120" />
            <el-table-column label="操作" width="150">
              <template #default>
                <el-button type="primary" link size="small">配置</el-button>
                <el-button type="success" link size="small">测试连接</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="🤖 AI模型配置" name="model">
        <el-card>
          <el-form label-width="140px" style="max-width:600px">
            <el-form-item label="当前模型">
              <el-input value="DeepSeek-V3" disabled />
            </el-form-item>
            <el-form-item label="备选模型">
              <el-select value="deepseek-v3">
                <el-option label="DeepSeek-V3（推荐）" value="deepseek-v3" />
                <el-option label="GLM-4 Plus" value="glm-4-plus" />
                <el-option label="Qwen-Max" value="qwen-max" />
              </el-select>
            </el-form-item>
            <el-form-item label="Temperature">
              <el-slider :min="0" :max="100" :model-value="30" />
            </el-form-item>
            <el-form-item label="最大Token数">
              <el-input-number :min="1024" :max="32768" :step="1024" :model-value="8192" />
            </el-form-item>
            <el-form-item label="RAG Top-K">
              <el-input-number :min="1" :max="20" :model-value="5" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary">保存配置</el-button>
              <el-button>恢复默认</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="👥 用户权限管理" name="users">
        <el-card>
          <template #header>
            <div class="card-header"><span>用户列表</span><el-button type="primary" size="small"><el-icon><Plus /></el-icon>添加用户</el-button></div>
          </template>
          <el-table :data="users" stripe>
            <el-table-column prop="name" label="姓名" />
            <el-table-column prop="dept" label="部门" />
            <el-table-column prop="role" label="角色" width="130">
              <template #default="{row}"><el-tag :type="row.role==='管理员'?'danger':row.role==='分析师'?'primary':'info'" size="small">{{ row.role }}</el-tag></template>
            </el-table-column>
            <el-table-column prop="lastLogin" label="最后登录" width="140" />
            <el-table-column prop="status" label="状态" width="80" align="center">
              <template #default="{row}"><el-tag :type="row.status==='正常'?'success':'info'" size="small">{{ row.status }}</el-tag></template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default>
                <el-button type="primary" link size="small">编辑</el-button>
                <el-button type="danger" link size="small">禁用</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const activeTab = ref('datasource')
const dataSources = ref([
  { name:'增值税发票管理系统', type:'API接口', status:'已连接', lastSync:'2026-03-25 08:00', frequency:'每月1日' },
  { name:'统计局年鉴数据库', type:'数据库', status:'已连接', lastSync:'2026-03-20 10:30', frequency:'每季度' },
  { name:'企业所得税申报系统', type:'API接口', status:'已连接', lastSync:'2026-03-25 06:00', frequency:'每月15日' },
  { name:'重点税源监控平台', type:'数据交换', status:'已连接', lastSync:'2026-03-24 18:00', frequency:'每月' },
  { name:'MCP协议数据层', type:'标准化接口', status:'已连接', lastSync:'2026-03-25 09:00', frequency:'实时' },
])
const users = ref([
  { name:'张三', dept:'稽查科', role:'管理员', lastLogin:'2026-03-25 09:15', status:'正常' },
  { name:'李四', dept:'征收管理科', role:'分析师', lastLogin:'2026-03-25 08:30', status:'正常' },
  { name:'王五', dept:'税政科', role:'分析师', lastLogin:'2026-03-24 17:45', status:'正常' },
  { name:'赵六', dept:'信息中心', role:'技术员', lastLogin:'2026-03-20 14:20', status:'正常' },
  { name:'孙七', dept:'法规科', role:'查看者', lastLogin:'2026-03-10 09:00', status:'已禁用' },
])
</script>

<style scoped>
.card-header { display:flex; justify-content:space-between; align-items:center; }
</style>
