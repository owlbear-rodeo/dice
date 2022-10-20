import { useTexture } from "@react-three/drei";

import { TrayMesh } from "../meshes/TrayMesh";

import albedo from "./albedo.jpg";
import orm from "./orm.jpg";
import normal from "./normal.jpg";
import { gltfTexture } from "../helpers/gltfTexture";

export function Tray(props: JSX.IntrinsicElements["group"]) {
  const [albedoMap, ormMap, normalMap] = useTexture(
    [albedo, orm, normal],
    (textures) => gltfTexture(textures, ["SRGB", "LINEAR", "LINEAR"])
  );
  return (
    <TrayMesh
      materialProps={{
        map: albedoMap,
        aoMap: ormMap,
        roughnessMap: ormMap,
        metalnessMap: ormMap,
        normalMap,
      }}
      {...props}
    />
  );
}
