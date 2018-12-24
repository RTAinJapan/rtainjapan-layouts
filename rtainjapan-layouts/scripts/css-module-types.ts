import child_process from 'child_process';

child_process.fork('./node_modules/.bin/tcm', ['-c', '-p', 'src/**/*.scss']);
