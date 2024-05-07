"use strict";

const MinHeap = require("./utils");

// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {
  const minHeap = new MinHeap((a, b) => {
    return a.date.getTime() - b.date.getTime()
  });

  for (let [index, logSource] of logSources.entries()) {
    const entry = logSource.pop()
    if (entry) {
      entry['log_source_id'] = index
      minHeap.insert(entry)
    }
  }
  while (!minHeap.isEmpty()) {
    const value = minHeap.pop()
    printer.print(value)
    const entry = logSources[value.log_source_id].pop()
    if (entry) {
      entry['log_source_id'] = value.log_source_id
      minHeap.insert(entry)
    }
  }

  printer.done()

  return console.log("Sync sort complete.");
};
