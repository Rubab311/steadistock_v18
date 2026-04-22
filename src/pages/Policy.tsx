import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Shield, FileText, ChevronLeft, Lock } from 'lucide-react';
import { Card } from '../components/ui/Card';

export const Policy = () => {
  const { type } = useParams();
  
  const policies = {
    privacy: {
      title: 'Privacy Policy',
      icon: Shield,
      body: `At SteadiStock, we take your data privacy seriously. This policy outlines how we handle information:
      
      1. Data Storage: All retail data is stored locally in your browser's persistent storage for your convenience.
      2. Security: We implement standard browser-based encryption for local data.
      3. Third Parties: We do not share your inventory or sales data with any third-party marketing agencies.
      4. Consent: By using this system, you agree to our data management practices.`
    },
    terms: {
      title: 'Terms of Service',
      icon: FileText,
      body: `Usage terms for the SteadiStock Management System:

      1. License: You are granted a limited license to use this prototype for retail management simulation.
      2. Accountability: SteadiStock is not liable for data loss due to browser cache clearing or local storage issues.
      3. Prohibitions: You may not reverse engineer or distribute this software without explicit permission.
      4. Compliance: Users must comply with local tax regulations when logging official sales.`
    },
    security: {
      title: 'Security Guidelines',
      icon: Lock,
      body: `Maintaining a secure environment for your retail records:

      1. Access Control: Always use unique pins/passwords for administrative accounts.
      2. Session Management: Log out when leaving a shared terminal.
      3. Local Backups: Periodically export reports to PDF or Excel to ensure data persistence outside the browser.
      4. Browser Updates: Keep your operating browser up to date to benefit from the latest security patches.`
    }
  };

  const content = policies[type as keyof typeof policies] || policies.privacy;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <Helmet>
        <title>{content.title} | SteadiStock</title>
      </Helmet>

      <Link to="/settings" className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest hover:translate-x-[-4px] transition-transform">
        <ChevronLeft size={16} />
        Back to Settings
      </Link>

      <div className="space-y-2">
        <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
          <content.icon size={24} />
        </div>
        <h1 className="text-4xl font-black text-neutral-text tracking-tighter">{content.title}</h1>
        <p className="text-neutral-secondary font-medium uppercase tracking-widest text-[10px]">Effective Date: April 2026</p>
      </div>

      <Card className="prose prose-slate max-w-none p-10">
         <div className="whitespace-pre-line text-neutral-text leading-relaxed font-medium">
            {content.body}
         </div>
      </Card>
      
      <div className="text-center pb-10">
         <p className="text-xs text-neutral-secondary font-medium">If you have questions about our policies, please contact support@steadi.stock</p>
      </div>
    </div>
  );
};
