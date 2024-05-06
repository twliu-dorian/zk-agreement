#!/bin/bash

circom circuits/evaluator.circom --r1cs --wasm
snarkjs powersoftau new bn128 12 ceremony_0000.ptua
snarkjs powersoftau contribute ceremony_0001.ptua ceremony_0002.ptau
snarkjs powersoftau contribute ceremony_0002.ptua ceremony_0003.ptua
snarkjs powersoftau prepare phase2 ceremony_0003.ptua ceremony_final.ptua
snarkjs powersoftau verify ceremony_final.ptua
snarkjs groth16 setup evaluator.r1cs ceremony_final.ptua setup_0000.zkey
snarkjs zkey contribute setup_0000.zkey setup_final.zkey
snarkjs zkey verify evaluator.r1cs ceremony_final.ptua setup_final.zkey
snarkjs zkey export solidityverifier setup_final.zkey contracts/Evaluator.sol

snarkjs zkey export verificationkey setup_final.zkey verification_key.json
snarkjs groth16 fullprove evaluator_js/input.json evaluator_js/evaluator.wasm setup_final.zkey proof.json public.json
snarkjs zkey export solidityverifier setup_final.zkey contracts/Verifier.sol
snarkjs zkey export soliditycalldata public.json proof.json
