#!/usr/bin/env node

require('./../boot').then(function () {
  const engine = sys.get('core/TemplateEngine');

  engine.clear();
  engine.compile();
});
