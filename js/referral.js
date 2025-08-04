async function registerReferrer() {
  try {
    const ref = document.getElementById("refAddress").value.trim();
    if (!web3.utils.isAddress(ref)) {
      alert("❌ กรุณากรอก Referrer Address ให้ถูกต้อง");
      return;
    }
    await contract.methods.setReferrer(ref).send({ from: account });
    alert("✅ สมัครสำเร็จ!");
  } catch (e) {
    console.error("❌ สมัคร Referrer ผิดพลาด:", e);
    alert("❌ สมัครไม่สำเร็จ");
  }
}

async function claimReferral() {
  try {
    await contract.methods.claimReferralReward().send({ from: account });
    alert("✅ เคลมรางวัลแนะนำสำเร็จแล้ว!");
    if (window.updateReferralInfo) await updateReferralInfo();
  } catch (e) {
    console.error("❌ Claim ผิดพลาด:", e);
    alert("❌ ไม่สามารถเคลมรางวัลแนะนำได้");
  }
}

window.registerReferrer = registerReferrer;
window.claimReferral    = claimReferral;
