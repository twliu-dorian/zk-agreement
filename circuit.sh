#!/bin/bash

circom circuits/evaluator.circom --r1cs --wasm
snarkjs powersoftau new bn128 12 ceremony_0000.ptua
snarkjs powersoftau contribute ceremony_0000.ptua ceremony_0001.ptau
snarkjs powersoftau contribute ceremony_0001.ptua ceremony_0002.ptau
snarkjs powersoftau contribute ceremony_0002.ptua ceremony_0003.ptua

snarkjs powersoftau prepare phase2 ceremony_0003.ptua ceremony_final.ptua
snarkjs powersoftau verify ceremony_final.ptua
snarkjs groth16 setup evaluator.r1cs ceremony_final.ptua setup_0000.zkey
snarkjs zkey contribute setup_0000.zkey setup_final.zkey
snarkjs zkey verify evaluator.r1cs ceremony_final.ptua setup_final.zkey

snarkjs zkey export verificationkey setup_final.zkey verification_key.json
snarkjs groth16 fullprove evaluator_js/input.json evaluator_js/evaluator.wasm setup_final.zkey proof.json public.json
snarkjs groth16 verify verification_key.json public.json proof.json
snarkjs zkey export soliditycalldata public.json proof.json

snarkjs zkey export solidityverifier setup_final.zkey contracts/Verifier.sol

## some randon numbers
104443005600468911244242568449370725967937207457628891404303681777082362571812
73310854147604155407371767068424340576196814722141124013753210994047862083940
47461430697488643507630860985895326572012905078387133721842165795406221633096
32704539094462184266567255440019373316024710172598492800484506882918590492502
19231983537552267805528347670730803018505102068835585639963549473375085991031
17447161820983434848709233622700873806870454294070752784052164079524978653197
33622395461426444162533029551801008584575479242736785450013085739431612551492
98918540128446593465927341181774708792147838358141851961617790906921088484257
94119302185673615621433303092863017996249719132323896447442506452195814131022
47796257568382089010094263828069581062474886158542139372458846447856781999187
65720271064979685373407749214833103409113315465895009169556528350660294406398
100182511168898724997194506482682762183441154657128961415836852300961839020917
110896914427861430695011196839889610074769664086916463695464547371569090534613
96287795725617053908826969618997739796282389244096516603003964860838556221152
31059478855638491646595472435072273552229996721010859784201566153373833690749
73429627218476782633660606151622827912944043843907989474975392170485460446359
114397466141645280937015012010137881782686049417189620801428333405339956163095
102330067719948297086812017808505237474905652497927008980862179410866132335795
36037043642361793417444779701283157404722211966529933233615866920085835164503
106662578757714914002531368641254302020951521984030832286054714591976626674390
