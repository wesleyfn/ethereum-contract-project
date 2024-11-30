let userAddress;
const toastLive = document.getElementById('liveToast');
const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLive);

const CONTRACT_ADDRESS = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';

// Verifica login persistente
window.onload = () => {
    const storedData = localStorage.getItem('user');
    if (storedData) {
        const user = JSON.parse(storedData);
        userAddress = user.address;
        updateUIOnLogin(user.address);
    }
};

// Atualiza a interface após login
function updateUIOnLogin(address) {
    document.getElementById('connectButton').style.display = "none";
    document.getElementById('loginButton').style.display = "none";
    document.getElementById('dropdown').style.display = "block";
    document.getElementById('registerSection').style.display = "block";
    document.getElementById('address').textContent = address;
}

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
    toastBootstrap.show();
});

// Fazer Login com Assinatura
document.getElementById('loginButton').addEventListener('click', async () => {
    try {
        const nonce = `Login em ${new Date().toISOString()}`;
        const signature = await ethereum.request({
            method: 'personal_sign',
            params: [nonce, userAddress],
        });

        console.log("Assinatura:", signature);
        console.log("Chave pública:", userAddress);

        const userData = { address: userAddress, nonce, signature };
        localStorage.setItem('user', JSON.stringify(userData));
        updateUIOnLogin(userAddress);
        document.getElementById('notification').textContent = "Login bem-sucedido! Bem-vindo.";
    } catch (error) {
        console.error("Erro no login:", error);
        document.getElementById('notification').textContent = "Erro ao fazer login.";
    }
    toastBootstrap.show();
});

// Logout
document.getElementById('dropdownLogout').addEventListener('click', () => {
    localStorage.clear();
    document.getElementById('notification').textContent = "Você saiu do sistema.";
    toastBootstrap.show();
    document.getElementById('connectButton').style.display = "block";
    document.getElementById('dropdown').style.display = "none";
    document.getElementById('registerSection').style.display = "none";
});

// Copiar Assinatura para a área de transferência
document.getElementById('address').addEventListener('click', () => {
    const signatureText = document.getElementById('address').innerText;
    navigator.clipboard.writeText(signatureText).then(() => {
        document.getElementById('notification').innerText = "Endereço copiado!";
        toastBootstrap.show();
    }).catch(err => {
        console.error('Erro ao copiar texto: ', err);
    });
});

// Carregar contrato
async function loadContract(web3) {
    try {
        const response = await fetch('./artifacts/contracts/Degree.sol/DegreeStorage.json');
        const contractData = await response.json();
        const contractABI = contractData.abi;
        return new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);
    } catch (error) {
        console.error('Erro ao carregar o contrato:', error);
        return null;
    }
}

// Registrar diploma na blockchain
async function contractSubmitDegree(contract, hashedDegree, to) {
    try {
        const receipt = await contract.methods.submitDegree(hashedDegree, to).send({ from: userAddress });
        console.log('Transação enviada:', receipt);
        document.getElementById('notification').textContent = `Diploma registrado com sucesso!`;
        toastBootstrap.show();
    } catch (error) {
        console.error('Erro ao registrar diploma:', error);
        document.getElementById('notification').textContent = `Erro ao registrar diploma.`;
        toastBootstrap.show();
    }
}

// Verificar diploma na blockchain
async function contractVerifyDegree(contract, to) {
    try {
        const degrees = await contract.methods.getDegrees(to).call();
        console.log('Diplomas encontrados:', degrees);
        document.getElementById('notification').textContent = degrees.length > 0 ? `Diplomas verificados com sucesso!` : `Nenhum diploma encontrado.`;
        toastBootstrap.show();
    } catch (error) {
        console.error('Erro ao verificar diploma:', error);
        document.getElementById('notification').textContent = `Erro ao verificar diploma.`;
        toastBootstrap.show();
    }
}

// Registrar diploma na blockchain
document.getElementById('submitDegreeForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (typeof window.ethereum !== 'undefined') {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const web3 = new Web3(window.ethereum);

            // Carregar o contrato
            const contract = await loadContract(web3);
            if (!contract) {
                throw new Error('Contrato não carregado corretamente');
            }

            // Converter formulário para JSON e calcular o hash do diploma
            const formData = new FormData(event.target);
            const degree = Object.fromEntries(formData.entries());
            const hashedDegree = web3.utils.sha3(JSON.stringify(degree));
            const to = document.getElementById('studentAddress').value;
            const toAddress = web3.utils.toChecksumAddress(to);

            // Verifique se o contrato e os parâmetros estão corretos
            console.log("Contrato:", contract);
            console.log("Hashed Degree:", hashedDegree);
            console.log("From Address:", userAddress);
            console.log("To Address:", toAddress);

            // Enviar a transação
            await contractSubmitDegree(contract, hashedDegree, toAddress);
        } catch (error) {
            console.error('Erro ao registrar diploma:', error);
            document.getElementById('notification').textContent = `Erro ao registrar diploma: ${error.message}`;
            toastBootstrap.show();
        }
    } else {
        console.error('MetaMask não encontrado! Instale o MetaMask para continuar.');
        document.getElementById('notification').textContent = 'MetaMask não encontrado! Instale o MetaMask para continuar.';
        toastBootstrap.show();
    }
});

// Verificar diploma na blockchain
document.getElementById('verifyDegreeForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (typeof window.ethereum !== 'undefined') {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const web3 = new Web3(window.ethereum);
            const contract = await loadContract(web3);
            const studentAddress = document.getElementById('degreeHashInput').value;
            const toAddress = web3.utils.toChecksumAddress(studentAddress);
            await contractVerifyDegree(contract, toAddress);
        } catch (error) {
            console.error('Erro ao conectar ao MetaMask ou carregar o contrato:', error);
            document.getElementById('notification').textContent = `Erro ao verificar diploma: ${error.message}`;
            toastBootstrap.show();
        }
    } else {
        console.error('MetaMask não encontrado! Instale o MetaMask para continuar.');
        document.getElementById('notification').textContent = 'MetaMask não encontrado! Instale o MetaMask para continuar.';
        toastBootstrap.show();
    }
});