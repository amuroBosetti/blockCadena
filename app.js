//Estandar que viene con el paquete crypto.js
const SHA256 = require("crypto-js/sha256");

console.log(generateGenesisBlock());

//Calcular el hash, teniendo un bloque
function calculateHash({previousHash, timestamp, data, nonce = 1}){
  return SHA256(previousHash + timestamp + JSON.stringify(data) + nonce).toString();
}

//Crear el bloque génesis
function generateGenesisBlock(){
  const block = {
    timestamp: + new Date(),
    data:       "Genesis block",
    previousHash: "0",
  };
  return {
    ...block,
    hash: calculateHash(block)
  }
}

//Checkear conformidad del hash. En este caso, siempre van a empezar con 0, repetido una cantidad variable de veces
function checkDifficulty(difficulty, hash){
  return hash.substr(0, difficulty) === "0".repeat(difficulty);
}

//Recalcular con otro nonce
function nextNonce(block){
  return updateHash({
    ...block,
    nonce: block.nonce + 1
  });
}

//Toma un bloque, y retorna el mismo bloque con una nueva version del hash
function updateHash() {
  return {
    ...block,
    hash: calculateHash(block);
  }
}
