import { abi, contractAddress } from "./constants.js";

const connectBtn = document.getElementById("connectBtn");
const fundBtn = document.getElementById("fund");
const balance = document.getElementById("getBalance");
const withdraw_ = document.getElementById("withdraw");
const balanceShow = document.getElementById("balanceShow");

connectBtn.onclick = connect;
fundBtn.onclick = fund;
balance.onclick = getBalance;
withdraw_.onclick = withdraw;


async function getBalance () {
  if(typeof window.ethereum !== "undefined") {
    const provider = new window.ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.utils.formatEther(balance));
    balanceShow.innerText = `Current Fund Balance Is: ${ethers.utils.formatEther(balance)} ETH`;
  } else {
    fundBtn.innerHTML="Please install metamask!"; 
  }
}

async function connect() {
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
     const ethAmount = document.getElementById("ethAmount").value;
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

 async function withdraw() {
   if(typeof window.ethereum != "undefined") {
    const provider = new window.ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    console.log("signer",signer);
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const transactionRes = await contract.withdraw();
      await listenForTransationMine(transactionRes, provider);
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