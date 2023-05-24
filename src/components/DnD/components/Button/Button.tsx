import { HTMLAttributes } from '@wordpress/element';
import classNames from 'classnames';

import styles from './Button.module.css';

export interface Props extends HTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
}

export function Button({ children, ...props }: Props) {
	return (
		<button className={classNames(styles.Button)} {...props}>
			{children}
		</button>
	);
}
