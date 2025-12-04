import React from 'react';

type Props = { name?: string };

export default function Hello({ name = 'World' }: Props) {
  return <div>Hello {name}</div>;
}
