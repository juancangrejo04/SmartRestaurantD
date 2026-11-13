import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { HelpCircle, ArrowLeft, Shield, Truck, CalendarCheck, CreditCard } from 'lucide-react';

export const HelpPage: React.FC = () => {
  const { t, profile } = useApp();

  const faqs = [
    {
      icon: CalendarCheck,
      q: t('faq_q1'),
      a: t('faq_a1'),
    },
    {
      icon: Truck,
      q: t('faq_q2'),
      a: t('faq_a2'),
    },
    {
      icon: CreditCard,
      q: t('faq_q3'),
      a: t('faq_a3'),
    },
    {
      icon: Shield,
      q: t('faq_q4'),
      a: t('faq_a4', { law: profile.dataResidency.applicableLaw }),
    },
  ];

  return (
    <div className="min-h-screen bg-[#FBF6EC] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7A6E65] hover:text-[#1F1A17]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('back_to_home')}</span>
        </Link>

        <div className="bg-[#FFFDF8] rounded-3xl p-8 border border-[#E9DFCC] shadow-xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#E9DFCC]">
            <div className="w-11 h-11 rounded-2xl bg-[#E8A33D]/20 flex items-center justify-center text-[#C8452C]">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-2xl text-[#1F1A17]">
                {t('faq_title')}
              </h1>
              <p className="text-xs text-[#7A6E65]">{t('faq_sub')}</p>
            </div>
          </div>

          <div className="space-y-4">
            {faqs.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#FBF6EC] border border-[#E9DFCC] space-y-2"
                >
                  <h2 className="font-bold text-sm text-[#1F1A17] flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[#C8452C]" />
                    <span>{item.q}</span>
                  </h2>
                  <p className="text-xs text-[#7A6E65] leading-relaxed">{item.a}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
