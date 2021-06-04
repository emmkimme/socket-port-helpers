'use strict';

/* built-in */
const assert = require('assert')

/* in-package */
const { Range } = require('../lib/code/range');

describe('Range', () => {
    it('single port', () => {
        let range = new Range('80');
        assert( range.covers(  80));

        assert.equal(range.next(), 80);
        assert.equal(range.next(), null);
    });

    it('space seperated ports', () => {
        let range = new Range('80 8080');
        assert( range.covers(  80));
        assert(!range.covers( 443));
        assert( range.covers(8080));

        assert.equal(range.next(), 80);
        assert.equal(range.next(), 8080);
    });

    it('comparator !=', () => {
        let range = new Range('!=80');
        assert(!range.covers(  80));
        assert( range.covers(  21));
        assert( range.covers( 443));

        assert.equal(range.next(), 1);
        assert.equal(range.next(78), 79);
        assert.equal(range.next(), 81);
    });

    it('comparator >=', () => {
        let range = new Range('>=1024');
        assert(!range.covers(  80));
        assert( range.covers(1024));
        assert( range.covers(8080));
        
        assert.equal(range.next(), 1024);
        assert.equal(range.next(), 1025);
    });

    it('comparator <=', () => {
        let range = new Range('<=1024');
        assert( range.covers(  80));
        assert( range.covers(1024));     
        assert(!range.covers(8080));
        
        assert.equal(range.next(), 1);
        assert.equal(range.next(1023), 1024);
        assert.equal(range.next(), null);
    });

    it('comparator >', () => {
        let range = new Range('>1024');
        assert(!range.covers(  80));
        assert(!range.covers(1024));
        assert( range.covers(8080));

        assert.equal(range.next(), 1025);
        assert.equal(range.next(), 1026);
    });

    it('comparator <', () => {
        let range = new Range('<1024');
        assert( range.covers(  80));
        assert(!range.covers(1024));
        assert(!range.covers(8080));

        assert.equal(range.next(), 1);
        assert.equal(range.next(1024), null);
    });

    it('comparator =', () => {
        let range = new Range('=1024');
        assert( range.covers(1024));
        assert(!range.covers(80));
        assert.equal(range.next(), 1024);
        assert.equal(range.next(), null);
    });

    it('combined comparators', () => {
        let range = new Range('>=7000 <=8000 !=7100');
        assert(!range.covers(6999));
        assert( range.covers(7000));
        assert(!range.covers(7100));
        assert( range.covers(8000));
        assert(!range.covers(8001));
        
    });
    
    it('hyphen range', () => {
        let range = new Range('7000-8000');
        assert(!range.covers(6999));
        assert( range.covers(7000));
        assert( range.covers(8000));
        assert(!range.covers(8001));
    });

    it('comma seperated range', () => {
        let range = new Range('80,8080');
        assert( range.covers(  80));
        assert(!range.covers( 443));
        assert( range.covers(8080));

        assert.equal(range.next(), 80);
        assert.equal(range.next(), 8080);
    });

    it('logical ||', () => {
        let range = new Range('80 || 8080');
        assert( range.covers(  80));
        assert(!range.covers( 443));
        assert( range.covers(8080));

        assert.equal(range.next(), 80);
        assert.equal(range.next(), 8080);
    });

    it('mixed ports and comparators', () => {
        let range = new Range('80 8080 >=9000');
        assert.equal(range.next(), 80);
        assert.equal(range.next(), 8080);
        assert.equal(range.next(), 9000);
    });
});