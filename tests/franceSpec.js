/*global describe: false, it: false */

'use strict';

var assert = require('assert');




describe('French non working days', function() {


    var IcalFile = require('./icalFile');
    var file = new IcalFile('en-US/france-nonworkingdays.ics');



    describe('parse', function() {

        it('getNonWorkingDays()', function() {
            var events = file.getNonWorkingDays();
            assert.equal(10, events.length);
        });
    });


    describe('rruleSet tests', function() {


        it('extract new year event dates for 2016', function() {

            var rruleSet = file.getRruleSet('b901ca08-d924-43c3-9166-1d215c9453d6');

            var nonworkingdays = rruleSet.between(new Date(2016, 0, 1), new Date(2016, 0, 2), true);


            assert.equal(1, nonworkingdays.length);
            assert.equal(0, nonworkingdays[0].getHours());
        });


        it('extract easter monday for 2016', function() {

            var rruleSet = file.getRruleSet('5bd21657-4072-4474-8007-4ffd522fea87');

            var nonworkingdays = rruleSet.between(new Date(2016, 2, 28), new Date(2016, 2, 29), true);

            assert.equal(1, nonworkingdays.length);

        });


        describe('have all events every years', function() {
            var events = file.getNonWorkingDays();
            var y, e, from, to, event, rruleSet, nonworkingdays, tests = [];

            for (y=2000; y<2050; y++) {
                /*
                from = new Date(Date.UTC(y, 0, 1));
                to = new Date(Date.UTC(1+y, 0, 1));
                */

                from = new Date(y, 0, 1);
                to = new Date(1+y, 0, 1);

                from.setUTCHours(0,0,0,0);
                to.setUTCHours(0,0,0,0);

                for (e=0; e<events.length; e++) {

                    event = events[e];

                    rruleSet = file.getRruleSet(event.getProperty('UID').value);
                    nonworkingdays = rruleSet.between(from, to, true);

                    tests.push({
                        summary: event.getProperty('SUMMARY').value,
                        y: y,
                        count: nonworkingdays.length
                    });
                }
            }

            tests.forEach(function(test) {
                it(test.summary+' found 1 time in year '+test.y, function() {
                    assert.equal(1, test.count);
                });
            });
        });


    });


});
