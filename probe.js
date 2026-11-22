// 只读探针：验证 GitHub Actions 机房 IP 能否抓到天天基金页面并解析状态。
// 不写任何 Gist、不接触线上数据。
(async () => {
  const url = "https://fund.eastmoney.com/018738.html";
  const t0 = Date.now();
  const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  const html = await r.text();
  console.log("HTTP", r.status, "bytes", html.length, "ms", Date.now() - t0);

  const seg = html.match(/交易状态：([\s\S]{0,500}?)<\/div>/);
  const block = seg ? seg[1] : "";
  console.log("BLOCK:", block.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim().slice(0, 200));

  const lim = block.match(/单日累计购买上限\s*([\d,.]+)\s*元/);
  if (lim) console.log("RESULT: 限大额 " + lim[1]);
  else if (/暂停申购|暂停销售/.test(block)) console.log("RESULT: 暂停");
  else if (/开放申购|正常申购/.test(block)) console.log("RESULT: 开放");
  else console.log("RESULT: 未知");
})().catch(e => { console.error("FETCH FAIL:", e.message); process.exit(1); });
