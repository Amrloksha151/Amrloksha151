import puppeteer from "@cloudflare/puppeteer";

const html = (data) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Quicksand:wght@300;400;500;600;700&display=swap');

  @page { margin: 32px; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Quicksand', 'Segoe UI', system-ui, sans-serif;
    background: #1A1816;
    color: #E8E0D8;
    padding: 40px;
    font-size: 14px;
    line-height: 1.6;
  }
  .hand {
    font-family: 'Caveat', cursive;
  }
  .header {
    border-bottom: 1px solid #3A3530;
    padding-bottom: 24px;
    margin-bottom: 32px;
  }
  .header h1 {
    font-size: 22px;
    font-weight: 300;
    letter-spacing: 0.02em;
    color: #E8E0D8;
  }
  .header .accent {
    color: #D4895A;
  }
  .header .line {
    display: block;
    width: 60px;
    height: 2px;
    background: #D4895A;
    margin-top: 12px;
    opacity: 0.4;
  }
  .section {
    margin-bottom: 28px;
  }
  .section-title {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #9A8A7A;
    margin-bottom: 8px;
  }
  .field {
    display: flex;
    gap: 12px;
    padding: 12px 16px;
    background: #24211E;
    border: 1px solid #3A3530;
    border-radius: 8px;
    margin-bottom: 8px;
  }
  .field-label {
    min-width: 80px;
    font-size: 12px;
    color: #B5651D;
  }
  .field-value {
    color: #E8E0D8;
    word-break: break-word;
  }
  .message-box {
    padding: 16px;
    background: #24211E;
    border: 1px solid #3A3530;
    border-radius: 8px;
    white-space: pre-wrap;
    color: #E8E0D8;
    line-height: 1.7;
  }
  .footer {
    margin-top: 40px;
    padding-top: 16px;
    border-top: 1px solid #3A3530;
    font-size: 11px;
    color: #6A6058;
    text-align: center;
  }
  .tag {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 11px;
    border: 1px solid #D4895A;
    color: #D4895A;
    background: rgba(212, 137, 90, 0.08);
  }
</style>
</head>
<body>
    <div class="header">
    <h1><span class="accent">✦</span> New Contact Message</h1>
    <span class="hand" style="display:block;margin-top:4px;font-size:13px;color:#9A8A7A;">from amrloksha151.me</span>
    <span class="line"></span>
  </div>

  <div class="section">
    <div class="section-title">Sender Details</div>
    <div class="field">
      <span class="field-label">Name</span>
      <span class="field-value">${escapeHtml(data.name)}</span>
    </div>
    <div class="field">
      <span class="field-label">Email</span>
      <span class="field-value">${escapeHtml(data.email)}</span>
    </div>
    ${data.phone ? `<div class="field"><span class="field-label">Phone</span><span class="field-value">${escapeHtml(data.phone)}</span></div>` : ""}
  </div>

  <div class="section">
    <div class="section-title">Subject</div>
    <div class="field">
      <span class="field-value" style="font-weight: 500;">${escapeHtml(data.subject)}</span>
      <span style="margin-left: auto;" class="tag">website</span>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Message</div>
    <div class="message-box">${escapeHtml(data.message)}</div>
  </div>

  <div class="footer">
    <span class="hand">amrloksha151</span> &mdash; ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
  </div>
</body>
</html>`;

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function generateContactPdf(data) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setJavaScriptEnabled(false);
  await page.setContent(html(data), { waitUntil: "networkidle0" });
  const pdf = await page.pdf({ format: "A4", margin: { top: 0, bottom: 0, left: 0, right: 0 }, printBackground: true });

  await browser.close();
  return pdf;
}
