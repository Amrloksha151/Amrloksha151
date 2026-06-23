import { neon } from '@neondatabase/serverless';

/**
 * CORS helper - returns CORS headers based on allowed origins
 */
function getCorsHeaders(request, env) {
  const origin = request.headers.get('Origin') || '';
  const allowedOrigins = (env.ALLOWED_ORIGINS || 'https://amrloksha151.me').split(',').map(o => o.trim());
  const allowedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Build HTML email for contact form submission
 */
function buildContactEmailHtml({ name, email, subject, message, clientIp, userAgent, timestamp }) {
  const preview = message.slice(0, 200);
  const hasMore = message.length > 200;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Contact Notification - amrloksha151.me</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0f;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0f;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background:#0d0d1a;border:1px solid rgba(0,255,136,0.3);border-radius:12px 12px 0 0;padding:32px;text-align:center;">
              <p style="margin:0;font-family:'Courier New',monospace;font-size:13px;color:#00ff88;letter-spacing:2px;text-transform:uppercase;">&gt;_ amrloksha151.me</p>
              <h1 style="margin:12px 0 0;font-size:22px;font-weight:700;color:#e2e8f0;">Contact Form Notification</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background:#0d0d1a;border-left:1px solid rgba(0,255,136,0.3);border-right:1px solid rgba(0,255,136,0.3);padding:32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.05);">
                    <p style="margin:0 0 4px;font-size:11px;color:#475569;text-transform:uppercase;letter-spacing:1px;">From</p>
                    <p style="margin:0;font-size:16px;color:#e2e8f0;font-weight:600;">${escapeHtml(name)}</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#00ff88;font-family:'Courier New',monospace;"><a href="mailto:${escapeHtml(email)}" style="color:#00ff88;text-decoration:none;">${escapeHtml(email)}</a></p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                    <p style="margin:0 0 4px;font-size:11px;color:#475569;text-transform:uppercase;letter-spacing:1px;">Subject</p>
                    <p style="margin:0;font-size:16px;color:#e2e8f0;font-weight:600;">${escapeHtml(subject)}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                    <p style="margin:0 0 12px;font-size:11px;color:#475569;text-transform:uppercase;letter-spacing:1px;">Message Preview</p>
                    <div style="background:rgba(0,255,136,0.04);border-left:3px solid #00ff88;padding:16px;border-radius:0 8px 8px 0;">
                      <p style="margin:0;font-size:14px;color:#94a3b8;line-height:1.7;">${escapeHtml(preview)}${hasMore ? '<span style="color:#475569;">... [truncated]</span>' : ''}</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:20px;">
                    <p style="margin:0 0 12px;font-size:11px;color:#475569;text-transform:uppercase;letter-spacing:1px;">Technical Details</p>
                    <table width="100%" cellpadding="6" cellspacing="0" style="font-size:12px;font-family:'Courier New',monospace;">
                      <tr style="background:rgba(255,255,255,0.03);">
                        <td style="color:#475569;width:120px;padding:8px;">IP Address</td>
                        <td style="color:#94a3b8;padding:8px;">${escapeHtml(clientIp)}</td>
                      </tr>
                      <tr>
                        <td style="color:#475569;padding:8px;">Timestamp</td>
                        <td style="color:#94a3b8;padding:8px;">${escapeHtml(timestamp)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#07070f;border:1px solid rgba(0,255,136,0.15);border-top:none;border-radius:0 0 12px 12px;padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#475569;">This is an automated notification from <a href="https://amrloksha151.me" style="color:#00ff88;text-decoration:none;">amrloksha151.me</a> &middot; Sent via Resend</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Build HTML email for service inquiry submission
 */
function buildInquiryEmailHtml({ name, email, service, subject, details, budget, timeline, clientIp, userAgent, timestamp }) {
  const preview = details.slice(0, 200);
  const hasMore = details.length > 200;
  
  const serviceLabels = {
    'pentest': 'Web Application Penetration Testing',
    'code-review': 'Security Code Review',
    'web-dev': 'Full-Stack Web Development',
    'consultation': 'Security Consultation'
  };
  const serviceLabel = serviceLabels[service] || service;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Service Inquiry - amrloksha151.me</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0f;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0f;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background:#0d0d1a;border:1px solid rgba(0,212,255,0.3);border-radius:12px 12px 0 0;padding:32px;text-align:center;">
              <p style="margin:0;font-family:'Courier New',monospace;font-size:13px;color:#00d4ff;letter-spacing:2px;text-transform:uppercase;">&gt;_ amrloksha151.me</p>
              <h1 style="margin:12px 0 0;font-size:22px;font-weight:700;color:#e2e8f0;">Service Inquiry</h1>
              <p style="margin:8px 0 0;font-size:13px;color:#94a3b8;">New inquiry received for a service</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background:#0d0d1a;border-left:1px solid rgba(0,212,255,0.3);border-right:1px solid rgba(0,212,255,0.3);padding:32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.05);">
                    <p style="margin:0 0 4px;font-size:11px;color:#475569;text-transform:uppercase;letter-spacing:1px;">Service Requested</p>
                    <p style="margin:0;font-size:16px;color:#00d4ff;font-weight:600;">${escapeHtml(serviceLabel)}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                    <p style="margin:0 0 4px;font-size:11px;color:#475569;text-transform:uppercase;letter-spacing:1px;">From</p>
                    <p style="margin:0;font-size:16px;color:#e2e8f0;font-weight:600;">${escapeHtml(name)}</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#00ff88;font-family:'Courier New',monospace;"><a href="mailto:${escapeHtml(email)}" style="color:#00ff88;text-decoration:none;">${escapeHtml(email)}</a></p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                    <p style="margin:0 0 4px;font-size:11px;color:#475569;text-transform:uppercase;letter-spacing:1px;">Subject</p>
                    <p style="margin:0;font-size:16px;color:#e2e8f0;font-weight:600;">${escapeHtml(subject)}</p>
                  </td>
                </tr>
                ${budget ? `<tr>
                  <td style="padding:20px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                    <p style="margin:0 0 4px;font-size:11px;color:#475569;text-transform:uppercase;letter-spacing:1px;">Budget</p>
                    <p style="margin:0;font-size:15px;color:#e2e8f0;">${escapeHtml(budget)}</p>
                  </td>
                </tr>` : ''}
                ${timeline ? `<tr>
                  <td style="padding:20px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                    <p style="margin:0 0 4px;font-size:11px;color:#475569;text-transform:uppercase;letter-spacing:1px;">Timeline</p>
                    <p style="margin:0;font-size:15px;color:#e2e8f0;">${escapeHtml(timeline)}</p>
                  </td>
                </tr>` : ''}
                <tr>
                  <td style="padding:20px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                    <p style="margin:0 0 12px;font-size:11px;color:#475569;text-transform:uppercase;letter-spacing:1px;">Details Preview</p>
                    <div style="background:rgba(0,212,255,0.04);border-left:3px solid #00d4ff;padding:16px;border-radius:0 8px 8px 0;">
                      <p style="margin:0;font-size:14px;color:#94a3b8;line-height:1.7;">${escapeHtml(preview)}${hasMore ? '<span style="color:#475569;">... [truncated]</span>' : ''}</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:20px;">
                    <p style="margin:0 0 12px;font-size:11px;color:#475569;text-transform:uppercase;letter-spacing:1px;">Technical Details</p>
                    <table width="100%" cellpadding="6" cellspacing="0" style="font-size:12px;font-family:'Courier New',monospace;">
                      <tr style="background:rgba(255,255,255,0.03);">
                        <td style="color:#475569;width:120px;padding:8px;">IP Address</td>
                        <td style="color:#94a3b8;padding:8px;">${escapeHtml(clientIp)}</td>
                      </tr>
                      <tr>
                        <td style="color:#475569;padding:8px;">Timestamp</td>
                        <td style="color:#94a3b8;padding:8px;">${escapeHtml(timestamp)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#07070f;border:1px solid rgba(0,212,255,0.15);border-top:none;border-radius:0 0 12px 12px;padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#475569;">This is an automated notification from <a href="https://amrloksha151.me" style="color:#00d4ff;text-decoration:none;">amrloksha151.me</a> &middot; Sent via Resend</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Escape HTML special characters to prevent XSS in emails
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return String(str || '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Handle POST /contact
 */
async function handleContact(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  
  const { name, email, subject, message } = body;
  const errors = [];
  
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('name must be at least 2 characters');
  }
  if (!email || !isValidEmail(email)) {
    errors.push('email must be a valid email address');
  }
  if (!subject || typeof subject !== 'string' || subject.trim().length < 5) {
    errors.push('subject must be at least 5 characters');
  }
  if (!message || typeof message !== 'string' || message.trim().length < 20) {
    errors.push('message must be at least 20 characters');
  }
  
  if (errors.length > 0) {
    return Response.json({ error: 'Validation failed', details: errors }, { status: 400 });
  }
  
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  const cleanSubject = subject.trim();
  const cleanMessage = message.trim();
  const clientIp = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown';
  const userAgent = request.headers.get('User-Agent') || 'unknown';
  const timestamp = new Date().toISOString();
  
  try {
    // Save to database
    if (env.DATABASE_URL) {
      const sql = neon(env.DATABASE_URL);
      await sql`
        INSERT INTO contact_submissions (name, email, subject, message, ip_address, user_agent, created_at)
        VALUES (${cleanName}, ${cleanEmail}, ${cleanSubject}, ${cleanMessage}, ${clientIp}, ${userAgent}, NOW())
      `;
    }
    
    // Send email via Resend
    if (env.RESEND_API_KEY && env.ADMIN_EMAIL) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Website <noreply@amrloksha151.me>',
          to: [env.ADMIN_EMAIL],
          subject: `[Contact] ${cleanSubject} - from ${cleanName}`,
          html: buildContactEmailHtml({ name: cleanName, email: cleanEmail, subject: cleanSubject, message: cleanMessage, clientIp, userAgent, timestamp }),
        }),
      });
    }
    
    return Response.json({ success: true, message: "Message received! I'll get back to you soon." });
  } catch (err) {
    console.error('[contact] Error:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Handle POST /services/inquiry
 */
async function handleInquiry(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  
  const { name, email, service, subject, details, budget, timeline } = body;
  const validServices = ['pentest', 'code-review', 'web-dev', 'consultation'];
  const errors = [];
  
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('name must be at least 2 characters');
  }
  if (!email || !isValidEmail(email)) {
    errors.push('email must be a valid email address');
  }
  if (!service || !validServices.includes(service)) {
    errors.push(`service must be one of: ${validServices.join(', ')}`);
  }
  if (!subject || typeof subject !== 'string' || subject.trim().length < 5) {
    errors.push('subject must be at least 5 characters');
  }
  if (!details || typeof details !== 'string' || details.trim().length < 20) {
    errors.push('details must be at least 20 characters');
  }
  
  if (errors.length > 0) {
    return Response.json({ error: 'Validation failed', details: errors }, { status: 400 });
  }
  
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  const cleanSubject = subject.trim();
  const cleanDetails = details.trim();
  const cleanBudget = budget ? String(budget).trim() : null;
  const cleanTimeline = timeline ? String(timeline).trim() : null;
  const clientIp = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown';
  const userAgent = request.headers.get('User-Agent') || 'unknown';
  const timestamp = new Date().toISOString();
  
  try {
    // Save to database
    if (env.DATABASE_URL) {
      const sql = neon(env.DATABASE_URL);
      await sql`
        INSERT INTO service_inquiries (name, email, service, subject, details, budget, timeline, ip_address, user_agent, created_at)
        VALUES (${cleanName}, ${cleanEmail}, ${service}, ${cleanSubject}, ${cleanDetails}, ${cleanBudget}, ${cleanTimeline}, ${clientIp}, ${userAgent}, NOW())
      `;
    }
    
    // Send email via Resend
    if (env.RESEND_API_KEY && env.ADMIN_EMAIL) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Website <noreply@amrloksha151.me>',
          to: [env.ADMIN_EMAIL],
          subject: `[Inquiry] ${cleanSubject} - ${service} from ${cleanName}`,
          html: buildInquiryEmailHtml({ name: cleanName, email: cleanEmail, service, subject: cleanSubject, details: cleanDetails, budget: cleanBudget, timeline: cleanTimeline, clientIp, userAgent, timestamp }),
        }),
      });
    }
    
    return Response.json({ success: true, message: "Inquiry received! I'll review it and get back to you within 24 hours." });
  } catch (err) {
    console.error('[inquiry] Error:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Main Worker fetch handler
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const method = request.method;
    const corsHeaders = getCorsHeaders(request, env);
    
    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    
    let response;
    
    if (method === 'POST' && url.pathname === '/contact') {
      response = await handleContact(request, env);
    } else if (method === 'POST' && url.pathname === '/services/inquiry') {
      response = await handleInquiry(request, env);
    } else {
      response = Response.json({ error: 'Not found', path: url.pathname }, { status: 404 });
    }
    
    // Add CORS headers to all responses
    const headers = new Headers(response.headers);
    for (const [key, value] of Object.entries(corsHeaders)) {
      headers.set(key, value);
    }
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
