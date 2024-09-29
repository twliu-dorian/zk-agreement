pragma circom  2.0.0;

include "./utils/mimc5sponge.circom";
include "./commitment_generator.circom";

template Evaluator(){
    signal input nullifierHash;
    signal input commitment;
    
    // Merkle proofs
    signal input root;
    signal input hashPairings[10];
    signal input hashDirections[10];
    
    // public inputs
    signal input buyer; // party A
    signal input seller; // party B
    signal input ratio; // ratio computed from mpc circuit
    // signal input value; 
    signal input evaluator[256];
    
   

    // checking merkle tree hash path
    component leafHashers[10];

    signal currentHash[10 + 1];
    currentHash[0] <== commitment;

    signal left[10];
    signal right[10];

    for(var i = 0; i < 10; i++){
        var d = hashDirections[i];

        leafHashers[i] = MiMC5Sponge(2);

        left[i] <== (1 - d) * currentHash[i];
        leafHashers[i].ins[0] <== left[i] + d * hashPairings[i];

        right[i] <== d * currentHash[i];
        leafHashers[i].ins[1] <== right[i] + (1 - d) * hashPairings[i];

        // leafHashers[i].k <== agreement.commitment;
        leafHashers[i].k <== commitment;
        currentHash[i + 1] <== leafHashers[i].o;
    }

    root === currentHash[10];

    // constraining signals
    signal buyerConstraint <== buyer * buyer;
    signal sellerConstraint <==  seller * seller;
    signal ratioConstraint <== ratio * ratio;
    // signal valueConstraint <== value * value;
    
    signal evaluatorConstraint[256];
    for (var i = 0; i < 256; i++) {
        evaluatorConstraint[i] <== evaluator[i] * evaluator[i];
    }
}

component main {public [root, nullifierHash, buyer, seller, ratio]} = Evaluator();
