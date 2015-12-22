/**
 * Pterodactyl Daemon
 * Copyright (c) 2015 Dane Everitt <dane@daneeveritt.com>
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
const rfr = require('rfr');

const LoadConfig = rfr('lib/helpers/config.js');
const Log = rfr('lib/helpers/logger.js');
const Restify = require('restify');
const BuilderController = rfr('lib/controllers/builder.js');

const Config = new LoadConfig();

const Server = Restify.createServer({
    name: 'Pterodactyl Daemon',
});

Server.use(Restify.bodyParser());

Server.on('uncaughtException', function (req, res, route, err) {
    Log.fatal({ path: route.spec.path, method: route.spec.method }, err.stack);
    return res.send(500);
});

Server.get('/', function (req, res) {
    res.send('Hello World.');
});

Server.post('/server/new', function (req, res) {
    const Builder = new BuilderController(req.params);
    Builder.init(function (err) {
        if (err) {
            Log.error(err, 'An error occured while attempting to initalize a new server.');
            return res.send(500);
        }
        return res.send(204);
    });
});

Server.listen(Config.get('web.listen', 8080), function listen() {
    Log.info('Webserver listening on 0.0.0.0:8080');
});