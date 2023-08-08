async function loadContractAddress() {
    const response = await fetch("contractAddress.json");
    const data = await response.json();
    return data.contractAddress;
}

async function loadContractABI() {
    const response = await fetch("test_contract_abi.json");
    const abi = await response.json();
    return abi;
}

document.addEventListener("DOMContentLoaded", async () => {
    const contractAddress = await loadContractAddress();
    const contractABI = await loadContractABI();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    let contract;

    document.getElementById("loginBtn").addEventListener("click", async () => {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const signer = provider.getSigner();
            contract = new ethers.Contract(contractAddress, contractABI, signer);

            // 5つのクーポン残高フォームを生成
            const balanceContainer = document.getElementById("balanceForms");
            for (let i = 0; i < 5; i++) {
                const input = document.createElement("input");
                input.addEventListener("input", async (e) => {
                    const balance = await contract.getBalance(e.target.value);
                    e.target.nextSibling.textContent = `Balance: ${balance.toString()}`;
                });
                const span = document.createElement("span");
                balanceContainer.appendChild(input);
                balanceContainer.appendChild(span);
            }

            document.getElementById("loginBtn").style.display = "none";
            document.getElementById("dashboard").style.display = "block";
        } catch (error) {
            console.error("Login failed:", error.message);
        }
    });

    document.getElementById("sendBtn").addEventListener("click", async () => {
        const to = document.getElementById("toAddress").value;
        const amount = document.getElementById("amount").value;
        try {
            await contract.transfer(to, amount);
            alert("Transfer Successful");
        } catch (error) {
            alert("Transfer failed:", error.message);
        }
    });

    document.getElementById("logoutBtn").addEventListener("click", () => {
        contract = null;
        document.getElementById("loginBtn").style.display = "block";
        document.getElementById("dashboard").style.display = "none";
    });
});
