function setBscScanLink() {
  try {
    const el = document.getElementById("bscscanLink");
    if (el && account) el.href = `https://bscscan.com/address/${account}`;
  } catch (e) { console.warn("setBscScanLink skipped:", e); }
}

async function initApp() {
  if (!account || !web3) return;

  // อัปเดตรางวัล referral
  await updateReferralInfo();

  // สร้างลิงก์แนะนำ
  const currentUrl   = window.location.origin + window.location.pathname;
  const referralLink = `${currentUrl}?ref=${account}`;
  const refEl = document.getElementById("refLink");
  if (refEl) {
    refEl.href = referralLink;
    refEl.innerText = referralLink;
  }

  // ลิงก์ไป BscScan
  setBscScanLink();
}

async function updateReferralInfo() {
  try {
    // users(address) -> (referrer, referralRewards)
    const user = await contract.methods.users(account).call();
    const formatted = web3.utils.fromWei(user.referralRewards || "0", "ether");
    document.getElementById("refReward").innerText = formatted;
  } catch (err) {
    console.error("❌ โหลด referral ไม่ได้:", err);
  }
}

window.initApp = initApp;
