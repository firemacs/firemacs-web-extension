import constants from './constants';
import Storage from './storage';
import logger from './logger';

function initialize([ store ]) {
    let activeKeymap = null;

    // Keymap initialization logic
    store.get('keymap')
        .then((result) => {
            if (typeof result === 'object') {
                logger.info('Loaded existing keymap');
                return result;
            } else {
                logger.info('No existing keymap; installing default');
                return store.set('keymap', constants.defaultKeymap);
            };
        })
        .then((keymap) => {
            logger.info('Activating keymap', keymap);
            return (activeKeymap = keymap);
        })
    // Any other initialization would happen here
        .then(() => logger.info('Firemacs is good to go!'))
        .catch(err => logger.error(err));
};

Promise.all([new Storage(constants.storageKey)])
    .then(initialize);
