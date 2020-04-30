const joinSpace = require('../joinSpace');
const forEach = require('../forEach');
const AGENTS = [
  'linux', 'mozilla', 'firefox', 'opera', 'trident', 'edge',
  'chrome', 'ubuntu', 'chromium', 'safari', 'msie', 'WebKit', 'AppleWebKit',
  'mobile', 'ie', 'webtv', 'konqueror', 'blackberry', 'android', 'iron',
  'iphone', 'ipod', 'ipad', 'mac', 'darwin', 'windows', 'freebsd',
];

module.exports = (userAgent, output) => {
  userAgent = userAgent.toLowerCase();
  output = output || [];
  forEach(AGENTS, (userAgentName, name, version, matchs) => {
    matchs = (new RegExp('('
      + userAgentName.toLowerCase()
    + ')([/ ]([0-9_x]+))?', 'g')).exec(userAgent);
    matchs && (
      output.push(name = matchs[1].replace(' ', '_')),
      (version = matchs[3]) && output.push(name + '-' + version)
    );
  });
  return joinSpace(output);
};
