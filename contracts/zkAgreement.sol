// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./MiMC5Sponge.sol";
import "./ReentrancyGuard.sol";

contract zkAgreement is ReentrancyGuard {
    Hasher hasher;
    uint public treeLevel = 10;
    uint256 public denomination = 1 ether;
    uint public nextLeafIdx = 0;

    mapping(uint256 => bool) public roots;
    mapping(uint8 => uint256) lastLevelHash;
    mapping(uint => bool) public nullifierHashes;
    mapping(uint256 => bool) public commitments;

    uint256[10] levelDefaults = [
        63771806957809309726317474227089898627135440676260389143578078221402337729597,
        26329784091809616525656596827869754057735600617732985836257533869889848689540,
        91812545750724120478049643735121533121180674247352352428571686173858273812548,
        37460817908076601381291603917636845998871678032835421649609720027002581164371,
        9627294466522009764250266663696874060400336828234707190076472738519008426653,
        13855014489163768114573979355157461109742526590910186847340523945768036922571,
        53905928342978876520984791451694802705133215706595604178784790255233737269703,
        87646555410478181956045998784285324128878755394746302981889809258235802684312,
        73382807414385780209502054336991662169384348553898491823190037666338086508945,
        55592519799874930900949387802369149234060515939655775391990208064877268637902
    ];

    event Agreement(
        uint256 root,
        uint256[10] hashPairings,
        uint8[10] pairDirection
    );
    constructor(address _hasher, address _verifier) {
        hasher = Hasher(_hasher);
        // verifier = _verifier;
    }

    function agreement(uint256 _commitment) external payable nonReentrant {
        require(!commitments[_commitment], "duplicate commitment hash");
        require(nextLeafIdx < 2 ** treeLevel, "the tree is full");
        uint256 newRoot;
        uint256[10] memory hashPairings;
        uint8[10] memory hashDirections;
        uint256 currentIdx = nextLeafIdx;
        uint256 currentHash = _commitment;

        uint256 left;
        uint256 right;
        uint256[2] memory ins;

        for (uint8 i = 0; i < treeLevel; i++) {
            if (currentIdx % 2 == 0) {
                left = currentHash;
                right = levelDefaults[i];
                hashPairings[i] = levelDefaults[i];
                hashDirections[i] = 0;
            } else {
                left = lastLevelHash[i];
                right = currentHash;
                hashPairings[i] = lastLevelHash[i];
                hashDirections[i] = 1;
            }
            lastLevelHash[i] = currentHash;

            ins[0] = left;
            ins[1] = right;

            uint256 h = hasher.MiMC5Sponge{gas: 150000}(ins, _commitment);

            currentHash = h;
            currentIdx = currentIdx / 2;
        }

        newRoot = currentHash;
        roots[newRoot] = true;
        nextLeafIdx += 1;

        commitments[_commitment] = true;
        emit Agreement(newRoot, hashPairings, hashDirections);
    }
}
