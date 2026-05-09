/**
 * data-service.js - 数据服务层
 * ContentGen AI 落地页
 * 
 * 职责：Lead 数据模型定义、localStorage 读写封装
 * 预留真实 API 接入注释
 * 
 * @author jiyan
 * @version 1.0.0
 */

(function () {
  'use strict';

  // ============================================
  // 常量定义
  // ============================================
  var STORAGE_KEY = 'contentgen_leads';
  var LEAD_MODEL_VERSION = '1.0';

  /**
   * Lead 数据模型
   * 
   * 字段说明：
   * - name:        姓名（必填）
   * - company:     公司名称（必填）
   * - email:       公司邮箱（必填，邮箱格式）
   * - position:    职位（必填）
   * - phone:       手机号（选填）
   * - company_size: 公司规模（选填，枚举值见 COMPANY_SIZE_OPTIONS）
   * - created_at:  创建时间（自动生成，ISO 8601 格式）
   */
  var LeadModel = {
    fields: ['name', 'company', 'email', 'position', 'phone', 'company_size', 'created_at'],

    /**
     * 创建一条新的 Lead 记录
     * @param {Object} data - 用户提交的表单数据
     * @returns {Object} 符合模型规范的 Lead 对象
     */
    create: function (data) {
      return {
        name: (data.name || '').trim(),
        company: (data.company || '').trim(),
        email: (data.email || '').trim().toLowerCase(),
        position: (data.position || '').trim(),
        phone: (data.phone || '').trim(),
        company_size: data.company_size || '',
        created_at: new Date().toISOString()
      };
    },

    /**
     * 验证 Lead 对象是否完整（用于提交前校验）
     * @param {Object} lead
     * @returns {Object} { valid: boolean, errors: string[] }
     */
    validate: function (lead) {
      var errors = [];
      if (!lead.name) errors.push('name 是必填字段');
      if (!lead.company) errors.push('company 是必填字段');
      if (!lead.email) errors.push('email 是必填字段');
      if (!lead.position) errors.push('position 是必填字段');
      return {
        valid: errors.length === 0,
        errors: errors
      };
    }
  };

  // ============================================
  // localStorage 读写封装
  // ============================================

  /**
   * 从 localStorage 读取所有 Lead 记录
   * @returns {Array} Lead 数组，无记录时返回空数组
   */
  function getLeads() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var leads = JSON.parse(raw);
      return Array.isArray(leads) ? leads : [];
    } catch (e) {
      console.error('[data-service] getLeads 读取失败:', e);
      return [];
    }
  }

  /**
   * 将一条 Lead 记录保存到 localStorage
   * @param {Object} data - 用户提交的表单数据（原始对象）
   * @returns {Object} { success: boolean, lead: Object, error: string }
   */
  function saveLead(data) {
    try {
      var lead = LeadModel.create(data);
      var validation = LeadModel.validate(lead);
      if (!validation.valid) {
        return { success: false, lead: null, error: '数据校验失败: ' + validation.errors.join(', ') };
      }
      var leads = getLeads();
      leads.push(lead);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
      return { success: true, lead: lead, error: null };
    } catch (e) {
      console.error('[data-service] saveLead 保存失败:', e);
      return { success: false, lead: null, error: '存储失败，请检查浏览器本地存储空间' };
    }
  }

  /**
   * 清空所有 Lead 记录（仅用于测试/开发环境）
   * @returns {boolean}
   */
  function clearLeads() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (e) {
      console.error('[data-service] clearLeads 失败:', e);
      return false;
    }
  }

  /**
   * 获取 Lead 总数
   * @returns {number}
   */
  function getLeadCount() {
    return getLeads().length;
  }

  // ============================================
  // 真实 API 接入预留
  // ============================================
  // 
  // TODO: 当需要接入真实后端 API 时，替换 saveLead 的实现如下：
  //
  // var API_BASE_URL = 'https://api.contentgen.ai/v1';
  //
  // function saveLead(data) {
  //   return fetch(API_BASE_URL + '/leads', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'X-API-Key': 'YOUR_API_KEY'
  //     },
  //     body: JSON.stringify(LeadModel.create(data))
  //   })
  //   .then(function(res) {
  //     if (!res.ok) throw new Error('API Error: ' + res.status);
  //     return res.json();
  //   })
  //   .then(function(result) {
  //     return { success: true, lead: result.data, error: null };
  //   })
  //   .catch(function(err) {
  //     return { success: false, lead: null, error: err.message };
  //   });
  // }
  //
  // 如使用 async/await：
  // async function saveLead(data) {
  //   var response = await fetch(API_BASE_URL + '/leads', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(LeadModel.create(data))
  //   });
  //   if (!response.ok) throw new Error('Request failed');
  //   var result = await response.json();
  //   return { success: true, lead: result.data };
  // }
  //

  // ============================================
  // 导出（支持 AMD / CommonJS / 全局变量）
  // ============================================
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      LeadModel: LeadModel,
      getLeads: getLeads,
      saveLead: saveLead,
      clearLeads: clearLeads,
      getLeadCount: getLeadCount
    };
  } else {
    window.DataService = {
      LeadModel: LeadModel,
      getLeads: getLeads,
      saveLead: saveLead,
      clearLeads: clearLeads,
      getLeadCount: getLeadCount
    };
  }

})();