/**
 * TypePaws - Performance Trend Line Chart
 * Renders smooth high-DPI canvas charts for WPM and Accuracy history.
 */

class PerformanceChart {
  constructor(canvasId = 'wpm-trend-chart') {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
  }

  render(data = []) {
    if (!this.canvas || !this.ctx) {
      this.canvas = document.getElementById('wpm-trend-chart');
      if (this.canvas) this.ctx = this.canvas.getContext('2d');
    }
    if (!this.canvas || !this.ctx) return;

    if (!data || data.length === 0) {
      data = [
        { label: 'Test 1', wpm: 25, accuracy: 92 },
        { label: 'Test 2', wpm: 30, accuracy: 94 },
        { label: 'Test 3', wpm: 34, accuracy: 96 },
        { label: 'Test 4', wpm: 39, accuracy: 97 },
        { label: 'Test 5', wpm: 43, accuracy: 98 }
      ];
    }

    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    const width = rect.width || 600;
    const height = rect.height || 220;

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.ctx.scale(dpr, dpr);

    const isDark = document.body.classList.contains('dark-theme');
    const primaryColor = isDark ? '#38bdf8' : '#0284c7';
    const secondaryColor = isDark ? '#ec4899' : '#e11d48';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
    const textColor = isDark ? '#94a3b8' : '#64748b';

    const padding = { top: 30, right: 30, bottom: 40, left: 45 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    this.ctx.clearRect(0, 0, width, height);

    // Max values
    const maxWpm = Math.max(60, ...data.map(d => d.wpm + 10));
    const minWpm = Math.max(0, Math.min(...data.map(d => d.wpm - 5)));

    // Draw Grid Lines & Labels
    const steps = 4;
    this.ctx.font = '11px sans-serif';
    this.ctx.fillStyle = textColor;
    this.ctx.textAlign = 'right';

    for (let i = 0; i <= steps; i++) {
      const yVal = minWpm + ((maxWpm - minWpm) / steps) * i;
      const y = padding.top + chartH - (chartH / steps) * i;

      this.ctx.beginPath();
      this.ctx.strokeStyle = gridColor;
      this.ctx.lineWidth = 1;
      this.ctx.setLineDash([4, 4]);
      this.ctx.moveTo(padding.left, y);
      this.ctx.lineTo(padding.left + chartW, y);
      this.ctx.stroke();
      this.ctx.setLineDash([]);

      this.ctx.fillText(`${Math.round(yVal)}`, padding.left - 8, y + 4);
    }

    // Points
    const stepX = chartW / Math.max(1, data.length - 1);
    const points = data.map((d, idx) => {
      const x = padding.left + idx * stepX;
      const y = padding.top + chartH - ((d.wpm - minWpm) / (maxWpm - minWpm)) * chartH;
      return { x, y, ...d };
    });

    // Draw Gradient Area below WPM line
    const grad = this.ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
    grad.addColorStop(0, isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(2, 132, 199, 0.25)');
    grad.addColorStop(1, 'rgba(56, 189, 248, 0.0)');

    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, padding.top + chartH);
    points.forEach((pt, i) => {
      if (i === 0) this.ctx.lineTo(pt.x, pt.y);
      else {
        const prev = points[i - 1];
        const cx = (prev.x + pt.x) / 2;
        this.ctx.bezierCurveTo(cx, prev.y, cx, pt.y, pt.x, pt.y);
      }
    });
    this.ctx.lineTo(points[points.length - 1].x, padding.top + chartH);
    this.ctx.closePath();
    this.ctx.fillStyle = grad;
    this.ctx.fill();

    // Draw Smooth Line
    this.ctx.beginPath();
    this.ctx.strokeStyle = primaryColor;
    this.ctx.lineWidth = 3.5;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    points.forEach((pt, i) => {
      if (i === 0) this.ctx.moveTo(pt.x, pt.y);
      else {
        const prev = points[i - 1];
        const cx = (prev.x + pt.x) / 2;
        this.ctx.bezierCurveTo(cx, prev.y, cx, pt.y, pt.x, pt.y);
      }
    });
    this.ctx.stroke();

    // Draw Points & Tooltip Labels
    points.forEach((pt) => {
      // Outer glow circle
      this.ctx.beginPath();
      this.ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
      this.ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
      this.ctx.fill();
      this.ctx.strokeStyle = primaryColor;
      this.ctx.lineWidth = 3;
      this.ctx.stroke();

      // Top value badge
      this.ctx.fillStyle = primaryColor;
      this.ctx.font = 'bold 11px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(`${pt.wpm}`, pt.x, pt.y - 12);

      // X-axis label
      this.ctx.fillStyle = textColor;
      this.ctx.font = '10px sans-serif';
      this.ctx.fillText(pt.label || '', pt.x, padding.top + chartH + 20);
    });
  }
}

window.performanceChart = new PerformanceChart();
