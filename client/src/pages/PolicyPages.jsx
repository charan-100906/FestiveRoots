import React from 'react';

export const ShippingPolicyPage = () => (
  <div className="policy-page" style={{ padding: '4rem 0 6rem' }}>
    <div className="container container-narrow">
      <div className="card" style={{ padding: '2.5rem', background: '#FFFFFF' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--color-maroon)', marginBottom: '1.25rem' }}>Shipping & Fulfilment Policy</h1>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
          FestiveRoots coordinates parcel collections directly from regional artisan workshops located across India. Each artisan packs and dispatches their portion of your order independently.
        </p>
        <h3 style={{ fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Dispatch & Transit Timings</h3>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
          Standard in-stock products are prepared and dispatched within 2-4 business days. Made-to-order crafts require additional handcrafting time specified on the product page.
        </p>
        <h3 style={{ fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Delivery Charges</h3>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
          Coordinated regional delivery is ₹80 for orders below ₹999. Orders above ₹999 qualify for Free Delivery. In this academic version, tracking progress is demonstrated via simulated lifecycle updates.
        </p>
      </div>
    </div>
  </div>
);

export const ReturnPolicyPage = () => (
  <div className="policy-page" style={{ padding: '4rem 0 6rem' }}>
    <div className="container container-narrow">
      <div className="card" style={{ padding: '2.5rem', background: '#FFFFFF' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--color-maroon)', marginBottom: '1.25rem' }}>Return & Refund Policy</h1>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
          Because our items are handcrafted by independent artisans using natural materials (terracotta clay, organic dyes, native timber), minor natural variations in texture, shade, and hand-carved markings are intrinsic hallmarks of authentic folk artistry rather than defects.
        </p>
        <h3 style={{ fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Damaged in Transit</h3>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
          If a delicate ceramic or terracotta item arrives damaged, customers may notify platform support within 48 hours with photographs. Eligible replacements or refunds will be coordinated with the workshop.
        </p>
      </div>
    </div>
  </div>
);

export const PrivacyPolicyPage = () => (
  <div className="policy-page" style={{ padding: '4rem 0 6rem' }}>
    <div className="container container-narrow">
      <div className="card" style={{ padding: '2.5rem', background: '#FFFFFF' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--color-maroon)', marginBottom: '1.25rem' }}>Privacy Policy & Terms</h1>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
          FestiveRoots values consumer and artisan privacy. We only collect the minimal personal information necessary to coordinate order fulfilment and maintain accounts (name, email address, contact phone number, and delivery address).
        </p>
        <h3 style={{ fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Security Standards</h3>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
          Passwords are cryptographically hashed with bcrypt. User authentication is secured using JSON Web Tokens (JWT). We never sell user data to third parties.
        </p>
      </div>
    </div>
  </div>
);
