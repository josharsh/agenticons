import { forwardRef, createElement } from 'react';

export const defaultAttributes = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function createIcon(iconName, iconNode) {
  const Component = forwardRef(function AgenticonComponent(props, ref) {
    const {
      color = 'currentColor',
      size = 24,
      strokeWidth = 2,
      absoluteStrokeWidth = false,
      className,
      children,
      ...rest
    } = props;

    const classes = className
      ? `agenticon agenticon-${iconName} ${className}`
      : `agenticon agenticon-${iconName}`;

    return createElement(
      'svg',
      {
        ref,
        ...defaultAttributes,
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth
          ? (Number(strokeWidth) * 24) / Number(size)
          : strokeWidth,
        className: classes,
        'aria-hidden': rest['aria-label'] || rest['aria-labelledby'] ? undefined : true,
        ...rest,
      },
      iconNode.map(([tag, attrs], index) => createElement(tag, { key: index, ...attrs })),
      children
    );
  });

  Component.displayName = iconName
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

  return Component;
}
