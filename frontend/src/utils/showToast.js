const showToast = (message, type = 'success') => {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const typeLabels = {
    success: 'Success',
    danger: 'Error',
    warning: 'Warning'
  };

  const typeColors = {
    success: { bg: '#f8f9fa', text: '#28a745', border: '#28a745' },
    danger: { bg: '#f8f9fa', text: '#dc3545', border: '#dc3545' },
    warning: { bg: '#f8f9fa', text: '#ffc107', border: '#ffc107' }
  };

  const headerLabel = typeLabels[type] || type.charAt(0).toUpperCase() + type.slice(1);
  const colors = typeColors[type] || typeColors.success;

  const toast = document.createElement('div');
  toast.className = `toast border-0 mb-2`;
  toast.style.backgroundColor = colors.bg;
  toast.style.borderLeft = `4px solid ${colors.border}`;
  toast.role = 'alert';
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');

  toast.innerHTML = `
    <div class="toast-header bg-transparent">
      <strong class="me-auto" style="color: ${colors.text};">${headerLabel}</strong>
      <button type="button" class="btn-close ms-2 mb-1" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body m-1"">
      ${message}
    </div>
  `;

  container.appendChild(toast);

  const bsToast = new window.bootstrap.Toast(toast, { delay: 5000 });
  bsToast.show();

  toast.addEventListener('hidden.bs.toast', () => toast.remove());
};

export default showToast;
