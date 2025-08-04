// config.js

// ---- addresses ----
const contractAddress = "0xf24bb50d20b64329290D2144016Bf13b5f901710";
const usdtAddress     = "0x55d398326f99059fF775485246999027B3197955";
const kjcAddress      = "0xd479ae350dc24168e8db863c5413c35fb2044ecd";
const routerAddress   = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
const lpTokenAddress  = "0xdF0d76046E72C183142c5208Ea0247450475A0DF";

// ---- minimal ERC20 ABI we use ----
const usdtABI = [
  { constant: true,  inputs: [],                                  name: "decimals",  outputs: [{ type: "uint8" }],   type: "function" },
  { constant: true,  inputs: [{ name: "_owner",  type: "address"}],name: "balanceOf", outputs: [{ type: "uint256"}],  type: "function" },
  { constant: false, inputs: [{ name: "_spender",type: "address"}, { name: "_value", type: "uint256"}],
    name: "approve", outputs: [{ name: "success", type: "bool"}],  type: "function" }
];
const kjcABI = usdtABI; // ใช้เหมือนกัน (approve/balanceOf/decimals)

// ---- Pancake Router (เฉพาะที่ใช้) ----
const routerABI = [
  { name: "getAmountsOut", type: "function", constant: true,
    inputs:  [{ name: "amountIn", type: "uint256" }, { name: "path", type: "address[]" }],
    outputs: [{ name: "amounts",  type: "uint256[]" }] }
];

// ---- Staking contract ABI (ต้องครอบคลุม method ที่ UI เรียก) ----
const stakingABI = [
  // write
  { name: "buyAndStake",           type: "function", inputs: [{ name: "usdtAmount", type: "uint256" }, { name: "minKJC", type: "uint256" }], stateMutability: "nonpayable", outputs: [] },
  { name: "claimStakingReward",    type: "function", inputs: [], stateMutability: "nonpayable", outputs: [] },
  { name: "claimReferralReward",   type: "function", inputs: [], stateMutability: "nonpayable", outputs: [] },
  { name: "withdrawLP",            type: "function", inputs: [], stateMutability: "nonpayable", outputs: [] },
  { name: "setReferrer",           type: "function", inputs: [{ name: "ref", type: "address" }], stateMutability: "nonpayable", outputs: [] },

  // read (สำหรับ UI)
  { name: "users",                 type: "function", stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [
      { name: "referrer",        type: "address"  },
      { name: "referralRewards", type: "uint256" }
    ]
  },
  { name: "canWithdraw",           type: "function", stateMutability: "view",
    inputs:  [{ name: "user", type: "address" }], outputs: [{ type: "bool" }] },

  // ถ้า UI ใช้ 1-stake แบบ struct เดิม:
  { name: "stakers",               type: "function", stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [
      { name: "amount",    type: "uint256" },
      { name: "lastClaim", type: "uint256" },
      { name: "startTime", type: "uint256" }
    ]
  },

  // ถ้า UI คำนวณรางวัลรอเคลมจากสัญญา
  { name: "getPendingReward",      type: "function", stateMutability: "view",
    inputs:  [{ name: "user", type: "address" }], outputs: [{ type: "uint256" }] }
];

// alias กันพลาด (บางไฟล์เรียก contractABI)
const contractABI = stakingABI;
