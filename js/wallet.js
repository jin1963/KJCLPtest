// wallet.js
let web3;
let account;
let contract;
let usdtContract;
let kjcContract;
let routerContract;

let isConnecting = false;
const BSC_CHAIN_ID = "0x38";

async function connectWallet() {
  if (isConnecting) return;
  isConnecting = true;

  try {
    if (!window.ethereum) {
      alert("⚠️ กรุณาติดตั้ง MetaMask หรือ Bitget Wallet");
      isConnecting = false;
      return;
    }

    // ขอสิทธิ์เชื่อมต่อ
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const [acc] = await web3.eth.getAccounts();
    account = acc;

    // สลับไป BSC ถ้ายังไม่ใช่
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    if (chainId !== BSC_CHAIN_ID) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: BSC_CHAIN_ID }],
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
        } else {
          throw e;
        }
      }
    }

    // ใช้ stakingABI ตรง ๆ (กันกรณีใช้ชื่อ contractABI แล้วหาไม่เจอ)
    const ABI = (typeof stakingABI !== "undefined") ? stakingABI : contractABI;

    contract       = new web3.eth.Contract(ABI, contractAddress);
    usdtContract   = new web3.eth.Contract(usdtABI, usdtAddress);
    kjcContract    = new web3.eth.Contract(kjcABI,  kjcAddress);
    routerContract = new web3.eth.Contract(routerABI, routerAddress);

    document.getElementById("walletAddress").innerText = `✅ ${account}`;

    // โหลดข้อมูลแรกเข้า (ฟังก์ชันนี้อยู่ใน app.js)
    if (typeof initApp === "function") await initApp();

  } catch (err) {
    console.error("Wallet connect error:", err);
    alert("❌ เชื่อมต่อกระเป๋าไม่สำเร็จ ลองใหม่อีกครั้ง");
  }

  isConnecting = false;
}

// เผยฟังก์ชันให้ปุ่มเรียกใช้ได้
window.connectWallet = connectWallet;
