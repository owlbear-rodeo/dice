import * as THREE from "three";

// Set up the dice roll variables ahead of time to avoid re-creating the objects frequently
let meshPosition = new THREE.Vector3();
let locatorVector = new THREE.Vector3();
const up = new THREE.Vector3(0, 1, 0);
let highestDot = -1;
let dot = -1;
let highestNumber = 0;

/** Get the number facing up on a 3D dice group */
export function getValueFromDiceGroup(parent: THREE.Group): number {
  // Reset the order variables
  highestDot = -1;
  highestNumber = 0;

  const dice = parent.getObjectByName("dice");
  const mesh = dice?.children[0];
  const locators = mesh?.children;
  if (mesh && locators) {
    for (const locator of locators) {
      // Calculate the dot product between the locator direction and the world up vector
      // The highest dot product will be the locator facing the most up.
      mesh.getWorldPosition(meshPosition);
      locator.getWorldPosition(locatorVector);
      locatorVector.sub(meshPosition);
      locatorVector.normalize();
      dot = locatorVector.dot(up);
      if (dot > highestDot) {
        highestDot = dot;
        // Get the locator number by slicing the name and parsing it
        highestNumber = parseInt(locator.name.slice(12));
      }
    }
  }
  return highestNumber;
}
