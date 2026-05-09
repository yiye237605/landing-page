/**
 * form-handler.js - 表单处理逻辑
 * ContentGen AI 落地页
 * 
 * 职责：
 * - 绑定表单 submit 事件
 * - 必填校验（name, company, email, position）
 * - 邮箱格式校验（正则）
 * - 手机号格式校验（选填，正则）
 * - 防重复提交（提交后按钮 disabled + loading 文字）
 * - 提交成功后显示成功提示，失败显示错误提示
 * - 调用 DataService 保存数据
 * 
 * @author jiyan
 * @version 1.0.0
 */

(function () {
  'use strict';

  // ============================================
  // 校验规则定义
  // ============================================
  var patterns = {
    // 姓名：中文、英文、空格、点号，不少于2个字符
    name: /^[\u4e00-\u9fa5a-zA-Z\s·.]{2,50}$/,
    // 公司名：非空，至少2个字符
    company: /^[^\s]{2,100}$/,
    // 邮箱：标准格式
    email: /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
    // 手机号：中国大陆手机号，11位以1开头
    phone: /^1[3-9]\d{9}$/,
    // 职位：非空，至少2个字符
    position: /^[^\s]{2,50}$/
  };

  /**
   * 被禁止的个人邮箱域名（要求使用公司邮箱）
   * @type {Array}
   */
  var bannedEmailDomains = [
    'qq.com', '163.com', '126.com', 'gmail.com',
    'hotmail.com', 'outlook.com', 'sina.com', '139.com',
    'foxmail.com', 'sohu.com', 'yahoo.com', 'sina.com.cn'
  ];

  // ============================================
  // DOM 元素引用
  // ============================================
  var form = document.getElementById('leadForm');
  if (!form) {
    console.warn('[form-handler] 未找到 #leadForm，初始化跳过');
    return;
  }

  var submitBtn = document.getElementById('submitBtn');
  var formSuccess = document.getElementById('formSuccess');

  // ============================================
  // 错误提示
  // ============================================

  /**
   * 显示字段错误
   * @param {string} fieldId - 字段 ID（对应 Error 元素的 id 为 fieldId + 'Error'）
   * @param {string} message - 错误文案
   */
  function showError(fieldId, message) {
    var errEl = document.getElementById(fieldId + 'Error');
    var inputEl = document.getElementById(fieldId);
    if (errEl) {
      errEl.textContent = message;
      errEl.style.display = 'block';
    }
    if (inputEl) {
      inputEl.classList.add('input-error');
    }
  }

  /**
   * 清除字段错误
   * @param {string} fieldId
   */
  function clearError(fieldId) {
    var errEl = document.getElementById(fieldId + 'Error');
    var inputEl = document.getElementById(fieldId);
    if (errEl) {
      errEl.textContent = '';
      errEl.style.display = '';
    }
    if (inputEl) {
      inputEl.classList.remove('input-error');
    }
  }

  // ============================================
  // 单字段校验
  // ============================================

  /**
   * 校验单个字段
   * @param {string} fieldId
   * @param {string} value
   * @returns {string} 空字符串表示校验通过，否则返回错误文案
   */
  function validateField(fieldId, value) {
    var trimmed = (value || '').trim();
    clearError(fieldId);

    switch (fieldId) {
      case 'name':
        if (!trimmed) return '请输入您的姓名';
        if (!patterns.name.test(trimmed)) return '姓名格式不正确（至少2个字符）';
        break;

      case 'company':
        if (!trimmed) return '请输入公司名称';
        if (trimmed.length < 2) return '公司名称至少2个字符';
        break;

      case 'email':
        if (!trimmed) return '请输入公司邮箱';
        if (!patterns.email.test(trimmed)) return '请输入有效的邮箱格式';
        // 检查是否是公司邮箱
        var domain = (trimmed.split('@')[1] || '').toLowerCase();
        if (bannedEmailDomains.indexOf(domain) !== -1) {
          return '请使用公司邮箱，不接受个人邮箱';
        }
        break;

      case 'position':
        if (!trimmed) return '请输入您的职位';
        if (trimmed.length < 2) return '职位至少2个字符';
        break;

      case 'phone':
        // 手机号为选填，但填写了就必须格式正确
        if (trimmed && !patterns.phone.test(trimmed)) {
          return '请输入有效的中国大陆手机号';
        }
        break;
    }
    return '';
  }

  // ============================================
  // 表单级别校验
  // ============================================

  /**
   * 校验整个表单
   * @returns {boolean} true 表示校验通过
   */
  function validateForm() {
    var fields = ['name', 'company', 'email', 'position', 'phone'];
    var hasError = false;

    fields.forEach(function (fieldId) {
      var el = document.getElementById(fieldId);
      if (!el) return;
      var err = validateField(fieldId, el.value);
      if (err) {
        showError(fieldId, err);
        hasError = true;
      }
    });

    return !hasError;
  }

  /**
   * 从表单收集数据
   * @returns {Object}
   */
  function getFormData() {
    return {
      name: form.name ? form.name.value.trim() : '',
      company: form.company ? form.company.value.trim() : '',
      email: form.email ? form.email.value.trim() : '',
      position: form.position ? form.position.value.trim() : '',
      phone: form.phone ? form.phone.value.trim() : '',
      company_size: form.companySize ? form.companySize.value : ''
    };
  }

  // ============================================
  // 防重复提交
  // ============================================

  /**
   * 设置按钮为 loading 状态
   */
  function setButtonLoading() {
    if (!submitBtn) return;
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtn.textContent = '提交中...';
  }

  /**
   * 重置按钮状态
   */
  function resetButton() {
    if (!submitBtn) return;
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
    submitBtn.textContent = '立即预约';
  }

  /**
   * 显示提交错误提示
   * @param {string} message
   */
  function showSubmitError(message) {
    // 创建一个临时的错误提示
    var errorDiv = document.createElement('div');
    errorDiv.className = 'submit-error';
    errorDiv.textContent = message || '提交失败，请稍后重试';
    errorDiv.style.cssText = 'color:#DC2626;font-size:14px;margin-top:12px;text-align:center;';
    var submitRow = form.querySelector('.form-submit');
    if (submitRow) {
      // 移除已有的错误提示
      var existing = form.querySelector('.submit-error');
      if (existing) existing.remove();
      submitRow.parentNode.insertBefore(errorDiv, submitRow.nextSibling);
      // 3秒后自动移除
      setTimeout(function () {
        if (errorDiv.parentNode) errorDiv.remove();
      }, 3000);
    }
  }

  // ============================================
  // 表单提交处理
  // ============================================

  /**
   * 提交成功后的处理：隐藏表单，显示成功提示
   * @param {Object} result - saveLead 返回结果
   */
  function handleSuccess(result) {
    // 隐藏表单输入区域，显示成功区域
    var hideSelectors = '.form-group, .form-row, .form-privacy, .form-submit';
    form.querySelectorAll(hideSelectors).forEach(function (el) {
      el.style.display = 'none';
    });
    if (formSuccess) {
      formSuccess.hidden = false;
      formSuccess.style.display = 'flex';
    }
    console.log('[form-handler] Lead 保存成功:', result.lead);
  }

  /**
   * 提交失败后的处理
   * @param {string} errorMessage
   */
  function handleError(errorMessage) {
    showSubmitError(errorMessage || '提交失败，请稍后重试');
    resetButton();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // 1. 校验表单
    if (!validateForm()) {
      return;
    }

    // 2. 防重复提交
    setButtonLoading();

    // 3. 收集数据
    var data = getFormData();

    // 4. 调用 DataService 保存
    if (typeof window.DataService !== 'undefined') {
      var result = window.DataService.saveLead(data);
      if (result.success) {
        handleSuccess(result);
      } else {
        handleError(result.error);
      }
    } else {
      // DataService 未加载时的兜底处理（本地存储）
      console.warn('[form-handler] DataService 未就绪，使用兜底存储');
      try {
        var leads = JSON.parse(localStorage.getItem('contentgen_leads') || '[]');
        data.created_at = new Date().toISOString();
        leads.push(data);
        localStorage.setItem('contentgen_leads', JSON.stringify(leads));
        handleSuccess({ lead: data });
      } catch (err) {
        handleError('存储失败：' + err.message);
      }
    }
  });

  // ============================================
  // 实时校验（blur + input）
  // ============================================
  ['name', 'company', 'email', 'position', 'phone'].forEach(function (fieldId) {
    var el = document.getElementById(fieldId);
    if (!el) return;

    el.addEventListener('blur', function () {
      var err = validateField(fieldId, el.value);
      if (err) showError(fieldId, err);
    });

    el.addEventListener('input', function () {
      clearError(fieldId);
    });
  });

})();