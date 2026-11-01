import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contact-page" style={{ padding: '3.5rem 0 6rem' }}>
      <div className="container container-narrow">
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>Contact & Artisan Support</h1>
          <p>
            Have inquiries about a regional handicraft order, artisan onboarding, or bulk festive orders? We're here to assist.
          </p>
        </div>

        <div className="card" style={{ padding: '2.5rem', background: '#FFFFFF' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <CheckCircle size={48} color="var(--color-success)" style={{ marginBottom: '1rem' }} />
              <h3>Thank You for Reaching Out!</h3>
              <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                Your message has been received. Our craft coordination team will respond to your inquiry shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                    placeholder="e.g. Priya Sharma"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="form-input"
                  placeholder="e.g. Artisan verification question / Bulk festive order inquiry"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="form-textarea"
                  placeholder="Tell us how we can assist you..."
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                <Send size={16} /> Send Message to FestiveRoots
              </button>
            </form>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border-light)', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            <div>
              <Mail size={18} color="var(--color-terracotta)" style={{ marginBottom: '0.25rem' }} />
              <div>support@festiveroots.com</div>
            </div>
            <div>
              <Phone size={18} color="var(--color-terracotta)" style={{ marginBottom: '0.25rem' }} />
              <div>+91 98765 43210</div>
            </div>
            <div>
              <MapPin size={18} color="var(--color-terracotta)" style={{ marginBottom: '0.25rem' }} />
              <div>Heritage Guild Hub, India</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
