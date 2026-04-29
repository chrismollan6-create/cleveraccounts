import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Clever Accounts",
  description: "Clever Accounts terms of service — governing your use of cleveraccounts.com and related services.",
};

const sections = [
  {
    title: "Limitations of Use",
    content: `By using this website, you warrant on behalf of yourself, your users, and other parties you represent that you will not:
• modify, copy, prepare derivative works of, decompile, or reverse engineer any materials and software contained on this website;
• remove any copyright or other proprietary notations from any materials and software on this website;
• transfer the materials to another person or "mirror" the materials on any other server;
• knowingly or negligently use this website or any of its associated services in a way that abuses or disrupts our networks or any other service Clever Accounts Ltd provides;
• use this website or its associated services to transmit or publish any harassing, indecent, obscene, fraudulent, or unlawful material;
• use this website or its associated services in violation of any applicable laws or regulations;
• use this website in conjunction with sending unauthorised advertising or spam;
• harvest, collect or gather user data without the user's consent; or
• use this website or its associated services in such a way that may infringe the privacy, intellectual property rights, or other rights of third parties.`,
  },
  {
    title: "Intellectual Property",
    content: `The intellectual property in the materials contained in this website are owned by or licensed to Clever Accounts Ltd and are protected by applicable copyright and trademark law. We grant our users permission to download one copy of the materials for personal, non-commercial transitory use.

This constitutes the grant of a license, not a transfer of title. This license shall automatically terminate if you violate any of these restrictions or the Terms of Service, and may be terminated by Clever Accounts Ltd at any time.`,
  },
  {
    title: "Liability",
    content: `Our website and the materials on our website are provided on an 'as is' basis. To the extent permitted by law, Clever Accounts Ltd makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property, or other violation of rights.

In no event shall Clever Accounts Ltd or its suppliers be liable for any consequential loss suffered or incurred by you or any third party arising from the use or inability to use this website or the materials on this website, even if Clever Accounts Ltd or an authorised representative has been notified, orally or in writing, of the possibility of such damage.

In the context of this agreement, "consequential loss" includes any consequential loss, indirect loss, real or anticipated loss of profit, loss of benefit, loss of revenue, loss of business, loss of goodwill, loss of opportunity, loss of savings, loss of reputation, loss of use and/or loss or corruption of data, whether under statute, contract, equity, tort (including negligence), indemnity or otherwise.

Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.`,
  },
  {
    title: "Accuracy of Materials",
    content: `The materials appearing on our website are not comprehensive and are for general information purposes only. Clever Accounts Ltd does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on this website, or otherwise relating to such materials or on any resources linked to this website.`,
  },
  {
    title: "Links",
    content: `Clever Accounts Ltd has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement, approval or control by Clever Accounts Ltd of the site. Use of any such linked site is at your own risk and we strongly advise you make your own investigations with respect to the suitability of those sites.`,
  },
  {
    title: "Right to Terminate",
    content: `We may suspend or terminate your right to use our website and terminate these Terms of Service immediately upon written notice to you for any breach of these Terms of Service.`,
  },
  {
    title: "Severance",
    content: `Any term of these Terms of Service which is wholly or partially void or unenforceable is severed to the extent that it is void or unenforceable. The validity of the remainder of these Terms of Service is not affected.`,
  },
  {
    title: "Governing Law",
    content: `These Terms of Service are governed by and construed in accordance with the laws of United Kingdom. You irrevocably submit to the exclusive jurisdiction of the courts in that State or location.`,
  },
];

export default function TermsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-dark py-16 md:py-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/15 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-black text-white mb-3">Terms of Service</h1>
          <p className="text-white/60">Last updated: 16 November 2022</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-12" preserveAspectRatio="none">
            <path d="M0,0 C480,50 960,50 1440,0 L1440,50 L0,50 Z" fill="white" />
          </svg>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-text-light leading-relaxed mb-6">
            These Terms of Service govern your use of the website located at <a href="https://cleveraccounts.com" className="text-primary hover:underline">https://cleveraccounts.com</a> and any related services provided by Clever Accounts Ltd.
          </p>
          <p className="text-text-light leading-relaxed mb-6">
            By accessing <a href="https://cleveraccounts.com" className="text-primary hover:underline">https://cleveraccounts.com</a>, you agree to abide by these Terms of Service and to comply with all applicable laws and regulations. If you do not agree with these Terms of Service, you are prohibited from using or accessing this website or using any other services provided by Clever Accounts Ltd.
          </p>
          <p className="text-text-light leading-relaxed mb-10">
            We, Clever Accounts Ltd, reserve the right to review and amend any of these Terms of Service at our sole discretion. Upon doing so, we will update this page. Any changes to these Terms of Service will take effect immediately from the date of publication.
          </p>

          <div className="space-y-10">
            {sections.map(({ title, content }) => (
              <div key={title}>
                <h2 className="text-xl font-black text-dark mb-3">{title}</h2>
                <div className="text-text-light leading-relaxed whitespace-pre-line text-sm">{content}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
