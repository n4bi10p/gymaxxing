const { withAppBuildGradle } = require('@expo/config-plugins');

/** Signs release APKs when CI provides GYMAXXING_RELEASE_* Gradle properties. */
function withReleaseSigning(config) {
  return withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents;
    if (contents.includes('GYMAXXING_RELEASE_STORE_FILE')) return config;
    contents = contents.replace(
      'signingConfigs {',
      `signingConfigs {
        release {
            if (project.hasProperty('GYMAXXING_RELEASE_STORE_FILE')) {
                storeFile file(GYMAXXING_RELEASE_STORE_FILE)
                storePassword GYMAXXING_RELEASE_STORE_PASSWORD
                keyAlias GYMAXXING_RELEASE_KEY_ALIAS
                keyPassword GYMAXXING_RELEASE_KEY_PASSWORD
            }
        }`,
    );
    contents = contents.replace(
      'signingConfig signingConfigs.debug',
      "signingConfig project.hasProperty('GYMAXXING_RELEASE_STORE_FILE') ? signingConfigs.release : signingConfigs.debug",
    );
    config.modResults.contents = contents;
    return config;
  });
}

module.exports = withReleaseSigning;
