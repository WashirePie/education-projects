// credits to https://acjay.com/2019/04/19/an-epic-webpack-mystery/
const fixNedbForElectronRenderer = {
  apply(resolver) {
    resolver
      .getHook("beforeDescribed-relative")
      .tapAsync(
        "FixNedbForElectronRenderer",
        (request, resolveContext, callback) => {
          if (!request.descriptionFileData.name === "nedb") {
            return callback();
          }

          let relativePath;
          if (
            request.path.startsWith(
              resolver.join(request.descriptionFileRoot, "lib/storage")
            )
          ) {
            relativePath = "lib/storage.js";
          } else if (
            request.path.startsWith(
              resolver.join(request.descriptionFileRoot, "lib/customUtils")
            )
          ) {
            relativePath = "lib/customUtils.js";
          } else {
            return callback();
          }

          const path = resolver.join(request.descriptionFileRoot, relativePath);
          const newRequest = Object.assign({}, request, { path });
          callback(null, newRequest);
        }
      );
  }
};

// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.resolve
      .plugin("fixNedbForElectronRenderer")
      .use(fixNedbForElectronRenderer);
  },
  configureWebpack: {
    devtool: "source-map"
  },
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.ts',
      nodeIntegration: true
    }
  }
}
