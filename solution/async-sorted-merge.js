"use strict";

const MinHeap = require("./utils");

// Print all entries, across all of the *async* sources, in chronological order.

module.exports = async (logSources, printer) => {
  const minHeap = new MinHeap((a, b) => a.date.getTime() - b.date.getTime());

  await Promise.all(logSources.map(async (logSource, index) => {
    const entry = await logSource.popAsync()
    if (entry) {
      entry.logSourceId = index
      minHeap.insert(entry)
    }
  }))

  while (!minHeap.isEmpty()) {
    const entry = minHeap.pop()
    printer.print(entry)
    const next_entry = await logSources[entry.logSourceId].popAsync()
    if (next_entry) {
      next_entry.logSourceId = entry.logSourceId
      minHeap.insert(next_entry)
    }
  }

  printer.done();

  console.log("Async sort complete.");
}