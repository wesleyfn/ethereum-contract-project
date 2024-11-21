let userAddress;
const toastLive = document.getElementById('liveToast')
const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLive)

// Verifica login persistente
window.onload = () => {
    const storedData = localStorage.getItem('user');
    if (storedData) {
        document.getElementById('notification').textContent = `Bem-vindo de volta!`;
        toastBootstrap.show()
        document.getElementById('connectButton').style.display = "none";
        document.getElementById('loginButton').style.display = "none";
        document.getElementById('dropdown').style.display = "block";
    }
};

// Conectar ao MetaMask
document.getElementById('connectButton').addEventListener('click', async () => {
    if (window.ethereum) {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            userAddress = accounts[0];
            document.getElementById('notification').textContent = `Conectado com sucesso!`;
            document.getElementById('loginButton').style.display = 'block';
            document.getElementById('connectButton').style.display = 'none';
        } catch (error) {
            console.error("Erro ao conectar:", error);
            document.getElementById('notification').textContent = "Erro ao conectar ao MetaMask.";
        }
    } else {
        document.getElementById('notification').textContent = "MetaMask não detectado!";
    }
    toastBootstrap.show()
});

// Fazer Login com Assinatura
document.getElementById('loginButton').addEventListener('click', async () => {
    try {
        const nonce = `Login em ${new Date().toISOString()}`; // Desafio simples gerado no client-side

        // Solicitar assinatura do desafio
        const signature = await ethereum.request({
            method: 'personal_sign',
            params: [nonce, userAddress],
        });

        console.log("Assinatura:", signature);

        // Salvar os dados no localStorage
        const userData = { address: userAddress, nonce, signature };
        localStorage.setItem('user', JSON.stringify(userData));

        // Atualizar a interface
        document.getElementById('notification').textContent = "Login bem-sucedido! Bem-vindo.";
        document.getElementById('connectButton').style.display = "none";
        document.getElementById('loginButton').style.display = "none";
        document.getElementById('dropdown').style.display = "block";
    } catch (error) {
        console.error("Erro no login:", error);
        document.getElementById('notification').textContent = "Erro ao fazer login.";
    }
    toastBootstrap.show()
});

// Logout
document.getElementById('dropdownLogout').addEventListener('click', () => {
    localStorage.removeItem('user');
    document.getElementById('notification').textContent = "Você saiu do sistema.";
    toastBootstrap.show()
    document.getElementById('connectButton').style.display = "block";
    document.getElementById('dropdown').style.display = "none";
});

// Mostrar Assinatura em um modal
document.getElementById('dropdownSignature').addEventListener('click', () => {
    const storedData = localStorage.getItem('user');
    if (storedData) {
        const user = JSON.parse(storedData);
        document.getElementById('signature').textContent = user.signature;
    }
});

// Copiar Assinatura para a área de transferência
document.getElementById('signature').addEventListener('click', function() {
    var signatureText = document.getElementById('signature').innerText;
    var tempInput = document.createElement('textarea');

    tempInput.value = signatureText;
    document.body.appendChild(tempInput);
    tempInput.select();
    
    navigator.clipboard.writeText(tempInput.value).then(function() {
        document.getElementById('notification').innerText = "Assinatura copiada!";
        toastBootstrap.show()
    }).catch(function(err) {
        console.error('Erro ao copiar texto: ', err);
    });
    document.body.removeChild(tempInput);
});




/* 
async function registerAsset() {
    const assetName = document.getElementById("assetInput").value;
    const feedback = document.getElementById("feedback");

    if (window.ethereum) {
        if (typeof Web3 !== 'undefined') {
            const web3 = new Web3(window.ethereum);
            console.log("Web3.js está funcionando!", web3);
        } else {
            console.error("Web3.js não encontrado!");
        }

        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const contractAddress = "SEU_CONTRATO_ADDRESS";
        const contractABI = []; // Adicione o ABI do contrato dentro do array

        const contract = new web3.eth.Contract(contractABI, contractAddress);
        const accounts = await web3.eth.getAccounts();

        try {
            await contract.methods.registerAsset(assetName).send({ from: accounts[0] });
            feedback.innerHTML = "Ativo registrado com sucesso!";
        } catch (error) {
            feedback.innerHTML = "Erro ao registrar ativo: " + error.message;
        }
    } else {
        feedback.innerHTML = "MetaMask não detectado!";
    }
}
*/