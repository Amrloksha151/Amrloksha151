---
title: "Personal Website - amrloksha151.me"
description: "This website itself - a full-stack serverless personal site built with AstroJS and Cloudflare Workers, designed to showcase security research and development work."
date: "2025-06"
tags: ["AstroJS", "Cloudflare Workers", "TypeScript", "Neon DB", "Resend", "Tailwind CSS"]
github: "https://github.com/amrloksha151/amrloksha151.me"
demo: "https://amrloksha151.me"
featured: true
status: "active"
---

## Overview

A high-performance, fully serverless personal website built to showcase security research and web development work. Every aspect of the site is optimized for performance, security, and developer experience.

## Architecture

### Frontend - AstroJS on Cloudflare Pages
- Zero-JS-by-default with selective hydration
- Content Collections for type-safe content management
- Tailwind CSS v4 for styling
- Deployed to Cloudflare's global edge network

### Backend - Cloudflare Workers
- Vanilla Cloudflare Worker (no framework overhead)
- Neon serverless PostgreSQL for persistent data
- Resend for transactional emails
- CORS-protected with origin validation

## Security Considerations
- All form submissions validated server-side
- CORS strict origin checking
- No third-party analytics scripts
- Content Security Policy headers
- HSTS enabled via Cloudflare

## Performance
- Lighthouse score: 99/100 Performance
- Zero layout shift (CLS: 0)
- Core Web Vitals: All green
