/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  ignoredRouteFiles: [".*"],
  appDirectory: "app",
  assetsBuildDirectory: "public/dist",
  serverBuildPath: "dist/index.js",
  publicPath: "/dist/",
};
