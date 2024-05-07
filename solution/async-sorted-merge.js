"use strict";

const MinHeap = require("./utils");

// Print all entries, across all of the *async* sources, in chronological order.

module.exports = async (logSources, printer) => {
  const logSourcesEntries = new Map();

  await Promise.all(logSources.map(async (logSource, index) => {
    const entries = [];
    let internalIndex = 0;
    let entry = await logSource.popAsync();
    while (entry) {
      entry.logSourceId = index;
      entry.internalId = internalIndex++;
      entries.push(entry);
      entry = await logSource.popAsync();
    }

    if (entries.length > 0) {
      logSourcesEntries.set(index, entries);
    }
  }));

  const minHeap = new MinHeap((a, b) => a.date.getTime() - b.date.getTime());

  for (const [_index, entries] of logSourcesEntries) {
    minHeap.insert(entries[0]);
  }

  while (!minHeap.isEmpty()) {
    const value = minHeap.pop();
    printer.print(value);

    const sourceEntries = logSourcesEntries.get(value.logSourceId);
    if (value.internalId + 1 < sourceEntries.length) {
      minHeap.insert(sourceEntries[value.internalId + 1]);
    }
  }

  printer.done();

  console.log("Async sort complete.");
};