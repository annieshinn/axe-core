const axe = require('axe-core');
const regeneratorRuntime = require('regenerator-runtime');

const path = require('path');
const fs = require('fs');
const html = fs.readFileSync(path.resolve(__dirname, './index2.html'), 'utf8');

describe('Evaluate axe-core violations', () => {
  it('html file has no axe violations', done => {
    // exclude tests that are incompatible
    const config = {
      rules: {
        'color-contrast': { enabled: false },
        'link-in-text-block': { enabled: false }
      }
    };

    // get language tag from imported html file and assign to jsdom document
    const langTag = html.match(/<html lang="(.*)"/);
    if (langTag) document.documentElement.lang = langTag[1];
    document.documentElement.innerHTML = html.toString();

    axe.run(config, async (err, { violations }) => {
      if (err) {
        console.log('err: ', err);
        done();
      }

      if (violations.length === 0) {
        console.log('Congrats! Keep up the good work, you have 0 known violations!');
      } else {
        violations.forEach(axeViolation => {
          console.log('-------');
          const whereItFailed = axeViolation.nodes[0].html;
          // const failureSummary = axeViolation.nodes[0].failureSummary;
    
          const { description, help, helpUrl } = axeViolation;

          console.log('TEST DESCRIPTION: ', description,
            '\nISSUE: ', help,
            '\nMORE INFO: ', helpUrl,
            '\nWHERE IT FAILED: ', whereItFailed,
            // '\nhow to fix: ', failureSummary
          );
        });
      }

      expect(err).toBe(null);
      expect(violations).toHaveLength(0);
      done();
    });
  });
});
