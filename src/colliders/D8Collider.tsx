import { ConvexHullCollider } from "@react-three/rapier";

const vertices = [
  -1.371878, 0.0, 0.0, 0.0, -1.371878, 0.0, 0.0, 1.371878, 0.0, 0.0, 0.0,
  1.371878, 1.371878, 0.0, 0.0, 0.0, 0.0, -1.371878,
].map((n) => n / 10);

export function D8Collider() {
  return <ConvexHullCollider args={[vertices]} />;
}
