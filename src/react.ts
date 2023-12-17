import { useLoaderData as useRemixLoaderData } from '@remix-run/react';

import { LoaderFunction, MetaFunction } from '@remix-run/node';
import { deserialize } from 'superjson';
import { SuperJSONResult } from 'superjson/dist/types';
import { RawType, SuperJSONMetaFunction, SuperJSONTypedResponse } from '.';

export const parse = <Data>(superJsonResult: SuperJSONResult) =>
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

export const useLoaderData = <Loader>() => {
  const loaderData = useRemixLoaderData<any>(); // HACK: any to avoid type error
  type NewType = RawType<SuperJSONTypedResponse<Loader>>;

  return parse<Loader extends LoaderFunction ? NewType : unknown>(loaderData);
};

export const useSuperJSONLoaderData = useLoaderData;
