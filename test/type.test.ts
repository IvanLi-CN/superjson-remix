import { json, useLoaderData, withSuperJSON } from '../src/index';
import { LoaderFunctionArgs } from '@remix-run/node';

export async function loader(args: LoaderFunctionArgs) {
  return json({ title: 'string', subscriptions: [] });
}

export const meta = withSuperJSON<typeof loader>(({ data }) => {
  return [{ title: data.title }];
});

const data = useLoaderData<typeof loader>();
const subscriptions = data.subscriptions;
