// ใช้กับ web3.js ตามที่โปรเจกต์ใช้อยู่
let web3, account;
let contract, usdtContract, kjcContract, routerContract;

const BSC_CHAIN_ID = "0x38";

async function connectWallet() {
  try {
    if (!window.ethereum) {
      alert("กรุณาติดตั้ง MetaMask/Bitget Wallet");
      return;
    }
    // สลับเครือข่ายไป BSC ถ้าจำเป็น
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    if (chainId !== BSC_CHAIN_ID) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: BSC_CHAIN_ID }]
        });
      } catch (e) {
        if (e.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: BSC_CHAIN_ID,
              chainName: "BNB Smart Chain",
              nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
              rpcUrls: ["https://bsc-dataseed.binance.org/"],
              blockExplorerUrls: ["https://bscscan.com"]
            }]
          });
        } else { throw e; }
      }
    }

    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    account = accounts[0];

    document.getElementById("walletAddress").innerText = `✅ ${account}`;

    // เตรียม instance ตาม config.js
    contract       = new web3.eth.Contract(contractABI, contractAddress);
    usdtContract   = new web3.eth.Contract(usdtABI,     usdtAddress);
    kjcContract    = new web3.eth.Contract(kjcABI,      kjcAddress);
    routerContract = new web3.eth.Contract(routerABI,   routerAddress);

    // ตั้งลิงก์ ref + bscscan
    initApp(); // อยู่ใน app.js
  } catch (err) {
    console.error("⚠️ Wallet connect error:", err);
    alert("❌ เชื่อมต่อกระเป๋าไม่สำเร็จ");
  }
}

// เผย function ให้ปุ่มใน HTML เรียกได้
window.connectWallet = connectWallet;
