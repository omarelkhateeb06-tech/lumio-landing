-- ============================================================================
-- Write the real Stripe payment-link URLs onto each cert.
--
-- The cert seeds (20260529150001_seed_certs.sql, seed-new-industry-certs.sql,
-- seed-legal-cert.sql) shipped with empty / 'test_placeholder' values for
-- stripe_payment_link, so the in-app "Pay" button (CertOverview reads
-- certs.stripe_payment_link at runtime) had no real URL behind it. This is the
-- authoritative source for the live $49 payment links; apply it AFTER any cert
-- seed re-run so the real URLs win. Idempotent (plain UPDATE by slug).
--
-- Links are the live Stripe Payment Links created for the HMA account
-- (acct_1TigPC1jvSYizhkj). They are public buy URLs, not secrets.
-- ============================================================================

update public.certs set stripe_payment_link = case slug
  when 'beginner-ai-practitioner'         then 'https://buy.stripe.com/6oU4grgW40mab2D2tqcbC00'
  when 'customer-service-ai-practitioner' then 'https://buy.stripe.com/aFafZ97lu9WK9Yzc40cbC01'
  when 'education-ai-practitioner'         then 'https://buy.stripe.com/8x24gr7lufh4fiTec8cbC02'
  when 'finance-ai-practitioner'           then 'https://buy.stripe.com/bJecMX9tCfh46Mn5FCcbC03'
  when 'healthcare-ai-practitioner'        then 'https://buy.stripe.com/9B6bIT5dmfh47Qr7NKcbC04'
  when 'hr-ai-practitioner'                then 'https://buy.stripe.com/cNi9AL8py6Ky9YzgkgcbC05'
  when 'legal-ai-practitioner'             then 'https://buy.stripe.com/eVqcMX8pyb0OgmXgkgcbC06'
end,
updated_at = now()
where slug like '%-ai-practitioner';
