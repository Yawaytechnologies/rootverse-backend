const escapeHtml = (value) => String(value ?? "-")
  .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;").replaceAll("'", "&#039;");

const number = (value, digits = 2) => Number(value || 0).toLocaleString("en-IN", {
  minimumFractionDigits: digits,
  maximumFractionDigits: digits,
});
const money = (value) => `₹ ${number(value, 2)}`;
const date = (value) => value ? new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(value)) : "-";
const dateTime = (value) => value ? `${date(value)} ${new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "UTC" }).format(new Date(value))} (UTC)` : "-";

const small = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
const underThousand = (n) => {
  let result = "";
  if (n >= 100) { result += `${small[Math.floor(n / 100)]} Hundred `; n %= 100; }
  if (n >= 20) { result += `${tens[Math.floor(n / 10)]} `; n %= 10; }
  if (n > 0) result += `${small[n]} `;
  return result.trim();
};
const amountInWords = (value) => {
  let n = Math.round(Number(value || 0));
  if (!n) return "Indian Rupees Zero Only";
  const parts = [];
  const units = [[10000000, "Crore"], [100000, "Lakh"], [1000, "Thousand"]];
  for (const [size, label] of units) {
    if (n >= size) { parts.push(`${underThousand(Math.floor(n / size))} ${label}`); n %= size; }
  }
  if (n) parts.push(underThousand(n));
  return `Indian Rupees ${parts.join(" ")} Only`;
};

const financialYear = (value) => {
  const d = new Date(value || Date.now());
  const y = d.getUTCFullYear();
  const start = d.getUTCMonth() >= 3 ? y : y - 1;
  return `${start}-${String(start + 1).slice(-2)}`;
};

const scientificName = (species) => {
  const text = String(species || "").toLowerCase();
  if (text.includes("vannamei")) return "Litopenaeus vannamei";
  if (text.includes("monodon") || text.includes("tiger")) return "Penaeus monodon";
  return null;
};

