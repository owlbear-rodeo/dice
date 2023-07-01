import * as THREE from "three";

type Encoding = "LINEAR" | "SRGB";

/**
 * Setup a THREE.js texture to work with a GLTF model
 * @param textures Input textures
 * @param encodings Texture encodings
 *
 * @example <caption>Usage with `@react-three/drei` `useTexture`</caption>
 *  const [albedoMap, ormMap, normalMap] = useTexture(
 *    [albedo, orm, normal],
 *    (textures) => gltfTexture(textures, ["SRGB", "LINEAR", "LINEAR"])
 *  );
 */
export function gltfTexture(
  textures: THREE.Texture | THREE.Texture[],
  encodings: Encoding | Encoding[]
) {
  if (Array.isArray(textures) && Array.isArray(encodings)) {
    if (textures.length !== encodings.length) {
      throw Error("Textures and encodings must have the same length");
    }
    for (let i = 0; i < textures.length; i++) {
      const texture = textures[i];
      const encoding = encodings[i];
      texture.flipY = false;
      texture.colorSpace =
        encoding === "SRGB" ? THREE.SRGBColorSpace : THREE.LinearSRGBColorSpace;
    }
  } else if (Array.isArray(textures) || Array.isArray(encodings)) {
    throw Error("Textures and encodings must match types");
  } else {
    textures.flipY = false;
    textures.colorSpace =
      encodings === "SRGB" ? THREE.SRGBColorSpace : THREE.LinearSRGBColorSpace;
  }
}
