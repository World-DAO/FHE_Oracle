module fhe_sui::verification;

use sui::groth16;

public fun verify_groth16_proof(
    verifying_key: vector<u8>,
    proof: vector<u8>,
    public_inputs: vector<u8>
) {
    let pvk = groth16::prepare_verifying_key(&groth16::bn254(), &verifying_key);
    let proof_points = groth16::proof_points_from_bytes(proof);
    let inputs = groth16::public_proof_inputs_from_bytes(public_inputs);

    assert!(
        groth16::verify_groth16_proof(
            &groth16::bn254(),
            &pvk,
            &inputs,
            &proof_points
        )
    );
}