/**
 * ContentGen AI 落地页 - 交互逻辑
 * Author: zhijin
 * Version: 1.0.0
 */

(function () {
  'use strict';

  // ============================================
  // Navbar scroll behavior
  // ============================================
  var navbar = document.getElementById('navbar');
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');

  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // Mobile nav toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu on link click
    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ============================================
  // Smooth scroll for anchor links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var navHeight = navbar ? navbar.offsetHeight : 72;
        var top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // ============================================
  // Lead Form Validation & Submission
  // ============================================
  var form = document.getElementById('leadForm');
  if (form) {
    var submitBtn = document.getElementById('submitBtn');
    var formSuccess = document.getElementById('formSuccess');

    // Validation patterns
    var patterns = {
      name: /^[\u4e00-\u9fa5a-zA-Z\s·.]+$/,
      company: /^[^\s]+$/,
      email: /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
      phone: /^1[3-9]\d{9}$/,
      position: /^[^\s]+$/
    };

    var bannedDomains = ['qq.com', '163.com', '126.com', 'gmail.com', 'hotmail.com', 'outlook.com', 'sina.com', '139.com'];

    function showError(fieldId, message) {
      var errEl = document.getElementById(fieldId + 'Error');
      if (errEl) {
        errEl.textContent = message;
        errEl.style.display = 'block';
      }
      var inputEl = document.getElementById(fieldId);
      if (inputEl) inputEl.classList.add('input-error');
    }

    function clearError(fieldId) {
      var errEl = document.getElementById(fieldId + 'Error');
      if (errEl) {
        errEl.textContent = '';
        errEl.style.display = '';
      }
      var inputEl = document.getElementById(fieldId);
      if (inputEl) inputEl.classList.remove('input-error');
    }

    function validateField(fieldId, value) {
      clearError(fieldId);
      var trimmed = value.trim();

      switch (fieldId) {
        case 'name':
          if (!trimmed) return '请输入您的姓名';
          if (trimmed.length < 2) return '姓名至少2个字符';
          if (!patterns.name.test(trimmed)) return '姓名格式不正确';
          break;
        case 'company':
          if (!trimmed) return '请输入公司名称';
          if (trimmed.length < 2) return '公司名称至少2个字符';
          break;
        case 'email':
          if (!trimmed) return '请输入公司邮箱';
          if (!patterns.email.test(trimmed)) return '请输入有效的邮箱格式';
          var domain = trimmed.split('@')[1] || '';
          if (bannedDomains.indexOf(domain.toLowerCase()) !== -1) return '请使用公司邮箱，不接受个人邮箱';
          break;
        case 'position':
          if (!trimmed) return '请输入您的职位';
          if (trimmed.length < 2) return '职位至少2个字符';
          break;
        case 'phone':
          if (trimmed && !patterns.phone.test(trimmed)) return '请输入有效的中国大陆手机号';
          break;
      }
      return '';
    }

    // Real-time validation on blur
    ['name', 'company', 'email', 'position', 'phone'].forEach(function (fieldId) {
      var el = document.getElementById(fieldId);
      if (el) {
        el.addEventListener('blur', function () {
          var err = validateField(fieldId, el.value);
          if (err) showError(fieldId, err);
        });
        el.addEventListener('input', function () {
          clearError(fieldId);
        });
      }
    });

    function validateForm() {
      var fields = ['name', 'company', 'email', 'position', 'phone', 'companySize'];
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

    function getFormData() {
      return {
        name: form.name.value.trim(),
        company: form.company.value.trim(),
        email: form.email.value.trim(),
        position: form.position.value.trim(),
        phone: form.phone.value.trim(),
        companySize: form.companySize.value
      };
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!validateForm()) return;

      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
      submitBtn.textContent = '提交中...';

      var data = getFormData();

      // Simulate submission
      setTimeout(function () {
        var leadId = 'LEAD-' + formatDate(new Date()).replace(/-/g, '') + '-' + String(Math.floor(Math.random() * 1000)).padStart(3, '0');
        var response = {
          success: true,
          message: '预约成功，我们将在24小时内与您联系',
          leadId: leadId,
          timestamp: new Date().toISOString()
        };

        console.log('=== Lead Submission ===');
        console.log('Data:', JSON.stringify(data, null, 2));
        console.log('Response:', JSON.stringify(response, null, 2));

        // localStorage
        var leads = JSON.parse(localStorage.getItem('contentgen_leads') || '[]');
        leads.push(Object.assign({}, data, { leadId: leadId, submittedAt: response.timestamp }));
        localStorage.setItem('contentgen_leads', JSON.stringify(leads));

        // Show success
        form.querySelector('.form-row, .form-privacy, .form-submit').forEach(function (el) {
          el.style.display = '';
        });
        form.querySelectorAll('.form-group, .form-row, .form-privacy, .form-submit').forEach(function (el) {
          el.style.display = 'none';
        });
        formSuccess.hidden = false;
        formSuccess.style.display = 'flex';

      }, 1200);
    });
  }

  // ============================================
  // Utilities
  // ============================================
  function formatDate(date) {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0')
    ].join('-');
  }

})();
