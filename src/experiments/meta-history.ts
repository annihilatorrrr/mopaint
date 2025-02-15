
// This file contains a sketch of the engine for meta-history.
// It doesn't test any code used by the actual application, yet.

// The meta-history is a list of operations, some of which can act on other operations.
// These are called meta operations. The meta-history is resolved into a linear history
// by applying the meta operations to the operations they target,
// in order of meta level, from most meta to least meta.
// The meta level represents how far removed an operation is from a base operation.

// meta level of 0 = base operation, 1 = meta operation, 2 = meta-meta operation, etc.

// Base operations are things that directly affect the document, like inserting text.
// Undo is a meta operation that negates the effect of another operation.
// Redo is an undo applied to an undo. This makes it a meta-meta operation.

// It is possible for multiple operations to have the same meta level.
// Thus the order of the list matters, and not just the meta level.
// For instance, there may be many base operations, without any meta operations,
// and in that case, there's no need to increase the meta level above 0.
// It is also completely normal to have operations with a lower meta level than the previous operation
// in the list, for example, if the user undoes an operation, then adds a new operation.

// One invariant is that a meta operation's meta level must be greater than the meta level of the operation it targets.

// See meta-history.test.js for examples of how this works.

interface MHOperation {
	id: string;
	metaLevel: number;
	// application-specific data
	type: "undo" | "recolor" | "insert";
	target?: string;
	color?: string;
	insertIndex?: number;
	insertOp?: MHOperation;
}

function findTargetOp(metaHistory: MHOperation[], targetID: string, metaOpMetaLevel: number, removals: { removedOp: MHOperation, removedByOp: MHOperation | null }[]) {
	// Makes sure it matches a target, and the target is less meta than the meta operation.
	for (const otherOp of metaHistory) {
		if (otherOp.id === targetID) {
			if (otherOp.metaLevel < metaOpMetaLevel) {
				return otherOp;
			} else if (otherOp.metaLevel === metaOpMetaLevel) {
				throw new Error(`target operation '${targetID}' has equal meta level to the meta operation. Meta operations must only target operations less meta than themselves.`);
			} else {
				// This may never happen, since operations will be removed upon application,
				// so it will get the "already applied and thus can't be affected" error instead.
				throw new Error(`target operation '${targetID}' has greater meta level than the meta operation. Meta operations must only target operations less meta than themselves.`);
			}
		}
	}
	for (const { removedOp, removedByOp } of removals) {
		if (removedOp.id === targetID) {
			if (removedByOp) {
				throw new Error(`target operation '${targetID}' was already removed by operation '${removedByOp.id}'.`);
			} else {
				throw new Error(`target operation '${targetID}' was already applied and thus can't be affected.`);
			}
		}
	}
	throw new Error(`target operation '${targetID}' not found.`);
}

export function resolveMetaHistory(metaHistory: readonly MHOperation[]) {

	const maxMetaLevel = metaHistory.reduce((maxMetaLevel, op) => Math.max(maxMetaLevel, op.metaLevel), 0);
	const mutableMH = JSON.parse(JSON.stringify(metaHistory)) as MHOperation[];
	const removals = [];

	// Note: stopping loop before metaLevel of 0, as at that point it should be resolved.
	// (With most loops counting down you'd want >= 0.)
	for (let metaLevel = maxMetaLevel; metaLevel > 0; metaLevel--) {
		// The for-of loop could miss operations due to mutation without a copy.
		// We don't need a deep clone to handle splicing, just a new array.
		const frozenMH = Object.freeze([...mutableMH]);
		for (const op of frozenMH) {
			if (op.metaLevel === metaLevel) {
				if (op.type === "undo") {
					const targetOp = findTargetOp(mutableMH, op.target!, op.metaLevel, removals);
					mutableMH.splice(mutableMH.indexOf(targetOp), 1);
					removals.push({ removedOp: targetOp, removedByOp: op });
				} else if (op.type === "recolor") {
					const targetOp = findTargetOp(mutableMH, op.target!, op.metaLevel, removals);
					targetOp.color = op.color;
				} else if (op.type === "insert") {
					mutableMH.splice(op.insertIndex!, 0, op.insertOp!);
				} else {
					throw new Error(`unknown meta operation type '${op.type}'.`);
				}
				mutableMH.splice(mutableMH.indexOf(op), 1);
				removals.push({ removedOp: op, removedByOp: null });
			}
		}
	}
	// Sanity check: make sure all meta operations were applied.
	for (const op of mutableMH) {
		if (op.metaLevel > 0) {
			throw new Error(`meta operation '${op.id}' was left behind, never applied while resolving meta-history.`);
		}
	}
	return mutableMH;
}

// function compute({ program, cache, goalNode }) {
// 	const steps = resolveMetaHistory(program);
// 	for (const step of step) {
// 		step.execute();
// 	}
// }
