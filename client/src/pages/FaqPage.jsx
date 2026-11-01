import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FaqPage = () => {
  const faqs = [
    {
      q: 'How does FestiveRoots verify regional product authenticity?',
      a: 'We require artisans to register with their physical cluster location (state, district, village) and craft lineage details. Product origin claims are labeled as either "Declared by Artisan" or "Independently Verified" following documentation checks with local craft cooperatives and GI registries.'
    },
    {
      q: 'What is the multi-artisan order fulfilment model?',
      a: 'If your shopping cart contains items from different artisans across India (e.g. Kondapalli toys from Andhra Pradesh and Blue Pottery from Rajasthan), FestiveRoots partitions your checkout into independent sub-orders. Each artisan prepares and dispatches their portion directly from their regional workshop.'
    },
    {
      q: 'What is a "Made-to-Order" product?',
      a: 'Many traditional masterpieces—such as large terracotta sculptures, sacred wooden idol sets, or intricate handloom dupattas—are created specifically upon request. These items display a handcrafting preparation time (in days) during which the artisan hand-shapes, paints, and dries your custom piece before dispatch.'
    },
    {
      q: 'Can I cancel an order after placing it?',
      a: 'Yes, orders can be cancelled directly through your customer dashboard as long as the status is "PLACED" or "AWAITING_ARTISAN_CONFIRMATION". Once the artisan has started active preparation or collection has been scheduled, orders cannot be cancelled.'
    },
    {
      q: 'How can traditional artisans join FestiveRoots?',
      a: 'Artisans can click "Join as Artisan" in the header to submit their craft specialization, cluster location, biography, and photos. After submission, an administrator reviews their application before approving their verified status.'
    },
    {
      q: 'Are online payments and courier deliveries real in this version?',
      a: 'FestiveRoots is built as a complete academic MERN stack project. Payment options include Cash on Delivery (COD) and a safe "Simulated Online Demo" mode. Courier tracking updates are realistic simulations illustrating the intermediary logistics lifecycle.'
    }
  ];

  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="faq-page" style={{ padding: '3.5rem 0 6rem' }}>
      <div className="container container-narrow">
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
          <div className="heritage-pill" style={{ marginBottom: '0.5rem' }}>
            <HelpCircle size={13} /> Common Inquiries
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>Frequently Asked Questions</h1>
          <p>
            Learn about our intermediary model, artisan verification, craft origin standards, and order fulfilment.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} className="card" style={{ background: '#FFFFFF', overflow: 'hidden' }}>
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: 'var(--color-maroon)'
                }}
              >
                <span>{faq.q}</span>
                {openIndex === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {openIndex === idx && (
                <div style={{ padding: '0 1.5rem 1.5rem', color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: 1.6, borderTop: '1px solid var(--color-border-light)' }}>
                  <p style={{ marginTop: '0.75rem' }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
