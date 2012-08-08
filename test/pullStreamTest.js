'use strict';

var test = require('tap').test;
var streamBuffers = require("stream-buffers");
var PullStream = require('../');

test("source sending 1-byte at a time", function (t) {
  t.plan(3);

  var ps = new PullStream();
  ps.on('end', function () {
    sourceStream.destroy();
    t.end();
  });

  var sourceStream = new streamBuffers.ReadableStreamBuffer({
    frequency: 0,
    chunkSize: 1
  });
  sourceStream.put("Hello World!");

  sourceStream.pipe(ps);

  ps.pull('Hello'.length, function (err, data) {
    if (err) {
      t.fail(err);
    }
    t.equal('Hello', data.toString());

    var writableStream = new streamBuffers.WritableStreamBuffer({
      initialSize: 100
    });
    writableStream.on('close', function () {
      var str = writableStream.getContentsAsString('utf8');
      t.equal(' World', str);

      ps.pull(function (err, data) {
        if (err) {
          t.fail(err);
        }
        t.equal('!', data.toString());
      });
    });

    ps.pipe(' World'.length, writableStream);
  });
});

test("source sending all data at once", function (t) {
  t.plan(3);

  var ps = new PullStream();
  ps.on('end', function () {
    sourceStream.destroy();
    t.end();
  });

  var sourceStream = new streamBuffers.ReadableStreamBuffer({
    frequency: 0,
    chunkSize: 1000
  });
  sourceStream.put("Hello World!");

  sourceStream.pipe(ps);

  ps.pull('Hello'.length, function (err, data) {
    if (err) {
      t.fail(err);
    }
    t.equal('Hello', data.toString());

    var writableStream = new streamBuffers.WritableStreamBuffer({
      initialSize: 100
    });
    writableStream.on('close', function () {
      var str = writableStream.getContentsAsString('utf8');
      t.equal(' World', str);

      ps.pull(function (err, data) {
        if (err) {
          t.fail(err);
        }
        t.equal('!', data.toString());
      });
    });

    ps.pipe(' World'.length, writableStream);
  });
});
