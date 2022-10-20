import { useTexture } from "@react-three/drei";

import albedo from "./albedo.jpg";
import orm from "./orm.jpg";
import normal from "./normal.jpg";
import { gltfTexture } from "../../helpers/gltfTexture";

export function WalnutMaterial(
  props: JSX.IntrinsicElements["meshStandardMaterial"]
) {
  const [albedoMap, ormMap, normalMap] = useTexture(
    [albedo, orm, normal],
    (textures) => gltfTexture(textures, ["SRGB", "LINEAR", "LINEAR"])
  );

  return (
    <meshStandardMaterial
      map={albedoMap}
      aoMap={ormMap}
      roughnessMap={ormMap}
      metalnessMap={ormMap}
      normalMap={normalMap}
      {...props}
    />
  );
}
