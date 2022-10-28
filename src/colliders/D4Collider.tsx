import { ConvexHullCollider } from "@react-three/rapier";

const vertices = [
  0.0, -0.635828, -1.269768, 0.0, 1.159624, 0.0, 1.099651, -0.635829, 0.634884,
  -1.099651, -0.635829, 0.634884,
].map((n) => n / 10);

export function D4Collider() {
  return <ConvexHullCollider args={[vertices]} />;
}
