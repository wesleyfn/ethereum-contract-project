// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

contract DegreeStorage {
    struct Degree {
        bytes32 degreeHash;
        address to;
    }

    mapping(address => Degree[]) public degrees;

    event DegreeSubmitted(address indexed from, address indexed to, bytes32 degreeHash);
    event DegreeDeleted(address indexed to, bytes32 degreeHash);

    function submitDegree(bytes32 _degreeHash, address _to) public {
        degrees[_to].push(Degree(_degreeHash, _to));            
        emit DegreeSubmitted(msg.sender, _to, _degreeHash);
    }

    // Retorna todos os diplomas de um endereco
    function getDegrees(address _to) public view returns (Degree[] memory) {
        return degrees[_to];
    }

    function deleteDegree(address _to, uint index) public {
        require(index < degrees[_to].length, "Index out of bounds");
        bytes32 degreeHash = degrees[_to][index].degreeHash;

        // Move o ultimo elemento para a posicao do elemento a ser deletado
        degrees[_to][index] = degrees[_to][degrees[_to].length - 1];
        degrees[_to].pop();

        emit DegreeDeleted(_to, degreeHash);
    }
}
