const Pattern = require('url-pattern');

module.exports = class Command {

  args(pattern) {
    const argv = process.argv.slice(2);
    const matcher = new Pattern(pattern, {
      segmentNameCharset: 'a-zA-Z0-9.',
      segmentValueCharset: 'a-zA-Z0-9-_~ %.',
    });

    const args = matcher.match(argv.join('/'));

    if (args === null) {
      console.error('ERROR: Incorrect arguments');
      console.log('Usage: ' + process.argv[1] + ' ' + pattern.split('/').join(' ').replace(/(\( )/g, ' <').replace(/\)/g, '>'));
      return null;
    }
    return args;
  }

  hasDependencies(...args) {
    let result = true;
    const extensions = sys.get('core/ExtensionManager');

    for (const ext of args) {
      const info = extensions.getInfo(ext);

      if (info === null) {
        console.error('ERROR: Extension "' + ext + '" not found!');
        result = false;
      } else if (!info.enabled) {
        console.error('ERROR: Extension "' + ext + '" is not enabled!');
        result = false;
      }
    }
    return result;
  }

}
