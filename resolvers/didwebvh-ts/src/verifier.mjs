/**
 * Default Ed25519 verifier for `resolveDID` (DataIntegrityProof / eddsa-jcs-2022).
 * didwebvh-ts calls `verifier.verify(signature, message, publicKey)` with a raw
 * 32-byte Ed25519 public key (multibase payload after the 0xed01 prefix).
 */
import { verify as ed25519Verify } from '@stablelib/ed25519';

export const ed25519Verifier = {
  /**
   * @param {Uint8Array} signature
   * @param {Uint8Array} message
   * @param {Uint8Array} publicKey
   */
  async verify(signature, message, publicKey) {
    try {
      return ed25519Verify(publicKey, message, signature);
    } catch {
      return false;
    }
  },
};
