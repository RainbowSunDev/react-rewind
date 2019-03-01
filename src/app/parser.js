const esprima = require('esprima');
const fs = require('fs');
const estraverse = require('estraverse');
const escodegen = require('escodegen');
const path = require('path');
const _ = require('lodash');

// react files
const useReducerfile = '/node_modules/react/cjs/react.development.js';
const commitAllHostEffectsfile = '/node_modules/react-dom/cjs/react-dom.development.js';

// generated file names
const genReactDev = 'generatedReact.development.js';
const genReactDom = 'generatedReact-dom.development.js';

// convert file to string and parse
function parseFile(file) {
  const dir = path.join(__dirname, file);
  const fileString = fs.readFileSync(dir, { encoding: 'utf-8' });
  const ast = esprima.parseModule(fileString);
  return ast;
}
// declare functions to insert
// TODO: Un-comment timeTravelTracker
function useReducerReplacement() {
  let dispatcher = resolveDispatcher();
  function reducerWithTracker(state, action) {
    const newState = reducer(state, action);
    //  timeTravelTracker[timeTravelTracker.length - 1].actionDispatched = true;
    window.postMessage({
      type: 'DISPATCH',
      data: {
        state: newState,
        action,
      },
    });
    return newState;
  }
  return dispatcher.useReducer(reducerWithTracker, initialArg, init);
}
function commitAllHostEffectsReplacement() {
  while (nextEffect !== null) {
    {
      setCurrentFiber(nextEffect);
    }
    recordEffect();

    var effectTag = nextEffect.effectTag;

    if (effectTag & ContentReset) {
      commitResetTextContent(nextEffect);
    }

    if (effectTag & Ref) {
      var current$$1 = nextEffect.alternate;
      if (current$$1 !== null) {
        commitDetachRef(current$$1);
      }
    }

    // The following switch statement is only concerned about placement,
    // updates, and deletions. To avoid needing to add a case for every
    // possible bitmap value, we remove the secondary effects from the
    // effect tag and switch on that value.
    var primaryEffectTag = effectTag & (Placement | Update | Deletion);
    switch (primaryEffectTag) {
      case Placement:
        {
          //editbyme
          window.postMessage({
            type: 'EFFECT',
            data: {
              primaryEffectTag: 'PLACEMENT',
              effect: _.cloneDeep(nextEffect)
            }
          });
          
          commitPlacement(nextEffect);
          // Clear the "placement" from effect tag so that we know that this is inserted, before
          // any life-cycles like componentDidMount gets called.
          // TODO: findDOMNode doesn't rely on this any more but isMounted
          // does and isMounted is deprecated anyway so we should be able
          // to kill this.
          nextEffect.effectTag &= ~Placement;
          break;
        }
      case PlacementAndUpdate:
        {
          // Placement
          commitPlacement(nextEffect);
          // Clear the "placement" from effect tag so that we know that this is inserted, before
          // any life-cycles like componentDidMount gets called.
          nextEffect.effectTag &= ~Placement;

          // Update
          var _current = nextEffect.alternate;
          commitWork(_current, nextEffect);
          break;
        }
      case Update:
        {
          //editbyme
          window.postMessage({
            type: 'EFFECT',
            data: {
              primaryEffectTag: 'UPDATE',
              effect: _.cloneDeep(nextEffect),
              current: _.cloneDeep(nextEffect.alternate),
            },
          });

          var _current2 = nextEffect.alternate;
          commitWork(_current2, nextEffect);
          break;
        }
      case Deletion:
        {
          //editbyme
          window.postMessage({
            type: 'EFFECT',
            data: {
              primaryEffectTag: 'DELETION',
              effect: _.cloneDeep(nextEffect),
            },
          });

          commitDeletion(nextEffect);
          break;
        }
    }
    nextEffect = nextEffect.nextEffect;
  }

  {
    resetCurrentFiber();
  }
}

// traverse ast to find method and replace body with our node's body
function traverseTree(replacementNode, functionName, ast) {
  estraverse.replace(ast, {
    enter(node) {
      if (node.type === 'FunctionDeclaration') {
        if (node.id.name === functionName) {
          node.body = replacementNode.body[0].body;
        }
      }
    },
  });
}

function generateFile(filename, ast) {
  const code = escodegen.generate(ast);
  fs.writeFileSync(filename, code, (err) => {
    if (err) throw new Error(err.message);
  });
}

const parseAndGenerate = () => {
  // first file
  let ast = parseFile(useReducerfile);
  const injectableUseReducer = esprima.parseScript(useReducerReplacement.toString());
  traverseTree(injectableUseReducer, 'useReducer', ast);
  generateFile(genReactDev, ast);
  // second file
  ast = parseFile(commitAllHostEffectsfile);
  const injectableCommitAllHostEffects = esprima.parseScript(commitAllHostEffectsReplacement.toString());
  traverseTree(injectableCommitAllHostEffects, 'commitAllHostEffects', ast);
  generateFile(genReactDom, ast);
};

module.exports = parseAndGenerate;
