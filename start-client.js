/* Script to let us start the client from its parent directory in a
 * cross-platform way (so that npm start can launch both the API server
 * and the Webpack development server).
 *
 * This script is copied from the FullStackReact demo available at
 * https://github.com/fullstackreact/food-lookup-demo */

const args = [ 'start' ];
const opts = { stdio: 'inherit', cwd: 'client', shell: true };
require('child_process').spawn('npm', args, opts);