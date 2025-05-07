import { abi, contractAddress } from "./constants.js";

const connectBtn = document.getElementById("connectBtn");
const fundBtn = document.getElementById("fund");

connectBtn.onclick = connect;
fundBtn.onclick = fund;


async function connect(params) {
    if(typeof window.ethereum !== "undefined") {
    await window.ethereum.request({method: "eth_requestAccounts"});
    console.log("Connected");
    connectBtn.innerHTML="Connected";
  } else {
    fundBtn.innerHTML="Please install metamask!"; 
  }
}

console.log("Ether",ethers);

async function fund() {
     const ethAmount = "0.01";
     console.log(`Funding with ${ethAmount}`);

    
  if (typeof window.ethereum !== "undefined") {
    const provider = new window.ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionRes = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      await listenForTransationMine(transactionRes, provider);
      console.log("Done everything!");
    } catch (error) {
      console.log(error);
    }
  
  }
 }

 function listenForTransationMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`);
  return new Promise((resolve, reject) => {
      provider.once(transactionResponse.hash, (transactionReceipt) => {
          console.log(
              `Completed with ${transactionReceipt.confirmations} confirmations`
          );
          resolve();
      });
  });
}