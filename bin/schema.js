#!/usr/bin/env node

require('./../boot').then(function () {
  const command = sys.get('core/Command');

  if (!command.hasDependencies('database')) return;

  const args = command.args(':operation');

  if (args === null) return;

  switch (args.operation) {
    case 'update':
      const service = sys.get(':database/services/DatabaseService');

      service.updateSchema()
        .then(() => {
          console.log('SUCCESS: Schema Updated');
          process.exit();
        })
        .catch(() => {
          console.error('ERROR: Schema not updated');
          process.exit();
        });
  }
});
