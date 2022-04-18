const fs = require('fs')
const path = require('path')
const bump = require('standard-version/lib/lifecycles/bump')
const changelog = require('./changelog')
const latestSemverTag = require('standard-version/lib/latest-semver-tag')
const printError = require('standard-version/lib/print-error')
const { resolveUpdaterObjectFromArgument } = require('standard-version/lib/updaters')

module.exports = async function standardVersion (argv) {
  const defaults = require('standard-version/defaults')
  /**
   * `--message` (`-m`) support will be removed in the next major version.
   */
  const message = argv.m || argv.message
  if (message) {
    /**
     * The `--message` flag uses `%s` for version substitutions, we swap this
     * for the substitution defined in the config-spec for future-proofing upstream
     * handling.
     */
    argv.releaseCommitMessageFormat = message.replace(/%s/g, '{{currentTag}}')
    if (!argv.silent) {
      console.warn('[standard-version]: --message (-m) will be removed in the next major release. Use --releaseCommitMessageFormat.')
    }
  }

  if (argv.changelogHeader) {
    argv.header = argv.changelogHeader
    if (!argv.silent) {
      console.warn('[standard-version]: --changelogHeader will be removed in the next major release. Use --header.')
    }
  }

  if (argv.header && argv.header.search(changelog.START_OF_LAST_RELEASE_PATTERN) !== -1) {
    throw Error(`custom changelog header must not match ${changelog.START_OF_LAST_RELEASE_PATTERN}`)
  }

  /**
   * If an argument for `packageFiles` provided, we include it as a "default" `bumpFile`.
   */
  if (argv.packageFiles) {
    defaults.bumpFiles = defaults.bumpFiles.concat(argv.packageFiles)
  }

  const args = Object.assign({}, defaults, argv)
  let pkg
  for (const packageFile of args.packageFiles) {
    const updater = resolveUpdaterObjectFromArgument(packageFile)
    if (!updater) return
    const pkgPath = path.resolve(process.cwd(), updater.filename)
    try {
      const contents = fs.readFileSync(pkgPath, 'utf8')
      pkg = {
        version: updater.updater.readVersion(contents),
        private: typeof updater.updater.isPrivate === 'function' ? updater.updater.isPrivate(contents) : false
      }
      break
    } catch (err) {}
  }
  try {
    let version;
    if (pkg) {
      version = pkg.version;
    } else if (args.gitTagFallback) {
      version = await latestSemverTag(args.tagPrefix);
    } else {
      throw new Error('no package file found');
    }

    const newVersion = await bump(args, version);
    await changelog(args, newVersion);
  } catch (err) {
    printError(args, err.message);
    throw err;
  }
};