import { json as remixJson, TypedResponse } from '@remix-run/node';
import { serialize } from 'superjson';

export const json = <Data>(
  obj: Data,
  init?: number | ResponseInit
): TypedResponse<Data> => {
  const superJsonResult = serialize(obj);
  return remixJson(superJsonResult as Data, init);
};
