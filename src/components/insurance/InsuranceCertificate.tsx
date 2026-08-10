import { type InsuranceCertData, certDateParts } from '@/content/insurance-certificate';

function CertDate({ iso }: { iso: string }) {
  const p = certDateParts(iso);
  return (
    <>
      {p.dd}
      <sup>{p.suffix}</sup> {p.rest}
    </>
  );
}

/**
 * The Caunce O'Hara / Markel block-policy "Verification Certificate", laid out
 * to match the broker's original. Rendered to PDF by headless Chrome.
 */
export default function InsuranceCertificate({ data }: { data: InsuranceCertData }) {
  const period = (
    <>
      <CertDate iso={data.startDate} /> to <CertDate iso={data.periodEnd} /> inclusive
    </>
  );

  return (
    <div className="cert">
      <style>{`
        .cert { font-family: Arial, Helvetica, sans-serif; color: #333; font-size: 9pt;
                line-height: 1.32; padding: 10mm 16mm; box-sizing: border-box; }
        .cert-head { display: flex; justify-content: space-between; align-items: flex-start; }
        .cert-caunce { width: 128px; height: auto; display: block; }
        .cert-head-r { text-align: right; padding-top: 26px; }
        .cert-title { font-size: 14pt; font-weight: 800; color: #111; letter-spacing: .2px; }
        .cert-holder { font-size: 11.5pt; font-weight: 800; color: #111; margin-top: 2px; }
        .cert-rule { border: 0; border-top: 2px solid #111; margin: 8px 0 16px; }
        .cert h2 { font-size: 10.5pt; font-weight: 800; color: #111; margin: 0 0 10px; }
        .cert p { margin: 0 0 10px; }
        .cover { width: 100%; border-collapse: collapse; margin: 2px 0 14px; }
        .cover td { vertical-align: top; padding: 0.5px 0; }
        .c-label { width: 200px; font-weight: 700; color: #111; }
        .c-colon { width: 76px; }
        .c-mid { width: 120px; }
        .c-val { font-weight: 700; color: #111; }
        .c-note { font-style: italic; color: #555; }
        .c-gap td { height: 9px; }
        .cert sup { font-size: 0.62em; vertical-align: super; }
        .sig { font-weight: 800; font-size: 24pt; color: #111; line-height: 1; margin: 8px 0 2px;
               letter-spacing: .3px; }
        .sig-name { margin: 0; line-height: 1.3; }
        .cert-foot { margin-top: 16px; text-align: right; }
        .cert-markel { width: 82px; height: auto; display: inline-block; }
      `}</style>

      <div className="cert-head">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="cert-caunce" src="/insurance/caunce-ohara.jpg" alt="Caunce O'Hara" />
        <div className="cert-head-r">
          <div className="cert-title">VERIFICATION CERTIFICATE</div>
          <div className="cert-holder">JSA Services Limited t/a Workwell</div>
        </div>
      </div>
      <hr className="cert-rule" />

      <h2>TO WHOM IT MAY CONCERN:</h2>
      <p>
        A block policy of insurance has been arranged by the above-named company for the benefit of the
        Personal Service Companies that it currently provides services for.
      </p>
      <p>The following insurance cover is in force under the block policy -</p>

      <table className="cover">
        <tbody>
          <tr>
            <td className="c-label">Employers Liability</td>
            <td className="c-colon">:</td>
            <td className="c-mid">Limit of Indemnity</td>
            <td className="c-val">£10,000,000 any one Occurrence</td>
          </tr>
          <tr>
            <td />
            <td />
            <td />
            <td className="c-note">
              but limited to £5,000,000 any one Occurrence in respect of claims arising from acts of
              Terrorism or Offshore work undertaken.
            </td>
          </tr>
          <tr className="c-gap">
            <td colSpan={4} />
          </tr>
          <tr>
            <td className="c-label">Insurers</td>
            <td className="c-colon">:</td>
            <td colSpan={2}>Markel (UK) Ltd</td>
          </tr>
          <tr>
            <td className="c-label">Policy Number</td>
            <td className="c-colon">:</td>
            <td colSpan={2}>{data.policyNumber}</td>
          </tr>
          <tr>
            <td className="c-label">Period of Insurance</td>
            <td className="c-colon">:</td>
            <td colSpan={2}>{period}</td>
          </tr>
        </tbody>
      </table>

      <table className="cover">
        <tbody>
          <tr>
            <td className="c-label">Public Liability</td>
            <td className="c-colon">:</td>
            <td className="c-mid">Limit of Indemnity</td>
            <td className="c-val">£10,000,000 any one loss</td>
          </tr>
          <tr>
            <td className="c-label">Products Liability</td>
            <td className="c-colon">:</td>
            <td className="c-mid">Limit of Indemnity</td>
            <td className="c-val">£10,000,000 in the aggregate</td>
          </tr>
          <tr>
            <td className="c-label">Insurers</td>
            <td className="c-colon">:</td>
            <td colSpan={2}>Markel (UK) Ltd</td>
          </tr>
          <tr>
            <td className="c-label">Policy Number</td>
            <td className="c-colon">:</td>
            <td colSpan={2}>{data.policyNumber}</td>
          </tr>
          <tr>
            <td className="c-label">Period of Insurance</td>
            <td className="c-colon">:</td>
            <td colSpan={2}>{period}</td>
          </tr>
        </tbody>
      </table>

      <table className="cover">
        <tbody>
          <tr>
            <td className="c-label">Professional Indemnity</td>
            <td className="c-colon">:</td>
            <td className="c-mid">Limit of Indemnity</td>
            <td className="c-val">£5,000,000 any one claim</td>
          </tr>
          <tr>
            <td className="c-label">Insurers</td>
            <td className="c-colon">:</td>
            <td colSpan={2}>Markel (UK) Ltd</td>
          </tr>
          <tr>
            <td className="c-label">Policy Number</td>
            <td className="c-colon">:</td>
            <td colSpan={2}>{data.policyNumber}</td>
          </tr>
          <tr>
            <td className="c-label">Period of Insurance</td>
            <td className="c-colon">:</td>
            <td colSpan={2}>{period}</td>
          </tr>
        </tbody>
      </table>

      <table className="cover">
        <tbody>
          <tr>
            <td className="c-label">Personal Service Company</td>
            <td className="c-colon">:</td>
            <td colSpan={2} className="c-val">{data.company}</td>
          </tr>
          <tr>
            <td className="c-label">Insured under this policy</td>
            <td className="c-colon" />
            <td colSpan={2} />
          </tr>
        </tbody>
      </table>

      <p>
        If you have any queries regarding this policy or would like to report a claim or circumstances
        which may give rise to a claim, please contact Nigel Johnson or Molly Taylor at Caunce O’Hara on
        0161 833 2100. A copy of the policy detailing the terms and conditions is available from either of
        the above.
      </p>

      <p>Yours faithfully</p>
      <div className="sig">Nigel Johnson</div>
      <p className="sig-name">
        Nigel Johnson BSc (Hons)
        <br />
        Account Executive
      </p>

      <div className="cert-foot">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="cert-markel" src="/insurance/markel.png" alt="Markel" />
      </div>
    </div>
  );
}
