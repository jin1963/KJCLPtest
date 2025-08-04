// staking.js  —  buy&stake แบบมี gasLimit + กันสลิปเพจ + แจ้งเตือนละเอียด

// อาศัยตัวแปร global จาก wallet.js / config.js:
// web3, account, contract, usdtContract, routerContract, contractAddress, usdtAddress, kjcAddress

function bn(x) { return web3.utils.toBN(x); }

async function stakeLP(amountInput) {
  try {
    if (!web3 || !account) {
      alert("กรุณาเชื่อมต่อกระเป๋าก่อน");
      return;
    }

    // ----------------------------
    // 1) แปลงจำนวนเป็นหน่วย token
    // ----------------------------
    const amount = (amountInput || "").toString().trim();
    if (!amount || Number(amount) <= 0) {
      alert("กรุณากรอกจำนวน USDT (> 0)");
      return;
    }

    // พยายามอ่าน decimals ของ USDT (fallback = 18)
    let usdtDecimals = 18;
    try { usdtDecimals = Number(await usdtContract.methods.decimals().call()); } catch (_) {}
    const scale = bn(10).pow(bn(usdtDecimals));

    // toUnits แบบรองรับทศนิยม (เลี่ยงปัญหา BN อ่านทศนิยมไม่ได้)
    const [ints, fracsRaw = ""] = amount.split(".");
    const fracs = (fracsRaw + "0".repeat(usdtDecimals)).slice(0, usdtDecimals);
    const usdtAmount = bn(ints).mul(scale).add(bn(fracs));

    //
