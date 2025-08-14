import { db } from '../db/dexie';
import { Evaluation } from '../models/types';
import { nanoId } from '../utils/id';

export async function addEvaluation(data: Omit<Evaluation,'id'|'createdAt'>) {
  const evalObj: Evaluation = {
    id: nanoId(),
    createdAt: Date.now(),
    ...data
  };
  await db.evaluations.add(evalObj);
  return evalObj;
}

export async function listEvaluationsForVersion(formulaVersionId: string) {
  return db.evaluations.where({ formulaVersionId }).toArray();
}