-- Amr Loksha Personal Website Database Schema
-- Website: https://amrloksha151.me
-- Created: 2025

-- Contact form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  ip_address VARCHAR(100),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service inquiry submissions
CREATE TABLE IF NOT EXISTS service_inquiries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  service VARCHAR(100) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  details TEXT NOT NULL,
  budget VARCHAR(100),
  timeline VARCHAR(100),
  ip_address VARCHAR(100),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_service ON service_inquiries(service);
CREATE INDEX IF NOT EXISTS idx_inquiries_created ON service_inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON service_inquiries(email);
