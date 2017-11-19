import { describe, it } from 'mocha';
import { expect } from 'chai';

import { kbd, translateSeq, translateKey, sortSeq, parseKeymap, lookupCommand, validate, KeySequenceError } from '../../src/lib/parse-utils.js';

describe('Keymap utilities', () => {
    describe('parseKeymap', () => {
        it('should translate a keymap def into a keymap tree', () => {
            const mockKeymap = {
                'mock1': ['C-m'],
                'mock2': ['C-x C-c']
            };
            const expectedTree = {
                Control: {
                    m: 'mock1',
                    x: {
                        Control: {
                            c: 'mock2'
                        }
                    }
                }
            };

            expect(parseKeymap(mockKeymap))
                .to.deep.equal(expectedTree);
        });

        it('should throw when told to treat a non-prefix key as a prefix', () => {
            const mockKeymap = {
                'mock1': ['C-m'],
                'mock2': ['C-m x']
            };

            expect(() => parseKeymap(mockKeymap))
                .to.throw('append to a non-prefix');
        });
    });

    describe('lookupCommand', () => {
        const map = parseKeymap({
            'mock1': ['C-m'],
            'mock2': ['C-x C-c']
        });

        it('should find a shallow command that exists', () => {
            expect(lookupCommand(map, kbd('C-m')))
                .to.equal('mock1');
        });

        it('should find a deep command that exists', () => {
            expect(lookupCommand(map, kbd('C-x C-c')))
                .to.equal('mock2');
        });

        it('should return null for a command that doesn\'t exist', () => {
            expect(lookupCommand(map, kbd('C-x C-q')))
                .to.equal(null);
        });
    });

    describe('translateKey', () => {
        it('should fall back on identity', () => {
            expect(translateKey('q')).to.equal('q');
        });

        it('should prefer <foo> -> Foo', () => {
            expect(translateKey('<home>')).to.equal('Home');
        });

        it('should prefer non-printable map', () => {
            expect(translateKey('INS')).to.equal('Insert');
        });

        it('should prefer metamap by string', () => {
            expect(translateKey('S')).to.equal('Shift');
        });

        it('should prefer metamap by object', () => {
            expect(translateKey('s')).to.equal('OS');
        });
    });

    describe('translateSeq', () => {
        it('should translate metas in non-tail position', () => {
            expect(translateSeq(['C', 'x'])).to.deep.equal(['Control', 'x']);
        });

        it('should translate nonprintables in tail position', () => {
            expect(translateSeq(['C', '<home>'])).to.deep.equal(['Control', 'Home']);
        });

        it('should not translate printables in tail position', () => {
            expect(translateSeq(['C', 'C'])).to.deep.equal(['Control', 'C']);
        });
    });

    describe('KeySequenceError', () => {
        it('should correctly construct a message', () => {
            const e = new KeySequenceError('C-x', 'welp');
            expect(e.message).to.equal('In C-x: welp');
        });
    });

    describe('validate', () => {
        it('should throw with repeated metas', () => {
            expect(() => validate(['Control', 'Control', 'x'], 'C-C-x'))
                .to.throw('multiple instances of Control');
        });

        it('should throw with nontail nonmeta', () => {
            expect(() => validate(['x', 'Control'], 'x-C'))
                .to.throw('non-meta character outside tail');
        });

        it('should throw with >1 tail nonmeta', () => {
            expect(() => validate(['Control', 'x', 'x'], 'C-x-x'))
                .to.throw('non-meta character outside tail');
        });

        it('should return the given sequence on the happy path', () => {
            expect(validate(['Control', 'x'], 'C-x'))
                .to.deep.equal(['Control', 'x']);
        });
    });

    describe('kbd', () => {
        it('should translate chord sequences', () => {
            expect(kbd('C-x C-s')).to.deep.equal(['Control', 'x', 'Control', 's']);
        });
    });

    describe('sortSeq', () => {
        it('should stably sort metas to head of list', () => {
            const ordering = kbd('C-M-S-s-z').reverse().slice(1).reverse();

            const samples = [
                ['Control', 'Alt', 'x'],
                ['Alt', 'Control', 'x'],
                ['Shift', 'Control', 'Meta','x'],
                ['Control', 'Shift', 'Alt', 'x'],
                ['Shift', 'Alt', 'Meta', 'Control', 'x'],
                ['x']
            ].map(s => sortSeq(s).reverse().slice(1).reverse());

            const invalid = samples
                .map(sample => ordering
                    .map(meta => sample.indexOf(meta))
                    .filter(n => n !== -1))
                    .filter(s => !s.every((m, i) => i === 0 || s[i] > s[i-1]));

            expect(invalid.length).to.equal(0);
        });
    });
});
