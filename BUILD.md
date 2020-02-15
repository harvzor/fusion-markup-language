# Building

Use drone.io to build.

## Building locally

You'll need to install the Drone CLI:

https://docs.drone.io/cli/install/

Then run this simple cmd in this repo root:

```
$ drone exec
[test:0] + npm install
[test:1] npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@2.1.2 (node_modules/fsevents):
[test:2] npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@2.1.2: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})
[test:3]
[test:4] audited 236 packages in 1.957s
...
```
