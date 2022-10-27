import { TrayMesh } from "../meshes/TrayMesh";
import { TrayMaterial } from "../materials/tray/TrayMaterial";

export function Tray(props: JSX.IntrinsicElements["group"]) {
  return (
    <TrayMesh {...props}>
      <TrayMaterial />
    </TrayMesh>
  );
}
