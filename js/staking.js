async function stakeLP() {
  try {
    if (!account || !web3 || !contract) {
      alert("กรุณาเชื่อมต่อกระเป๋าก่อน");
      return;
    }

    const amountStr = document.getElementById("stakeAmount").value;
    if (!amountStr || Number(amountStr) <= 0) {
      alert("กรุณากรอกจำนวน USDT ให้ถูกต้อง");
      return;
    }

    const usdtAmount = web3.utils.toWei(amountStr, "ether");

    // 1) Approve USDT ให้ contract
    await usdtContract.methods.approve(contractAddress, usdtAmount).send({ from: account });

    // 2) คำนวณ minKJC จากครึ่งหนึ่งของ USDT (slippage 3%)
    const half = web3.utils.toBN(usdtAmount).div(web3.utils.toBN(2));
    const path = [usdtAddress, kjcAddress];
    const amountsOut = await routerContract.methods.getAmountsOut(half.toString(), path).call();
    const minKJC = web3.utils.toBN(amountsOut[1]).muln(97).divn(100);

    // 3) buyAndStake
    await contract.methods.buyAndStake(usdtAmount, minKJC.toString()).send({ from: account });

    alert("✅ สเตคสำเร็จ! ระบบได้เพิ่ม LP และล็อกไว้เรียบร้อยแล้ว");
    // ถ้ามีหน้าแสดงยอด stake ในอนาคต ค่อยอ่านมาแสดง
  } catch (error) {
    console.error("❌ ผิดพลาดตอน stake:", error);
    alert("❌ ไม่สามารถ stake ได้ กรุณาตรวจสอบจำนวนหรือรอสักครู่");
  }
}

async function claimReward() {
  try {
    await contract.methods.claimStakingReward().send({ from: account });
    alert("✅ เคลมรางวัลสำเร็จแล้ว!");
  } catch (e) {
    console.error("❌ Claim ผิดพลาด:", e);
    alert("❌ ไม่สามารถเคลมรางวัลได้");
  }
}

async function withdrawLP() {
  try {
    // ถ้าสัญญาเดิมไม่มี canWithdraw ให้ข้ามเช็คนี้ได้
    if (contract.methods.canWithdraw) {
      const can = await contract.methods.canWithdraw(account).call();
      if (!can) { alert("❌ ยังไม่ครบระยะเวลา 180 วัน"); return; }
    }
    await contract.methods.withdrawLP().send({ from: account });
    alert("✅ ถอน LP สำเร็จแล้ว");
  } catch (e) {
    console.error("❌ Withdraw ผิดพลาด:", e);
    alert("❌ ไม่สามารถถอน LP ได้");
  }
}

window.stakeLP = stakeLP;
window.claimReward = claimReward;
window.withdrawLP = withdrawLP;