export function renderProcurementReceiptHtml(procurement, baseUrl = "") {
  const trader = procurement.trader_snapshot || {};
  const producer = procurement.producer_snapshot || {};
  const harvest = procurement.harvest || {};
  const inspection = procurement.quality_inspection || {};
  const receiptNo = `OBT/PR/${financialYear(procurement.procurement_date)}/${String(procurement.id).padStart(6, "0")}`;
  const verifyUrl = `${baseUrl}/api/payment-receipts/verify-procurement/${encodeURIComponent(procurement.procurement_no)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${encodeURIComponent(verifyUrl)}`;
  const validTill = new Date(procurement.procurement_date);
  validTill.setUTCDate(validTill.getUTCDate() + 15);
  const quantity = Number(procurement.actual_weight_kg || 0);
  const rate = Number(procurement.rate_per_kg || 0);
  const gross = Number(procurement.gross_amount || 0);
  const adjustment = Number(procurement.adjustment_amount || 0);
  const tax = Number(procurement.tax_amount || 0);
  const total = Number(procurement.total_value || 0);
  const species = harvest.species || "Seafood Produce";
  const scientific = scientificName(species);

  return `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(receiptNo)}</title><style>
  @page{size:A4;margin:8mm}*{box-sizing:border-box}body{margin:0;background:#e8edf4;font-family:Arial,Helvetica,sans-serif;color:#111;font-size:10px}.page{width:194mm;min-height:277mm;margin:10px auto;background:#fff;padding:6mm;border:1px solid #c9d2df}.blue{color:#123e91}.top{display:grid;grid-template-columns:1.15fr .85fr;gap:18px;border-bottom:1.5px solid #1d62a8;padding-bottom:12px}.brand-wrap{display:flex;align-items:center;gap:12px}.mark{width:58px;height:58px;border:8px solid #0878bf;border-radius:50%;position:relative}.mark:after{content:"";position:absolute;background:#fff;width:20px;height:28px;left:11px;top:-9px;border-radius:0 0 14px 14px}.brand{font-size:28px;font-weight:800;color:#0878bf;line-height:.9}.brand span{display:block;font-size:16px;color:#143d86;margin-top:8px}.tagline{border-left:1px solid #777;padding-left:14px;color:#133d88;font-size:12px;line-height:1.65}.receipt-title{font-size:23px;font-weight:800;color:#143d91;text-align:right;margin-bottom:10px}.meta{display:grid;grid-template-columns:125px 8px 1fr;gap:5px;font-size:10px}.meta b{letter-spacing:.2px}.party-grid{display:grid;grid-template-columns:1fr 1fr 135px;gap:22px;padding:14px 4px 10px}.section-title{font-weight:800;color:#123e91;font-size:11px;letter-spacing:.3px;margin-bottom:9px}.party h2{font-size:13px;margin:0 0 6px}.party p{margin:0 0 7px;line-height:1.55}.fields{display:grid;grid-template-columns:80px 8px 1fr;gap:5px}.qr{border:1px solid #9da7b4;border-radius:3px;text-align:center;padding:9px}.qr img{width:86px;height:86px;display:block;margin:8px auto}.qr p{margin:5px 0;line-height:1.3}.bar{display:flex;align-items:center;gap:12px;color:#123e91;font-weight:800;font-size:11px;margin:8px 4px}.bar:after{content:"";height:1px;background:#6d8ebc;flex:1}.details{display:grid;grid-template-columns:1fr 1fr;gap:42px;padding:8px 4px 13px}.detail-grid{display:grid;grid-template-columns:110px 8px 1fr;gap:6px;line-height:1.25}.scientific{font-size:9px;font-style:italic;display:block;margin-top:3px}.items{width:100%;border-collapse:collapse;font-size:9.5px}.items th,.items td{border:1px solid #98a3b3;padding:7px 8px}.items th{background:#e5ebf8;color:#123e91;text-align:center}.items .num{text-align:right}.items .center{text-align:center}.totals td{font-weight:500}.totals .grand{background:#e5ebf8;color:#123e91;font-weight:800;font-size:11px}.words{vertical-align:top;padding:14px!important;color:#123e91;font-weight:800}.words span{display:block;color:#111;font-size:10px;line-height:1.5;margin-top:12px}.box{border:1px solid #aeb6c2;padding:10px 12px;margin-top:10px}.box h3{margin:0 0 6px;color:#123e91;font-size:11px}.box p{margin:0;line-height:1.5}.bottom{display:grid;grid-template-columns:1fr 1.2fr 1fr;margin-top:8px}.bottom>div{padding:5px 14px;border-right:1px solid #b8bec7}.bottom>div:last-child{border:0}.bottom h3,.footer-grid h3{color:#123e91;font-size:10px;margin:0 0 8px}.signature{height:52px;display:flex;align-items:end;gap:15px}.seal{width:50px;height:50px;border:2px solid #143d91;border-radius:50%;display:flex;align-items:center;justify-content:center;text-align:center;color:#143d91;font-size:7px;font-weight:bold;transform:rotate(-8deg)}.sign{font-family:cursive;color:#174a9c;font-size:20px}.notes{margin:0;padding-left:15px;line-height:1.45}.verified{color:#168b38;font-size:12px;font-weight:800;margin-top:12px}.verified:before{content:"✓";display:inline-grid;place-items:center;background:#168b38;color:#fff;width:18px;height:18px;border-radius:50%;margin-right:8px}.footer-grid{border-top:1.5px solid #1d62a8;margin-top:9px;padding-top:8px;display:grid;grid-template-columns:1fr 1.3fr 1fr;gap:18px;line-height:1.4}.closing{border:1px solid #86a9d0;border-radius:4px;text-align:center;color:#123e91;font-weight:700;padding:5px;margin-top:8px}.screen-note{text-align:center;margin:8px auto;color:#52657d}@media print{body{background:#fff}.page{margin:0;border:0;width:auto;min-height:auto}.screen-note{display:none}}
  </style></head><body><div class="screen-note">Use your browser Print command and select “Save as PDF”.</div><main class="page">
  <section class="top"><div class="brand-wrap"><div class="mark"></div><div class="brand">OneBlue<span>Trade Platform<br><small>by RootVerse</small></span></div><div class="tagline">Traceable.<br>Transparent.<br>Trusted.</div></div><div><div class="receipt-title">PROCUREMENT RECEIPT</div><div class="meta"><b>RECEIPT NO.</b><i>:</i><span>${escapeHtml(receiptNo)}</span><b>RECEIPT DATE</b><i>:</i><span>${escapeHtml(date(procurement.created_at || procurement.procurement_date))}</span><b>PROCUREMENT ID</b><i>:</i><span>${escapeHtml(procurement.procurement_no)}</span><b>PAYMENT TERMS</b><i>:</i><span>${escapeHtml(procurement.payment_terms || "As per Agreement")}</span><b>VALID TILL</b><i>:</i><span>${escapeHtml(date(validTill))}</span></div></div></section>
  <section class="party-grid"><div class="party"><div class="section-title">BILL FROM (TRADER)</div><h2>${escapeHtml(trader.name)}</h2><p>${escapeHtml(trader.address)}</p><div class="fields"><span>Trader ID</span><i>:</i><span>${escapeHtml(trader.trader_id)}</span><span>GSTIN</span><i>:</i><span>${escapeHtml(trader.gstin)}</span><span>Phone</span><i>:</i><span>${escapeHtml(trader.phone)}</span><span>Email</span><i>:</i><span>${escapeHtml(trader.email)}</span></div></div><div class="party"><div class="section-title">BILL TO (PRODUCER)</div><h2>${escapeHtml(producer.name)}</h2><p>${escapeHtml(producer.farm_name)}<br>${escapeHtml(producer.address)}</p><div class="fields"><span>Producer ID</span><i>:</i><span>${escapeHtml(producer.producer_id)}</span><span>Phone</span><i>:</i><span>${escapeHtml(producer.phone)}</span><span>Email</span><i>:</i><span>${escapeHtml(producer.email)}</span></div></div><div class="qr"><div class="section-title">RECEIPT QR CODE</div><img src="${escapeHtml(qrUrl)}" alt="Procurement verification QR"><p>Scan to verify<br>procurement</p></div></section>
  <div class="bar">PROCUREMENT DETAILS</div><section class="details"><div class="detail-grid"><span>Harvest ID</span><i>:</i><span>${escapeHtml(harvest.id)}</span><span>Pond ID</span><i>:</i><span>${escapeHtml(harvest.pond_code)}</span><span>Species</span><i>:</i><span>${escapeHtml(species)}${scientific ? `<small class="scientific">(Scientific Name: ${escapeHtml(scientific)})</small>` : ""}</span><span>Grade</span><i>:</i><span>${escapeHtml(inspection.grade)}</span><span>Size</span><i>:</i><span>${escapeHtml(inspection.size_count_kg || harvest.expected_size)} Count/kg</span><span>Harvest Date</span><i>:</i><span>${escapeHtml(date(harvest.preferred_harvest_time || harvest.completed_at))}</span><span>Inspection ID</span><i>:</i><span>${escapeHtml(inspection.id)}</span></div><div class="detail-grid"><span>Incoterm</span><i>:</i><span>EXW (Farm Gate)</span><span>Place of Procurement</span><i>:</i><span>${escapeHtml(harvest.farm_address || producer.address)}</span><span>Harvest Method</span><i>:</i><span>${escapeHtml(harvest.harvest_method)}</span><span>Harvest Reason</span><i>:</i><span>${escapeHtml(harvest.harvest_reason)}</span><span>Procurement Date & Time</span><i>:</i><span>${escapeHtml(dateTime(procurement.procurement_date))}</span></div></section>
  <table class="items"><thead><tr><th>#</th><th>DESCRIPTION</th><th>SIZE</th><th>QUANTITY<br>(kg)</th><th>RATE<br>(₹ / kg)</th><th>AMOUNT<br>(₹)</th></tr></thead><tbody><tr><td class="center">1</td><td>${escapeHtml(species)} (Whole, Head-On)<br>Quality Grade: ${escapeHtml(inspection.grade)} | Harvested from Pond ${escapeHtml(harvest.pond_code)}</td><td class="center">${escapeHtml(inspection.size_count_kg || harvest.expected_size)} Count/kg</td><td class="num">${number(quantity,3)}</td><td class="num">${number(rate,2)}</td><td class="num">${number(gross,2)}</td></tr><tr><td colspan="3" rowspan="5" class="words">AMOUNT IN WORDS<span>${escapeHtml(amountInWords(total))}</span></td><td colspan="2">SUB TOTAL</td><td class="num">${number(gross,2)}</td></tr><tr class="totals"><td colspan="2">OTHER CHARGES / ADJUSTMENT</td><td class="num">${number(adjustment,2)}</td></tr><tr class="totals"><td colspan="2">CGST (Tax Share)</td><td class="num">${number(tax / 2,2)}</td></tr><tr class="totals"><td colspan="2">SGST (Tax Share)</td><td class="num">${number(tax / 2,2)}</td></tr><tr class="totals"><td colspan="2" class="grand">TOTAL PROCUREMENT VALUE (₹)</td><td class="num grand">${number(total,2)}</td></tr></tbody></table>
  <section class="box"><h3>DECLARATION</h3><p>We, ${escapeHtml(trader.name)}, hereby acknowledge that we have procured the above-mentioned seafood produce from the producer as per the agreed quantity, quality and price.<br>This is only a procurement receipt and not a payment receipt.<br>Payments will be made as per the agreed terms and any payment will be against Procurement ID ${escapeHtml(procurement.procurement_no)}.</p></section>
  <section class="bottom"><div><h3>FOR ${escapeHtml(String(trader.name || "TRADER").toUpperCase())}</h3><div class="signature"><div class="seal">${escapeHtml(trader.name)}<br>VERIFIED</div><div class="sign">Authorised</div></div><b>Authorised Signatory</b><br>${escapeHtml(trader.authorized_signatory || trader.name)}</div><div><h3>IMPORTANT NOTES</h3><ol class="notes"><li>This receipt confirms procurement of goods only.</li><li>Payment will be made within the agreed credit period.</li><li>All payments will be recorded against Procurement ID ${escapeHtml(procurement.procurement_no)}.</li><li>This is a system-generated document; no physical signature is required.</li></ol></div><div><h3>DOCUMENT VERIFICATION</h3><div class="fields"><span>Platform</span><i>:</i><span>OneBlue Trade Platform</span><span>Generated On</span><i>:</i><span>${escapeHtml(dateTime(new Date()))}</span><span>Generated By</span><i>:</i><span>OneBlue System</span><span>Version</span><i>:</i><span>1.0</span></div><div class="verified">Verified Document</div></div></section>
  <section class="footer-grid"><div><h3>SUPPORT</h3>☎ ${escapeHtml(process.env.ONEBLUE_SUPPORT_PHONE)}<br>✉ ${escapeHtml(process.env.ONEBLUE_SUPPORT_EMAIL)}<br>◉ ${escapeHtml(process.env.ONEBLUE_WEBSITE)}</div><div><h3>REGISTERED OFFICE – ROOTVERSE</h3>${escapeHtml(process.env.ROOTVERSE_REGISTERED_OFFICE)}<br>CIN: ${escapeHtml(process.env.ROOTVERSE_CIN)}</div><div><h3>FOLLOW US</h3>${escapeHtml(process.env.ONEBLUE_SOCIAL_LINKS)}</div></section><div class="closing">This is a system-generated Procurement Receipt from OneBlue Trade Platform by RootVerse.<br>Thank you for Partnering with us!</div>
  </main></body></html>`;
}
