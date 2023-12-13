import {
  MetaArgs,
  MetaDescriptor,
  useLoaderData as useRemixLoaderData,
} from '@remix-run/react';

import {
  json as remixJson,
  LoaderFunction,
  MetaFunction,
  TypedResponse,
} from '@remix-run/node';
import { serialize, deserialize } from 'superjson';
import { SuperJSONResult } from 'superjson/dist/types';

type SuperJSONTypedResponse<T> = T extends (...args: any[]) => infer Output
  ? Awaited<Output>
  : unknown;

type RawType<T> = T extends TypedResponse<infer U> ? U : never;

export interface SuperJSONMetaFunction<
  Loader extends LoaderFunction | unknown = unknown,
  ParentsLoaders extends Record<string, LoaderFunction | unknown> = Record<
    string,
    unknown
  >
> {
  (
    args: Omit<MetaArgs<unknown, ParentsLoaders>, 'data'> & {
      data: Loader extends LoaderFunction
        ? RawType<SuperJSONTypedResponse<Loader>>
        : unknown;
    }
  ): MetaDescriptor[];
}

export const json = <Data,>(
  obj: Data,
  init?: number | ResponseInit
): TypedResponse<Data> => {
  const superJsonResult = serialize(obj);
  return remixJson(superJsonResult as Data, init);
};

export const parse = <Data,>(superJsonResult: SuperJSONResult) =>
  deserialize(superJsonResult) as Data;

export const withSuperJSON =
  <
    Loader extends LoaderFunction | unknown = unknown,
    ParentsLoaders extends Record<string, LoaderFunction | unknown> = Record<
      string,
      unknown
    >
  >(
    metaFn: SuperJSONMetaFunction<Loader, ParentsLoaders>
  ): MetaFunction<Loader, ParentsLoaders> =>
  ({ data, ...rest }) =>
    metaFn({
      ...rest,
      data: parse(data as unknown as SuperJSONResult),
    });

export const useLoaderData = <Loader,>() => {
  const loaderData = useRemixLoaderData<any>(); // HACK: any to avoid type error
  return parse<
    Loader extends LoaderFunction
      ? RawType<SuperJSONTypedResponse<Loader>>
      : unknown
  >(loaderData);
};

export const useSuperJSONLoaderData = useLoaderData;
