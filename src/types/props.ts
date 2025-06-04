import { LinkProps } from 'next/link';
import { ReactNode } from 'react';

interface DefaultProps {
  readonly className?: string;
  readonly children?: ReactNode[] | ReactNode;
  readonly props?: any[];
}

export type RouteProps = LinkProps &
  DefaultProps & { readonly target?: string };

export default DefaultProps;
