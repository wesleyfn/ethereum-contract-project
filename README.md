# Projeto de Blockchain
Este projeto tem como objetivo realizar experimentações com a linguagem solidity, bem como o hardhat para realizar a construção de smart contracts além de fazer o deploy na rede local para possíveis testes e modificações.
O projeto tem como objetivo a inserção de diplomas de graduação na rede blockchain. 
Através de algumas informações do aluno cadastradas pela instituição, será gerado um hash, esse hash será enviado para a blockchain e será associado a uma chave do aluno que solicitou o documento.

Para executar o projeto serão necessários dois terminais, no primeiro realize a compilação dos contratos com o seguinte comando:
```shell
npx hardhat compile
```
Ao compilar o projeto será disponibilizado o abi para a interação com o contrato da UI, o caminho é:
![exemplo-blockchain](https://github.com/user-attachments/assets/ce75b947-f45e-4e7f-b626-b9acef7067e2)

copie e cole o abi no código da interface como um array:

![image](https://github.com/user-attachments/assets/abbb6f80-6229-4606-a0d3-f9c422761d7a)

E em seguida utilize o comando a seguir para criar várias carteiras ficticias:
```shell
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```
Agora no outro terminal utilize esse comando para realizar o deploy do contrato na rede local:
```shell
npx hardhat ignition deploy ./ignition/modules/Degree.js --network localhost
```
Ao final do comando será exibido uma tela dessa com algumas informações, dentre elas é o address, ele será importante para a criação do contrato com o web3:

![image](https://github.com/user-attachments/assets/1075f106-6570-4e64-a1c4-0913e545ad92)


## Configuração no MetaMask

Para configurar o MetaMask para se conectar à rede local, siga os passos abaixo:

1. Abra o MetaMask e clique no ícone do perfil no canto superior direito.
2. Selecione "Configurações" no menu.
3. Clique em "Redes" e depois em "Adicionar rede".
4. Preencha os campos com as seguintes informações:
    - **Nome da rede**: Localhost 8545
    - **Nova URL RPC**: http://localhost:8545
    - **ID da cadeia**: 1337
    - **Símbolo da moeda**: ETH
    - **URL do explorador de blocos**: (deixe em branco)
5. Clique em "Salvar".

Agora, o MetaMask está configurado para se conectar à sua rede local Hardhat. Certifique-se de que o Hardhat está rodando com o comando `npx hardhat node` antes de tentar se conectar.

### Contas no MetaMask

Crie contas fictícias no MetaMask para interagir com a rede local. Você pode importar as chaves privadas das contas geradas pelo Hardhat. Para isso, siga os passos abaixo:
- No MetaMask, clique no ícone do perfil no canto superior direito.
- Selecione "Importar conta" no menu.
- Cole a chave privada de uma das contas geradas pelo Hardhat e clique em "Importar".


> **Atenção!** Utilizei a extensão Live Server para executar o front end

