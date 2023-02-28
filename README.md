# Owlbear Rodeo Dice

Beautiful 3D dice extension for d20 based systems

![Example](/docs/header.jpg)

## Installing

The extension can be installed from the [store page](https://extensions.owlbear.rodeo/dice).

## How it Works

This project uses [React](https://reactjs.org/) for UI, [Three.js](https://threejs.org/) for rendering and [Rapier](https://rapier.rs/) for physics.

The physics simulation is used to both generate the animation for the roll as well as the final roll values.

> Wait is it really random if physics is used to determine the result? How do I know the dice rolls are fair?

Short answer yes, the dice are fair. Long answer [here's a statistical analysis](https://blog.owlbear.rodeo/are-owlbear-rodeos-dice-fair/) of the rolling methodology.

In order to sync rolls over the network efficiently we rely on the fact the Rapier is a deterministic physics engine. This means that across two different computers we'll get the same result given the same initial parameters.

So we only need to make sure that all the initial parameters are synced and then each client can run its own simulation and end up with the correct animation.

To try out the dice roller outside of Owlbear Rodeo you can head to <https://dice.owlbear.rodeo/>.

## Building

This project uses [Yarn](https://yarnpkg.com/) as a package manager.

To install all the dependencies run:

`yarn`

To run in a development mode run:

`yarn dev`

To make a production build run:

`yarn build`

## Project Structure

All source files can be found in the `src` folder.

If you'd like to create a new dice set with the existing dice styles edit the `diceSets.ts` file in the `sets` folder.

If you'd like to add a new dice style the 3D models for the dice are split across four folders: `materials`, `meshes`, `colliders` and `previews`.

The `materials` folder contains the PBR materials for each dice style.

The `meshes` folder contains the 3D geometry used for the dice.

The `colliders` folder contains the simplified collider geometry for the dice.

The `previews` folder contains 2D image previews for each dice.

All the code specific for the Owlbear Rodeo extension is in the `plugin` folder.

## License

GNU GPLv3

## Contributing

This project is provided as an example of how to use the Owlbear Rodeo SDK. As such it is unlikely that we will accept pull requests for new features.

Instead we encourage you to fork this repository and build the dice roller of your dreams.

Copyright (C) 2023 Owlbear Rodeo
