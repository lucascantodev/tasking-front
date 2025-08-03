import { LinkProps } from 'next/link';
import { ReactNode, ButtonHTMLAttributes } from 'react';

interface DefaultProps {
  readonly className?: string;
  readonly children?: ReactNode[] | ReactNode;
  readonly props?: any[];
}

export type RouteProps = LinkProps &
  DefaultProps & { readonly target?: string };

export type ButtonProps = DefaultProps &
  ButtonHTMLAttributes<HTMLButtonElement>;

export default DefaultProps;
