//Estandar que viene con el paquete crypto.js
const SHA256 = require("crypto-js/sha256");

//TESTING
test();

function test(){
  var chain = [generateGenesisBlock()];

  const newBlockData = {
    sender: "ks829fh28192j28d9dk9",
    receiver: "ads8d91w29jsm2822910",
    amount:   0.0023,
    currency: "BTC"
  }

  chain = addBlock(chain, newBlockData);
  console.log(validateChain(chain));

  chain[1].hash = "123";
  console.log(validateChain(chain));

}


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
function updateHash(block) {
  return {
    ...block,
    hash: calculateHash(block)
  }
}

function mineBlock(difficulty, block) {
  function mine(block){
    const newBlock = nextNonce(block);
    return checkDifficulty(difficulty, newBlock.hash)
           ? newBlock
           : () => mine(nextNonce(block)); //esto retorna funciones anonimas, que trampoline va a ir ejecutando
  }
  return trampoline(() => mine(nextNonce(block)));
}

//Agrega un bloque a una cadena
function addBlock(chain, data) {
  const {hash: previousHash} = chain[chain.length - 1];
  const block        = { timestamp: + new Date(), data, previousHash, nonce: 0 };
  const newBlock     = mineBlock(4, block);
  return chain.concat(newBlock);
}

//Validar toda la cadena
function validateChain(chain) {
  function validate(chain, index) {
    if(index === 0) return true;
    const { hash, ...currentBlockWithoutHash } = chain[index];
    const currentBlock                         = chain[index];
    const previousBlock                        = chain[index - 1];
    const isValidHash                          = (hash === calculateHash(currentBlockWithoutHash));
    const isPreviousHashValid                  = (currentBlock.previousHash === previousBlock.hash);
    const isValidChain                         = (isValidHash && isPreviousHashValid);

    if(!isValidChain) return false;
    else return () => validate(chain, index - 1)
  }
  return trampoline(() => validate(chain, chain.length - 1));
}

//Trampolin para evitar problemas de memoria al hacer recursión
function trampoline(func) {
  let result = func.apply(func, ...arguments);
  while(result && typeof(result) === "function") {
    result = result();
  }
  return result;
}
