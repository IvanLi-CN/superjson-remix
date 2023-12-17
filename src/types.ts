import { MetaArgs, MetaDescriptor } from '@remix-run/react';

import { LoaderFunction, TypedResponse } from '@remix-run/node';

export type SuperJSONTypedResponse<T> = T extends (
  ...args: any[]
) => infer Output
  ? Awaited<Output>
  : unknown;

export type RawType<T> = T extends TypedResponse<infer U> ? U : never;

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
