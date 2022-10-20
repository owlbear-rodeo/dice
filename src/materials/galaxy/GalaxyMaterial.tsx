import { useTexture } from "@react-three/drei";

import albedo from "./albedo.jpg";
import orm from "./orm.jpg";
import normal from "./normal.jpg";
import { gltfTexture } from "../../helpers/gltfTexture";

export function GalaxyMaterial(
  props: JSX.IntrinsicElements["meshPhysicalMaterial"]
) {
  const [albedoMap, ormMap, normalMap] = useTexture(
    [albedo, orm, normal],
    (textures) => gltfTexture(textures, ["SRGB", "LINEAR", "LINEAR"])
  );

  return (
    <meshPhysicalMaterial
      map={albedoMap}
      aoMap={ormMap}
      metalnessMap={ormMap}
      roughnessMap={ormMap}
      normalMap={normalMap}
      clearcoat={1}
      clearcoatRoughness={0.3}
      {...props}
    />
  );
}
