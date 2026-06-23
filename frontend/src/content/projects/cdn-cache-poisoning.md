---
title: "CDN Cache Poisoning via Unkeyed Headers"
description: "Research and tooling around web cache poisoning attacks targeting CDN implementations, exploiting unkeyed query parameters and headers."
date: "2024-11"
tags: ["Cache Poisoning", "CDN", "Web Security", "JavaScript", "Bug Bounty"]
github: "https://github.com/amrloksha151/cdn-cache-poison"
featured: true
status: "completed"
---

## Overview

A systematic study of web cache poisoning vulnerabilities across multiple CDN providers, with a focus on unkeyed header exploitation and JavaScript-based DOM XSS chains.

## Techniques Explored

### Unkeyed Header Injection
Many CDN configurations cache responses without including certain request headers in the cache key. If a backend server reflects these headers in its response, an attacker can poison cached pages for all users.

### Fat GET Requests
Some CDN implementations allow body content in GET requests, treating the request as a POST for the backend but serving the cached response to all GET requests.

### Cache Deception Variations
Path-based cache deception where CDN caches `/profile/..%2fstatic/main.css` as a static asset while the backend serves the actual user profile page.

## Tools Developed
- `cache-probe.py` - Python script to systematically test headers for cache key exclusion
- Burp Suite extension for automated cache buster injection

## Disclosed Vulnerabilities
- 2 cache poisoning bugs leading to stored XSS (one critical, one medium)
- 1 cache deception vulnerability exposing authenticated user data
