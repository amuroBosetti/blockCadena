const block = require('./app.js')
const assert = require('assert');

// SETUP
let chain = [block.generateGenesisBlock()];

const testData = {
  sender:   "ks829fh28192j28d9dk9",
  receiver: "ads8d91w29jsm2822910",
  amount:   0.0023,
  currency: "BTC"
}

//TESTS

test();

function test(){
  describe('generateGenesisBlock() test', function() {
      it('The Genesis Block has a previousHash of 0', function(){
        assert(block.generateGenesisBlock().previousHash === "0");
      });
  });

  describe('addBlock() test', function() {
    it('The hash obtained is valid', function() {
      this.timeout(0);
      assert(block.addBlock(chain, testData)[1].hash.substr(0, 4) === "0".repeat(4));
    })
    it('The new chain is valid', function(){
      this.timeout(0);
      assert(block.validateChain(block.addBlock(chain, testData)));
    })
  })
}
