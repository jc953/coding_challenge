"use strict";

module.exports = class MinHeap {
    constructor(comparator) {
        this.heap = [];
        this.comparator = comparator || ((a, b) => a - b);
    }

    insert(value) {
        this.heap.push(value);
        this.heapifyUp();
    }

    pop() {
        if (this.isEmpty()) {
            return null;
        }

        const min = this.heap[0];
        const last = this.heap.pop();
        if (!this.isEmpty()) {
            this.heap[0] = last;
            this.heapifyDown();
        }
        return min;
    }

    heapifyUp() {
        let index = this.heap.length - 1;
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.comparator(this.heap[index], this.heap[parentIndex]) <= 0) {
                [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
                index = parentIndex;
            } else {
                break;
            }
        }
    }

    heapifyDown() {
        let index = 0;
        while (index < this.heap.length) {
            const leftChildIndex = 2 * index + 1;
            const rightChildIndex = 2 * index + 2;
            let smallerChildIndex = null;

            if (leftChildIndex < this.heap.length) {
                smallerChildIndex = leftChildIndex;
            }

            if (rightChildIndex < this.heap.length && this.comparator(this.heap[rightChildIndex], this.heap[leftChildIndex]) < 0) {
                smallerChildIndex = rightChildIndex;
            }

            if (smallerChildIndex !== null && this.comparator(this.heap[smallerChildIndex], this.heap[index]) < 0) {
                [this.heap[index], this.heap[smallerChildIndex]] = [this.heap[smallerChildIndex], this.heap[index]];
                index = smallerChildIndex;
            } else {
                break;
            }
        }
    }

    isEmpty() {
        return this.heap.length === 0;
    }
}